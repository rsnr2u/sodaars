import React, { useState, useEffect } from 'react';
import type { Location, LocationPayload } from '../../types/location';
import Drawer from '../ui/Drawer';
import Input from '../ui/Input';
import Button from '../ui/Button';
import LocationMapPicker from './LocationMapPicker';
import { getApiErrorMessage, getApiFieldErrors } from '../../services/api';

export interface LocationFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  location?: Location | null;
  onSave: (payload: LocationPayload) => Promise<void>;
}

export const LocationFormDrawer: React.FC<LocationFormDrawerProps> = ({
  isOpen,
  onClose,
  location,
  onSave,
}) => {
  const isEditing = !!location;

  const [formData, setFormData] = useState<LocationPayload>({
    name: '',
    code: '',
    status: 'ACTIVE',
    address: '',
    area: '',
    locality: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    country: 'India',
    landmark: '',
    latitude: null,
    longitude: null,
    description: '',
    notes: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name,
        code: location.code,
        status: location.status,
        address: location.address || '',
        area: location.area || '',
        locality: location.locality || '',
        city: location.city,
        district: location.district || '',
        state: location.state,
        pincode: location.pincode || '',
        country: location.country || 'India',
        landmark: location.landmark || '',
        latitude: location.latitude ?? null,
        longitude: location.longitude ?? null,
        description: location.description || '',
        notes: location.notes || '',
      });
    } else {
      setFormData({
        name: '',
        code: '',
        status: 'ACTIVE',
        address: '',
        area: '',
        locality: '',
        city: '',
        district: '',
        state: '',
        pincode: '',
        country: 'India',
        landmark: '',
        latitude: null,
        longitude: null,
        description: '',
        notes: '',
      });
    }
    setFieldErrors({});
    setErrorMessage(null);
  }, [location, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCoordinatesChange = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await onSave(formData);
      onClose();
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err);
      const errors = getApiFieldErrors(err);
      setErrorMessage(msg);
      if (errors) setFieldErrors(errors);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Location: ${location.code}` : 'Add New Site Location'}
      maxWidth="640px"
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="button" variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Location'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        {errorMessage && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--rose-50)',
              border: '1px solid #fecdd3',
              borderRadius: 'var(--radius-md)',
              color: 'var(--rose-700)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Basic Details Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '0.75rem' }}>
            Basic Information
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <Input
              label="Location Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. NH-16 Highway Junction"
              required
              error={fieldErrors.name?.[0]}
            />
            <Input
              label="Location Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="LOC-GNT-001"
              required
              error={fieldErrors.code?.[0]}
              helperText="Unique code within organization"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="UNDER_REVIEW">Under Review</option>
              </select>
            </div>
            <Input
              label="Landmark / Road Marker"
              name="landmark"
              value={formData.landmark || ''}
              onChange={handleChange}
              placeholder="Opp. Toll Plaza, Near Flyover"
              error={fieldErrors.landmark?.[0]}
            />
          </div>
        </div>

        {/* Address & Geographic Section */}
        <div style={{ marginBottom: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '0.75rem' }}>
            Address & Geography
          </h4>
          <Input
            label="Street Address"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            placeholder="Plot No. 42, Service Road"
            error={fieldErrors.address?.[0]}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Area / Neighborhood"
              name="area"
              value={formData.area || ''}
              onChange={handleChange}
              placeholder="Mangalagiri Bypass"
              error={fieldErrors.area?.[0]}
            />
            <Input
              label="Locality"
              name="locality"
              value={formData.locality || ''}
              onChange={handleChange}
              placeholder="Auto Nagar"
              error={fieldErrors.locality?.[0]}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Guntur"
              required
              error={fieldErrors.city?.[0]}
            />
            <Input
              label="District"
              name="district"
              value={formData.district || ''}
              onChange={handleChange}
              placeholder="Guntur"
              error={fieldErrors.district?.[0]}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Andhra Pradesh"
              required
              error={fieldErrors.state?.[0]}
            />
            <Input
              label="Pincode"
              name="pincode"
              value={formData.pincode || ''}
              onChange={handleChange}
              placeholder="522503"
              error={fieldErrors.pincode?.[0]}
            />
          </div>
        </div>

        {/* Geospatial Map Section */}
        <div style={{ marginBottom: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '0.75rem' }}>
            Geospatial Coordinates
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
            <Input
              label="Latitude (-90 to 90)"
              type="number"
              step="0.0000001"
              name="latitude"
              value={formData.latitude ?? ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  latitude: e.target.value === '' ? null : parseFloat(e.target.value),
                }))
              }
              placeholder="16.4321000"
              error={fieldErrors.latitude?.[0]}
            />
            <Input
              label="Longitude (-180 to 180)"
              type="number"
              step="0.0000001"
              name="longitude"
              value={formData.longitude ?? ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  longitude: e.target.value === '' ? null : parseFloat(e.target.value),
                }))
              }
              placeholder="80.5678000"
              error={fieldErrors.longitude?.[0]}
            />
          </div>

          <LocationMapPicker
            latitude={formData.latitude ?? null}
            longitude={formData.longitude ?? null}
            onChange={handleCoordinatesChange}
            height="260px"
          />
        </div>

        {/* Additional Notes */}
        <div style={{ marginBottom: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div className="form-group">
            <label className="form-label">Internal Operational Notes</label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              placeholder="Site access restrictions, municipal corporation zone, power connection notes..."
              className="form-textarea"
              rows={3}
            />
          </div>
        </div>
      </form>
    </Drawer>
  );
};

export default LocationFormDrawer;
