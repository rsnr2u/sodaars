import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  PlusCircle,
  Eye,
  Edit,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { Organization } from '../../types/organization';
import { organizationService } from '../../services/organizationService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import OrganizationDetailDrawer from './OrganizationDetailDrawer';
import CreateOrganizationModal from './CreateOrganizationModal';
import EditOrganizationModal from './EditOrganizationModal';
import VerifyOrganizationModal from './VerifyOrganizationModal';
import SuspendConfirmModal from './SuspendConfirmModal';

export const OrganizationsPage: React.FC = () => {
  const { isPlatformAdmin } = useAuth();
  const { error } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 15,
    current_page: 1,
    last_page: 1,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('');

  // Modals state
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [verifyingOrg, setVerifyingOrg] = useState<Organization | null>(null);
  const [suspendingOrg, setSuspendingOrg] = useState<Organization | null>(null);
  const [suspendMode, setSuspendMode] = useState<'suspend' | 'activate'>('suspend');

  // Handle URL query parameters (e.g. ?view=UUID or ?action=create)
  useEffect(() => {
    const viewUuid = searchParams.get('view');
    const action = searchParams.get('action');

    if (viewUuid) {
      setSelectedUuid(viewUuid);
    }
    if (action === 'create' && isPlatformAdmin) {
      setIsCreateOpen(true);
    }
  }, [searchParams, isPlatformAdmin]);

  const fetchOrganizations = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const response = await organizationService.getOrganizations({
          page,
          per_page: 15,
          search: search || undefined,
          status: statusFilter || undefined,
          registration_source: sourceFilter || undefined,
        });
        setOrganizations(response.items || []);
        setPagination(response.pagination);
      } catch {
        error('Data Load Error', 'Failed to retrieve organizations list.');
      } finally {
        setIsLoading(false);
      }
    },
    [search, statusFilter, sourceFilter, error]
  );

  useEffect(() => {
    fetchOrganizations(1);
  }, [fetchOrganizations]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrganizations(1);
  };

  const openDrawer = (uuid: string) => {
    setSelectedUuid(uuid);
    setSearchParams((prev) => {
      prev.set('view', uuid);
      return prev;
    });
  };

  const closeDrawer = () => {
    setSelectedUuid(null);
    setSearchParams((prev) => {
      prev.delete('view');
      return prev;
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Provider Organizations</h1>
          <p className="page-subtitle">
            Lifecycle governance, operational compliance, and verification controls
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => fetchOrganizations(pagination.current_page)}
            disabled={isLoading}
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          {isPlatformAdmin && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsCreateOpen(true)}
            >
              <PlusCircle size={15} />
              <span>Register Organization</span>
            </button>
          )}
        </div>
      </div>

      <div className="card">
        {/* Filters Bar */}
        <div className="filter-bar">
          <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
            <Search size={16} className="search-input-icon" />
            <input
              type="text"
              className="input-text"
              placeholder="Search by organization name, email, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              className="select-control"
              style={{ width: '160px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>

            <select
              className="select-control"
              style={{ width: '180px' }}
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="">All Sources</option>
              <option value="PUBLIC">PUBLIC (Self-Registered)</option>
              <option value="ADMIN">ADMIN (Provisioned)</option>
              <option value="INVITATION">INVITATION</option>
            </select>
          </div>
        </div>

        {/* Organizations Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Location</th>
                <th>Source</th>
                <th>Subscription Plan</th>
                <th>Status</th>
                <th>Verification</th>
                <th>Directory</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="spinner-large" style={{ margin: '0 auto 1rem' }} />
                    <span style={{ color: '#64748b' }}>Loading organization records...</span>
                  </td>
                </tr>
              ) : organizations.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    <Building2 size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                    <p>No organizations found matching the criteria.</p>
                  </td>
                </tr>
              ) : (
                organizations.map((org) => (
                  <tr key={org.id}>
                    <td>
                      <div
                        style={{ fontWeight: 600, color: 'var(--primary)', cursor: 'pointer' }}
                        onClick={() => openDrawer(org.uuid)}
                      >
                        {org.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {org.email || 'No email'} • <code>{org.slug}</code>
                      </div>
                    </td>
                    <td>
                      {org.city ? `${org.city}${org.state ? `, ${org.state}` : ''}` : '—'}
                    </td>
                    <td>
                      <span className={`badge badge-${org.registration_source || 'ADMIN'}`}>
                        <span>{org.registration_source || 'ADMIN'}</span>
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                        {org.active_subscription?.plan?.name || 'Standard Tier'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${org.status}`}>
                        <span className="badge-dot" />
                        <span>{org.status}</span>
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${org.verification_status}`}>
                        <span>{org.verification_status}</span>
                      </span>
                    </td>
                    <td>
                      {org.public_directory_visible ? (
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: '#059669',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <Eye size={13} />
                          <span>Visible</span>
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          Hidden
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
                        <button
                          type="button"
                          className="btn-icon"
                          title="View Profile Details"
                          onClick={() => openDrawer(org.uuid)}
                        >
                          <Eye size={15} />
                        </button>

                        {isPlatformAdmin && (
                          <>
                            <button
                              type="button"
                              className="btn-icon"
                              title="Edit Organization"
                              onClick={() => setEditingOrg(org)}
                            >
                              <Edit size={15} />
                            </button>

                            <button
                              type="button"
                              className="btn-icon"
                              title="Update Verification Status"
                              onClick={() => setVerifyingOrg(org)}
                            >
                              <ShieldCheck size={15} />
                            </button>

                            {org.status === 'SUSPENDED' ? (
                              <button
                                type="button"
                                className="btn-icon"
                                style={{ color: '#10b981' }}
                                title="Reactivate Organization"
                                onClick={() => {
                                  setSuspendingOrg(org);
                                  setSuspendMode('activate');
                                }}
                              >
                                <CheckCircle size={15} />
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn-icon"
                                style={{ color: '#ef4444' }}
                                title="Suspend Organization"
                                onClick={() => {
                                  setSuspendingOrg(org);
                                  setSuspendMode('suspend');
                                }}
                              >
                                <AlertTriangle size={15} />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="pagination-bar">
          <div>
            Showing{' '}
            <strong>
              {organizations.length > 0 ? (pagination.current_page - 1) * pagination.per_page + 1 : 0}
            </strong>{' '}
            to{' '}
            <strong>
              {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
            </strong>{' '}
            of <strong>{pagination.total}</strong> organizations
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={pagination.current_page <= 1 || isLoading}
              onClick={() => fetchOrganizations(pagination.current_page - 1)}
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={pagination.current_page >= pagination.last_page || isLoading}
              onClick={() => fetchOrganizations(pagination.current_page + 1)}
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Modals & Slide-over Drawer */}
      <OrganizationDetailDrawer
        uuid={selectedUuid}
        onClose={closeDrawer}
        onEditClick={(o) => setEditingOrg(o)}
        onVerifyClick={(o) => setVerifyingOrg(o)}
        onSuspendClick={(o) => {
          setSuspendingOrg(o);
          setSuspendMode('suspend');
        }}
        onActivateClick={(o) => {
          setSuspendingOrg(o);
          setSuspendMode('activate');
        }}
      />

      <CreateOrganizationModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setSearchParams((prev) => {
            prev.delete('action');
            return prev;
          });
        }}
        onSuccess={() => fetchOrganizations(pagination.current_page)}
      />

      <EditOrganizationModal
        org={editingOrg}
        isOpen={!!editingOrg}
        onClose={() => setEditingOrg(null)}
        onSuccess={() => fetchOrganizations(pagination.current_page)}
      />

      <VerifyOrganizationModal
        org={verifyingOrg}
        isOpen={!!verifyingOrg}
        onClose={() => setVerifyingOrg(null)}
        onSuccess={() => fetchOrganizations(pagination.current_page)}
      />

      <SuspendConfirmModal
        org={suspendingOrg}
        mode={suspendMode}
        isOpen={!!suspendingOrg}
        onClose={() => setSuspendingOrg(null)}
        onSuccess={() => fetchOrganizations(pagination.current_page)}
      />
    </div>
  );
};

export default OrganizationsPage;
