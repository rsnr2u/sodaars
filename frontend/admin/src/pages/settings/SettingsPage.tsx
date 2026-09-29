import React from 'react';
import {
  Shield,
  User,
  Server,
  Lock,
  Database,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user, platformRole } = useAuth();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Platform Governance & Security Settings</h1>
          <p className="page-subtitle">
            System architectural boundaries, security policies, and administrative RBAC matrix
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Administrator Profile Card */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} className="text-primary" />
              <h2 className="card-title">Active Administrator Session</h2>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: '#1e293b',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                }}
              >
                {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{user?.name}</h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>{user?.email}</p>
                <div style={{ marginTop: '0.35rem' }}>
                  <span className="badge badge-VERIFIED">
                    <span>ROLE: {platformRole}</span>
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '0.875rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.8125rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: '#64748b' }}>User ID:</span>
                <code>#{user?.id}</code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: '#64748b' }}>Account Status:</span>
                <span style={{ fontWeight: 600, color: '#10b981' }}>{user?.status || 'ACTIVE'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Authentication:</span>
                <span>Laravel Sanctum (Bearer Token)</span>
              </div>
            </div>
          </div>
        </div>

        {/* System & Architecture Integrity Card */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Server size={18} className="text-primary" />
              <h2 className="card-title">System & Architecture State</h2>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Database size={16} className="text-primary" />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Backend API Service</span>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#059669',
                    backgroundColor: '#ecfdf5',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontWeight: 600,
                  }}
                >
                  http://localhost:8000/api/v1
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={16} style={{ color: '#059669' }} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Commercial Boundary</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                  Discovery & Direct Contact Only (No Marketplace)
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock size={16} style={{ color: '#6366f1' }} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Suspension Security Gate</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#4338ca', fontWeight: 600 }}>
                  Immediate Provider 403 Lockout
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authoritative RBAC Matrix */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={18} className="text-primary" />
            <h2 className="card-title">Authoritative Platform RBAC Matrix</h2>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Feature / Action</th>
                <th style={{ textAlign: 'center' }}>SUPER_ADMIN</th>
                <th style={{ textAlign: 'center' }}>ADMIN</th>
                <th style={{ textAlign: 'center' }}>STAFF</th>
                <th>Authoritative Enforcement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Executive Dashboard</strong>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Real-time telemetry and metrics</div>
                </td>
                <td style={{ textAlign: 'center', color: '#059669', fontWeight: 700 }}>View</td>
                <td style={{ textAlign: 'center', color: '#059669', fontWeight: 700 }}>View</td>
                <td style={{ textAlign: 'center', color: '#059669', fontWeight: 700 }}>View</td>
                <td>
                  <code>EnsurePlatformRole</code> middleware
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Provider Organizations List</strong>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Search, filter, and inspect providers</div>
                </td>
                <td style={{ textAlign: 'center', color: '#059669', fontWeight: 700 }}>View</td>
                <td style={{ textAlign: 'center', color: '#059669', fontWeight: 700 }}>View</td>
                <td style={{ textAlign: 'center', color: '#059669', fontWeight: 700 }}>View</td>
                <td>
                  <code>OrganizationPolicy::viewAny</code>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Verify Provider</strong>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Update verification status & notes</div>
                </td>
                <td style={{ textAlign: 'center', color: '#059669', fontWeight: 700 }}>Full</td>
                <td style={{ textAlign: 'center', color: '#059669', fontWeight: 700 }}>Full</td>
                <td style={{ textAlign: 'center', color: '#dc2626' }}>—</td>
                <td>
                  <code>OrganizationPolicy::update</code>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Suspend / Activate Provider</strong>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Immediate operational lockout / restore</div>
                </td>
                <td style={{ textAlign: 'center', color: '#059669', fontWeight: 700 }}>Full</td>
                <td style={{ textAlign: 'center', color: '#059669', fontWeight: 700 }}>Full</td>
                <td style={{ textAlign: 'center', color: '#dc2626' }}>—</td>
                <td>
                  <code>OrganizationPolicy::update</code>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Register Organization (Admin)</strong>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Provision new tenant entity & owner</div>
                </td>
                <td style={{ textAlign: 'center', color: '#059669', fontWeight: 700 }}>Full</td>
                <td style={{ textAlign: 'center', color: '#059669', fontWeight: 700 }}>Full</td>
                <td style={{ textAlign: 'center', color: '#dc2626' }}>—</td>
                <td>
                  <code>OrganizationPolicy::create</code>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Subscription Plans View</strong>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>View all tiers, pricing & quotas</div>
                </td>
                <td style={{ textAlign: 'center', color: '#059669', fontWeight: 700 }}>View</td>
                <td style={{ textAlign: 'center', color: '#059669', fontWeight: 700 }}>View</td>
                <td style={{ textAlign: 'center', color: '#059669', fontWeight: 700 }}>View</td>
                <td>
                  <code>SubscriptionPlanPolicy::viewAny</code>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Create / Edit Subscription Plans</strong>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Modify tier pricing, limits & features</div>
                </td>
                <td style={{ textAlign: 'center', color: '#059669', fontWeight: 700 }}>Full</td>
                <td style={{ textAlign: 'center', color: '#059669', fontWeight: 700 }}>Full</td>
                <td style={{ textAlign: 'center', color: '#dc2626' }}>—</td>
                <td>
                  <code>SubscriptionPlanPolicy::create / update</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
