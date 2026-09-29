import React from 'react';
import type { AdvertisingResource } from '../../types/resource';
import type { TableColumn } from '../ui/Table';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import { useAuth } from '../../context/AuthContext';
import {
  Eye,
  Edit2,
  Trash2,
  Image,
  Layers,
  MapPin,
} from 'lucide-react';

export interface ResourceTableProps {
  resources: AdvertisingResource[];
  isLoading: boolean;
  onView: (resource: AdvertisingResource) => void;
  onEdit: (resource: AdvertisingResource) => void;
  onDelete: (resource: AdvertisingResource) => void;
  onManagePhotos: (resource: AdvertisingResource) => void;
  onAddResource?: () => void;
}

export const ResourceTable: React.FC<ResourceTableProps> = ({
  resources,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onManagePhotos,
  onAddResource,
}) => {
  const { role } = useAuth();
  // Owner and Manager have edit/delete authority; Staff can only view
  const canEditOrDelete = role === 'PROVIDER_OWNER' || role === 'PROVIDER_MANAGER';

  const formatPrice = (price?: number | null, currency = 'INR'): string => {
    if (!price || price <= 0) {
      return 'Price on Request';
    }
    try {
      return (
        new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: currency || 'INR',
          maximumFractionDigits: 0,
        }).format(price) + ' / mo'
      );
    } catch {
      return `₹${price.toLocaleString()} / mo`;
    }
  };

  const formatResourceType = (type: string): string => {
    return type
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getDimensionUnitAbbr = (unit: string): string => {
    switch (unit) {
      case 'METERS':
        return 'm';
      case 'INCHES':
        return 'in';
      case 'FEET':
      default:
        return 'ft';
    }
  };

  const getAreaUnitLabel = (unit: string): string => {
    switch (unit) {
      case 'METERS':
        return 'sq m';
      case 'INCHES':
        return 'sq in';
      case 'FEET':
      default:
        return 'sq ft';
    }
  };

  const columns: TableColumn<AdvertisingResource>[] = [
    {
      key: 'name',
      header: 'Resource',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: '0.88rem' }}>
            {r.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                padding: '1px 5px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--canvas-bg)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
              }}
            >
              {r.code}
            </span>
            {r.face_label && (
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Face: {r.face_label}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (r) => {
        if (!r.location) {
          return <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Unassigned</span>;
        }
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-body)' }}>
              <MapPin size={13} style={{ color: 'var(--blue-600)', flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                {r.location.name}
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {r.location.city}, {r.location.state}
            </div>
          </div>
        );
      },
    },
    {
      key: 'type',
      header: 'Type / Category',
      render: (r) => (
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-heading)' }}>
            {formatResourceType(r.resource_type)}
          </div>
          <div style={{ marginTop: '2px' }}>
            <Badge variant={r.category === 'DIGITAL' ? 'info' : 'neutral'}>
              {r.category}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      key: 'dimensions',
      header: 'Dimensions',
      render: (r) => {
        const unitAbbr = getDimensionUnitAbbr(r.dimension_unit);
        const areaUnit = getAreaUnitLabel(r.dimension_unit);
        const derivedArea = (r.width * r.height).toFixed(0);
        return (
          <div>
            <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
              {r.width} × {r.height} {unitAbbr}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {derivedArea} {areaUnit}
            </div>
          </div>
        );
      },
    },
    {
      key: 'illumination',
      header: 'Illumination',
      render: (r) => {
        const label = r.illumination_type.replace('_', ' ');
        const variant =
          r.illumination_type === 'DIGITAL_LED'
            ? 'info'
            : r.illumination_type === 'NON_LIT'
            ? 'neutral'
            : 'success';
        return <Badge variant={variant}>{label}</Badge>;
      },
    },
    {
      key: 'status',
      header: 'Status',
      width: '110px',
      render: (r) => {
        const variant =
          r.status === 'ACTIVE'
            ? 'success'
            : r.status === 'UNDER_MAINTENANCE' || r.status === 'UNDER_REVIEW'
            ? 'warning'
            : 'neutral';
        return <Badge variant={variant}>{r.status.replace('_', ' ')}</Badge>;
      },
    },
    {
      key: 'price',
      header: 'Indicative Rate',
      render: (r) => (
        <span
          style={{
            fontSize: '0.82rem',
            fontWeight: 600,
            color: r.base_price_monthly ? 'var(--navy-900)' : 'var(--text-muted)',
            whiteSpace: 'nowrap',
          }}
        >
          {formatPrice(r.base_price_monthly, r.currency || 'INR')}
        </span>
      ),
    },
    {
      key: 'media',
      header: 'Photos',
      width: '80px',
      render: (r) => {
        const count = r.media?.length ?? 0;
        return (
          <button
            onClick={() => onManagePhotos(r)}
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
      width: '130px',
      render: (r) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
          <button
            onClick={() => onView(r)}
            className="btn btn-ghost btn-sm"
            style={{ padding: '4px 6px' }}
            title="View Details"
          >
            <Eye size={15} />
          </button>

          {canEditOrDelete && (
            <>
              <button
                onClick={() => onEdit(r)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '4px 6px', color: 'var(--blue-600)' }}
                title="Edit Resource"
              >
                <Edit2 size={15} />
              </button>
              <button
                onClick={() => onDelete(r)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '4px 6px', color: 'var(--rose-600)' }}
                title="Delete Resource"
              >
                <Trash2 size={15} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (!isLoading && resources.length === 0) {
    return (
      <EmptyState
        title="No advertising resources yet"
        description="Add your first advertising resource face to start managing inventory across your locations."
        action={
          canEditOrDelete && onAddResource ? (
            <Button variant="primary" onClick={onAddResource}>
              + Add Resource
            </Button>
          ) : undefined
        }
        icon={<Layers size={40} style={{ color: 'var(--text-light)' }} />}
      />
    );
  }

  return (
    <Table
      columns={columns}
      data={resources}
      keyExtractor={(r) => r.uuid}
      isLoading={isLoading}
      emptyState={
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
          No resources match the selected criteria.
        </div>
      }
    />
  );
};

export default ResourceTable;
