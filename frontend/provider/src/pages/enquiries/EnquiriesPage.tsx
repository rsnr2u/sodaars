import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import enquiryService from '../../services/enquiryService';
import { getApiErrorMessage } from '../../services/api';
import type { Enquiry, EnquiryStatus, EnquiryPriority, EnquirySource } from '../../types/enquiry';
import type { PaginationMeta } from '../../types/common';
import EnquiryFilters from '../../components/enquiries/EnquiryFilters';
import EnquiryTable from '../../components/enquiries/EnquiryTable';
import EnquiryFormDrawer from '../../components/enquiries/EnquiryFormDrawer';
import EnquiryDetailDrawer from '../../components/enquiries/EnquiryDetailDrawer';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { FileText, Plus, RefreshCw } from 'lucide-react';

export const EnquiriesPage: React.FC = () => {
  const { role } = useAuth();
  const { success, error: showError } = useToast();

  const canDelete =
    role === 'PROVIDER_OWNER' ||
    role === 'PROVIDER_MANAGER' ||
    (role as any) === 'OWNER' ||
    (role as any) === 'MANAGER';

  // Data State
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter State
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<EnquiryStatus | ''>('');
  const [priority, setPriority] = useState<EnquiryPriority | ''>('');
  const [source, setSource] = useState<EnquirySource | ''>('');
  const [page, setPage] = useState<number>(1);
  const perPage = 15;

  // Drawer / Modal States
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingEnquiry, setEditingEnquiry] = useState<Enquiry | null>(null);
  const [viewingEnquiry, setViewingEnquiry] = useState<Enquiry | null>(null);
  const [enquiryToDelete, setEnquiryToDelete] = useState<Enquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Fetch Enquiries from backend
  const fetchEnquiries = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await enquiryService.getEnquiries({
        search: search || undefined,
        status: status || undefined,
        priority: priority || undefined,
        source: source || undefined,
        page,
        per_page: perPage,
      });

      setEnquiries(res.items || []);
      setPagination(res.pagination || null);
    } catch (err: any) {
      showError(getApiErrorMessage(err));
      setEnquiries([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [search, status, priority, source, page, showError]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  // Handlers
  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleStatusChange = (newStatus: EnquiryStatus | '') => {
    setStatus(newStatus);
    setPage(1);
  };

  const handlePriorityChange = (newPriority: EnquiryPriority | '') => {
    setPriority(newPriority);
    setPage(1);
  };

  const handleSourceChange = (newSource: EnquirySource | '') => {
    setSource(newSource);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('');
    setPriority('');
    setSource('');
    setPage(1);
  };

  const handleOpenCreate = () => {
    setEditingEnquiry(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (enquiry: Enquiry) => {
    setEditingEnquiry(enquiry);
    setIsFormOpen(true);
  };

  const handleEnquirySaved = (saved: Enquiry) => {
    setEnquiries((prev) => {
      const exists = prev.some((e) => e.uuid === saved.uuid);
      if (exists) {
        return prev.map((e) => (e.uuid === saved.uuid ? saved : e));
      }
      return [saved, ...prev];
    });
    if (viewingEnquiry?.uuid === saved.uuid) {
      setViewingEnquiry(saved);
    }
  };

  const handleConfirmDelete = async () => {
    if (!enquiryToDelete || !canDelete) return;

    try {
      setIsDeleting(true);
      await enquiryService.deleteEnquiry(enquiryToDelete.uuid);
      setEnquiries((prev) => prev.filter((e) => e.uuid !== enquiryToDelete.uuid));
      if (viewingEnquiry?.uuid === enquiryToDelete.uuid) {
        setViewingEnquiry(null);
      }
      success(`Proposal ${enquiryToDelete.enquiry_number} deleted.`);
      setEnquiryToDelete(null);
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
            <FileText size={22} style={{ color: '#2563eb' }} />
            <h1
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#0f172a',
                margin: 0,
              }}
            >
              Campaign Proposals & Enquiries
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
            Commercial campaign requests, inventory proposals, and tentative reservation holds.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchEnquiries}
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
            New Proposal
          </Button>
        </div>
      </div>

      {/* Filters (Status Tabs, Search, Priority, Source) */}
      <EnquiryFilters
        search={search}
        status={status}
        priority={priority}
        source={source}
        totalCount={pagination?.total}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
        onSourceChange={handleSourceChange}
        onReset={handleResetFilters}
      />

      {/* Table */}
      <EnquiryTable
        enquiries={enquiries}
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={(newPage) => setPage(newPage)}
        onViewEnquiry={(e) => setViewingEnquiry(e)}
        onEditEnquiry={handleOpenEdit}
        onDeleteEnquiry={canDelete ? (e) => setEnquiryToDelete(e) : undefined}
      />

      {/* Form Drawer (Add / Edit) */}
      <EnquiryFormDrawer
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEnquiry(null);
        }}
        enquiry={editingEnquiry}
        onSuccess={handleEnquirySaved}
      />

      {/* Detail Drawer */}
      <EnquiryDetailDrawer
        isOpen={Boolean(viewingEnquiry)}
        onClose={() => setViewingEnquiry(null)}
        enquiry={viewingEnquiry}
        onEdit={(e) => {
          setViewingEnquiry(null);
          handleOpenEdit(e);
        }}
        onEnquiryUpdated={handleEnquirySaved}
        onEnquiryDeleted={canDelete ? (e) => setEnquiryToDelete(e) : undefined}
      />

      {/* Delete Confirmation Modal */}
      {enquiryToDelete && (
        <Modal
          isOpen={Boolean(enquiryToDelete)}
          onClose={() => setEnquiryToDelete(null)}
          title="Delete Campaign Proposal"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
              Are you sure you want to delete proposal{' '}
              <strong>{enquiryToDelete.enquiry_number}</strong> (
              {enquiryToDelete.campaign_title})? Any associated tentative holds will be automatically released on the inventory calendar.
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
                <strong>Client:</strong> {enquiryToDelete.customer?.company_name || enquiryToDelete.customer?.contact_person}
              </div>
              <div style={{ marginTop: '0.2rem' }}>
                <strong>Current Status:</strong> {enquiryToDelete.status}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button
                variant="ghost"
                size="sm"
                disabled={isDeleting}
                onClick={() => setEnquiryToDelete(null)}
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

export default EnquiriesPage;
