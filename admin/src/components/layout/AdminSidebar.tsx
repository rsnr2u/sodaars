import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  Users,
  Database,
  FileText,
  Sliders,
  Building2,
  FileCheck2,
  Layers,
  Ban,
  CreditCard,
  ShoppingBag,
  Store,
  Wallet,
  Compass,
  ArrowRight,
  Package,
  Receipt
} from 'lucide-react';
import { DomainType } from '../../types';

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

interface SidebarSection {
  group: string;
  items: SidebarItem[];
}

interface AdminSidebarProps {
  currentDomain: DomainType;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentDomain }) => {
  // Domain 1: Administration Menus
  const administrationSections: SidebarSection[] = [
    {
      group: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'System Health', path: '/admin/health', icon: Activity },
      ],
    },
    {
      group: 'SUBSCRIPTIONS & BILLING',
      items: [
        { label: 'Packages & Plans', path: '/admin/plans', icon: Package },
        { label: 'Subscribers', path: '/admin/subscribers', icon: CreditCard },
        { label: 'Payment History', path: '/admin/payments', icon: Receipt },
      ],
    },
    {
      group: 'PLATFORM MANAGEMENT',
      items: [
        { label: 'Staff & Roles', path: '/admin/staff', icon: Users },
        { label: 'Master Data', path: '/admin/master-data', icon: Database },
      ],
    },
    {
      group: 'SECURITY & AUDIT',
      items: [
        { label: 'Activity Logs', path: '/admin/audit-logs', icon: FileText },
        { label: 'Settings', path: '/admin/settings', icon: Sliders },
      ],
    },
  ];

  // Domain 2: Provider Operations Menus
  const providerSections: SidebarSection[] = [
    {
      group: 'MEDIA PROVIDERS',
      items: [
        { label: 'Provider Directory', path: '/admin/providers', icon: Building2 },
        { label: 'KYC & GSTIN Desk', path: '/admin/providers/kyc', icon: FileCheck2 },
      ],
    },
    {
      group: 'INVENTORY GOVERNANCE',
      items: [
        { label: 'Global Resource Registry', path: '/admin/resources', icon: Layers },
        { label: 'Admin Block Management', path: '/admin/resources/blocks', icon: Ban },
      ],
    },
    {
      group: 'COMMERCIAL & PLANS',
      items: [
        { label: 'Subscription Quotas', path: '/admin/subscriptions', icon: CreditCard },
      ],
    },
  ];

  // Domain 3: Marketplace (Phase 2)
  const marketplaceSections: SidebarSection[] = [
    {
      group: 'MARKETPLACE BLUEPRINT',
      items: [
        { label: 'Roadmap & Architecture', path: '/admin/marketplace', icon: Compass },
      ],
    },
    {
      group: 'BUYER DESKS (PHASE 2)',
      items: [
        { label: 'Agency & Brands CRM', path: '/admin/marketplace/agencies', icon: Store, disabled: true },
        { label: 'Escrow Settlements', path: '/admin/marketplace/settlements', icon: Wallet, disabled: true },
      ],
    },
  ];

  // Select sections based on active domain
  const currentSections = 
    currentDomain === 'administration' 
      ? administrationSections 
      : currentDomain === 'provider'
      ? providerSections
      : marketplaceSections;

  return (
    <aside className="hidden md:flex fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-[#e4e4e7] flex-col justify-between py-5 px-3 z-30 overflow-y-auto">
      <div className="space-y-6">
        {/* Context Header indicating current active top domain */}
        <div className="px-3 pb-3 border-b border-[#f4f4f5]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 font-mono">
            Active Control Domain
          </span>
          <div className="mt-1 flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 capitalize">
              {currentDomain === 'administration' ? 'Platform Governance' : currentDomain === 'provider' ? 'Provider Operations' : 'Marketplace (Phase 2)'}
            </h2>
            <span className="w-2 h-2 rounded-full bg-orange-500" />
          </div>
        </div>

        {/* Navigation Sections */}
        {currentSections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
              {sec.group}
            </h3>
            <div className="mt-1 space-y-0.5">
              {sec.items.map((item, itemIdx) => {
                const Icon = item.icon;
                if (item.disabled) {
                  return (
                    <div
                      key={itemIdx}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 opacity-60 cursor-not-allowed"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-zinc-400" />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-500 font-mono">
                        Phase 2
                      </span>
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={itemIdx}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-orange-50 text-[#ea580c] font-semibold border-l-3 border-[#ea580c]'
                          : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 border-l-3 border-transparent'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info Box */}
      <div className="pt-4 border-t border-[#f4f4f5] px-2 space-y-2">
        <div className="p-3 rounded-xl bg-[#0a0a0a] text-white space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-orange-400 uppercase font-bold tracking-wide">
              ADMIN DESK
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">v1.4.0</span>
          </div>
          <p className="text-[11px] text-zinc-300 leading-snug">
            All system overrides & compliance actions are logged with immutable SHA-256 hash digests.
          </p>
        </div>
      </div>
    </aside>
  );
};
