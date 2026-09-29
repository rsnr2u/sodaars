import React from 'react';
import type { Location } from '../../types/location';
import { useAuth } from '../../context/AuthContext';
import Table from '../ui/Table';
import type { TableColumn } from '../ui/Table';
import Badge from '../ui/Badge';
import { Eye, Edit2, Image, Trash2, MapPin } from 'lucide-react';

export interface LocationTableProps {
  locations: Location[];
  isLoading: boolean;
  onView: (location: Location) => void;
  onEdit: (location: Location) => void;
  onManagePhotos: (location: Location) => void;
  onDelete: (location: Location) => void;
}

export const LocationTable: React.FC<LocationTableProps> = ({
  locations,
  isLoading,
  onView,
  onEdit,
  onManagePhotos,
  onDelete,
}) => {
  const { role } = useAuth();

  // Corrected RBAC: Staff can view; cannot edit or delete
  const canEditOrDelete = role === 'PROVIDER_OWNER' || role === 'PROVIDER_MANAGER';

  const columns: TableColumn<Location>[] = [
    {
      key: 'code',
      header: 'Code',
      width: '120px',
      render: (loc) => (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            fontWeight: 600,
            padding: '2px 6px',
            backgroundColor: 'var(--canvas-bg)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xs)',
            color: 'var(--text-heading)',
          }}
        >
          {loc.code}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Location Name',
      render: (loc) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button
            onClick={() => onView(loc)}
            style={{
              background: 'none',
              border: 'none',
              textAlign: 'left',
              fontWeight: 600,
              color: 'var(--text-heading)',
              cursor: 'pointer',
              padding: 0,
              fontSize: '0.9rem',
            }}
            className="hover-underline"
          >
            {loc.name}
          </button>
          {loc.landmark && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Near {loc.landmark}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'city',
      header: 'City / State',
      render: (loc) => (
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.85rem' }}>
          <span style={{ fontWeight: 500, color: 'var(--text-heading)' }}>{loc.city}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {loc.district ? `${loc.district}, ` : ''}{loc.state}
          </span>
        </div>
      ),
    },
    {
      key: 'coordinates',
      header: 'Coordinates',
      render: (loc) => {
        if (loc.latitude === null || loc.longitude === null || loc.latitude === undefined || loc.longitude === undefined) {
          return <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>No pin set</span>;
        }
        return (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--blue-700)', backgroundColor: 'var(--blue-50)', padding: '2px 6px', borderRadius: 'var(--radius-xs)' }}>
            <MapPin size={12} />
            <span>{loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}</span>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      width: '110px',
      render: (loc) => {
        const variant =
          loc.status === 'ACTIVE'
            ? 'success'
            : loc.status === 'UNDER_REVIEW'
            ? 'warning'
            : 'neutral';
        return <Badge variant={variant}>{loc.status.replace('_', ' ')}</Badge>;
      },
    },
    {
      key: 'media',
      header: 'Photos',
      width: '90px',
      render: (loc) => {
        const count = loc.media?.length ?? 0;
        return (
          <button
            onClick={() => onManagePhotos(loc)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'none',
              border: 'none',
              color: count > 0 ? 'var(--blue-600)' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 500,
              cursor: 'pointer',
              padding: '2px 4px',
            }}
            title="Manage Photos"
          >
            <Image size={14} />
            <span>{count}</span>
          </button>
        );
      },
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '140px',
      render: (loc) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
          <button
            onClick={() => onView(loc)}
            className="btn btn-ghost btn-sm"
            style={{ padding: '4px 6px' }}
            title="View Details"
          >
            <Eye size={15} />
          </button>

          {canEditOrDelete && (
            <>
              <button
                onClick={() => onEdit(loc)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '4px 6px', color: 'var(--blue-600)' }}
                title="Edit Location"
              >
                <Edit2 size={15} />
              </button>
              <button
                onClick={() => onDelete(loc)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '4px 6px', color: 'var(--rose-600)' }}
                title="Delete Location"
              >
                <Trash2 size={15} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={locations}
      keyExtractor={(loc) => loc.uuid}
      isLoading={isLoading}
      emptyState={
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
          No site locations found matching your search or filters.
        </div>
      }
    />
  );
};

export default LocationTable;
