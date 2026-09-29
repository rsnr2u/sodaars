import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import Badge from '../ui/Badge';
import type { Organization, UpdateOrganizationSettingsPayload } from '../../types/organization';
import organizationService from '../../services/organizationService';
import { getApiErrorMessage, getApiFieldErrors } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Briefcase,
  User,
  Globe,
  FileText,
  Palette,
  Clock,
  Share2,
  Shield,
  Save,
  Image as ImageIcon,
} from 'lucide-react';

export interface OperationalSettingsFormProps {
  organization: Organization;
  isOwner: boolean;
  onOrganizationUpdated: (updatedOrg: Organization) => void;
}

export const OperationalSettingsForm: React.FC<OperationalSettingsFormProps> = ({
  organization,
  isOwner,
  onOrganizationUpdated,
}) => {
  const { success, error: showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [contactPerson, setContactPerson] = useState(organization.contact_person || '');
  const [district, setDistrict] = useState(organization.district || '');
  const [website, setWebsite] = useState(organization.website || '');
  const [businessDescription, setBusinessDescription] = useState(organization.business_description || '');
  const [gstin, setGstin] = useState(organization.gstin || '');
  const [pan, setPan] = useState(organization.pan || '');
  const [logoUrl, setLogoUrl] = useState(organization.logo_url || '');

  // Branding
  const [primaryColor, setPrimaryColor] = useState(
    organization.settings?.branding?.primary_color || '#0F172A'
  );
  const [secondaryColor, setSecondaryColor] = useState(
    organization.settings?.branding?.secondary_color || '#0284C7'
  );
  const [accentColor, setAccentColor] = useState(
    organization.settings?.branding?.accent_color || '#F59E0B'
  );

  // Operating Hours
  const [monFriHours, setMonFriHours] = useState(
    organization.settings?.working_hours?.monday_friday || '09:30 - 18:30'
  );
  const [satHours, setSatHours] = useState(
    organization.settings?.working_hours?.saturday || '10:00 - 16:00'
  );
  const [sunHours, setSunHours] = useState(
    organization.settings?.working_hours?.sunday || 'Closed'
  );

  // Social Links
  const [linkedin, setLinkedin] = useState(organization.settings?.social_links?.linkedin || '');
  const [twitter, setTwitter] = useState(organization.settings?.social_links?.twitter || '');
  const [facebook, setFacebook] = useState(organization.settings?.social_links?.facebook || '');
  const [instagram, setInstagram] = useState(organization.settings?.social_links?.instagram || '');

  useEffect(() => {
    setContactPerson(organization.contact_person || '');
    setDistrict(organization.district || '');
    setWebsite(organization.website || '');
    setBusinessDescription(organization.business_description || '');
    setGstin(organization.gstin || '');
    setPan(organization.pan || '');
    setLogoUrl(organization.logo_url || '');

    setPrimaryColor(organization.settings?.branding?.primary_color || '#0F172A');
    setSecondaryColor(organization.settings?.branding?.secondary_color || '#0284C7');
    setAccentColor(organization.settings?.branding?.accent_color || '#F59E0B');

    setMonFriHours(organization.settings?.working_hours?.monday_friday || '09:30 - 18:30');
    setSatHours(organization.settings?.working_hours?.saturday || '10:00 - 16:00');
    setSunHours(organization.settings?.working_hours?.sunday || 'Closed');

    setLinkedin(organization.settings?.social_links?.linkedin || '');
    setTwitter(organization.settings?.social_links?.twitter || '');
    setFacebook(organization.settings?.social_links?.facebook || '');
    setInstagram(organization.settings?.social_links?.instagram || '');
  }, [organization]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;

    try {
      setIsSubmitting(true);
      setFieldErrors({});

      const payload: UpdateOrganizationSettingsPayload = {
        contact_person: contactPerson.trim() || undefined,
        district: district.trim() || undefined,
        website: website.trim() || undefined,
        business_description: businessDescription.trim() || undefined,
        gstin: gstin.trim().toUpperCase() || undefined,
        pan: pan.trim().toUpperCase() || undefined,
        logo_url: logoUrl.trim() || undefined,
        settings: {
          branding: {
            primary_color: primaryColor,
            secondary_color: secondaryColor,
            accent_color: accentColor,
            favicon_url: organization.settings?.branding?.favicon_url,
          },
          working_hours: {
            monday_friday: monFriHours,
            saturday: satHours,
            sunday: sunHours,
          },
          social_links: {
            linkedin: linkedin.trim() || undefined,
            twitter: twitter.trim() || undefined,
            facebook: facebook.trim() || undefined,
            instagram: instagram.trim() || undefined,
          },
        },
      };

      const updated = await organizationService.updateSettings(payload);
      onOrganizationUpdated(updated);
      success('Operational settings and branding saved successfully.');
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
            <Briefcase size={20} style={{ color: 'var(--navy-600)' }} />
            <span>Commercial & Operational Settings</span>
          </div>
          {!isOwner && (
            <Badge variant="neutral" icon={<Shield size={12} />}>
              Read-Only (Owner Only)
            </Badge>
          )}
        </div>
      }
      subtitle="Tax credentials, operational leadership, brand assets, and operating schedule"
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
            Operational settings modifications are restricted to <strong>PROVIDER_OWNER</strong>.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Section 1: Commercial & Contact Leadership */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--navy-800)', marginBottom: '0.85rem' }}>
            Commercial & Contact Information
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <Input
              label="Primary Contact Person"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              error={fieldErrors.contact_person}
              disabled={!isOwner || isSubmitting}
              placeholder="e.g. Ramesh Kumar"
              leftIcon={<User size={16} />}
            />

            <Input
              label="Operational District / Region"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              error={fieldErrors.district}
              disabled={!isOwner || isSubmitting}
              placeholder="e.g. South Mumbai / BKC"
            />

            <Input
              label="Official Website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              error={fieldErrors.website}
              disabled={!isOwner || isSubmitting}
              placeholder="e.g. https://www.acmeoutdoor.com"
              leftIcon={<Globe size={16} />}
            />

            <Input
              label="GSTIN (Goods and Services Tax)"
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              error={fieldErrors.gstin}
              disabled={!isOwner || isSubmitting}
              placeholder="e.g. 27ABCDE1234F1Z5"
              leftIcon={<FileText size={16} />}
            />

            <Input
              label="PAN (Permanent Account Number)"
              value={pan}
              onChange={(e) => setPan(e.target.value.toUpperCase())}
              error={fieldErrors.pan}
              disabled={!isOwner || isSubmitting}
              placeholder="e.g. ABCDE1234F"
            />

            <Input
              label="Company Logo URL"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              error={fieldErrors.logo_url}
              disabled={!isOwner || isSubmitting}
              placeholder="e.g. https://example.com/logo.png"
              leftIcon={<ImageIcon size={16} />}
            />
          </div>

          {/* Logo Preview */}
          {logoUrl && (
            <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Logo Preview:</span>
              <img
                src={logoUrl}
                alt="Logo preview"
                style={{ height: '36px', maxWidth: '120px', objectFit: 'contain', borderRadius: '4px', border: '1px solid var(--border-color)', padding: '2px' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Business Description */}
          <div style={{ marginTop: '1rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
              Business Profile & Public Directory Description
            </label>
            <textarea
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              rows={3}
              placeholder="Brief summary of your outdoor media network, coverage areas, formats offered..."
              disabled={!isOwner || isSubmitting}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                fontSize: '0.85rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                color: '#0f172a',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                background: !isOwner ? 'var(--slate-50)' : '#fff',
              }}
            />
            {fieldErrors.business_description && (
              <span style={{ color: 'var(--rose-600)', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                {fieldErrors.business_description}
              </span>
            )}
          </div>
        </div>

        {/* Section 2: Branding Colors */}
        <div style={{ marginBottom: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--navy-800)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Palette size={16} />
            <span>Brand Colors (Directory Showcase)</span>
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Primary Brand Color
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  disabled={!isOwner || isSubmitting}
                  style={{ width: '38px', height: '38px', padding: 0, border: '1px solid var(--border-color)', borderRadius: '6px', cursor: isOwner ? 'pointer' : 'default' }}
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  disabled={!isOwner || isSubmitting}
                  placeholder="#0F172A"
                  style={{ fontFamily: 'monospace' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Secondary Brand Color
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  disabled={!isOwner || isSubmitting}
                  style={{ width: '38px', height: '38px', padding: 0, border: '1px solid var(--border-color)', borderRadius: '6px', cursor: isOwner ? 'pointer' : 'default' }}
                />
                <Input
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  disabled={!isOwner || isSubmitting}
                  placeholder="#0284C7"
                  style={{ fontFamily: 'monospace' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Accent Color
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  disabled={!isOwner || isSubmitting}
                  style={{ width: '38px', height: '38px', padding: 0, border: '1px solid var(--border-color)', borderRadius: '6px', cursor: isOwner ? 'pointer' : 'default' }}
                />
                <Input
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  disabled={!isOwner || isSubmitting}
                  placeholder="#F59E0B"
                  style={{ fontFamily: 'monospace' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Operating Schedule */}
        <div style={{ marginBottom: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--navy-800)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={16} />
            <span>Operating Hours</span>
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <Input
              label="Monday – Friday"
              value={monFriHours}
              onChange={(e) => setMonFriHours(e.target.value)}
              disabled={!isOwner || isSubmitting}
              placeholder="e.g. 09:30 - 18:30"
            />

            <Input
              label="Saturday"
              value={satHours}
              onChange={(e) => setSatHours(e.target.value)}
              disabled={!isOwner || isSubmitting}
              placeholder="e.g. 10:00 - 16:00 or Closed"
            />

            <Input
              label="Sunday & Public Holidays"
              value={sunHours}
              onChange={(e) => setSunHours(e.target.value)}
              disabled={!isOwner || isSubmitting}
              placeholder="e.g. Closed"
            />
          </div>
        </div>

        {/* Section 4: Social Media Links */}
        <div style={{ marginBottom: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--navy-800)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Share2 size={16} />
            <span>Social Presence Links</span>
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <Input
              label="LinkedIn URL"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              disabled={!isOwner || isSubmitting}
              placeholder="https://linkedin.com/company/..."
            />

            <Input
              label="X / Twitter URL"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              disabled={!isOwner || isSubmitting}
              placeholder="https://x.com/..."
            />

            <Input
              label="Facebook URL"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              disabled={!isOwner || isSubmitting}
              placeholder="https://facebook.com/..."
            />

            <Input
              label="Instagram URL"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              disabled={!isOwner || isSubmitting}
              placeholder="https://instagram.com/..."
            />
          </div>
        </div>

        {isOwner && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              leftIcon={isSubmitting ? <Spinner size={16} /> : <Save size={16} />}
            >
              {isSubmitting ? 'Saving...' : 'Save Operational Settings'}
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
};

export default OperationalSettingsForm;
