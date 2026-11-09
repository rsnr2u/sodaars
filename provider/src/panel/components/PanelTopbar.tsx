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
  FileText,
  Receipt,
  Layers,
  ArrowRight,
  Plus,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Percent,
  Key,
} from 'lucide-react';

export const PanelTopbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [bookingsMegaOpen, setBookingsMegaOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const bookingsMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (bookingsMenuRef.current && !bookingsMenuRef.current.contains(event.target as Node)) {
        setBookingsMegaOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileOpen(false);
        setBookingsMegaOpen(false);
      }
    };

    if (profileOpen || bookingsMegaOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileOpen, bookingsMegaOpen]);

  // Close menus on route navigation
  useEffect(() => {
    setProfileOpen(false);
    setBookingsMegaOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const isBookingsActive = location.pathname.startsWith('/panel/bookings');

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E2E8F0] shadow-[0_1px_4px_rgba(26,36,53,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Left: Brand + Navigation */}
          <div className="flex items-center gap-5 lg:gap-7">
            {/* Logo */}
            <Link to="/panel/dashboard" className="flex items-center gap-2 shrink-0 group">
              <img
                src="/sodaars-logo.png"
                alt="SODAARS - Turning Hoardings Into Digital Reach"
                className="h-[34px] w-auto object-contain transition-transform group-hover:opacity-90"
              />
            </Link>

            {/* Desktop Topbar Navigation */}
            <nav className="hidden xl:flex items-center gap-0.5 lg:gap-1.5">
              <NavLink
                to="/panel/dashboard"
                className={({ isActive }) =>
                  `relative py-2 px-3 text-[0.85rem] font-semibold rounded-md transition-colors whitespace-nowrap text-[#1A2435] ${
                    isActive
                      ? 'bg-red-50/70 font-bold after:content-[""] after:absolute after:bottom-[-17px] after:left-3 after:right-3 after:h-[2.5px] after:bg-[#E11D2E] after:rounded-full'
                      : 'hover:bg-[#F4F6F8]'
                  }`
                }
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/panel/resources"
                className={({ isActive }) =>
                  `relative py-2 px-3 text-[0.85rem] font-semibold rounded-md transition-colors whitespace-nowrap text-[#1A2435] ${
                    isActive
                      ? 'bg-red-50/70 font-bold after:content-[""] after:absolute after:bottom-[-17px] after:left-3 after:right-3 after:h-[2.5px] after:bg-[#E11D2E] after:rounded-full'
                      : 'hover:bg-[#F4F6F8]'
                  }`
                }
              >
                Inventory
              </NavLink>

              <NavLink
                to="/panel/availability"
                className={({ isActive }) =>
                  `relative py-2 px-3 text-[0.85rem] font-semibold rounded-md transition-colors whitespace-nowrap text-[#1A2435] ${
                    isActive
                      ? 'bg-red-50/70 font-bold after:content-[""] after:absolute after:bottom-[-17px] after:left-3 after:right-3 after:h-[2.5px] after:bg-[#E11D2E] after:rounded-full'
                      : 'hover:bg-[#F4F6F8]'
                  }`
                }
              >
                Availability
              </NavLink>

              {/* BOOKINGS MEGA-DROPDOWN MENU */}
              <div
                className="relative"
                ref={bookingsMenuRef}
                onMouseEnter={() => setBookingsMegaOpen(true)}
                onMouseLeave={() => setBookingsMegaOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setBookingsMegaOpen(!bookingsMegaOpen)}
                  className={`relative py-2 px-3 text-[0.85rem] font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer text-[#1A2435] ${
                    isBookingsActive || bookingsMegaOpen
                      ? 'bg-red-50/70 font-bold'
                      : 'hover:bg-[#F4F6F8]'
                  }`}
                >
                  <span>Bookings</span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${
                      bookingsMegaOpen ? 'rotate-180 text-[#E11D2E]' : 'text-[#1A2435]'
                    }`}
                  />
                  {isBookingsActive && (
                    <span className="absolute bottom-[-17px] left-3 right-3 h-[2.5px] bg-[#E11D2E] rounded-full" />
                  )}
                </button>

                {/* MEGA-DROPDOWN PANEL */}
                {bookingsMegaOpen && (
                  <div className="absolute left-0 top-full pt-2 w-[720px] z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xl p-5 text-xs grid grid-cols-3 gap-5">
                      {/* Column 1: Sales & Quotations */}
                      <div className="space-y-2.5 border-r border-[#E2E8F0] pr-4">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1A2435]">
                          <FileText size={13} className="text-[#E11D2E]" />
                          <span>Quotations &amp; Proposals</span>
                        </div>
                        <p className="text-[11px] text-[#64748B] leading-tight">
                          Pre-sale client estimates, temporary holds, and rates before conversion.
                        </p>
                        <div className="space-y-1 pt-1">
                          <Link
                            to="/panel/bookings?view=quotations"
                            onClick={() => setBookingsMegaOpen(false)}
                            className="flex items-start gap-2 p-2 rounded-lg hover:bg-[#F4F6F8] transition-colors group"
                          >
                            <div className="p-1.5 rounded-md bg-[#F4F6F8] group-hover:bg-red-50 text-[#1A2435] group-hover:text-[#E11D2E] mt-0.5">
                              <FileText size={13} />
                            </div>
                            <div>
                              <div className="font-bold text-[#1A2435] group-hover:text-[#E11D2E]">
                                Quotations Ledger
                              </div>
                              <div className="text-[10px] text-[#64748B]">
                                14 Active Proposals in Pipeline
                              </div>
                            </div>
                          </Link>

                          <Link
                            to="/panel/bookings/create?type=quotation"
                            onClick={() => setBookingsMegaOpen(false)}
                            className="flex items-start gap-2 p-2 rounded-lg hover:bg-[#F4F6F8] transition-colors group"
                          >
                            <div className="p-1.5 rounded-md bg-red-50 text-[#E11D2E] mt-0.5">
                              <Plus size={13} />
                            </div>
                            <div>
                              <div className="font-bold text-[#E11D2E]">
                                + Create New Quotation
                              </div>
                              <div className="text-[10px] text-[#64748B]">
                                Multi-site proposal builder
                              </div>
                            </div>
                          </Link>

                          <Link
                            to="/panel/bookings?view=quotations&status=hold"
                            onClick={() => setBookingsMegaOpen(false)}
                            className="flex items-start gap-2 p-2 rounded-lg hover:bg-[#F4F6F8] transition-colors group"
                          >
                            <div className="p-1.5 rounded-md bg-amber-50 text-amber-700 mt-0.5">
                              <Clock size={13} />
                            </div>
                            <div>
                              <div className="font-bold text-[#1A2435] group-hover:text-[#E11D2E]">
                                Client Holds (Soft Block)
                              </div>
                              <div className="text-[10px] text-[#64748B]">
                                48–72h tentative reservations
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>

                      {/* Column 2: Bookings Pipeline */}
                      <div className="space-y-2.5 border-r border-[#E2E8F0] pr-4">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1A2435]">
                          <CheckCircle2 size={13} className="text-emerald-600" />
                          <span>Confirmed Bookings</span>
                        </div>
                        <p className="text-[11px] text-[#64748B] leading-tight">
                          Legally locked contracts across direct clients and public marketplace.
                        </p>
                        <div className="space-y-1 pt-1">
                          <Link
                            to="/panel/bookings?view=direct"
                            onClick={() => setBookingsMegaOpen(false)}
                            className="flex items-start gap-2 p-2 rounded-lg hover:bg-[#F4F6F8] transition-colors group"
                          >
                            <div className="p-1.5 rounded-md bg-[#F4F6F8] group-hover:bg-[#E2E8F0] text-[#1A2435] mt-0.5">
                              <Layers size={13} />
                            </div>
                            <div>
                              <div className="font-bold text-[#1A2435] group-hover:text-[#E11D2E]">
                                My Direct Bookings
                              </div>
                              <div className="text-[10px] text-[#64748B]">
                                Offline clients &amp; direct agencies
                              </div>
                            </div>
                          </Link>

                          <Link
                            to="/panel/bookings?view=marketplace"
                            onClick={() => setBookingsMegaOpen(false)}
                            className="flex items-start gap-2 p-2 rounded-lg hover:bg-[#F4F6F8] transition-colors group"
                          >
                            <div className="p-1.5 rounded-md bg-amber-50 text-amber-800 mt-0.5">
                              <ShoppingBag size={13} />
                            </div>
                            <div>
                              <div className="font-bold text-[#1A2435] group-hover:text-[#E11D2E]">
                                Marketplace Bookings
                              </div>
                              <div className="text-[10px] text-[#64748B]">
                                Inbound orders via SODAARS
                              </div>
                            </div>
                          </Link>

                          <Link
                            to="/panel/bookings?view=all"
                            onClick={() => setBookingsMegaOpen(false)}
                            className="flex items-start gap-2 p-2 rounded-lg hover:bg-[#F4F6F8] transition-colors group"
                          >
                            <div className="p-1.5 rounded-md bg-[#F4F6F8] text-[#1A2435] mt-0.5">
                              <ArrowRight size={13} />
                            </div>
                            <div>
                              <div className="font-bold text-[#1A2435] group-hover:text-[#E11D2E]">
                                All Bookings Master
                              </div>
                              <div className="text-[10px] text-[#64748B]">
                                257 Confirmed contracts ledger
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>

                      {/* Column 3: Invoicing & Finance */}
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1A2435]">
                          <Receipt size={13} className="text-emerald-700" />
                          <span>Invoices &amp; Billing</span>
                        </div>
                        <p className="text-[11px] text-[#64748B] leading-tight">
                          Tax invoices, 50% advance collection, and balance POP settlements.
                        </p>
                        <div className="space-y-1 pt-1">
                          <Link
                            to="/panel/finance"
                            onClick={() => setBookingsMegaOpen(false)}
                            className="flex items-start gap-2 p-2 rounded-lg hover:bg-[#F4F6F8] transition-colors group"
                          >
                            <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-700 mt-0.5">
                              <Receipt size={13} />
                            </div>
                            <div>
                              <div className="font-bold text-[#1A2435] group-hover:text-emerald-700">
                                Invoices Ledger
                              </div>
                              <div className="text-[10px] text-[#64748B]">
                                Tax Invoices (MD-INV-2026 series)
                              </div>
                            </div>
                          </Link>

                          <Link
                            to="/panel/finance?tab=aging"
                            onClick={() => setBookingsMegaOpen(false)}
                            className="flex items-start gap-2 p-2 rounded-lg hover:bg-[#F4F6F8] transition-colors group"
                          >
                            <div className="p-1.5 rounded-md bg-[#F4F6F8] text-[#1A2435] mt-0.5">
                              <Percent size={13} />
                            </div>
                            <div>
                              <div className="font-bold text-[#1A2435] group-hover:text-emerald-700">
                                50% Advance &amp; POP
                              </div>
                              <div className="text-[10px] text-[#64748B]">
                                Track milestone payments
                              </div>
                            </div>
                          </Link>

                          <div className="pt-2 border-t border-[#E2E8F0] mt-2">
                            <Link
                              to="/panel/bookings/create"
                              onClick={() => setBookingsMegaOpen(false)}
                              className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg bg-[#E11D2E] text-white font-bold text-[11px] hover:bg-[#C51323] transition-colors"
                            >
                              <Plus size={12} />
                              <span>Create Direct Booking</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <NavLink
                to="/panel/campaigns"
                className={({ isActive }) =>
                  `relative py-2 px-3 text-[0.85rem] font-semibold rounded-md transition-colors whitespace-nowrap text-[#1A2435] ${
                    isActive
                      ? 'bg-red-50/70 font-bold after:content-[""] after:absolute after:bottom-[-17px] after:left-3 after:right-3 after:h-[2.5px] after:bg-[#E11D2E] after:rounded-full'
                      : 'hover:bg-[#F4F6F8]'
                  }`
                }
              >
                Campaigns
              </NavLink>

              <NavLink
                to="/panel/customers"
                className={({ isActive }) =>
                  `relative py-2 px-3 text-[0.85rem] font-semibold rounded-md transition-colors whitespace-nowrap text-[#1A2435] ${
                    isActive
                      ? 'bg-red-50/70 font-bold after:content-[""] after:absolute after:bottom-[-17px] after:left-3 after:right-3 after:h-[2.5px] after:bg-[#E11D2E] after:rounded-full'
                      : 'hover:bg-[#F4F6F8]'
                  }`
                }
              >
                Customers
              </NavLink>

              <NavLink
                to="/panel/finance"
                className={({ isActive }) =>
                  `relative py-2 px-3 text-[0.85rem] font-semibold rounded-md transition-colors whitespace-nowrap text-[#1A2435] ${
                    isActive
                      ? 'bg-red-50/70 font-bold after:content-[""] after:absolute after:bottom-[-17px] after:left-3 after:right-3 after:h-[2.5px] after:bg-[#E11D2E] after:rounded-full'
                      : 'hover:bg-[#F4F6F8]'
                  }`
                }
              >
                Finance
              </NavLink>

              <NavLink
                to="/panel/reports"
                className={({ isActive }) =>
                  `relative py-2 px-3 text-[0.85rem] font-semibold rounded-md transition-colors whitespace-nowrap text-[#1A2435] ${
                    isActive
                      ? 'bg-red-50/70 font-bold after:content-[""] after:absolute after:bottom-[-17px] after:left-3 after:right-3 after:h-[2.5px] after:bg-[#E11D2E] after:rounded-full'
                      : 'hover:bg-[#F4F6F8]'
                  }`
                }
              >
                Reports
              </NavLink>

              <NavLink
                to="/panel/settings"
                className={({ isActive }) =>
                  `relative py-2 px-3 text-[0.85rem] font-semibold rounded-md transition-colors whitespace-nowrap text-[#1A2435] ${
                    isActive || location.pathname.startsWith('/panel/organization/settings')
                      ? 'bg-red-50/70 font-bold after:content-[""] after:absolute after:bottom-[-17px] after:left-3 after:right-3 after:h-[2.5px] after:bg-[#E11D2E] after:rounded-full'
                      : 'hover:bg-[#F4F6F8]'
                  }`
                }
              >
                Settings
              </NavLink>
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
                  ? 'bg-red-50 text-[#E11D2E] ring-1 ring-red-200'
                  : 'bg-[#F4F6F8] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#1A2435]'
              }`}
            >
              <Settings size={17} />
            </Link>

            {/* Notification Bell */}
            <button
              aria-label="Notifications"
              className="w-9 h-9 rounded-lg bg-[#F4F6F8] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#1A2435] flex items-center justify-center transition-colors relative"
            >
              <Bell size={17} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E11D2E]" />
            </button>

            {/* User Profile Pill */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-[#F4F6F8] transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-[#1A2435] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  MD
                </div>
                <div className="hidden lg:flex flex-col leading-tight">
                  <span className="text-xs font-bold text-[#1A2435]">MD ARTS</span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#64748B]">
                    Provider Account
                  </span>
                </div>
                <ChevronDown size={14} className="text-[#64748B] hidden lg:block" />
              </button>

              {/* Profile Menu Dropdown */}
              {profileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg border border-[#E2E8F0] shadow-lg py-1.5 z-50 text-xs"
                  onClick={() => setProfileOpen(false)}
                >
                  <div className="px-3.5 py-2.5 border-b border-[#E2E8F0]">
                    <div className="font-bold text-[#1A2435] text-sm">MD ARTS</div>
                    <div className="text-[11px] text-[#64748B]">MD Arts Outdoor Media Network</div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/panel/settings"
                      className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#F4F6F8] text-[#1A2435] font-semibold transition-colors"
                    >
                      <Settings size={15} className="text-[#E11D2E]" />
                      <span>Settings &amp; Preferences</span>
                    </Link>

                    <Link
                      to="/panel/change-password"
                      className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#F4F6F8] text-[#1A2435] font-semibold transition-colors"
                    >
                      <Key size={15} className="text-[#E11D2E]" />
                      <span>Change Password</span>
                    </Link>

                    <Link
                      to="/panel/organization/profile"
                      className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#F4F6F8] text-[#1A2435] transition-colors"
                    >
                      <Building size={15} className="text-[#64748B]" />
                      <span>Organization Profile</span>
                    </Link>

                    <Link
                      to="/panel/organization/subscription"
                      className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#F4F6F8] text-[#1A2435] transition-colors"
                    >
                      <User size={15} className="text-[#64748B]" />
                      <span>Plan &amp; Subscription Quota</span>
                    </Link>

                    <Link
                      to="/"
                      target="_blank"
                      className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#F4F6F8] text-[#1A2435] transition-colors"
                    >
                      <ExternalLink size={15} className="text-[#64748B]" />
                      <span>View Public Website</span>
                    </Link>
                  </div>

                  <div className="border-t border-[#E2E8F0] my-1" />

                  <button
                    onClick={() => navigate('/signin')}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-rose-600 hover:bg-rose-50 text-left cursor-pointer font-medium transition-colors"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle (for screens < 1280px) */}
            <div className="flex xl:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-[#1A2435] hover:text-[#E11D2E] hover:bg-[#F4F6F8] transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-3 border-t border-[#E2E8F0] space-y-1 bg-white">
            <Link
              to="/panel/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-[0.875rem] font-semibold rounded-md text-[#1A2435] hover:bg-[#F4F6F8] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/panel/resources"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-[0.875rem] font-semibold rounded-md text-[#1A2435] hover:bg-[#F4F6F8] transition-colors"
            >
              Inventory
            </Link>
            <Link
              to="/panel/availability"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-[0.875rem] font-semibold rounded-md text-[#1A2435] hover:bg-[#F4F6F8] transition-colors"
            >
              Availability
            </Link>

            {/* Bookings & Commercials Mobile Section */}
            <div className="py-2 px-3 space-y-1 bg-red-50/50 rounded-lg my-1 border border-red-100">
              <span className="text-[11px] font-bold text-[#E11D2E] uppercase tracking-wider block">
                Bookings &amp; Commercials
              </span>
              <Link
                to="/panel/bookings?view=quotations"
                onClick={() => setMobileMenuOpen(false)}
                className="block pl-2 py-1.5 text-xs text-[#1A2435] hover:text-[#E11D2E] font-semibold transition-colors"
              >
                📄 Quotations &amp; Proposals (14)
              </Link>
              <Link
                to="/panel/bookings?view=direct"
                onClick={() => setMobileMenuOpen(false)}
                className="block pl-2 py-1.5 text-xs text-[#1A2435] hover:text-[#E11D2E] transition-colors"
              >
                🎯 My Direct Bookings
              </Link>
              <Link
                to="/panel/bookings?view=marketplace"
                onClick={() => setMobileMenuOpen(false)}
                className="block pl-2 py-1.5 text-xs text-[#1A2435] hover:text-[#E11D2E] transition-colors"
              >
                🛍️ Marketplace Bookings
              </Link>
              <Link
                to="/panel/finance"
                onClick={() => setMobileMenuOpen(false)}
                className="block pl-2 py-1.5 text-xs text-[#1A2435] hover:text-emerald-700 font-semibold transition-colors"
              >
                🧾 Invoices &amp; Tax Bills
              </Link>
            </div>

            <Link
              to="/panel/campaigns"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-[0.875rem] font-semibold rounded-md text-[#1A2435] hover:bg-[#F4F6F8] transition-colors"
            >
              Campaigns
            </Link>
            <Link
              to="/panel/customers"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-[0.875rem] font-semibold rounded-md text-[#1A2435] hover:bg-[#F4F6F8] transition-colors"
            >
              Customers
            </Link>
            <Link
              to="/panel/finance"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-[0.875rem] font-semibold rounded-md text-[#1A2435] hover:bg-[#F4F6F8] transition-colors"
            >
              Finance
            </Link>
            <Link
              to="/panel/reports"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-[0.875rem] font-semibold rounded-md text-[#1A2435] hover:bg-[#F4F6F8] transition-colors"
            >
              Reports
            </Link>
            <Link
              to="/panel/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-[0.875rem] font-semibold rounded-md text-[#1A2435] hover:bg-[#F4F6F8] transition-colors"
            >
              Settings
            </Link>
            <Link
              to="/panel/change-password"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-[0.875rem] font-semibold rounded-md text-[#1A2435] hover:bg-[#F4F6F8] transition-colors"
            >
              Change Password
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default PanelTopbar;
