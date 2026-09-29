import React, { useState, useEffect, useCallback } from 'react';
import type { Location, LocationPayload } from '../../types/location';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import locationService from '../../services/locationService';
import { getApiErrorMessage } from '../../services/api';
import LocationFilters from '../../components/locations/LocationFilters';
import LocationTable from '../../components/locations/LocationTable';
import LocationFormDrawer from '../../components/locations/LocationFormDrawer';
import LocationOverviewDrawer from '../../components/locations/LocationOverviewDrawer';
import Button from '../../components/ui/Button';
import { Plus } from 'lucide-react';

export const LocationsPage: React.FC = () => {
  const { role } = useAuth();
  const { success, error: showError } = useToast();

  // Corrected RBAC: Owner & Manager can create, edit, delete locations; Staff can only view
  const canCreateOrEdit = role === 'PROVIDER_OWNER' || role === 'PROVIDER_MANAGER';

  // Data State
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filter State
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [city, setCity] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Drawer / Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [overviewTab, setOverviewTab] = useState<'overview' | 'photos'>('overview');

  const fetchLocations = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await locationService.getLocations({
        page,
        per_page: perPage,
        search: search.trim() || undefined,
        status: status || undefined,
        city: city.trim() || undefined,
      });

      setLocations(data.items || []);
      setTotalCount(data.pagination.total);
      setTotalPages(data.pagination.last_page);
    } catch (err: unknown) {
      showError(getApiErrorMessage(err), 'Failed to load locations');
    } finally {
      setIsLoading(false);
    }
  }, [page, perPage, search, status, city, showError]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  // Handle Search / Filter Updates
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    setPage(1);
  };

  const handleCityChange = (val: string) => {
    setCity(val);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('');
    setCity('');
    setPage(1);
  };

  // Drawer Actions
  const handleOpenCreate = () => {
    if (!canCreateOrEdit) return;
    setEditingLocation(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (loc: Location) => {
    if (!canCreateOrEdit) return;
    setEditingLocation(loc);
    setIsFormOpen(true);
  };

  const handleOpenOverview = (loc: Location) => {
    setSelectedLocation(loc);
    setOverviewTab('overview');
    setIsOverviewOpen(true);
  };

  const handleOpenPhotos = (loc: Location) => {
    setSelectedLocation(loc);
    setOverviewTab('photos');
    setIsOverviewOpen(true);
  };

  const handleSaveLocation = async (payload: LocationPayload) => {
    if (editingLocation) {
      const updated = await locationService.updateLocation(editingLocation.uuid, payload);
      success(`Location "${updated.name}" updated successfully.`);
      if (selectedLocation?.uuid === updated.uuid) {
        setSelectedLocation(updated);
      }
    } else {
      const created = await locationService.createLocation(payload);
      success(`Location "${created.name}" created successfully.`);
    }
    fetchLocations();
  };

  const handleDeleteLocation = async (loc: Location) => {
    if (!canCreateOrEdit) return;
    if (!window.confirm(`Are you sure you want to delete "${loc.name}" (${loc.code})?`)) return;

    try {
      await locationService.deleteLocation(loc.uuid);
      success(`Location "${loc.name}" deleted successfully.`);
      fetchLocations();
    } catch (err: unknown) {
      showError(getApiErrorMessage(err), 'Delete Failed');
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1>Site Locations</h1>
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
          <p>Manage your physical outdoor advertising sites, coordinates, and photo assets.</p>
        </div>

        {/* Add Location Action (Owner & Manager only, hidden for Staff per RBAC) */}
        {canCreateOrEdit && (
          <Button
            variant="primary"
            onClick={handleOpenCreate}
            leftIcon={<Plus size={16} />}
          >
            Add Location
          </Button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <LocationFilters
        search={search}
        status={status}
        city={city}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onCityChange={handleCityChange}
        onReset={handleResetFilters}
      />

      {/* Locations Table */}
      <LocationTable
        locations={locations}
        isLoading={isLoading}
        onView={handleOpenOverview}
        onEdit={handleOpenEdit}
        onManagePhotos={handleOpenPhotos}
        onDelete={handleDeleteLocation}
      />

      {/* Pagination Bar */}
      {totalCount > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1.25rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--surface-white)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
            <span>
              Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} locations)
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

      {/* Add / Edit Location Drawer */}
      <LocationFormDrawer
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        location={editingLocation}
        onSave={handleSaveLocation}
      />

      {/* Location Overview Drawer */}
      <LocationOverviewDrawer
        isOpen={isOverviewOpen}
        onClose={() => setIsOverviewOpen(false)}
        location={selectedLocation}
        onEdit={handleOpenEdit}
        initialTab={overviewTab}
        onLocationUpdated={fetchLocations}
      />
    </div>
  );
};

export default LocationsPage;
