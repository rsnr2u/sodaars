import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EmptyState from '../../components/ui/EmptyState';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Settings, ShieldAlert, ArrowLeft } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { role, activeOrg } = useAuth();

  // Adjustment 4: Owner and Manager can access the shell; Staff receives unauthorized banner
  const isAllowed = role === 'PROVIDER_OWNER' || role === 'PROVIDER_MANAGER';

  if (!isAllowed) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto 0' }}>
        <EmptyState
          icon={<ShieldAlert size={32} style={{ color: 'var(--rose-500)' }} />}
          title="Access Restricted"
          description="Your current role (PROVIDER_STAFF) does not have permission to manage organization settings. Please contact your organization owner or manager for assistance."
          action={
            <Link to="/dashboard" className="btn btn-secondary btn-md">
              <ArrowLeft size={16} />
              <span>Return to Dashboard</span>
            </Link>
          }
        />
      </div>
    );
  }

  const roleLabel = role ? role.replace('PROVIDER_', '') : 'MEMBER';

  return (
    <div>
      <div className="page-header">
        <div className="page-header-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <h1>Organization Settings</h1>
            <Badge variant="orange">{roleLabel}</Badge>
          </div>
          <p>
            Configure business profile details, public directory visibility, and team members for{' '}
            <strong>{activeOrg?.trading_name || activeOrg?.name}</strong>.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <Card title="Public Business Profile" subtitle="Company details showcased on the SODAARS directory">
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Step 5 will connect the live profile editor to update trading name, contact details, physical office address, and operational cities.
          </p>
        </Card>

        <Card title="Public Directory Visibility" subtitle="Controls whether your verified sites appear publicly">
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Step 5 will integrate the toggle switch. Only organization owners can alter visibility; managers and staff are prevented by backend policy.
          </p>
        </Card>

        <Card title="Team & Staff Management" subtitle="Manage member roles and invitations">
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Step 5 will integrate team member invitation, role assignment (Owner, Manager, Staff), and access revocation.
          </p>
        </Card>
      </div>

      <EmptyState
        icon={<Settings size={28} />}
        title="Settings & Team Management Engine"
        description="Comprehensive organization settings, visibility controls, and team RBAC configuration will be fully integrated in Step 5."
      />
    </div>
  );
};

export default SettingsPage;
