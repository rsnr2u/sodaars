import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, HelpCircle, Search, User, LogOut, ExternalLink } from 'lucide-react';

export const TopHeader: React.FC = () => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="w-full bg-[#171717] text-white border-b border-[#262626] px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-14">
        {/* Left: Brand Identity & Active Org */}
        <div className="flex items-center gap-4">
          <Link to="/panel/dashboard" className="flex items-center gap-2.5">
            <div className="bg-white px-2 py-1 rounded-sm flex items-center shadow-xs">
              <img src="/sodaars-logo.png" alt="SODAARS" className="h-5 w-auto object-contain" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded-xs bg-[#262626] text-[#F97316] border border-[#333333]">
              Provider Panel
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-[#333333]">
            <span className="text-xs text-[#A3A3A3]">Workspace:</span>
            <span className="text-xs font-semibold text-white bg-[#262626] px-2 py-0.5 rounded-sm">
              Apex Media Networks
            </span>
          </div>
        </div>

        {/* Center: Global Quick Search */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]"
            />
            <input
              type="text"
              placeholder="Search resources, bookings, customers..."
              className="w-full h-8 pl-9 pr-3 rounded-md bg-[#262626] border border-[#333333] text-xs text-white placeholder:text-[#737373] focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
            />
          </div>
        </div>

        {/* Right: Actions & User Profile */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            className="p-1.5 rounded-md text-[#A3A3A3] hover:text-white hover:bg-[#262626] transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F97316]" />
          </button>

          {/* Help & Specs Reference */}
          <Link
            to="/resources"
            target="_blank"
            className="p-1.5 rounded-md text-[#A3A3A3] hover:text-white hover:bg-[#262626] transition-colors"
            title="Help & Documentation"
          >
            <HelpCircle size={16} />
          </Link>

          {/* User Menu Trigger */}
          <div className="relative ml-2" ref={profileMenuRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 rounded-md hover:bg-[#262626] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#262626] border border-[#404040] flex items-center justify-center text-xs font-semibold text-white">
                RK
              </div>
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-xs font-medium text-white">Rajesh Kumar</span>
                <span className="text-[10px] text-[#A3A3A3] mt-0.5">Admin</span>
              </div>
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 w-56 bg-white text-[#171717] rounded-md border border-[#E5E5E5] shadow-lg py-1 z-50 text-xs"
                onClick={() => setProfileOpen(false)}
              >
                <div className="px-3 py-2 border-b border-[#E5E5E5]">
                  <div className="font-semibold text-[#171717]">Rajesh Kumar</div>
                  <div className="text-[11px] text-[#737373]">rajesh@apexoutdoor.com</div>
                </div>

                <Link
                  to="/panel/settings"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-[#FAFAF9] text-[#262626] font-medium"
                >
                  <User size={14} className="text-[#EA580C]" />
                  Settings &amp; Preferences
                </Link>

                <Link
                  to="/panel/organization/profile"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-[#FAFAF9] text-[#262626]"
                >
                  <User size={14} className="text-[#737373]" />
                  Organization Profile
                </Link>

                <Link
                  to="/"
                  target="_blank"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-[#FAFAF9] text-[#262626]"
                >
                  <ExternalLink size={14} className="text-[#737373]" />
                  View Public Website
                </Link>

                <div className="border-t border-[#E5E5E5] my-1" />

                <button
                  onClick={() => navigate('/signin')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 text-left"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
