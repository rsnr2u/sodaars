<?php

namespace App\Services\Customer;

use App\Enums\CustomerStatus;
use App\Enums\EnquiryStatus;
use App\Models\Customer;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class CustomerService
{
    /**
     * List customers for an organization with filtering and pagination.
     */
    public function listCustomers(Organization $org, array $filters = []): LengthAwarePaginator
    {
        $query = Customer::where('organization_id', $org->id);

        if (! empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('company_name', 'like', "%{$search}%")
                    ->orWhere('brand_name', 'like', "%{$search}%")
                    ->orWhere('contact_person', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['customer_type'])) {
            $query->where('customer_type', $filters['customer_type']);
        }

        if (! empty($filters['city'])) {
            $query->where('city', 'like', "%{$filters['city']}%");
        }

        if (! empty($filters['state'])) {
            $query->where('state', 'like', "%{$filters['state']}%");
        }

        $sortBy = in_array($filters['sort_by'] ?? null, ['company_name', 'code', 'created_at', 'status'], true)
            ? $filters['sort_by']
            : 'created_at';

        $sortOrder = strtolower($filters['sort_order'] ?? 'desc') === 'asc' ? 'asc' : 'desc';

        $perPage = min(max((int) ($filters['per_page'] ?? 15), 1), 100);

        return $query->orderBy($sortBy, $sortOrder)->paginate($perPage);
    }

    /**
     * Create a new customer for an organization.
     */
    public function createCustomer(Organization $org, User $user, array $data): Customer
    {
        // Auto-generate code if omitted
        if (empty($data['code'])) {
            $data['code'] = $this->generateNextCode($org);
        } else {
            // Check uniqueness within organization
            if (Customer::where('organization_id', $org->id)->where('code', $data['code'])->exists()) {
                throw ValidationException::withMessages([
                    'code' => ['The customer code has already been taken in this organization.'],
                ]);
            }
        }

        $data['organization_id'] = $org->id;
        $data['created_by_user_id'] = $user->id;

        return Customer::create($data);
    }

    /**
     * Update an existing customer.
     */
    public function updateCustomer(Customer $customer, array $data): Customer
    {
        if (isset($data['code']) && $data['code'] !== $customer->code) {
            $exists = Customer::where('organization_id', $customer->organization_id)
                ->where('code', $data['code'])
                ->where('id', '!=', $customer->id)
                ->exists();

            if ($exists) {
                throw ValidationException::withMessages([
                    'code' => ['The customer code has already been taken in this organization.'],
                ]);
            }
        }

        $customer->update($data);

        return $customer->fresh();
    }

    /**
     * Delete a customer (soft delete).
     */
    public function deleteCustomer(Customer $customer): void
    {
        // Safeguard: block deletion if active enquiries exist
        $hasActiveEnquiries = $customer->enquiries()
            ->whereNotIn('status', [EnquiryStatus::LOST->value, EnquiryStatus::CANCELLED->value])
            ->exists();

        if ($hasActiveEnquiries) {
            throw ValidationException::withMessages([
                'customer' => ['Cannot delete customer with active enquiries.'],
            ]);
        }

        $customer->delete();
    }

    /**
     * Generate the next sequential customer code for an organization.
     */
    protected function generateNextCode(Organization $org): string
    {
        $lastCustomer = Customer::withTrashed()
            ->where('organization_id', $org->id)
            ->where('code', 'like', 'CUST-%')
            ->orderByRaw('CAST(SUBSTRING(code, 6) AS UNSIGNED) DESC')
            ->first();

        if ($lastCustomer && preg_match('/CUST-(\d+)/', $lastCustomer->code, $matches)) {
            $nextNumber = ((int) $matches[1]) + 1;
        } else {
            $nextNumber = 1;
        }

        return sprintf('CUST-%04d', $nextNumber);
    }
}
