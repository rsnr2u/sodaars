import React, { useState, useEffect, useCallback } from 'react';
import type {
  AdvertisingResource,
  AdvertisingResourcePayload,
  TenantSubscription,
} from '../../types/resource';
import type { LocationOption } from '../../components/resources/ResourceFilters';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import resourceService from '../../services/resourceService';
import locationService from '../../services/locationService';
import { getApiErrorMessage } from '../../services/api';
import ResourceQuotaBar from '../../components/resources/ResourceQuotaBar';
import ResourceFilters from '../../components/resources/ResourceFilters';
import ResourceTable from '../../components/resources/ResourceTable';
import ResourceFormDrawer from '../../components/resources/ResourceFormDrawer';
import ResourceOverviewDrawer from '../../components/resources/ResourceOverviewDrawer';
import Button from '../../components/ui/Button';
import { Plus } from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const { role } = useAuth();
  const { success, error: showError } = useToast();

  // RBAC: Owner & Manager can create, edit, delete resources; Staff can only view
  const canCreateOrEdit = role === 'PROVIDER_OWNER' || role === 'PROVIDER_MANAGER';

  // Data State
  const [resources, setResources] = useState<AdvertisingResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [subscription, setSubscription] = useState<TenantSubscription | null>(null);
  const [locations, setLocations] = useState<LocationOption[]>([]);

  // Filter State
  const [search, setSearch] = useState('');
  const [locationUuid, setLocationUuid] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [illuminationType, setIlluminationType] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Drawer / Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<AdvertisingResource | null>(null);

  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<AdvertisingResource | null>(null);
  const [overviewTab, setOverviewTab] = useState<'overview' | 'media'>('overview');

  // Load locations for filter & form dropdowns
  const fetchLocations = useCallback(async () => {
    try {
      const data = await locationService.getLocations({ per_page: 100, status: 'ACTIVE' });
      const options: LocationOption[] = (data.items || []).map((loc) => ({
        uuid: loc.uuid,
        name: loc.name,
        code: loc.code,
      }));
      setLocations(options);
    } catch {
      // Non-blocking fallback
    }
  }, []);

  // Load subscription quota
  const fetchSubscription = useCallback(async () => {
    try {
      const sub = await resourceService.getSubscription();
      setSubscription(sub);

      // Fetch exact active count for quota calculation
      const activeRes = await resourceService.getResources({ status: 'ACTIVE', per_page: 1 });
      setActiveCount(activeRes.pagination.total);
    } catch {
      // Non-blocking fallback
    }
  }, []);

  // Load resources with current filters
  const fetchResources = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await resourceService.getResources({
        page,
        per_page: perPage,
        search: search.trim() || undefined,
        location_uuid: locationUuid || undefined,
        resource_type: resourceType || undefined,
        category: category || undefined,
        status: status || undefined,
        illumination_type: illuminationType || undefined,
      });

      setResources(data.items || []);
      setTotalCount(data.pagination.total);
      setTotalPages(data.pagination.last_page);
    } catch (err: unknown) {
      showError(getApiErrorMessage(err), 'Failed to load advertising resources');
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    perPage,
    search,
    locationUuid,
    resourceType,
    category,
    status,
    illuminationType,
    showError,
  ]);

  // Initial Load
  useEffect(() => {
    fetchLocations();
    fetchSubscription();
  }, [fetchLocations, fetchSubscription]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  // Drawer Handlers
  const handleOpenCreate = () => {
    if (!canCreateOrEdit) return;
    setEditingResource(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (res: AdvertisingResource) => {
    if (!canCreateOrEdit) return;
    setEditingResource(res);
    setIsFormOpen(true);
  };

  const handleOpenOverview = (res: AdvertisingResource) => {
    setSelectedResource(res);
    setOverviewTab('overview');
    setIsOverviewOpen(true);
  };

  const handleOpenPhotos = (res: AdvertisingResource) => {
    setSelectedResource(res);
    setOverviewTab('media');
    setIsOverviewOpen(true);
  };

  const handleSaveResource = async (payload: AdvertisingResourcePayload) => {
    if (editingResource) {
      const updated = await resourceService.updateResource(editingResource.uuid, payload);
      success(`Resource "${updated.name}" updated successfully.`);
      if (selectedResource?.uuid === updated.uuid) {
        setSelectedResource(updated);
      }
    } else {
      const created = await resourceService.createResource(payload);
      success(`Resource "${created.name}" created successfully.`);
    }
    fetchResources();
    fetchSubscription();
  };

  const handleDeleteResource = async (res: AdvertisingResource) => {
    if (!canCreateOrEdit) return;
    if (!window.confirm(`Are you sure you want to delete "${res.name}" (${res.code})?`)) return;

    try {
      await resourceService.deleteResource(res.uuid);
      success(`Resource "${res.name}" deleted successfully.`);
      fetchResources();
      fetchSubscription();
    } catch (err: unknown) {
      showError(getApiErrorMessage(err), 'Delete Failed');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setLocationUuid('');
    setResourceType('');
    setCategory('');
    setStatus('');
    setIlluminationType('');
    setPage(1);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1>Advertising Resources</h1>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--blue-700)',
                backgroundColor: 'var(--blue-50)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {totalCount} total
            </span>
          </div>
          <p>Manage your outdoor advertising inventory, physical specifications, and rate cards across locations.</p>
        </div>

        {/* Add Resource Action (Owner & Manager only, hidden for Staff per RBAC) */}
        {canCreateOrEdit && (
          <Button
            variant="primary"
            onClick={handleOpenCreate}
            leftIcon={<Plus size={16} />}
          >
            Add Resource
          </Button>
        )}
      </div>

      {/* Subscription Quota Bar */}
      <ResourceQuotaBar
        activeCount={activeCount}
        subscription={subscription}
      />

      {/* Search & Filters */}
      <ResourceFilters
        search={search}
        locationUuid={locationUuid}
        resourceType={resourceType}
        category={category}
        status={status}
        illuminationType={illuminationType}
        locations={locations}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        onLocationChange={(val) => {
          setLocationUuid(val);
          setPage(1);
        }}
        onResourceTypeChange={(val) => {
          setResourceType(val);
          setPage(1);
        }}
        onCategoryChange={(val) => {
          setCategory(val);
          setPage(1);
        }}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        onIlluminationChange={(val) => {
          setIlluminationType(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Resources Table */}
      <ResourceTable
        resources={resources}
        isLoading={isLoading}
        onView={handleOpenOverview}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteResource}
        onManagePhotos={handleOpenPhotos}
        onAddResource={handleOpenCreate}
      />

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1.25rem',
            padding: '0.75rem 0.5rem',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
            <span>
              Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} resources)
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Per page:</span>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(parseInt(e.target.value, 10));
                  setPage(1);
                }}
                className="form-select"
                style={{ height: '28px', padding: '2px 6px', fontSize: '0.8rem' }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Add / Edit Resource Drawer */}
      <ResourceFormDrawer
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        resource={editingResource}
        locations={locations}
        onSave={handleSaveResource}
      />

      {/* Resource Overview Drawer */}
      <ResourceOverviewDrawer
        isOpen={isOverviewOpen}
        onClose={() => setIsOverviewOpen(false)}
        resource={selectedResource}
        onEdit={handleOpenEdit}
        initialTab={overviewTab}
        onResourceUpdated={() => {
          fetchResources();
          if (selectedResource) {
            resourceService.getResource(selectedResource.uuid).then(setSelectedResource);
          }
        }}
      />
    </div>
  );
};

export default ResourcesPage;
