import React, { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import type { Organization } from '../../types/organization';
import organizationService from '../../services/organizationService';
import { getApiErrorMessage } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Globe,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react';

export interface DirectoryVisibilityCardProps {
  organization: Organization;
  isOwner: boolean;
  onVisibilityChanged: (updatedOrg: Organization) => void;
}

export const DirectoryVisibilityCard: React.FC<DirectoryVisibilityCardProps> = ({
  organization,
  isOwner,
  onVisibilityChanged,
}) => {
  const { success, error: showError } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const isActive = organization.status === 'ACTIVE';
  const isVerified = organization.verification_status === 'VERIFIED';
  const isVisible = Boolean(organization.public_directory_visible);
  const isFullyPublished = isActive && isVerified && isVisible;

  const handleToggleVisibility = async () => {
    if (!isOwner) return;

    try {
      setIsUpdating(true);
      const nextState = !isVisible;
      const updated = await organizationService.updateVisibility(nextState);
      onVisibilityChanged(updated);
      success(
        nextState
          ? 'Public directory visibility enabled.'
          : 'Public directory visibility disabled.'
      );
    } catch (err) {
      showError(getApiErrorMessage(err));
    } finally {
      setIsUpdating(false);
    }
  };

  const directoryUrl = `http://localhost:3000/providers/${organization.slug}`;

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Globe size={20} style={{ color: 'var(--navy-600)' }} />
          <span>Public Directory & Discovery</span>
        </div>
      }
      subtitle="Manage your public profile visibility on the SODAARS Outdoor Discovery Network"
    >
      {/* Triple Gate Status Banner */}
      <div
        style={{
          background: isFullyPublished
            ? 'rgba(16, 185, 129, 0.08)'
            : 'rgba(245, 158, 11, 0.08)',
          border: `1px solid ${
            isFullyPublished ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'
          }`,
          borderRadius: '8px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <h4
              style={{
                margin: 0,
                fontSize: '1rem',
                fontWeight: 600,
                color: isFullyPublished ? 'var(--emerald-800)' : 'var(--amber-800)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {isFullyPublished ? (
                <>
                  <CheckCircle2 size={18} style={{ color: 'var(--emerald-600)' }} />
                  Live & Discoverable on Public Directory
                </>
              ) : (
                <>
                  <AlertTriangle size={18} style={{ color: 'var(--amber-600)' }} />
                  Triple-Gate Verification Requirements
                </>
              )}
            </h4>
            <p
              style={{
                margin: '0.25rem 0 0',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
              }}
            >
              All three conditions below must be met for your advertising inventory to appear in
              public search results and maps.
            </p>
          </div>

          <Badge variant={isFullyPublished ? 'success' : 'warning'}>
            {isFullyPublished ? 'DIRECTORY ACTIVE' : 'INCOMPLETE GATING'}
          </Badge>
        </div>

        {/* 3 Conditions Checklist */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            background: 'var(--surface-color)',
            padding: '1rem',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
          }}
        >
          {/* Gate 1: Organization Active */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
            {isActive ? (
              <CheckCircle2 size={18} style={{ color: 'var(--emerald-600)', marginTop: '2px', flexShrink: 0 }} />
            ) : (
              <XCircle size={18} style={{ color: 'var(--rose-600)', marginTop: '2px', flexShrink: 0 }} />
            )}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>1. Organization Active</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Status: <strong>{organization.status}</strong>
              </div>
            </div>
          </div>

          {/* Gate 2: Organization Verified */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
            {isVerified ? (
              <CheckCircle2 size={18} style={{ color: 'var(--emerald-600)', marginTop: '2px', flexShrink: 0 }} />
            ) : (
              <XCircle size={18} style={{ color: 'var(--amber-600)', marginTop: '2px', flexShrink: 0 }} />
            )}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>2. Platform Verified</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Status: <strong>{organization.verification_status}</strong>
              </div>
            </div>
          </div>

          {/* Gate 3: Public Visibility Enabled */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
            {isVisible ? (
              <CheckCircle2 size={18} style={{ color: 'var(--emerald-600)', marginTop: '2px', flexShrink: 0 }} />
            ) : (
              <XCircle size={18} style={{ color: 'var(--slate-400)', marginTop: '2px', flexShrink: 0 }} />
            )}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>3. Visibility Enabled</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Setting: <strong>{isVisible ? 'Enabled' : 'Disabled'}</strong>
              </div>
            </div>
          </div>
        </div>

        {!isVerified && (
          <div
            style={{
              marginTop: '0.85rem',
              fontSize: '0.82rem',
              color: 'var(--amber-700)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Shield size={15} />
            <span>
              Platform verification is currently <strong>{organization.verification_status}</strong>. Even if visibility is toggled ON, your listings will not appear publicly until verification is completed by platform administrators.
            </span>
          </div>
        )}
      </div>

      {/* Visibility Action Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          background: 'var(--surface-color)',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Directory Publication Toggle</span>
            {!isOwner && (
              <Badge variant="neutral" icon={<Shield size={12} />}>
                Owner Permission Required
              </Badge>
            )}
          </div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Turn visibility ON to make your verified advertising resources accessible to media buyers on the discovery directory.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant={isVisible ? 'primary' : 'secondary'}
            onClick={handleToggleVisibility}
            disabled={!isOwner || isUpdating}
            leftIcon={
              isUpdating ? (
                <Spinner size={16} />
              ) : isVisible ? (
                <Eye size={16} />
              ) : (
                <EyeOff size={16} />
              )
            }
          >
            {isUpdating
              ? 'Updating...'
              : isVisible
              ? 'Visibility ON'
              : 'Visibility OFF'}
          </Button>
        </div>
      </div>

      {/* Directory URL & Profile Preview */}
      <div
        style={{
          marginTop: '1.25rem',
          padding: '1rem',
          background: '#f8fafc',
          borderRadius: '6px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
            Public Profile Slug
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.88rem', color: 'var(--navy-700)', marginTop: '2px' }}>
            /providers/{organization.slug}
          </div>
        </div>

        <a
          href={directoryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm"
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ExternalLink size={14} />
          <span>Preview Public Profile</span>
        </a>
      </div>
    </Card>
  );
};

export default DirectoryVisibilityCard;
