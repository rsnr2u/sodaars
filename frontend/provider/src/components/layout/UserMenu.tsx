import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LogOut, Shield, ChevronDown } from 'lucide-react';
import Badge from '../ui/Badge';

export const UserMenu: React.FC = () => {
  const { user, role, logout } = useAuth();
  const { info } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      info('You have been logged out securely.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const roleLabel = role ? role.replace('PROVIDER_', '') : 'MEMBER';
  const roleBadgeVariant =
    role === 'PROVIDER_OWNER'
      ? 'orange'
      : role === 'PROVIDER_MANAGER'
      ? 'primary'
      : 'neutral';

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.35rem 0.5rem',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          transition: 'background-color var(--transition-fast)',
        }}
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--navy-900)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.8rem',
            border: '2px solid var(--surface-white)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          {getInitials(user.name)}
        </div>
        <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '240px',
            backgroundColor: 'var(--surface-white)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 40,
            padding: '0.6rem',
            animation: 'fadeIn var(--transition-fast)',
          }}
        >
          <div style={{ padding: '0.5rem 0.6rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.4rem' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-heading)' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              {user.email}
            </div>
            <Badge variant={roleBadgeVariant} icon={<Shield size={11} />}>
              {roleLabel}
            </Badge>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.55rem 0.6rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: 'var(--rose-600)',
              cursor: 'pointer',
              width: '100%',
              fontSize: '0.88rem',
              fontWeight: 500,
              textAlign: 'left',
              transition: 'background-color var(--transition-fast)',
            }}
          >
            <LogOut size={16} />
            <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
