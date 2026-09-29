<?php

namespace App\Http\Controllers\Api\V1\Tenant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\StoreCustomerRequest;
use App\Http\Requests\Tenant\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Http\Traits\ApiResponse;
use App\Models\Customer;
use App\Services\Customer\CustomerService;
use App\Services\Tenant\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CustomerController extends Controller
{
    use ApiResponse;

    protected TenantContext $tenantContext;
    protected CustomerService $customerService;

    public function __construct(TenantContext $tenantContext, CustomerService $customerService)
    {
        $this->tenantContext = $tenantContext;
        $this->customerService = $customerService;
    }

    /**
     * List customers for the active tenant.
     */
    public function index(Request $request): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        Gate::authorize('viewAny', [Customer::class, $organization]);

        $customers = $this->customerService->listCustomers($organization, $request->all());

        return $this->successResponse([
            'items' => CustomerResource::collection($customers),
            'pagination' => [
                'total' => $customers->total(),
                'per_page' => $customers->perPage(),
                'current_page' => $customers->currentPage(),
                'last_page' => $customers->lastPage(),
            ],
        ], 'Customers retrieved successfully.');
    }

    /**
     * Create a new customer for the active tenant.
     */
    public function store(StoreCustomerRequest $request): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        Gate::authorize('create', [Customer::class, $organization]);

        $customer = $this->customerService->createCustomer(
            $organization,
            $request->user(),
            $request->validated()
        );

        return $this->successResponse(
            new CustomerResource($customer),
            'Customer created successfully.',
            201
        );
    }

    /**
     * Display a specific customer.
     */
    public function show(string $uuid): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        $customer = Customer::where('organization_id', $organization->id)
            ->where('uuid', $uuid)
            ->withCount('enquiries')
            ->firstOrFail();

        Gate::authorize('view', $customer);

        return $this->successResponse(
            new CustomerResource($customer),
            'Customer details retrieved successfully.'
        );
    }

    /**
     * Update an existing customer.
     */
    public function update(UpdateCustomerRequest $request, string $uuid): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        $customer = Customer::where('organization_id', $organization->id)
            ->where('uuid', $uuid)
            ->firstOrFail();

        Gate::authorize('update', $customer);

        $updated = $this->customerService->updateCustomer($customer, $request->validated());

        return $this->successResponse(
            new CustomerResource($updated),
            'Customer updated successfully.'
        );
    }

    /**
     * Delete a customer (soft delete).
     */
    public function destroy(string $uuid): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        $customer = Customer::where('organization_id', $organization->id)
            ->where('uuid', $uuid)
            ->firstOrFail();

        Gate::authorize('delete', $customer);

        $this->customerService->deleteCustomer($customer);

        return $this->successResponse(null, 'Customer deleted successfully.');
    }
}
