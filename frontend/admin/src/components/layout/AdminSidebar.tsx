import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminSidebar: React.FC = () => {
  const { user, platformRole, logout } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      info('Signed Out', 'You have been signed out of the platform admin portal.');
      navigate('/login');
    } catch {
      navigate('/login');
    }
  };

  const getRoleBadgeClass = () => {
    switch (platformRole) {
      case 'SUPER_ADMIN':
        return 'sidebar-badge';
      case 'ADMIN':
        return 'sidebar-badge';
      default:
        return 'sidebar-badge';
    }
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'AD';

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Shield size={22} className="text-primary" />
          <span>SODAARS</span>
        </div>
        <span className={getRoleBadgeClass()}>
          {platformRole?.replace('_', ' ') || 'PORTAL'}
        </span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Core Administration</div>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/organizations"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Building2 size={18} />
          <span>Organizations</span>
        </NavLink>

        <NavLink
          to="/plans"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <CreditCard size={18} />
          <span>Subscription Plans</span>
        </NavLink>

        <div className="nav-section-title">System & Governance</div>
        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Settings size={18} />
          <span>Platform Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-snippet">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name" title={user?.name}>
              {user?.name || 'Administrator'}
            </div>
            <div className="user-role-pill">
              <span>{user?.email || 'admin@sodaars.com'}</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="btn-icon"
          title="Sign out"
          onClick={handleLogout}
          aria-label="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
