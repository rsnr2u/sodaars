import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import leadService from '../../services/leadService';
import resourceService from '../../services/resourceService';
import { getApiErrorMessage } from '../../services/api';
import type { DirectoryLead } from '../../types/lead';
import type { PaginationMeta } from '../../types/common';
import type { ResourceOption } from '../../components/leads/LeadFilters';
import LeadFilters from '../../components/leads/LeadFilters';
import LeadTable from '../../components/leads/LeadTable';
import LeadDetailDrawer from '../../components/leads/LeadDetailDrawer';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { Inbox, RefreshCw } from 'lucide-react';

export const LeadsPage: React.FC = () => {
  const { role } = useAuth();
  const { success, error: showError } = useToast();

  const canDelete =
    role === 'PROVIDER_OWNER' ||
    role === 'PROVIDER_MANAGER' ||
    (role as any) === 'OWNER' ||
    (role as any) === 'MANAGER';

  // Leads Data State
  const [leads, setLeads] = useState<DirectoryLead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter State
  const [status, setStatus] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [resourceUuid, setResourceUuid] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const perPage = 15;

  // Available Resources for filter dropdown
  const [resources, setResources] = useState<ResourceOption[]>([]);

  // Selected Lead for Detail Drawer
  const [selectedLead, setSelectedLead] = useState<DirectoryLead | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Delete Lead Confirmation Modal
  const [leadToDelete, setLeadToDelete] = useState<DirectoryLead | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Load resources for the optional filter dropdown
  useEffect(() => {
    const loadResources = async () => {
      try {
        const res = await resourceService.getResources({ per_page: 100 });
        setResources(
          (res.items || []).map((r) => ({
            uuid: r.uuid,
            name: r.name,
            code: r.code,
          }))
        );
      } catch {
        // Non-critical, filter will simply be omitted if resources fail to load
      }
    };
    loadResources();
  }, []);

  // Fetch leads from backend
  const fetchLeads = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await leadService.getLeads({
        status: status || undefined,
        search: search || undefined,
        resource_uuid: resourceUuid || undefined,
        page,
        per_page: perPage,
      });

      setLeads(res.items || []);
      setPagination(res.pagination || null);
    } catch (err: any) {
      showError(getApiErrorMessage(err));
      setLeads([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [status, search, resourceUuid, page, showError]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Status Filter Handler (resets page to 1)
  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
  };

  // Search Filter Handler (resets page to 1)
  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  // Resource Filter Handler (resets page to 1)
  const handleResourceChange = (newResourceUuid: string) => {
    setResourceUuid(newResourceUuid);
    setPage(1);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setStatus('');
    setSearch('');
    setResourceUuid('');
    setPage(1);
  };

  // Select Lead for Drawer
  const handleSelectLead = (lead: DirectoryLead) => {
    setSelectedLead(lead);
    setIsDrawerOpen(true);
  };

  // Handle lead updated from drawer (status advance or notes change)
  const handleLeadUpdated = (updatedLead: DirectoryLead) => {
    setSelectedLead(updatedLead);
    setLeads((prev) =>
      prev.map((item) => (item.uuid === updatedLead.uuid ? updatedLead : item))
    );
  };

  // Handle lead deletion from drawer or table
  const handleLeadDeleted = (deletedUuid: string) => {
    setLeads((prev) => prev.filter((item) => item.uuid !== deletedUuid));
    if (selectedLead?.uuid === deletedUuid) {
      setSelectedLead(null);
      setIsDrawerOpen(false);
    }
    success('Directory lead deleted successfully.');
  };

  // Confirm delete from table button
  const handleConfirmDelete = async () => {
    if (!leadToDelete || !canDelete) return;
    try {
      setIsDeleting(true);
      await leadService.deleteLead(leadToDelete.uuid);
      handleLeadDeleted(leadToDelete.uuid);
      setLeadToDelete(null);
    } catch (err: any) {
      showError(getApiErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
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
            <Inbox size={22} style={{ color: '#2563eb' }} />
            <h1
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#0f172a',
                margin: 0,
              }}
            >
              Directory Leads Inbox
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
            Prospective advertiser inquiries captured from the public directory with immutable resource and location snapshots.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchLeads}
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
        </div>
      </div>

      {/* Filters (Status Tabs, Debounced Search, Resource filter) */}
      <LeadFilters
        status={status}
        search={search}
        resourceUuid={resourceUuid}
        resources={resources}
        totalCount={pagination?.total}
        onStatusChange={handleStatusChange}
        onSearchChange={handleSearchChange}
        onResourceChange={handleResourceChange}
        onReset={handleResetFilters}
      />

      {/* Leads Table */}
      <LeadTable
        leads={leads}
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={(newPage) => setPage(newPage)}
        onSelectLead={handleSelectLead}
        onDeleteLead={canDelete ? (lead) => setLeadToDelete(lead) : undefined}
      />

      {/* Lead Detail Drawer */}
      <LeadDetailDrawer
        lead={selectedLead}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedLead(null);
        }}
        onLeadUpdated={handleLeadUpdated}
        onLeadDeleted={handleLeadDeleted}
      />

      {/* Table-level Delete Confirmation Modal */}
      {leadToDelete && (
        <Modal
          isOpen={Boolean(leadToDelete)}
          onClose={() => setLeadToDelete(null)}
          title="Delete Directory Lead"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
              Are you sure you want to delete the lead inquiry from{' '}
              <strong>{leadToDelete.visitor.name}</strong> (
              {leadToDelete.visitor.company_name || 'Individual'})? This will remove the lead from
              your active directory inbox.
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
                <strong>Recorded Unit:</strong> {leadToDelete.snapshots.resource_name || 'General Inquiry'} (
                {leadToDelete.snapshots.resource_code || '—'})
              </div>
              <div style={{ marginTop: '0.2rem' }}>
                <strong>Current Status:</strong> {leadToDelete.status}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button
                variant="ghost"
                size="sm"
                disabled={isDeleting}
                onClick={() => setLeadToDelete(null)}
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

export default LeadsPage;
