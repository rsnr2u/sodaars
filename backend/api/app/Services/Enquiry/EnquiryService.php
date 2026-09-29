<?php

namespace App\Services\Enquiry;

use App\Enums\CustomerStatus;
use App\Enums\EnquiryStatus;
use App\Enums\ScheduleBlockType;
use App\Enums\ScheduleStatus;
use App\Models\AdvertisingResource;
use App\Models\Customer;
use App\Models\Enquiry;
use App\Models\EnquiryItem;
use App\Models\Location;
use App\Models\Organization;
use App\Models\ResourceSchedule;
use App\Models\User;
use App\Services\Availability\AvailabilityService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class EnquiryService
{
    protected AvailabilityService $availabilityService;

    public function __construct(AvailabilityService $availabilityService)
    {
        $this->availabilityService = $availabilityService;
    }

    /**
     * List enquiries for an organization with filtering and pagination.
     */
    public function listEnquiries(Organization $org, array $filters = []): LengthAwarePaginator
    {
        $query = Enquiry::where('organization_id', $org->id)
            ->with(['customer', 'assignedToUser', 'items.advertisingResource', 'items.location']);

        if (! empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('enquiry_number', 'like', "%{$search}%")
                    ->orWhere('campaign_title', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($cq) use ($search) {
                        $cq->where('company_name', 'like', "%{$search}%")
                            ->orWhere('contact_person', 'like', "%{$search}%");
                    });
            });
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        if (! empty($filters['source'])) {
            $query->where('source', $filters['source']);
        }

        if (! empty($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }

        if (! empty($filters['assigned_to_user_id'])) {
            $query->where('assigned_to_user_id', $filters['assigned_to_user_id']);
        }

        if (! empty($filters['start_date'])) {
            $query->where('start_date', '>=', $filters['start_date']);
        }

        if (! empty($filters['end_date'])) {
            $query->where('end_date', '<=', $filters['end_date']);
        }

        $sortBy = in_array($filters['sort_by'] ?? null, ['enquiry_number', 'campaign_title', 'created_at', 'status', 'start_date'], true)
            ? $filters['sort_by']
            : 'created_at';

        $sortOrder = strtolower($filters['sort_order'] ?? 'desc') === 'asc' ? 'asc' : 'desc';

        $perPage = min(max((int) ($filters['per_page'] ?? 15), 1), 100);

        return $query->orderBy($sortBy, $sortOrder)->paginate($perPage);
    }

    /**
     * Create an enquiry along with its requested items.
     * Note: Inventory holds are NOT placed automatically.
     */
    public function createEnquiry(Organization $org, User $user, array $data): Enquiry
    {
        // 1. Tenant integrity check on customer_id
        $customer = Customer::where('organization_id', $org->id)->find($data['customer_id']);
        if (! $customer) {
            throw ValidationException::withMessages([
                'customer_id' => ['The selected customer does not exist in this organization.'],
            ]);
        }

        // 2. Customer BLOCKED check
        if ($customer->isBlocked()) {
            throw ValidationException::withMessages([
                'customer_id' => ['Cannot create an enquiry for a blocked customer.'],
            ]);
        }

        // 3. Auto-generate enquiry_number if omitted
        if (empty($data['enquiry_number'])) {
            $data['enquiry_number'] = $this->generateNextEnquiryNumber($org);
        } else {
            if (Enquiry::where('organization_id', $org->id)->where('enquiry_number', $data['enquiry_number'])->exists()) {
                throw ValidationException::withMessages([
                    'enquiry_number' => ['The enquiry number has already been taken in this organization.'],
                ]);
            }
        }

        // 4. Validate items tenant integrity and XOR rule
        $itemsData = $data['items'] ?? [];
        $this->validateEnquiryItems($org, $itemsData);

        return DB::transaction(function () use ($org, $user, $data, $itemsData) {
            $enquiryData = $data;
            unset($enquiryData['items']);

            $enquiryData['organization_id'] = $org->id;
            $enquiryData['created_by_user_id'] = $user->id;
            $enquiryData['status'] = EnquiryStatus::NEW->value;

            $enquiry = Enquiry::create($enquiryData);

            foreach ($itemsData as $item) {
                $enquiry->items()->create([
                    'advertising_resource_id' => $item['advertising_resource_id'] ?? null,
                    'location_id' => $item['location_id'] ?? null,
                    'start_date' => $item['start_date'] ?? null,
                    'end_date' => $item['end_date'] ?? null,
                    'slots_count' => $item['slots_count'] ?? 1,
                    'proposed_rate' => $item['proposed_rate'] ?? null,
                    'notes' => $item['notes'] ?? null,
                ]);
            }

            return $enquiry->load(['customer', 'items.advertisingResource', 'items.location']);
        });
    }

    /**
     * Update an enquiry and synchronise items.
     */
    public function updateEnquiry(Enquiry $enquiry, array $data): Enquiry
    {
        $org = $enquiry->organization;

        // If customer_id changed, verify tenant and blocked status
        if (isset($data['customer_id']) && $data['customer_id'] !== $enquiry->customer_id) {
            $customer = Customer::where('organization_id', $org->id)->find($data['customer_id']);
            if (! $customer) {
                throw ValidationException::withMessages([
                    'customer_id' => ['The selected customer does not exist in this organization.'],
                ]);
            }
            if ($customer->isBlocked()) {
                throw ValidationException::withMessages([
                    'customer_id' => ['Cannot reassign enquiry to a blocked customer.'],
                ]);
            }
        }

        // If enquiry_number changed, verify uniqueness
        if (isset($data['enquiry_number']) && $data['enquiry_number'] !== $enquiry->enquiry_number) {
            $exists = Enquiry::where('organization_id', $org->id)
                ->where('enquiry_number', $data['enquiry_number'])
                ->where('id', '!=', $enquiry->id)
                ->exists();

            if ($exists) {
                throw ValidationException::withMessages([
                    'enquiry_number' => ['The enquiry number has already been taken in this organization.'],
                ]);
            }
        }

        return DB::transaction(function () use ($enquiry, $data, $org) {
            if (isset($data['items'])) {
                $this->validateEnquiryItems($org, $data['items']);

                // Replace items
                $enquiry->items()->delete();
                foreach ($data['items'] as $item) {
                    $enquiry->items()->create([
                        'advertising_resource_id' => $item['advertising_resource_id'] ?? null,
                        'location_id' => $item['location_id'] ?? null,
                        'start_date' => $item['start_date'] ?? null,
                        'end_date' => $item['end_date'] ?? null,
                        'slots_count' => $item['slots_count'] ?? 1,
                        'proposed_rate' => $item['proposed_rate'] ?? null,
                        'notes' => $item['notes'] ?? null,
                    ]);
                }
            }

            $updateData = $data;
            unset($updateData['items'], $updateData['status']); // Status transitions must use transitionStatus()

            $enquiry->update($updateData);

            return $enquiry->fresh(['customer', 'items.advertisingResource', 'items.location']);
        });
    }

    /**
     * Transition enquiry status with state machine enforcement and automatic hold release on LOST/CANCELLED.
     */
    public function transitionStatus(Enquiry $enquiry, EnquiryStatus $newStatus, ?string $reason = null): Enquiry
    {
        $currentStatus = $enquiry->status instanceof EnquiryStatus ? $enquiry->status : EnquiryStatus::from($enquiry->status);

        if (! $currentStatus->canTransitionTo($newStatus)) {
            throw ValidationException::withMessages([
                'status' => ["Cannot transition enquiry from {$currentStatus->value} to {$newStatus->value}."],
            ]);
        }

        return DB::transaction(function () use ($enquiry, $newStatus, $reason) {
            // If transitioning to LOST or CANCELLED, automatically release active tentative holds
            if (in_array($newStatus, [EnquiryStatus::LOST, EnquiryStatus::CANCELLED], true)) {
                $activeHolds = ResourceSchedule::where('organization_id', $enquiry->organization_id)
                    ->where('reference_type', 'ENQUIRY')
                    ->where('reference_id', $enquiry->id)
                    ->where('block_type', ScheduleBlockType::TENTATIVE_HOLD->value)
                    ->where('status', ScheduleStatus::TENTATIVE->value)
                    ->get();

                foreach ($activeHolds as $hold) {
                    $this->availabilityService->releaseScheduleBlock(
                        $hold,
                        "[AUTO-RELEASED: ENQUIRY_{$newStatus->value}]"
                    );
                }
            }

            $enquiry->status = $newStatus;
            if ($newStatus === EnquiryStatus::LOST && $reason) {
                $enquiry->lost_reason = $reason;
            }

            $enquiry->save();

            return $enquiry->fresh(['customer', 'items.advertisingResource', 'items.location']);
        });
    }

    /**
     * Check availability for all specific resource items in an enquiry.
     */
    public function checkEnquiryAvailability(Enquiry $enquiry): array
    {
        $results = [];

        foreach ($enquiry->items as $item) {
            if (! $item->advertising_resource_id || ! $item->advertisingResource) {
                $results[] = [
                    'item_uuid' => $item->uuid,
                    'type' => 'LOCATION_INQUIRY',
                    'location_id' => $item->location_id,
                    'is_available' => null,
                    'message' => 'General location inquiry. Specific resource not assigned.',
                ];
                continue;
            }

            $startDate = $item->effective_start_date;
            $endDate = $item->effective_end_date;

            if (! $startDate || ! $endDate) {
                $results[] = [
                    'item_uuid' => $item->uuid,
                    'type' => 'RESOURCE_INQUIRY',
                    'resource_uuid' => $item->advertisingResource->uuid,
                    'resource_name' => $item->advertisingResource->name,
                    'is_available' => null,
                    'message' => 'Start date and end date must be defined to check availability.',
                ];
                continue;
            }

            $availability = $this->availabilityService->checkAvailability(
                $item->advertisingResource,
                $startDate,
                $endDate,
                $item->slots_count ?? 1
            );

            $results[] = array_merge([
                'item_uuid' => $item->uuid,
                'type' => 'RESOURCE_INQUIRY',
                'resource_uuid' => $item->advertisingResource->uuid,
                'resource_name' => $item->advertisingResource->name,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'slots_count' => $item->slots_count ?? 1,
            ], $availability);
        }

        return $results;
    }

    /**
     * Explicitly place a tentative hold for an enquiry item.
     */
    public function placeHoldForItem(Enquiry $enquiry, EnquiryItem $item, User $user, ?int $holdHours = null): ResourceSchedule
    {
        if ($item->enquiry_id !== $enquiry->id) {
            throw ValidationException::withMessages([
                'item' => ['The specified item does not belong to this enquiry.'],
            ]);
        }

        if (! $item->advertising_resource_id || ! $item->advertisingResource) {
            throw ValidationException::withMessages([
                'item' => ['Cannot place a hold on a general location inquiry. An advertising resource face must be assigned.'],
            ]);
        }

        $startDate = $item->effective_start_date;
        $endDate = $item->effective_end_date;

        if (! $startDate || ! $endDate) {
            throw ValidationException::withMessages([
                'dates' => ['Start date and end date must be defined to place a hold.'],
            ]);
        }

        // Verify availability before placing hold
        $availability = $this->availabilityService->checkAvailability(
            $item->advertisingResource,
            $startDate,
            $endDate,
            $item->slots_count ?? 1
        );

        if (! $availability['is_available']) {
            throw ValidationException::withMessages([
                'item' => ['The requested resource is not available for the specified dates.'],
            ]);
        }

        return $this->availabilityService->createScheduleBlock($enquiry->organization, $user, [
            'advertising_resource_id' => $item->advertising_resource_id,
            'block_type' => ScheduleBlockType::TENTATIVE_HOLD->value,
            'status' => ScheduleStatus::TENTATIVE->value,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'slots_count' => $item->slots_count ?? 1,
            'hold_duration_hours' => $holdHours ?? 72,
            'title' => "Enquiry {$enquiry->enquiry_number}: {$enquiry->campaign_title}",
            'reference_type' => 'ENQUIRY',
            'reference_id' => $enquiry->id,
            'notes' => "Tentative hold placed from Enquiry {$enquiry->enquiry_number}",
        ]);
    }

    /**
     * Delete an enquiry (soft delete) and auto-release attached tentative holds.
     */
    public function deleteEnquiry(Enquiry $enquiry): void
    {
        DB::transaction(function () use ($enquiry) {
            $activeHolds = ResourceSchedule::where('organization_id', $enquiry->organization_id)
                ->where('reference_type', 'ENQUIRY')
                ->where('reference_id', $enquiry->id)
                ->where('block_type', ScheduleBlockType::TENTATIVE_HOLD->value)
                ->where('status', ScheduleStatus::TENTATIVE->value)
                ->get();

            foreach ($activeHolds as $hold) {
                $this->availabilityService->releaseScheduleBlock(
                    $hold,
                    '[AUTO-RELEASED: ENQUIRY_DELETED]'
                );
            }

            $enquiry->items()->delete();
            $enquiry->delete();
        });
    }

    /**
     * Validate enquiry items for tenant integrity and XOR rule.
     */
    protected function validateEnquiryItems(Organization $org, array $items): void
    {
        foreach ($items as $index => $item) {
            $hasResource = ! empty($item['advertising_resource_id']);
            $hasLocation = ! empty($item['location_id']);

            // XOR validation: Resource OR Location, never both and never neither
            if ($hasResource && $hasLocation) {
                throw ValidationException::withMessages([
                    "items.{$index}" => ['An enquiry item must specify either a resource OR a location, not both.'],
                ]);
            }

            if (! $hasResource && ! $hasLocation) {
                throw ValidationException::withMessages([
                    "items.{$index}" => ['An enquiry item must specify either a resource or a location.'],
                ]);
            }

            // Tenant integrity for advertising_resource_id
            if ($hasResource) {
                $resourceExists = AdvertisingResource::where('organization_id', $org->id)
                    ->where('id', $item['advertising_resource_id'])
                    ->exists();

                if (! $resourceExists) {
                    throw ValidationException::withMessages([
                        "items.{$index}.advertising_resource_id" => ['The specified advertising resource does not exist in this organization.'],
                    ]);
                }
            }

            // Tenant integrity for location_id
            if ($hasLocation) {
                $locationExists = Location::where('organization_id', $org->id)
                    ->where('id', $item['location_id'])
                    ->exists();

                if (! $locationExists) {
                    throw ValidationException::withMessages([
                        "items.{$index}.location_id" => ['The specified location does not exist in this organization.'],
                    ]);
                }
            }
        }
    }

    /**
     * Generate the next sequential enquiry number for an organization.
     */
    protected function generateNextEnquiryNumber(Organization $org): string
    {
        $year = date('Y');
        $prefix = "ENQ-{$year}-";

        $lastEnquiry = Enquiry::withTrashed()
            ->where('organization_id', $org->id)
            ->where('enquiry_number', 'like', "{$prefix}%")
            ->orderByRaw("CAST(SUBSTRING(enquiry_number, " . (strlen($prefix) + 1) . ") AS UNSIGNED) DESC")
            ->first();

        if ($lastEnquiry && preg_match("/ENQ-{$year}-(\d+)/", $lastEnquiry->enquiry_number, $matches)) {
            $nextNumber = ((int) $matches[1]) + 1;
        } else {
            $nextNumber = 1;
        }

        return sprintf("%s%04d", $prefix, $nextNumber);
    }
}
