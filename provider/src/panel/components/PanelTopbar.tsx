import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  ExternalLink,
  Building,
  Settings,
} from 'lucide-react';

export const PanelTopbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileOpen]);

  // Close menus on route navigation
  useEffect(() => {
    setProfileOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Dashboard', path: '/panel/dashboard' },
    { name: 'Inventory', path: '/panel/resources' },
    { name: 'Bookings', path: '/panel/bookings' },
    { name: 'Customers', path: '/panel/customers' },
    { name: 'Campaigns', path: '/panel/campaigns' },
    { name: 'Finance', path: '/panel/finance' },
    { name: 'Reports', path: '/panel/reports' },
    { name: 'Settings', path: '/panel/settings' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAFAF9]/95 backdrop-blur-md border-b border-[#E5E5E5] shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Left: Brand + Navigation */}
          <div className="flex items-center gap-6 lg:gap-8">
            {/* Logo */}
            <Link to="/panel/dashboard" className="flex items-center gap-2 shrink-0 group">
              <img
                src="/sodaars-logo.png"
                alt="SODAARS"
                className="h-7 w-auto object-contain transition-transform group-hover:opacity-90"
              />
            </Link>

            {/* Desktop Topbar Navigation (NO SIDEBAR) */}
            <nav className="hidden xl:flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path === '/panel/settings' && location.pathname.startsWith('/panel/organization/settings'));
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={`relative py-2 px-3 text-[0.875rem] font-semibold rounded-md transition-colors whitespace-nowrap ${
                      isActive
                        ? 'text-[#EA580C] bg-orange-50/60 after:content-[""] after:absolute after:bottom-[-17px] after:left-3 after:right-3 after:h-[2.5px] after:bg-[#F97316] after:rounded-full'
                        : 'text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4]'
                    }`}
                  >
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Right: Controls & Profile */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Direct Settings Quick Action Button */}
            <Link
              to="/panel/settings"
              aria-label="Settings & System Policies"
              title="Settings & System Policies"
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                location.pathname.startsWith('/panel/settings') || location.pathname.startsWith('/panel/organization/settings')
                  ? 'bg-orange-100 text-[#EA580C] ring-1 ring-orange-300'
                  : 'bg-[#F5F5F4] hover:bg-[#E5E5E5] text-[#525252] hover:text-[#171717]'
              }`}
            >
              <Settings size={17} />
            </Link>

            {/* Notification Bell */}
            <button
              aria-label="Notifications"
              className="w-9 h-9 rounded-lg bg-[#F5F5F4] hover:bg-[#E5E5E5] text-[#525252] hover:text-[#171717] flex items-center justify-center transition-colors relative"
            >
              <Bell size={17} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F97316]" />
            </button>

            {/* User Profile Pill */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-[#F5F5F4] transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-[#EA580C] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  PO
                </div>
                <div className="hidden lg:flex flex-col leading-tight">
                  <span className="text-xs font-bold text-[#171717]">Provider Organization</span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#737373]">
                    Provider Account
                  </span>
                </div>
                <ChevronDown size={14} className="text-[#737373] hidden lg:block" />
              </button>

              {/* Profile Menu Dropdown */}
              {profileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-60 bg-white rounded-lg border border-[#E5E5E5] shadow-lg py-1 z-50 text-xs"
                  onClick={() => setProfileOpen(false)}
                >
                  <div className="px-3 py-2.5 border-b border-[#E5E5E5]">
                    <div className="font-bold text-[#171717]">Provider Organization</div>
                    <div className="text-[11px] text-[#737373]">SODAARS Provider Portal</div>
                  </div>

                  <Link
                    to="/panel/settings"
                    className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#FAFAF9] text-[#171717] font-medium"
                  >
                    <Settings size={14} className="text-[#EA580C]" />
                    <span>Settings &amp; Preferences</span>
                  </Link>

                  <Link
                    to="/panel/organization/profile"
                    className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#FAFAF9] text-[#171717]"
                  >
                    <Building size={14} className="text-[#737373]" />
                    Organization Profile
                  </Link>

                  <Link
                    to="/panel/organization/subscription"
                    className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#FAFAF9] text-[#171717]"
                  >
                    <User size={14} className="text-[#737373]" />
                    Plan &amp; Subscription Quota
                  </Link>

                  <Link
                    to="/"
                    target="_blank"
                    className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#FAFAF9] text-[#171717]"
                  >
                    <ExternalLink size={14} className="text-[#737373]" />
                    View Public Website
                  </Link>

                  <div className="border-t border-[#E5E5E5] my-1" />

                  <button
                    onClick={() => navigate('/signin')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 hover:bg-rose-50 text-left cursor-pointer"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle (for screens < 1280px) */}
            <div className="flex xl:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4]"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-3 border-t border-[#E5E5E5] space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-[0.875rem] font-semibold rounded-md transition-colors ${
                    isActive
                      ? 'text-[#EA580C] bg-orange-50 font-bold'
                      : 'text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4]'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};

export default PanelTopbar;
