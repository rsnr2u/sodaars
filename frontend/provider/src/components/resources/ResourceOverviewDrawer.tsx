import React, { useState, useEffect } from 'react';
import type { AdvertisingResource } from '../../types/resource';
import Drawer from '../ui/Drawer';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { ResourceMediaManager } from './ResourceMediaManager';
import { useAuth } from '../../context/AuthContext';
import {
  Layers,
  MapPin,
  Image as ImageIcon,
  Edit2,
} from 'lucide-react';

export interface ResourceOverviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resource: AdvertisingResource | null;
  onEdit: (resource: AdvertisingResource) => void;
  initialTab?: 'overview' | 'media';
  onResourceUpdated?: () => void;
}

export const ResourceOverviewDrawer: React.FC<ResourceOverviewDrawerProps> = ({
  isOpen,
  onClose,
  resource,
  onEdit,
  initialTab = 'overview',
  onResourceUpdated,
}) => {
  const { role } = useAuth();
  const canEdit = role === 'PROVIDER_OWNER' || role === 'PROVIDER_MANAGER';

  const [activeTab, setActiveTab] = useState<'overview' | 'media'>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!resource) return null;

  const statusVariant =
    resource.status === 'ACTIVE'
      ? 'success'
      : resource.status === 'UNDER_MAINTENANCE' || resource.status === 'UNDER_REVIEW'
      ? 'warning'
      : 'neutral';

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
        }).format(price) + ' / month'
      );
    } catch {
      return `₹${price.toLocaleString()} / month`;
    }
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

  const unitAbbr = getDimensionUnitAbbr(resource.dimension_unit);
  const areaUnit = getAreaUnitLabel(resource.dimension_unit);
  const derivedArea = (resource.width * resource.height).toFixed(1);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div>
          <div>{resource.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 600,
                padding: '2px 6px',
                backgroundColor: 'var(--canvas-bg)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--text-secondary)',
              }}
            >
              {resource.code}
            </span>
            <Badge variant={statusVariant}>{resource.status.replace('_', ' ')}</Badge>
            <Badge variant={resource.category === 'DIGITAL' ? 'info' : 'neutral'}>
              {resource.category}
            </Badge>
            {resource.slug && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--blue-700)',
                  backgroundColor: 'var(--blue-50)',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-xs)',
                }}
                title="Immutable Public Directory Slug"
              >
                /{resource.slug}
              </span>
            )}
          </div>
        </div>
      }
      maxWidth="700px"
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Location: <strong>{resource.location?.name || 'Unassigned'}</strong>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onEdit(resource);
                }}
                leftIcon={<Edit2 size={14} />}
              >
                Edit Resource
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      {/* Tabs Header */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '1.25rem',
        }}
      >
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.6rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'overview' ? '2px solid var(--blue-600)' : '2px solid transparent',
            color: activeTab === 'overview' ? 'var(--blue-600)' : 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Layers size={16} />
          <span>Specifications & Details</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.6rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'media' ? '2px solid var(--blue-600)' : '2px solid transparent',
            color: activeTab === 'media' ? 'var(--blue-600)' : 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <ImageIcon size={16} />
          <span>Photography ({resource.media?.length ?? 0})</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Location Reference Card */}
          {resource.location && (
            <div
              style={{
                backgroundColor: 'var(--canvas-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'var(--blue-50)',
                    color: 'var(--blue-600)',
                  }}
                >
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-heading)' }}>
                    {resource.location.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {resource.location.city}, {resource.location.state} • Code: {resource.location.code}
                  </div>
                </div>
              </div>

              {resource.location.latitude && resource.location.longitude && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-secondary)',
                    backgroundColor: '#ffffff',
                    padding: '3px 6px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {resource.location.latitude.toFixed(4)}, {resource.location.longitude.toFixed(4)}
                </span>
              )}
            </div>
          )}

          {/* Physical Specifications Grid */}
          <div>
            <h4
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-muted)',
                marginBottom: '0.75rem',
              }}
            >
              Physical Specifications
            </h4>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dimensions</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-heading)' }}>
                  {resource.width} × {resource.height} {unitAbbr}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Derived Surface Area</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--blue-700)' }}>
                  {derivedArea} {areaUnit}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Illumination</span>
                <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-heading)', marginTop: '2px' }}>
                  {resource.illumination_type.replace('_', ' ')}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Face Identifier</span>
                <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-heading)', marginTop: '2px' }}>
                  Face #{resource.face_number || 1} {resource.face_label ? `(${resource.face_label})` : ''}
                </div>
              </div>

              {resource.direction && (
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Facing Direction</span>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-heading)', marginTop: '2px' }}>
                    {resource.direction}
                  </div>
                </div>
              )}

              {resource.traffic_flow && (
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Traffic Flow</span>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-heading)', marginTop: '2px' }}>
                    {resource.traffic_flow}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Digital Specifications (if DIGITAL) */}
          {resource.category === 'DIGITAL' && (
            <div>
              <h4
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-muted)',
                  marginBottom: '0.75rem',
                }}
              >
                Digital Display Specifications
              </h4>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.75rem',
                  backgroundColor: 'var(--canvas-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Screen Resolution</span>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                    {resource.resolution || 'Not specified'}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pixel Pitch</span>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                    {resource.pixel_pitch || 'Not specified'}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Slot Duration</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                    {resource.slot_duration_seconds ? `${resource.slot_duration_seconds} seconds` : 'Standard'}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Est. Daily Impressions</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--blue-700)' }}>
                    {resource.daily_impressions_estimate
                      ? resource.daily_impressions_estimate.toLocaleString()
                      : 'Not estimated'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Commercial & Rate Card Information */}
          <div>
            <h4
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-muted)',
                marginBottom: '0.75rem',
              }}
            >
              Indicative Rate Card & Hours
            </h4>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Indicative Monthly Rate</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-900)', marginTop: '2px' }}>
                  {formatPrice(resource.base_price_monthly, resource.currency || 'INR')}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  *Indicative rate card for discovery; quotations issued directly.
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Operating Hours</span>
                <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-heading)', marginTop: '4px' }}>
                  {resource.operating_hours_from && resource.operating_hours_to
                    ? `${resource.operating_hours_from.substring(0, 5)} - ${resource.operating_hours_to.substring(0, 5)}`
                    : '24 Hours / Unrestricted'}
                </div>
              </div>
            </div>
          </div>

          {/* Operational Details */}
          {(resource.description || resource.installation_details || resource.notes) && (
            <div>
              <h4
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-muted)',
                  marginBottom: '0.75rem',
                }}
              >
                Operational Information
              </h4>

              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  fontSize: '0.85rem',
                }}
              >
                {resource.description && (
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block' }}>
                      Description
                    </span>
                    <p style={{ margin: '3px 0 0 0', color: 'var(--text-body)', lineHeight: 1.5 }}>
                      {resource.description}
                    </p>
                  </div>
                )}

                {resource.installation_details && (
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block' }}>
                      Installation Details
                    </span>
                    <p style={{ margin: '3px 0 0 0', color: 'var(--text-body)', lineHeight: 1.5 }}>
                      {resource.installation_details}
                    </p>
                  </div>
                )}

                {resource.notes && (
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block' }}>
                      Internal Notes
                    </span>
                    <p style={{ margin: '3px 0 0 0', color: 'var(--text-body)', lineHeight: 1.5 }}>
                      {resource.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata & Audit */}
          <div
            style={{
              paddingTop: '0.5rem',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>
              Created: {resource.created_at ? new Date(resource.created_at).toLocaleDateString() : 'N/A'}
            </span>
            <span>
              Last updated: {resource.updated_at ? new Date(resource.updated_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      )}

      {/* Tab 2: Media */}
      {activeTab === 'media' && (
        <ResourceMediaManager
          resourceUuid={resource.uuid}
          onMediaChanged={onResourceUpdated}
        />
      )}
    </Drawer>
  );
};

export default ResourceOverviewDrawer;
