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
];

export const OrganizationSideMenu: React.FC = () => {
  const quota = CANONICAL_SUBSCRIPTION_DATA;

  return (
    <div className="w-full space-y-4">
      {/* Mobile Horizontal Sub-Navigation (< 1024px) */}
      <div className="lg:hidden bg-white border border-[#E5E5E5] rounded-lg p-1.5 shadow-xs overflow-x-auto">
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
                      ? 'bg-[#EA580C] text-white shadow-xs'
                      : 'text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4]'
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
      <div className="hidden lg:block bg-white rounded-lg border border-[#E5E5E5] shadow-xs overflow-hidden">
        {/* Organization Header Pill */}
        <div className="p-4 border-b border-[#E5E5E5] bg-[#FAFAF9]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#EA580C] to-[#C2410C] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              PO
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-[#171717] truncate">
                  Apex Media Networks
                </h3>
                <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
              </div>
              <p className="text-[11px] text-[#737373] truncate">
                Provider Account • SODAARS
              </p>
            </div>
          </div>
        </div>

        {/* Section Label */}
        <div className="px-4 pt-3 pb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
            Organization Administration
          </span>
        </div>

        {/* Vertical Sub-Menu Links */}
        <nav className="p-2 space-y-1">
          {ORG_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative flex items-center justify-between p-2.5 rounded-md text-xs transition-colors group ${
                    isActive
                      ? 'bg-orange-50/80 text-[#EA580C] font-semibold border-l-3 border-[#EA580C]'
                      : 'text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4]'
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
                            ? 'text-[#EA580C]'
                            : 'text-[#737373] group-hover:text-[#171717]'
                        }`}
                      />
                      <div className="min-w-0 text-left">
                        <div className="truncate leading-tight font-medium">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-[#737373] truncate font-normal mt-0.5">
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
                          isActive ? 'text-[#EA580C] opacity-100' : 'text-[#737373]'
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
        <div className="p-3 mx-2 my-2 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#171717] flex items-center gap-1">
              Registered Quota
            </span>
            <span className="font-bold text-[#EA580C]">
              {quota.totalRegistered} / {quota.tierLimit}
            </span>
          </div>

          <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${quota.percentageUsed}%` }}
              className="bg-[#EA580C] h-full"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#737373]">
            <span>Tier 2 (51-100 Displays)</span>
            <Link
              to="/panel/organization/subscription"
              className="text-[#EA580C] font-semibold hover:underline"
            >
              Details
            </Link>
          </div>
        </div>

        {/* Support & Documentation Footer */}
        <div className="p-3 border-t border-[#E5E5E5] bg-[#FAFAF9]/40 text-[11px] text-[#737373] flex items-center justify-between">
          <span className="flex items-center gap-1">
            <HelpCircle size={12} /> Provider Help
          </span>
          <Link
            to="/help"
            target="_blank"
            className="text-[#EA580C] hover:underline flex items-center gap-0.5 font-medium"
          >
            Docs <ExternalLink size={10} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSideMenu;
