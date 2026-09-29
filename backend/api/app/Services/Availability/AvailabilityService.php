<?php

namespace App\Services\Availability;

use App\Enums\ResourceCategory;
use App\Enums\ScheduleBlockType;
use App\Enums\ScheduleStatus;
use App\Models\AdvertisingResource;
use App\Models\Organization;
use App\Models\ResourceSchedule;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\ValidationException;

class AvailabilityService
{
    /**
     * Check whether an advertising resource has sufficient availability/capacity for a given date window.
     */
    public function checkAvailability(
        AdvertisingResource $resource,
        string|Carbon $startDate,
        string|Carbon $endDate,
        int $requestedSlots = 1,
        ?int $ignoreScheduleId = null
    ): array {
        $start = Carbon::parse($startDate)->startOfDay();
        $end = Carbon::parse($endDate)->startOfDay();

        if ($start->gt($end)) {
            throw ValidationException::withMessages([
                'end_date' => ['The end date must be on or after the start date.'],
            ]);
        }

        $startStr = $start->toDateString();
        $endStr = $end->toDateString();

        // 1. Query active schedules overlapping the requested window
        $query = ResourceSchedule::where('advertising_resource_id', $resource->id)
            ->activeInventory()
            ->overlapping($startStr, $endStr);

        if ($ignoreScheduleId) {
            $query->where('id', '!=', $ignoreScheduleId);
        }

        $activeSchedules = $query->with('createdByUser')->get();

        // 2. Static Resource: Binary Exclusivity
        if ($resource->category === ResourceCategory::STATIC) {
            if ($activeSchedules->isNotEmpty()) {
                $conflicts = $activeSchedules->map(function (ResourceSchedule $s) {
                    return [
                        'uuid' => $s->uuid,
                        'title' => $s->title,
                        'block_type' => $s->block_type->value,
                        'status' => $s->status->value,
                        'start_date' => $s->start_date->toDateString(),
                        'end_date' => $s->end_date->toDateString(),
                    ];
                })->values()->all();

                return [
                    'is_available' => false,
                    'resource_category' => ResourceCategory::STATIC->value,
                    'total_slots' => 1,
                    'available_slots' => 0,
                    'requested_slots' => 1,
                    'conflicts' => $conflicts,
                ];
            }

            return [
                'is_available' => true,
                'resource_category' => ResourceCategory::STATIC->value,
                'total_slots' => 1,
                'available_slots' => 1,
                'requested_slots' => 1,
                'conflicts' => [],
            ];
        }

        // 3. Digital Resource: Share of Voice (SOV) / Loop Slot Capacity
        $totalSlots = $resource->getTotalSlots();
        $minAvailable = $totalSlots;
        $bottlenecks = [];
        $curr = $start->copy();

        while ($curr->lte($end)) {
            $currDate = $curr->toDateString();
            $daySchedules = $activeSchedules->filter(function (ResourceSchedule $s) use ($currDate) {
                return $s->start_date->toDateString() <= $currDate && $s->end_date->toDateString() >= $currDate;
            });

            $dayBookedSlots = $daySchedules->sum('slots_count');
            $dayAvailable = max(0, $totalSlots - $dayBookedSlots);

            if ($dayAvailable < $minAvailable) {
                $minAvailable = $dayAvailable;
            }

            if ($dayAvailable < $requestedSlots) {
                $bottlenecks[] = [
                    'date' => $currDate,
                    'total_slots' => $totalSlots,
                    'booked_slots' => $dayBookedSlots,
                    'available_slots' => $dayAvailable,
                    'requested_slots' => $requestedSlots,
                ];
            }

            $curr->addDay();
        }

        $isAvailable = ($minAvailable >= $requestedSlots);

        return [
            'is_available' => $isAvailable,
            'resource_category' => ResourceCategory::DIGITAL->value,
            'total_slots' => $totalSlots,
            'available_slots' => $minAvailable,
            'requested_slots' => $requestedSlots,
            'conflicts' => $bottlenecks,
        ];
    }

    /**
     * Generate a day-by-day calendar matrix for an advertising resource for a specific month.
     */
    public function getMonthlyCalendar(AdvertisingResource $resource, int $year, int $month): array
    {
        $monthStart = Carbon::createFromDate($year, $month, 1)->startOfDay();
        $monthEnd = $monthStart->copy()->endOfMonth()->startOfDay();

        $activeSchedules = ResourceSchedule::where('advertising_resource_id', $resource->id)
            ->activeInventory()
            ->overlapping($monthStart->toDateString(), $monthEnd->toDateString())
            ->orderBy('start_date')
            ->get();

        $totalSlots = $resource->getTotalSlots();
        $days = [];
        $curr = $monthStart->copy();

        while ($curr->lte($monthEnd)) {
            $currDate = $curr->toDateString();
            $daySchedules = $activeSchedules->filter(function (ResourceSchedule $s) use ($currDate) {
                return $s->start_date->toDateString() <= $currDate && $s->end_date->toDateString() >= $currDate;
            });

            $scheduleSummaries = $daySchedules->map(function (ResourceSchedule $s) {
                return [
                    'uuid' => $s->uuid,
                    'title' => $s->title,
                    'block_type' => $s->block_type->value,
                    'status' => $s->status->value,
                    'slots_count' => $s->slots_count,
                    'hold_expires_at' => $s->hold_expires_at?->toISOString(),
                ];
            })->values()->all();

            if ($resource->category === ResourceCategory::STATIC) {
                $hasSchedules = $daySchedules->isNotEmpty();
                $primary = $daySchedules->first();

                $dayStatus = 'AVAILABLE';
                if ($hasSchedules) {
                    $dayStatus = $primary->block_type->value; // BOOKING, MAINTENANCE, CIVIC_HOLD, etc.
                }

                $days[] = [
                    'date' => $currDate,
                    'day' => (int) $curr->day,
                    'status' => $dayStatus,
                    'total_slots' => 1,
                    'booked_slots' => $hasSchedules ? 1 : 0,
                    'available_slots' => $hasSchedules ? 0 : 1,
                    'schedules' => $scheduleSummaries,
                ];
            } else {
                $dayBookedSlots = $daySchedules->sum('slots_count');
                $dayAvailableSlots = max(0, $totalSlots - $dayBookedSlots);

                $dayStatus = 'AVAILABLE';
                if ($dayBookedSlots >= $totalSlots) {
                    $dayStatus = 'BOOKED';
                } elseif ($dayBookedSlots > 0) {
                    $dayStatus = 'PARTIALLY_AVAILABLE';
                }

                $days[] = [
                    'date' => $currDate,
                    'day' => (int) $curr->day,
                    'status' => $dayStatus,
                    'total_slots' => $totalSlots,
                    'booked_slots' => $dayBookedSlots,
                    'available_slots' => $dayAvailableSlots,
                    'schedules' => $scheduleSummaries,
                ];
            }

            $curr->addDay();
        }

        return [
            'year' => $year,
            'month' => $month,
            'resource' => [
                'id' => $resource->id,
                'uuid' => $resource->uuid,
                'name' => $resource->name,
                'code' => $resource->code,
                'category' => $resource->category->value,
                'total_slots' => $totalSlots,
            ],
            'days' => $days,
        ];
    }

    /**
     * List resource schedules for an organization with filtering and pagination.
     */
    public function listSchedules(Organization $organization, array $filters = []): LengthAwarePaginator
    {
        $query = ResourceSchedule::where('organization_id', $organization->id)
            ->with(['advertisingResource.location', 'createdByUser']);

        // Filter by resource UUID
        if (! empty($filters['resource_uuid'])) {
            $query->whereHas('advertisingResource', function (Builder $q) use ($filters) {
                $q->where('uuid', $filters['resource_uuid']);
            });
        }

        // Filter by block type
        if (! empty($filters['block_type'])) {
            $query->where('block_type', $filters['block_type']);
        }

        // Filter by status
        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Filter by date range overlap
        if (! empty($filters['start_date']) && ! empty($filters['end_date'])) {
            $query->overlapping($filters['start_date'], $filters['end_date']);
        }

        // Search in title or notes
        if (! empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function (Builder $q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        $query->orderBy('start_date', 'asc');

        $perPage = min(max((int) ($filters['per_page'] ?? 15), 1), 100);

        return $query->paginate($perPage);
    }

    /**
     * Create a schedule block or reservation.
     */
    public function createScheduleBlock(Organization $organization, User $user, array $data): ResourceSchedule
    {
        // 1. Resolve advertising resource
        $resource = null;
        if (! empty($data['advertising_resource_uuid'])) {
            $resource = AdvertisingResource::where('organization_id', $organization->id)
                ->where('uuid', $data['advertising_resource_uuid'])
                ->firstOrFail();
            $data['advertising_resource_id'] = $resource->id;
            unset($data['advertising_resource_uuid']);
        } else {
            $resource = AdvertisingResource::where('organization_id', $organization->id)
                ->where('id', $data['advertising_resource_id'])
                ->firstOrFail();
        }

        $slotsCount = (int) ($data['slots_count'] ?? 1);
        if ($resource->category === ResourceCategory::STATIC) {
            $slotsCount = 1;
        }

        // 2. Fresh Availability Check
        $check = $this->checkAvailability($resource, $data['start_date'], $data['end_date'], $slotsCount);
        if (! $check['is_available']) {
            throw ValidationException::withMessages([
                'dates' => ['The selected dates or slot capacity are not available for this resource due to conflicting schedules.'],
            ]);
        }

        // 3. Handle block type & hold expiration
        $blockType = $data['block_type'];
        if ($blockType === ScheduleBlockType::TENTATIVE_HOLD->value) {
            $data['status'] = ScheduleStatus::TENTATIVE->value;

            if (! empty($data['hold_expires_at'])) {
                $expiresAt = Carbon::parse($data['hold_expires_at']);
                if ($expiresAt->isPast()) {
                    throw ValidationException::withMessages([
                        'hold_expires_at' => ['Hold expiration must be a future timestamp.'],
                    ]);
                }
                if ($expiresAt->gt(now()->addDays(30))) {
                    throw ValidationException::withMessages([
                        'hold_expires_at' => ['Hold duration cannot exceed the maximum safety limit of 30 days.'],
                    ]);
                }
                $data['hold_expires_at'] = $expiresAt;
            } else {
                $defaultHours = (int) ($organization->settings['default_hold_duration_hours'] ?? 72);
                $data['hold_expires_at'] = now()->addHours($defaultHours);
            }
        } else {
            $data['status'] = $data['status'] ?? ScheduleStatus::CONFIRMED->value;
            $data['hold_expires_at'] = null;
        }

        // 4. Enforce tenant boundary & attribution
        $data['organization_id'] = $organization->id;
        $data['created_by_user_id'] = $user->id;
        $data['slots_count'] = $slotsCount;

        return ResourceSchedule::create($data)->load(['advertisingResource.location', 'createdByUser']);
    }

    /**
     * Update an existing schedule block.
     * Safeguard 3: Re-runs availability validation if any inventory-affecting field changes.
     */
    public function updateScheduleBlock(ResourceSchedule $schedule, array $data): ResourceSchedule
    {
        // Prevent spoofing immutable fields
        unset($data['organization_id'], $data['uuid'], $data['id'], $data['created_by_user_id']);

        // Resolve target resource
        $resource = $schedule->advertisingResource;
        if (! empty($data['advertising_resource_uuid'])) {
            $resource = AdvertisingResource::where('organization_id', $schedule->organization_id)
                ->where('uuid', $data['advertising_resource_uuid'])
                ->firstOrFail();
            $data['advertising_resource_id'] = $resource->id;
            unset($data['advertising_resource_uuid']);
        }

        $startDate = $data['start_date'] ?? $schedule->start_date->toDateString();
        $endDate = $data['end_date'] ?? $schedule->end_date->toDateString();
        $slotsCount = isset($data['slots_count']) ? (int) $data['slots_count'] : $schedule->slots_count;

        if ($resource->category === ResourceCategory::STATIC) {
            $slotsCount = 1;
        }

        // Check if inventory-affecting fields changed
        $affectsInventory = (
            $resource->id !== $schedule->advertising_resource_id ||
            $startDate !== $schedule->start_date->toDateString() ||
            $endDate !== $schedule->end_date->toDateString() ||
            $slotsCount !== $schedule->slots_count ||
            (isset($data['status']) && $data['status'] !== $schedule->status->value)
        );

        if ($affectsInventory) {
            $targetStatus = $data['status'] ?? $schedule->status->value;

            // Only check conflict if the updated status is active
            if ($targetStatus !== ScheduleStatus::CANCELLED->value) {
                $check = $this->checkAvailability($resource, $startDate, $endDate, $slotsCount, $schedule->id);
                if (! $check['is_available']) {
                    throw ValidationException::withMessages([
                        'dates' => ['The updated dates or slot capacity conflict with existing active schedules.'],
                    ]);
                }
            }
        }

        // Validate hold expiry if updated
        if (isset($data['hold_expires_at'])) {
            $expiresAt = Carbon::parse($data['hold_expires_at']);
            if ($expiresAt->isPast()) {
                throw ValidationException::withMessages([
                    'hold_expires_at' => ['Hold expiration must be a future timestamp.'],
                ]);
            }
            if ($expiresAt->gt($schedule->created_at->addDays(30))) {
                throw ValidationException::withMessages([
                    'hold_expires_at' => ['Hold duration cannot exceed 30 days from creation.'],
                ]);
            }
            $data['hold_expires_at'] = $expiresAt;
        }

        $schedule->update($data);

        return $schedule->fresh(['advertisingResource.location', 'createdByUser']);
    }

    /**
     * Release a schedule block or hold by cancelling it.
     */
    public function releaseScheduleBlock(ResourceSchedule $schedule, ?string $reason = null): ResourceSchedule
    {
        $notes = $schedule->notes;
        if ($reason) {
            $notes = $notes ? ($notes . "\n" . $reason) : $reason;
        }

        $schedule->update([
            'status' => ScheduleStatus::CANCELLED->value,
            'released_at' => now(),
            'notes' => $notes,
        ]);

        return $schedule->fresh(['advertisingResource.location', 'createdByUser']);
    }

    /**
     * Extend a tentative hold's expiration.
     */
    public function extendHold(ResourceSchedule $schedule, string|Carbon $newExpiresAt): ResourceSchedule
    {
        if ($schedule->block_type !== ScheduleBlockType::TENTATIVE_HOLD) {
            throw ValidationException::withMessages([
                'hold' => ['Only tentative holds can be extended.'],
            ]);
        }

        $target = Carbon::parse($newExpiresAt);
        if ($target->isPast()) {
            throw ValidationException::withMessages([
                'hold_expires_at' => ['Extension date must be in the future.'],
            ]);
        }

        $maxAllowed = $schedule->created_at->copy()->addDays(30);
        if ($target->gt($maxAllowed)) {
            throw ValidationException::withMessages([
                'hold_expires_at' => ['Hold extension cannot exceed the 30-day maximum limit from creation date.'],
            ]);
        }

        $schedule->update([
            'hold_expires_at' => $target,
        ]);

        return $schedule->fresh(['advertisingResource.location', 'createdByUser']);
    }

    /**
     * Confirm a tentative hold into a confirmed booking.
     * Safeguard 2: Fresh availability check immediately before confirmation.
     */
    public function confirmHold(ResourceSchedule $schedule): ResourceSchedule
    {
        if ($schedule->block_type !== ScheduleBlockType::TENTATIVE_HOLD) {
            throw ValidationException::withMessages([
                'hold' => ['Only tentative holds can be confirmed into bookings.'],
            ]);
        }

        // Prevent confirming an already expired hold
        if ($schedule->hold_expires_at && $schedule->hold_expires_at->isPast()) {
            throw ValidationException::withMessages([
                'hold' => ['Cannot confirm an expired tentative hold.'],
            ]);
        }

        // Safeguard 2: Perform fresh availability check immediately before converting
        $check = $this->checkAvailability(
            $schedule->advertisingResource,
            $schedule->start_date->toDateString(),
            $schedule->end_date->toDateString(),
            $schedule->slots_count,
            $schedule->id // Ignore current tentative record
        );

        if (! $check['is_available']) {
            throw ValidationException::withMessages([
                'hold' => ['Cannot confirm hold because the resource is no longer available due to conflicting schedules.'],
            ]);
        }

        $schedule->update([
            'block_type' => ScheduleBlockType::BOOKING->value,
            'status' => ScheduleStatus::CONFIRMED->value,
            'hold_expires_at' => null,
        ]);

        return $schedule->fresh(['advertisingResource.location', 'createdByUser']);
    }

    /**
     * Soft delete a schedule record.
     */
    public function deleteScheduleBlock(ResourceSchedule $schedule): void
    {
        $schedule->delete();
    }
}
