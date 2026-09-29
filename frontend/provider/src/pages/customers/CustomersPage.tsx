import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import customerService from '../../services/customerService';
import { getApiErrorMessage } from '../../services/api';
import type { Customer, CustomerType, CustomerStatus } from '../../types/customer';
import type { PaginationMeta } from '../../types/common';
import CustomerFilters from '../../components/customers/CustomerFilters';
import CustomerTable from '../../components/customers/CustomerTable';
import CustomerFormDrawer from '../../components/customers/CustomerFormDrawer';
import CustomerDetailDrawer from '../../components/customers/CustomerDetailDrawer';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { Users, Plus, RefreshCw } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const { role } = useAuth();
  const { success, error: showError } = useToast();

  const canDelete =
    role === 'PROVIDER_OWNER' ||
    role === 'PROVIDER_MANAGER' ||
    (role as any) === 'OWNER' ||
    (role as any) === 'MANAGER';

  // Data State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter State
  const [search, setSearch] = useState<string>('');
  const [customerType, setCustomerType] = useState<CustomerType | ''>('');
  const [status, setStatus] = useState<CustomerStatus | ''>('');
  const [page, setPage] = useState<number>(1);
  const perPage = 15;

  // Drawer / Modal States
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Fetch Customers from backend
  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await customerService.getCustomers({
        search: search || undefined,
        customer_type: customerType || undefined,
        status: status || undefined,
        page,
        per_page: perPage,
      });

      setCustomers(res.items || []);
      setPagination(res.pagination || null);
    } catch (err: any) {
      showError(getApiErrorMessage(err));
      setCustomers([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [search, customerType, status, page, showError]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Handlers
  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleTypeChange = (newType: CustomerType | '') => {
    setCustomerType(newType);
    setPage(1);
  };

  const handleStatusChange = (newStatus: CustomerStatus | '') => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCustomerType('');
    setStatus('');
    setPage(1);
  };

  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleCustomerSaved = (saved: Customer) => {
    setCustomers((prev) => {
      const exists = prev.some((c) => c.uuid === saved.uuid);
      if (exists) {
        return prev.map((c) => (c.uuid === saved.uuid ? saved : c));
      }
      return [saved, ...prev];
    });
    if (viewingCustomer?.uuid === saved.uuid) {
      setViewingCustomer(saved);
    }
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete || !canDelete) return;

    try {
      setIsDeleting(true);
      await customerService.deleteCustomer(customerToDelete.uuid);
      setCustomers((prev) => prev.filter((c) => c.uuid !== customerToDelete.uuid));
      if (viewingCustomer?.uuid === customerToDelete.uuid) {
        setViewingCustomer(null);
      }
      success(`Client ${customerToDelete.company_name || customerToDelete.contact_person} removed.`);
      setCustomerToDelete(null);
    } catch (err: any) {
      showError(getApiErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          backgroundColor: '#ffffff',
          padding: '1.25rem 1.5rem',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Users size={22} style={{ color: '#2563eb' }} />
            <h1
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#0f172a',
                margin: 0,
              }}
            >
              Commercial Clients Directory
            </h1>
          </div>
          <p
            style={{
              fontSize: '0.85rem',
              color: '#64748b',
              marginTop: '0.35rem',
              marginBottom: 0,
            }}
          >
            Direct advertisers, corporate brands, and media agencies associated with outdoor advertising campaigns.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchCustomers}
            disabled={isLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#64748b',
            }}
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenCreate}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.875rem',
            }}
          >
            <Plus size={16} />
            Add Client
          </Button>
        </div>
      </div>

      {/* Filters */}
      <CustomerFilters
        search={search}
        customerType={customerType}
        status={status}
        totalCount={pagination?.total}
        onSearchChange={handleSearchChange}
        onTypeChange={handleTypeChange}
        onStatusChange={handleStatusChange}
        onReset={handleResetFilters}
      />

      {/* Table */}
      <CustomerTable
        customers={customers}
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={(newPage) => setPage(newPage)}
        onViewCustomer={(c) => setViewingCustomer(c)}
        onEditCustomer={handleOpenEdit}
        onDeleteCustomer={canDelete ? (c) => setCustomerToDelete(c) : undefined}
      />

      {/* Form Drawer (Add / Edit) */}
      <CustomerFormDrawer
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCustomer(null);
        }}
        customer={editingCustomer}
        onSuccess={handleCustomerSaved}
      />

      {/* Detail Drawer */}
      <CustomerDetailDrawer
        isOpen={Boolean(viewingCustomer)}
        onClose={() => setViewingCustomer(null)}
        customer={viewingCustomer}
        onEdit={(c) => {
          setViewingCustomer(null);
          handleOpenEdit(c);
        }}
        onDelete={canDelete ? (c) => setCustomerToDelete(c) : undefined}
      />

      {/* Delete Confirmation Modal */}
      {customerToDelete && (
        <Modal
          isOpen={Boolean(customerToDelete)}
          onClose={() => setCustomerToDelete(null)}
          title="Delete Client Record"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
              Are you sure you want to delete client{' '}
              <strong>{customerToDelete.company_name || customerToDelete.contact_person}</strong> (
              {customerToDelete.code})?
            </p>

            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '0.75rem',
                fontSize: '0.8rem',
                color: '#64748b',
              }}
            >
              <div>
                <strong>Associated Campaigns:</strong> {customerToDelete.enquiries_count ?? 0} Enquiries
              </div>
              <div style={{ marginTop: '0.2rem' }}>
                <strong>Contact:</strong> {customerToDelete.contact_person} ({customerToDelete.phone})
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button
                variant="ghost"
                size="sm"
                disabled={isDeleting}
                onClick={() => setCustomerToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CustomersPage;
