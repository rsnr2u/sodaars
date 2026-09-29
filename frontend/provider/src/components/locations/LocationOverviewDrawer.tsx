import React, { useState } from 'react';
import type { Location } from '../../types/location';
import { useAuth } from '../../context/AuthContext';
import Drawer from '../ui/Drawer';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import LocationMapPicker from './LocationMapPicker';
import LocationMediaManager from './LocationMediaManager';
import { MapPin, Image as ImageIcon, Info, Edit2, Calendar, User } from 'lucide-react';

export interface LocationOverviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  location: Location | null;
  onEdit: (location: Location) => void;
  initialTab?: 'overview' | 'photos';
  onLocationUpdated?: () => void;
}

export const LocationOverviewDrawer: React.FC<LocationOverviewDrawerProps> = ({
  isOpen,
  onClose,
  location,
  onEdit,
  initialTab = 'overview',
  onLocationUpdated,
}) => {
  const { role } = useAuth();
  const canEdit = role === 'PROVIDER_OWNER' || role === 'PROVIDER_MANAGER';

  const [activeTab, setActiveTab] = useState<'overview' | 'photos'>(initialTab);

  if (!location) return null;

  const statusVariant =
    location.status === 'ACTIVE'
      ? 'success'
      : location.status === 'UNDER_REVIEW'
      ? 'warning'
      : 'neutral';

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span>{location.name}</span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              fontWeight: 600,
              padding: '2px 6px',
              backgroundColor: 'var(--canvas-bg)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xs)',
            }}
          >
            {location.code}
          </span>
          <Badge variant={statusVariant}>{location.status.replace('_', ' ')}</Badge>
        </div>
      }
      maxWidth="680px"
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            City: <strong>{location.city}</strong>, {location.state}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onEdit(location);
                }}
                leftIcon={<Edit2 size={14} />}
              >
                Edit Location
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
            gap: '0.45rem',
            padding: '0.65rem 1rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'overview' ? '2px solid var(--blue-600)' : '2px solid transparent',
            color: activeTab === 'overview' ? 'var(--blue-600)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'overview' ? 600 : 500,
            cursor: 'pointer',
            fontSize: '0.88rem',
          }}
        >
          <Info size={16} />
          <span>Overview & Map</span>
        </button>

        <button
          onClick={() => setActiveTab('photos')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.65rem 1rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'photos' ? '2px solid var(--blue-600)' : '2px solid transparent',
            color: activeTab === 'photos' ? 'var(--blue-600)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'photos' ? 600 : 500,
            cursor: 'pointer',
            fontSize: '0.88rem',
          }}
        >
          <ImageIcon size={16} />
          <span>Site Photos</span>
        </button>
      </div>

      {/* Tab 1: Overview & Map */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Address Information Card */}
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--canvas-bg)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '0.5rem' }}>
              Physical Address
            </h4>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {location.address && <div>{location.address}</div>}
              {(location.area || location.locality) && (
                <div>{[location.area, location.locality].filter(Boolean).join(', ')}</div>
              )}
              <div>
                {[location.city, location.district, location.state, location.pincode]
                  .filter(Boolean)
                  .join(', ')}
              </div>
              {location.country && <div>{location.country}</div>}
            </div>

            {location.landmark && (
              <div style={{ marginTop: '0.6rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <strong>Landmark:</strong> {location.landmark}
              </div>
            )}
          </div>

          {/* Coordinates & Mini Map */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={15} style={{ color: 'var(--blue-600)' }} />
              <span>Site Coordinates</span>
            </h4>

            {location.latitude !== null && location.longitude !== null && location.latitude !== undefined && location.longitude !== undefined ? (
              <>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                  Latitude: <strong>{location.latitude.toFixed(6)}</strong> • Longitude: <strong>{location.longitude.toFixed(6)}</strong>
                </div>
                <LocationMapPicker
                  latitude={location.latitude}
                  longitude={location.longitude}
                  onChange={() => {}}
                  height="260px"
                  readOnly={true}
                />
              </>
            ) : (
              <div
                style={{
                  padding: '1.5rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--canvas-bg)',
                  border: '1px dashed var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                }}
              >
                No geospatial coordinates recorded for this location. Click "Edit Location" to drop a pin.
              </div>
            )}
          </div>

          {/* Notes */}
          {location.notes && (
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--canvas-bg)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '0.35rem' }}>
                Operational Notes
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                {location.notes}
              </p>
            </div>
          )}

          {/* Audit Info */}
          <div
            style={{
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            {location.created_by && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <User size={13} />
                <span>Created by: {location.created_by.name}</span>
              </div>
            )}
            {location.created_at && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={13} />
                <span>Created: {new Date(location.created_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Site Photos */}
      {activeTab === 'photos' && (
        <LocationMediaManager
          locationUuid={location.uuid}
          onMediaChanged={onLocationUpdated}
        />
      )}
    </Drawer>
  );
};

export default LocationOverviewDrawer;
