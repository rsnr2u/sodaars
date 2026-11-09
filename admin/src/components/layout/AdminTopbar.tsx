import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Building2, 
  ShoppingBag, 
  Search, 
  Bell, 
  HelpCircle, 
  UserCheck, 
  ChevronDown,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCheck,
  Receipt,
  Radio,
  Clock,
  ExternalLink,
  X
} from 'lucide-react';
import { DomainType } from '../../types';

interface AdminTopbarProps {
  currentDomain: DomainType;
  onDomainChange: (domain: DomainType) => void;
}

interface AdminNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  category: 'kyc' | 'campaigns' | 'billing' | 'alerts';
  read: boolean;
  link: string;
}

const initialNotifications: AdminNotification[] = [
  {
    id: 'notif-1',
    title: 'KYC Document Pending Audit',
    message: 'Skyline Hoardings submitted GSTIN REG-06 and Trade License for verification.',
    time: '5m ago',
    category: 'kyc',
    read: false,
    link: '/admin/providers/kyc',
  },
  {
    id: 'notif-2',
    title: 'Mounting Proofs Uploaded',
    message: 'Field crew uploaded Day & Night geotagged photos for Western Express Highway Billboard (MUM-WEH-BB-04).',
    time: '18m ago',
    category: 'campaigns',
    read: false,
    link: '/admin/providers/PRV-1001',
  },
  {
    id: 'notif-3',
    title: 'SaaS Subscription Paid',
    message: 'Invoice INV-2026-0891 (₹5,89,988 incl. 18% GST) captured for Punjab Highway Media.',
    time: '1h ago',
    category: 'billing',
    read: false,
    link: '/admin/payments',
  },
  {
    id: 'notif-4',
    title: 'Municipal Inspection Hold',
    message: 'GHMC municipal structural audit certification needed for HYD-HITEC-09.',
    time: '3h ago',
    category: 'alerts',
    read: false,
    link: '/admin/resources/blocks',
  },
  {
    id: 'notif-5',
    title: 'New Booking Confirmed',
    message: 'Tata Motors EV Passenger Vehicles booked BKC Diamond Bourse Unipole for 31 days.',
    time: 'Yesterday',
    category: 'campaigns',
    read: true,
    link: '/admin/providers/PRV-1001',
  },
];

export const AdminTopbar: React.FC<AdminTopbarProps> = ({ currentDomain, onDomainChange }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<'all' | 'kyc' | 'campaigns' | 'billing' | 'alerts'>('all');
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotificationPanel(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pure menu names without notification badges
  const domains = [
    {
      id: 'administration' as DomainType,
      label: 'Administration',
      sublabel: 'Governance & Staff',
      icon: ShieldCheck,
      path: '/admin/dashboard',
    },
    {
      id: 'provider' as DomainType,
      label: 'Provider Operations',
      sublabel: 'Media Owners & Assets',
      icon: Building2,
      path: '/admin/providers',
    },
    {
      id: 'marketplace' as DomainType,
      label: 'Marketplace',
      sublabel: 'Agencies & Escrow',
      icon: ShoppingBag,
      path: '/admin/marketplace',
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notif: AdminNotification) => {
    // Mark this specific notification as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    setShowNotificationPanel(false);
    navigate(notif.link);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.category === activeFilter;
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0d0d0d] text-white border-b border-[#262626]">
      {/* Top Banner Bar */}
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity & Mission Control tag */}
        <div className="flex items-center gap-6">
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#ea580c] to-[#c2410c] flex items-center justify-center font-bold text-white shadow-lg shadow-orange-950/40 border border-orange-400/30 transition-transform group-hover:scale-105">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg text-white font-mono">SODAARS</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#262626] text-orange-400 border border-orange-500/30 font-mono">
                  Mission Control
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-none">OOH Infrastructure Operating System</p>
            </div>
          </Link>

          {/* Vertical Divider */}
          <div className="hidden lg:block h-7 w-[1px] bg-[#262626]" />

          {/* Domain Navigation Tabs (Pure Menu Names - No Notification Badges) */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Domain Switcher">
            {domains.map((dom) => {
              const Icon = dom.icon;
              const isActive = currentDomain === dom.id;
              return (
                <Link
                  key={dom.id}
                  to={dom.path}
                  onClick={() => onDomainChange(dom.id)}
                  className={`relative flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#1f1f1f] text-white font-semibold shadow-inner border border-zinc-700/60'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#171717] border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-zinc-500'}`} />
                  <div className="flex flex-col text-left">
                    <span className="leading-tight font-medium text-xs">
                      {dom.label}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-normal leading-none mt-0.5">{dom.sublabel}</span>
                  </div>
                  {isActive && (
                    <span className="absolute bottom-[-9px] left-1/2 -translate-x-1/2 w-8 h-[2px] bg-orange-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Search, Notifications Bell, Status & Admin Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Search Bar */}
          <div className="hidden xl:flex items-center relative w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3" />
            <input
              type="text"
              placeholder="Search providers, hoards, logs..."
              className="w-full bg-[#171717] text-xs text-zinc-200 pl-8 pr-12 py-1.5 rounded-lg border border-[#2e2e2e] focus:outline-none focus:border-orange-500/70 placeholder:text-zinc-500 font-sans"
            />
            <span className="absolute right-2.5 text-[10px] text-zinc-500 font-mono bg-[#262626] px-1 py-0.5 rounded border border-zinc-700">
              Ctrl K
            </span>
          </div>

          {/* Live Network Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NODE_LIVE</span>
          </div>

          {/* ========================================================= */}
          {/* BELL ICON WITH NOTIFICATION DROPDOWN                      */}
          {/* ========================================================= */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotificationPanel(!showNotificationPanel)}
              className="p-2 rounded-lg bg-[#171717] hover:bg-[#262626] text-zinc-300 hover:text-white border border-[#2a2a2a] relative transition-colors focus:outline-none"
              title="System & Operational Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white font-mono shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotificationPanel && (
              <div className="absolute right-0 mt-2 w-96 bg-[#171717] border border-[#2e2e2e] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Header */}
                <div className="p-3.5 border-b border-[#262626] flex items-center justify-between bg-[#141414]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-mono bg-orange-500/20 text-orange-400 border border-orange-500/30 px-1.5 py-0.2 rounded-full font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-[11px] text-zinc-400 hover:text-orange-400 transition-colors flex items-center gap-1 font-sans"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all as read</span>
                    </button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 px-3 py-2 border-b border-[#262626] bg-[#121212] overflow-x-auto text-[11px] font-mono">
                  {(['all', 'kyc', 'campaigns', 'billing', 'alerts'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveFilter(tab)}
                      className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                        activeFilter === tab
                          ? 'bg-[#262626] text-white font-bold'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a1a]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Notification Items List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-[#222222]">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-3 flex items-start gap-3 cursor-pointer transition-colors ${
                          !notif.read ? 'bg-orange-950/10 hover:bg-orange-950/20' : 'hover:bg-[#1f1f1f]'
                        }`}
                      >
                        {/* Category Icon */}
                        <div className="shrink-0 mt-0.5">
                          {notif.category === 'kyc' && (
                            <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </div>
                          )}
                          {notif.category === 'campaigns' && (
                            <div className="w-7 h-7 rounded-lg bg-orange-500/15 text-orange-400 border border-orange-500/30 flex items-center justify-center">
                              <Radio className="w-3.5 h-3.5" />
                            </div>
                          )}
                          {notif.category === 'billing' && (
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                              <Receipt className="w-3.5 h-3.5" />
                            </div>
                          )}
                          {notif.category === 'alerts' && (
                            <div className="w-7 h-7 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 flex items-center justify-center">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-xs font-semibold truncate ${!notif.read ? 'text-white' : 'text-zinc-300'}`}>
                              {notif.title}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                              {notif.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">
                            {notif.message}
                          </p>
                        </div>

                        {/* Unread Dot */}
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-2" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-zinc-500 text-xs font-mono">
                      No notifications in this category.
                    </div>
                  )}
                </div>

                {/* Footer Link */}
                <div className="p-2.5 border-t border-[#262626] bg-[#141414] text-center">
                  <Link
                    to="/admin/audit-logs"
                    onClick={() => setShowNotificationPanel(false)}
                    className="text-xs font-mono text-orange-400 hover:text-orange-300 inline-flex items-center gap-1 font-medium transition-colors"
                  >
                    <span>View All System Activity Logs</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile & Role Switcher */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 pl-2 pr-2.5 py-1.5 rounded-lg bg-[#171717] hover:bg-[#222222] border border-[#2a2a2a] transition-colors"
            >
              <div className="w-7 h-7 rounded bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold text-xs">
                AR
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-zinc-200 leading-none">Arunav Roy</div>
                <div className="text-[10px] text-orange-400 font-mono leading-none mt-0.5">SUPER_ADMIN</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#171717] border border-[#2e2e2e] rounded-xl shadow-2xl p-1.5 z-50 text-xs">
                <div className="px-3 py-2 border-b border-[#2e2e2e]">
                  <p className="font-semibold text-zinc-200">Arunav Roy</p>
                  <p className="text-[11px] text-zinc-400">arunav@sodaars.internal</p>
                  <span className="inline-block mt-1 text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono">
                    Tier-0 Full Access
                  </span>
                </div>
                <div className="py-1">
                  <Link
                    to="/admin/staff"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded text-zinc-300 hover:bg-[#262626] hover:text-white"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-zinc-400" />
                    Security & Staff Directory
                  </Link>
                  <Link
                    to="/admin/audit-logs"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded text-zinc-300 hover:bg-[#262626] hover:text-white"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                    My Activity Logs
                  </Link>
                </div>
                <div className="pt-1 border-t border-[#2e2e2e]">
                  <a
                    href="http://localhost:5173"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between px-3 py-1.5 rounded text-orange-400 hover:bg-orange-950/30 text-[11px] font-mono"
                  >
                    <span>Open Provider Platform</span>
                    <span>:5173 ↗</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Domain Bar (Visible only on smaller screens) */}
      <div className="md:hidden flex items-center justify-around border-t border-[#262626] bg-[#121212] px-2 py-1.5 text-xs">
        {domains.map((dom) => {
          const Icon = dom.icon;
          const isActive = currentDomain === dom.id;
          return (
            <Link
              key={dom.id}
              to={dom.path}
              onClick={() => onDomainChange(dom.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded ${
                isActive ? 'bg-[#222] text-orange-400 font-semibold' : 'text-zinc-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{dom.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
};
