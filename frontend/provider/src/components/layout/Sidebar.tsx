import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  MapPin,
  Layers,
  Calendar,
  Inbox,
  Users,
  FileText,
  Settings,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeOrg, role } = useAuth();

  // Settings is visible to OWNER and MANAGER, hidden for STAFF (Adjustment 4)
  const canAccessSettings = role === 'PROVIDER_OWNER' || role === 'PROVIDER_MANAGER';

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Locations', path: '/locations', icon: MapPin },
    { label: 'Resources', path: '/resources', icon: Layers },
    { label: 'Availability', path: '/availability', icon: Calendar },
    { label: 'Directory Leads', path: '/leads', icon: Inbox },
    { label: 'Clients', path: '/customers', icon: Users },
    { label: 'Enquiries', path: '/enquiries', icon: FileText },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <Link to="/dashboard" className="sidebar-brand" onClick={onClose}>
          <div className="sidebar-logo-icon">S</div>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-title">SODAARS</span>
            <span className="sidebar-brand-sub">Provider Portal</span>
          </div>
        </Link>
      </div>

      {/* Main Navigation Links */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-section">Operations</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {canAccessSettings && (
          <>
            <div className="sidebar-nav-section" style={{ marginTop: '0.75rem' }}>
              Management
            </div>
            <NavLink
              to="/settings"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Settings size={18} />
              <span>Settings</span>
            </NavLink>
          </>
        )}

        <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-link"
            style={{ fontSize: '0.82rem', color: 'var(--navy-600)' }}
          >
            <ExternalLink size={15} />
            <span>Public Directory</span>
          </a>
        </div>
      </nav>

      {/* Sidebar Footer Context */}
      {activeOrg && (
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, paddingRight: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {activeOrg.trading_name || activeOrg.name}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--sidebar-text)' }}>
                {role ? role.replace('PROVIDER_', '') : 'STAFF'}
              </span>
            </div>
            {activeOrg.verification_status === 'VERIFIED' && (
              <ShieldCheck size={18} style={{ color: 'var(--emerald-500)', flexShrink: 0 }} />
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
