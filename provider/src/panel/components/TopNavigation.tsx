import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  FileText,
  Users,
  Camera,
  Receipt,
  BarChart3,
  Settings,
} from 'lucide-react';

export const TopNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/panel/dashboard', icon: LayoutDashboard },
    { name: 'Inventory', path: '/panel/resources', icon: Layers },
    { name: 'Bookings', path: '/panel/bookings', icon: FileText },
    { name: 'Customers', path: '/panel/customers', icon: Users },
    { name: 'Campaigns', path: '/panel/campaigns', icon: Camera },
    { name: 'Finance', path: '/panel/finance', icon: Receipt },
    { name: 'Reports', path: '/panel/reports', icon: BarChart3 },
    { name: 'Settings', path: '/panel/settings', icon: Settings },
  ];

  return (
    <nav className="w-full bg-white border-b border-[#E5E5E5] sticky top-0 z-30 shadow-xs">
      {/* Primary Top Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? 'border-[#F97316] text-[#F97316] bg-orange-50/50 font-semibold'
                    : 'border-transparent text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4]'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-[#F97316]' : 'text-[#737373]'} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;
