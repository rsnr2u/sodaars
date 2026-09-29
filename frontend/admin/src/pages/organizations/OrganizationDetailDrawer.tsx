import React, { useEffect, useState } from 'react';
import {
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Edit,
  ExternalLink,
} from 'lucide-react';
import type { Organization } from '../../types/organization';
import { organizationService } from '../../services/organizationService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface OrganizationDetailDrawerProps {
  uuid: string | null;
  onClose: () => void;
  onVerifyClick: (org: Organization) => void;
  onSuspendClick: (org: Organization) => void;
  onActivateClick: (org: Organization) => void;
  onEditClick: (org: Organization) => void;
}

export const OrganizationDetailDrawer: React.FC<OrganizationDetailDrawerProps> = ({
  uuid,
  onClose,
  onVerifyClick,
  onSuspendClick,
  onActivateClick,
  onEditClick,
}) => {
  const { isPlatformAdmin } = useAuth();
  const { error } = useToast();

  const [org, setOrg] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!uuid) return;

    let isMounted = true;
    setIsLoading(true);

    organizationService
      .getOrganization(uuid)
      .then((data) => {
        if (isMounted) setOrg(data);
      })
      .catch(() => {
        if (isMounted) {
          error('Load Failed', 'Could not load organization details.');
          onClose();
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [uuid, onClose, error]);

  if (!uuid) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Building2 size={20} className="text-primary" />
            <h3 className="drawer-title">Organization Profile</h3>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <div className="spinner-large" style={{ margin: '0 auto 1rem' }} />
              <p>Loading organization records...</p>
            </div>
          ) : !org ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              No organization data found.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Header Box */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{org.name}</h2>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <span className={`badge badge-${org.status}`}>
                      <span className="badge-dot" />
                      <span>{org.status}</span>
                    </span>
                    <span className={`badge badge-${org.verification_status}`}>
                      <span>{org.verification_status}</span>
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                  UUID: <code>{org.uuid}</code> • Slug: <code>{org.slug}</code>
                </div>
              </div>

              {/* Directory Visibility Alert */}
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: org.public_directory_visible ? '#ecfdf5' : '#f8fafc',
                  border: `1px solid ${org.public_directory_visible ? '#a7f3d0' : '#e2e8f0'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                {org.public_directory_visible ? (
                  <Eye size={18} style={{ color: '#059669', flexShrink: 0 }} />
                ) : (
                  <EyeOff size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                    Directory Visibility: {org.public_directory_visible ? 'Visible' : 'Hidden'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {org.public_directory_visible
                      ? 'Provider is published on the public discovery platform.'
                      : 'Provider is not discoverable publicly.'}
                  </div>
                </div>
                {org.public_directory_visible && (
                  <a
                    href={`http://localhost:3000/providers/${org.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ flexShrink: 0 }}
                  >
                    <span>View Public Page</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>

              {/* Contact Information */}
              <div className="card" style={{ marginBottom: 0 }}>
                <div className="card-header" style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Contact & Address</span>
                </div>
                <div className="card-body" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                    <Mail size={15} style={{ color: '#64748b', flexShrink: 0 }} />
                    <span>{org.email || 'No email provided'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                    <Phone size={15} style={{ color: '#64748b', flexShrink: 0 }} />
                    <span>{org.phone || 'No phone provided'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8125rem' }}>
                    <MapPin size={15} style={{ color: '#64748b', flexShrink: 0, marginTop: '2px' }} />
                    <span>
                      {[org.address, org.city, org.state, org.pincode, org.country]
                        .filter(Boolean)
                        .join(', ') || 'No address specified'}
                    </span>
                  </div>
                  {org.website && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                      <Globe size={15} style={{ color: '#64748b', flexShrink: 0 }} />
                      <a href={org.website} target="_blank" rel="noopener noreferrer">
                        {org.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Commercial & Statutory */}
              <div className="card" style={{ marginBottom: 0 }}>
                <div className="card-header" style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Statutory & Legal</span>
                </div>
                <div className="card-body" style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>
                      GSTIN
                    </div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                      {org.gstin || 'Not Provided'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>
                      PAN
                    </div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                      {org.pan || 'Not Provided'}
                    </div>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>
                      Business Description
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#334155', marginTop: '0.25rem' }}>
                      {org.business_description || 'No description provided.'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription & Quota */}
              <div className="card" style={{ marginBottom: 0 }}>
                <div className="card-header" style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Subscription & Limits</span>
                </div>
                <div className="card-body" style={{ padding: '1rem' }}>
                  {org.active_subscription ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>
                          Current Plan
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#2563eb' }}>
                          {org.active_subscription.plan?.name || 'Active Tier'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>
                          Resource Limit
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                          {org.active_subscription.resource_limit} units
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>
                          Billing Cycle
                        </div>
                        <div style={{ fontSize: '0.8125rem' }}>
                          {org.active_subscription.billing_cycle || 'MONTHLY'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>
                          Price
                        </div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                          {org.active_subscription.currency} {org.active_subscription.price}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                      No active subscription record attached.
                    </div>
                  )}
                </div>
              </div>

              {/* Team Members */}
              <div className="card" style={{ marginBottom: 0 }}>
                <div className="card-header" style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    Organization Team Members ({org.organization_users?.length || org.members_count || 0})
                  </span>
                </div>
                <div className="card-body" style={{ padding: '0.5rem 1rem' }}>
                  {org.organization_users && org.organization_users.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {org.organization_users.map((mem) => (
                        <div
                          key={mem.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.5rem 0',
                            borderBottom: '1px solid #f1f5f9',
                            fontSize: '0.8125rem',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600 }}>{mem.user?.name || 'User'}</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                              {mem.user?.email}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                padding: '0.15rem 0.4rem',
                                borderRadius: '4px',
                                background: '#f1f5f9',
                                fontWeight: 600,
                              }}
                            >
                              {mem.role}
                            </span>
                            <span
                              className={`badge badge-${mem.status}`}
                              style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}
                            >
                              {mem.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.8125rem', color: '#64748b', padding: '0.5rem 0' }}>
                      No users loaded or listed.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {org && (
          <div className="drawer-footer">
            {isPlatformAdmin ? (
              <>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onEditClick(org)}
                >
                  <Edit size={14} />
                  <span>Edit Profile</span>
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onVerifyClick(org)}
                >
                  <ShieldCheck size={14} />
                  <span>Verification</span>
                </button>

                {org.status === 'SUSPENDED' ? (
                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm"
                    onClick={() => onActivateClick(org)}
                  >
                    <CheckCircle size={14} />
                    <span>Activate</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => onSuspendClick(org)}
                  >
                    <AlertTriangle size={14} />
                    <span>Suspend</span>
                  </button>
                )}
              </>
            ) : (
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Staff role: View only permissions
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationDetailDrawer;
