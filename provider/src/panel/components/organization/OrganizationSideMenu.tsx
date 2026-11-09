import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Building2,
  Users,
  CreditCard,
  ShoppingBag,
  FileSignature,
  Sliders,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Lock,
} from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import { CANONICAL_SUBSCRIPTION_DATA } from '../../types/subscription';

export interface OrgNavItem {
  name: string;
  shortName: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  badge?: string;
  badgeVariant?: 'brand' | 'active' | 'inactive';
}

export const ORG_NAV_ITEMS: OrgNavItem[] = [
  {
    name: 'Organization Profile',
    shortName: 'Profile',
    path: '/panel/organization/profile',
    icon: Building2,
    description: 'Legal identity, GSTIN & address',
  },
  {
    name: 'Team Management',
    shortName: 'Team',
    path: '/panel/organization/team',
    icon: Users,
    description: 'Staff roster & access roles',
    badge: 'Owner',
    badgeVariant: 'brand',
  },
  {
    name: 'Subscription & Quota',
    shortName: 'Subscription',
    path: '/panel/organization/subscription',
    icon: CreditCard,
    description: 'Capacity limits & billing',
    badge: 'Tier 2',
    badgeVariant: 'active',
  },
  {
    name: 'Marketplace Channel',
    shortName: 'Marketplace',
    path: '/panel/organization/marketplace',
    icon: ShoppingBag,
    description: 'Voluntary discovery & net prices',
  },
  {
    name: 'Marketplace Agreement',
    shortName: 'Agreement',
    path: '/panel/organization/marketplace-agreement',
    icon: FileSignature,
    description: 'Commercial terms & execution',
    badge: 'Active',
    badgeVariant: 'active',
  },
  {
    name: 'Operational Settings',
    shortName: 'Settings',
    path: '/panel/organization/settings',
    icon: Sliders,
    description: 'Hold limits, buffers & preferences',
  },
  {
    name: 'Change Password & Security',
    shortName: 'Password',
    path: '/panel/organization/change-password',
    icon: Lock,
    description: 'Master credentials, 2FA & sessions',
  },
];

export const OrganizationSideMenu: React.FC = () => {
  const quota = CANONICAL_SUBSCRIPTION_DATA;

  return (
    <div className="w-full space-y-4">
      {/* Mobile Horizontal Sub-Navigation (< 1024px) */}
      <div className="lg:hidden bg-white border border-[#E2E8F0] rounded-lg p-1.5 shadow-xs overflow-x-auto">
        <nav className="flex items-center gap-1 min-w-max">
          {ORG_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[#E11D2E] text-white shadow-xs'
                      : 'text-[#1A2435] hover:bg-[#F4F6F8]'
                  }`
                }
              >
                <Icon size={14} />
                <span>{item.shortName}</span>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/15 font-mono">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Desktop Vertical Sidebar Card (>= 1024px) */}
      <div className="hidden lg:block bg-white rounded-lg border border-[#E2E8F0] shadow-xs overflow-hidden">
        {/* Organization Header Pill */}
        <div className="p-4 border-b border-[#E2E8F0] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1A2435] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              MD
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-[#1A2435] truncate">
                  MD ARTS
                </h3>
                <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
              </div>
              <p className="text-[11px] text-[#64748B] truncate">
                Provider Account • SODAARS
              </p>
            </div>
          </div>
        </div>

        {/* Section Label */}
        <div className="px-4 pt-3 pb-1.5 bg-white">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
            Organization Administration
          </span>
        </div>

        {/* Vertical Sub-Menu Links */}
        <nav className="p-2 space-y-1 bg-white">
          {ORG_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative flex items-center justify-between p-2.5 rounded-md text-xs transition-colors group ${
                    isActive
                      ? 'bg-red-50/80 text-[#1A2435] font-bold border-l-3 border-[#E11D2E]'
                      : 'text-[#1A2435] hover:bg-[#F4F6F8] font-medium'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        size={16}
                        className={`shrink-0 transition-colors ${
                          isActive
                            ? 'text-[#E11D2E]'
                            : 'text-[#64748B] group-hover:text-[#1A2435]'
                        }`}
                      />
                      <div className="min-w-0 text-left">
                        <div className="truncate leading-tight font-medium text-[#1A2435]">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-[#64748B] truncate font-normal mt-0.5">
                          {item.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      {item.badge && (
                        <Badge
                          variant={item.badgeVariant || (isActive ? 'brand' : 'inactive')}
                          size="sm"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {item.badge}
                        </Badge>
                      )}
                      <ChevronRight
                        size={13}
                        className={`transition-transform opacity-40 group-hover:opacity-100 ${
                          isActive ? 'text-[#E11D2E] opacity-100' : 'text-[#64748B]'
                        }`}
                      />
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Live Quota Mini Meter in Sidebar */}
        <div className="p-3 mx-2 my-2 rounded-lg bg-[#F4F6F8] border border-[#E2E8F0] space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#1A2435] flex items-center gap-1">
              Registered Quota
            </span>
            <span className="font-bold text-[#E11D2E]">
              {quota.totalRegistered} / {quota.tierLimit}
            </span>
          </div>

          <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden flex">
            <div
              style={{ width: `${quota.percentageUsed}%` }}
              className="bg-[#E11D2E] h-full"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#64748B]">
            <span>Tier 2 (51-100 Displays)</span>
            <Link
              to="/panel/organization/subscription"
              className="text-[#E11D2E] font-semibold hover:underline"
            >
              Details
            </Link>
          </div>
        </div>

        {/* Support & Documentation Footer */}
        <div className="p-3 border-t border-[#E2E8F0] bg-white text-[11px] text-[#64748B] flex items-center justify-between">
          <span className="flex items-center gap-1">
            <HelpCircle size={12} /> Provider Help
          </span>
          <Link
            to="/help"
            target="_blank"
            className="text-[#E11D2E] hover:underline flex items-center gap-0.5 font-medium"
          >
            Docs <ExternalLink size={10} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSideMenu;
