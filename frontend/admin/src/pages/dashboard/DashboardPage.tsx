import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  CheckCircle,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  RefreshCw,
  PlusCircle,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { dashboardService, type DashboardMetrics } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const DashboardPage: React.FC = () => {
  const { isPlatformAdmin } = useAuth();
  const { error } = useToast();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const data = await dashboardService.getMetrics();
      setMetrics(data);
    } catch {
      error('Dashboard Error', 'Failed to retrieve real-time organization metrics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Dashboard</h1>
          <p className="page-subtitle">
            Platform-wide organization lifecycle telemetry and governance metrics
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={fetchDashboardData}
            disabled={isLoading}
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          {isPlatformAdmin && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/organizations?action=create')}
            >
              <PlusCircle size={15} />
              <span>New Organization</span>
            </button>
          )}
        </div>
      </div>

      {/* Real Metric Cards Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Total Providers</span>
            <div className="metric-icon-box">
              <Building2 size={18} />
            </div>
          </div>
          <div className="metric-value">
            {isLoading ? '—' : metrics?.totalOrganizations ?? 0}
          </div>
          <div className="metric-subtext">
            <span>All registered provider entities</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Active Providers</span>
            <div
              className="metric-icon-box"
              style={{ background: '#ecfdf5', color: '#10b981' }}
            >
              <CheckCircle size={18} />
            </div>
          </div>
          <div className="metric-value" style={{ color: '#059669' }}>
            {isLoading ? '—' : metrics?.activeOrganizations ?? 0}
          </div>
          <div className="metric-subtext">
            <span>Operational & inventory active</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Suspended Providers</span>
            <div
              className="metric-icon-box"
              style={{ background: '#fef2f2', color: '#ef4444' }}
            >
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="metric-value" style={{ color: '#dc2626' }}>
            {isLoading ? '—' : metrics?.suspendedOrganizations ?? 0}
          </div>
          <div className="metric-subtext">
            <span>Access blocked / suspended</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Subscription Plans</span>
            <div
              className="metric-icon-box"
              style={{ background: '#f5f3ff', color: '#7c3aed' }}
            >
              <Layers size={18} />
            </div>
          </div>
          <div className="metric-value" style={{ color: '#6d28d9' }}>
            {isLoading ? '—' : metrics?.totalPlans ?? 0}
          </div>
          <div className="metric-subtext">
            <span>
              {metrics ? `${metrics.activePlans} active tiers defined` : 'Plan governance'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Providers + Quick Governance */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Recent Organizations Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Recent Organizations</h2>
              <p className="card-description">
                Latest provider onboarding and registration activity
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => navigate('/organizations')}
            >
              <span>View All</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>Location</th>
                  <th>Plan Tier</th>
                  <th>Status</th>
                  <th>Verification</th>
                  <th>Directory</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                      Loading real-time records...
                    </td>
                  </tr>
                ) : !metrics?.recentOrganizations.length ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No provider organizations registered yet.
                    </td>
                  </tr>
                ) : (
                  metrics.recentOrganizations.map((org) => (
                    <tr
                      key={org.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/organizations?view=${org.uuid}`)}
                    >
                      <td>
                        <div style={{ fontWeight: 600 }}>{org.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {org.email || 'No email provided'}
                        </div>
                      </td>
                      <td>
                        {org.city ? `${org.city}${org.state ? `, ${org.state}` : ''}` : '—'}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                          {org.active_subscription?.plan?.name || 'Standard'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${org.status}`}>
                          <span className="badge-dot" />
                          <span>{org.status}</span>
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${org.verification_status}`}>
                          <span>{org.verification_status}</span>
                        </span>
                      </td>
                      <td>
                        {org.public_directory_visible ? (
                          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Eye size={13} />
                            <span>Visible</span>
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            Hidden
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Governance & Status Summary Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Governance Status</h3>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <ShieldCheck size={18} className="text-primary" />
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      Directory Triple-Gate
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Public directory display strictly requires: Organization Active + Verified + Directory Visible flag.
                  </p>
                </div>

                <div
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <AlertTriangle size={18} style={{ color: '#f59e0b' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      Suspension Policy
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Suspending an organization instantly locks tenant provider access (HTTP 403) and hides all published inventory.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Quick Administration</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => navigate('/organizations')}
              >
                <Building2 size={16} />
                <span>Review Organizations</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => navigate('/plans')}
              >
                <Layers size={16} />
                <span>Subscription Plan Matrix</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => navigate('/settings')}
              >
                <ShieldCheck size={16} />
                <span>Security & Platform Roles</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
