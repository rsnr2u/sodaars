import React from 'react';
import { useLocation } from 'react-router-dom';
import { Activity, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminHeader: React.FC = () => {
  const location = useLocation();
  const { platformRole } = useAuth();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Executive Dashboard';
    if (path.startsWith('/organizations')) return 'Provider Organizations';
    if (path.startsWith('/plans')) return 'Subscription Plans & Quotas';
    if (path.startsWith('/settings')) return 'Platform Governance & Settings';
    return 'Platform Administration';
  };

  return (
    <header className="admin-header">
      <div className="header-title-area">
        <h1 className="header-page-title">{getPageTitle()}</h1>
      </div>

      <div className="header-actions">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            color: '#10b981',
            background: '#ecfdf5',
            padding: '0.25rem 0.65rem',
            borderRadius: '9999px',
            border: '1px solid #a7f3d0',
            fontWeight: 600,
          }}
        >
          <Activity size={13} />
          <span>API Connected</span>
        </div>

        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm"
          title="Open Public Discovery Directory in new tab"
        >
          <span>Public Directory</span>
          <ExternalLink size={14} />
        </a>

        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '0.25rem 0.5rem',
            borderRadius: '6px',
            backgroundColor: '#f1f5f9',
            color: '#334155',
          }}
        >
          Role: {platformRole}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
