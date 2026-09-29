import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, ChevronDown, Check } from 'lucide-react';

export const OrgSwitcher: React.FC = () => {
  const { activeOrg, memberships, switchOrganization } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
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

  if (!activeOrg) return null;

  const handleSelect = (orgUuid: string) => {
    switchOrganization(orgUuid);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.4rem 0.75rem',
          backgroundColor: 'var(--canvas-bg)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'all var(--transition-fast)',
        }}
        aria-label="Switch organization"
        aria-expanded={isOpen}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--blue-50)',
            color: 'var(--blue-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Building2 size={16} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '160px' }}>
          <span
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text-heading)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {activeOrg.trading_name || activeOrg.name}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {activeOrg.verification_status === 'VERIFIED' ? 'Verified Provider' : 'Standard Account'}
          </span>
        </div>
        <ChevronDown size={14} style={{ color: 'var(--text-muted)', marginLeft: '0.2rem' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            width: '240px',
            backgroundColor: 'var(--surface-white)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 40,
            padding: '0.5rem',
            animation: 'fadeIn var(--transition-fast)',
          }}
        >
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
              padding: '0.4rem 0.6rem',
            }}
          >
            Your Organizations
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            {memberships.map((membership) => {
              const isCurrent = membership.organization.uuid === activeOrg.uuid;
              return (
                <button
                  key={membership.id}
                  onClick={() => handleSelect(membership.organization.uuid)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.6rem',
                    backgroundColor: isCurrent ? 'var(--blue-50)' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                    transition: 'background-color var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: isCurrent ? 600 : 500,
                        color: isCurrent ? 'var(--blue-700)' : 'var(--text-heading)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {membership.organization.trading_name || membership.organization.name}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Role: {membership.role.replace('PROVIDER_', '')}
                    </span>
                  </div>
                  {isCurrent && <Check size={16} style={{ color: 'var(--blue-600)', flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgSwitcher;
