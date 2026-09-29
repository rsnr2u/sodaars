import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import Badge from '../ui/Badge';
import type { Organization, UpdateOrganizationPayload } from '../../types/organization';
import organizationService from '../../services/organizationService';
import { getApiErrorMessage, getApiFieldErrors } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Building2, Mail, Phone, MapPin, Shield, Save } from 'lucide-react';

export interface OrganizationProfileFormProps {
  organization: Organization;
  isOwner: boolean;
  onOrganizationUpdated: (updatedOrg: Organization) => void;
}

export const OrganizationProfileForm: React.FC<OrganizationProfileFormProps> = ({
  organization,
  isOwner,
  onOrganizationUpdated,
}) => {
  const { success, error: showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<UpdateOrganizationPayload>({
    name: organization.name || '',
    email: organization.email || '',
    phone: organization.phone || '',
    address: organization.address || '',
    city: organization.city || '',
    state: organization.state || '',
    pincode: organization.pincode || '',
    country: organization.country || 'India',
  });

  useEffect(() => {
    setFormData({
      name: organization.name || '',
      email: organization.email || '',
      phone: organization.phone || '',
      address: organization.address || '',
      city: organization.city || '',
      state: organization.state || '',
      pincode: organization.pincode || '',
      country: organization.country || 'India',
    });
  }, [organization]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;

    try {
      setIsSubmitting(true);
      setFieldErrors({});
      const updated = await organizationService.updateProfile(formData);
      onOrganizationUpdated(updated);
      success('Organization basic profile updated successfully.');
    } catch (err) {
      const fieldErrs = getApiFieldErrors(err);
      if (fieldErrs) {
        const flat: Record<string, string> = {};
        Object.entries(fieldErrs).forEach(([k, v]) => {
          flat[k] = v[0];
        });
        setFieldErrors(flat);
      }
      showError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Building2 size={20} style={{ color: 'var(--navy-600)' }} />
            <span>Organization Profile</span>
          </div>
          {!isOwner && (
            <Badge variant="neutral" icon={<Shield size={12} />}>
              Read-Only (Owner Only)
            </Badge>
          )}
        </div>
      }
      subtitle="Basic legal entity and primary communication address"
    >
      {!isOwner && (
        <div
          style={{
            background: 'var(--slate-50)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.84rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Shield size={16} style={{ color: 'var(--navy-500)' }} />
          <span>
            You are viewing this organization profile in read-only mode. Modifying legal company details requires <strong>PROVIDER_OWNER</strong> credentials.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <Input
            label="Organization Legal Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={fieldErrors.name}
            disabled={!isOwner || isSubmitting}
            required
            placeholder="e.g. Acme Outdoor Media Pvt Ltd"
          />

          <Input
            label="Official Contact Email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
            error={fieldErrors.email}
            disabled={!isOwner || isSubmitting}
            placeholder="e.g. contact@acmeoutdoor.com"
            leftIcon={<Mail size={16} />}
          />

          <Input
            label="Primary Telephone / Mobile"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            error={fieldErrors.phone}
            disabled={!isOwner || isSubmitting}
            placeholder="e.g. +91 98765 43210"
            leftIcon={<Phone size={16} />}
          />

          <Input
            label="Physical Office Address"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            error={fieldErrors.address}
            disabled={!isOwner || isSubmitting}
            placeholder="e.g. Suite 402, Signature Towers"
            leftIcon={<MapPin size={16} />}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <Input
            label="City"
            name="city"
            value={formData.city || ''}
            onChange={handleChange}
            error={fieldErrors.city}
            disabled={!isOwner || isSubmitting}
            placeholder="e.g. Mumbai"
          />

          <Input
            label="State"
            name="state"
            value={formData.state || ''}
            onChange={handleChange}
            error={fieldErrors.state}
            disabled={!isOwner || isSubmitting}
            placeholder="e.g. Maharashtra"
          />

          <Input
            label="Pincode / Postal Code"
            name="pincode"
            value={formData.pincode || ''}
            onChange={handleChange}
            error={fieldErrors.pincode}
            disabled={!isOwner || isSubmitting}
            placeholder="e.g. 400001"
          />

          <Input
            label="Country"
            name="country"
            value={formData.country || ''}
            onChange={handleChange}
            error={fieldErrors.country}
            disabled={!isOwner || isSubmitting}
            placeholder="e.g. India"
          />
        </div>

        {isOwner && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              leftIcon={isSubmitting ? <Spinner size={16} /> : <Save size={16} />}
            >
              {isSubmitting ? 'Saving...' : 'Save Profile Changes'}
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
};

export default OrganizationProfileForm;
