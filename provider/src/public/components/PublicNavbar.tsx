import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Layers,
  Calendar,
  FileText,
  Users,
  Camera,
  BookOpen,
  HelpCircle,
  ShoppingBag,
  Store,
  Info,
  ShieldCheck,
  TrendingUp,
  Menu,
  X,
  ArrowRight,
  Mail,
  LifeBuoy,
} from 'lucide-react';
import Button from '../../components/ui/Button';

export const PublicNavbar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleMouseEnter = (menu: string) => setActiveMenu(menu);
  const handleMouseLeave = () => setActiveMenu(null);
  const closeMenu = () => {
    setActiveMenu(null);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E2E8F0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2.5 text-[#1A2435] hover:opacity-90 transition-opacity"
          >
            <img
              src="/sodaars-logo.png"
              alt="SODAARS - Turning Hoardings Into Digital Reach"
              className="h-[34px] w-auto object-contain"
            />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#E11D2E] px-1.5 py-0.5 rounded bg-red-50 border border-red-200">
              Provider
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Solutions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('solutions')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                  location.pathname === '/solutions' || location.pathname.startsWith('/solutions/') || activeMenu === 'solutions'
                    ? 'text-[#E11D2E] bg-red-50/70 font-bold'
                    : 'text-[#1A2435] hover:text-[#E11D2E] hover:bg-[#F4F6F8]'
                }`}
              >
                Solutions
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    activeMenu === 'solutions' ? 'rotate-180 text-[#E11D2E]' : 'text-[#64748B]'
                  }`}
                />
              </button>

              {activeMenu === 'solutions' && (
                <div className="absolute top-full left-0 w-80 p-3 bg-white rounded-lg border border-[#E2E8F0] shadow-xl grid gap-1 z-50">
                  <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                    5 Core Solutions
                  </div>
                  <Link
                    to="/solutions/resource-management"
                    onClick={closeMenu}
                    className="group flex items-start gap-3 p-2 rounded-md hover:bg-[#F4F6F8] transition-colors"
                  >
                    <Layers className="text-[#E11D2E] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#1A2435] group-hover:text-[#E11D2E] transition-colors">Resource Management</div>
                      <div className="text-[11px] text-[#64748B]">Hoardings, unipoles & gantries</div>
                    </div>
                  </Link>
                  <Link
                    to="/solutions/availability-engine"
                    onClick={closeMenu}
                    className="group flex items-start gap-3 p-2 rounded-md hover:bg-[#F4F6F8] transition-colors"
                  >
                    <Calendar className="text-[#E11D2E] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#1A2435] group-hover:text-[#E11D2E] transition-colors">Availability Engine</div>
                      <div className="text-[11px] text-[#64748B]">Real-time slot & hold manager</div>
                    </div>
                  </Link>
                  <Link
                    to="/solutions/booking-pipeline"
                    onClick={closeMenu}
                    className="group flex items-start gap-3 p-2 rounded-md hover:bg-[#F4F6F8] transition-colors"
                  >
                    <FileText className="text-[#E11D2E] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#1A2435] group-hover:text-[#E11D2E] transition-colors">Booking Pipeline</div>
                      <div className="text-[11px] text-[#64748B]">Direct contracts & client renewals</div>
                    </div>
                  </Link>
                  <Link
                    to="/solutions/customer-crm"
                    onClick={closeMenu}
                    className="group flex items-start gap-3 p-2 rounded-md hover:bg-[#F4F6F8] transition-colors"
                  >
                    <Users className="text-[#E11D2E] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#1A2435] group-hover:text-[#E11D2E] transition-colors">Customer CRM</div>
                      <div className="text-[11px] text-[#64748B]">Agencies and direct buyers</div>
                    </div>
                  </Link>
                  <Link
                    to="/solutions/campaign-execution"
                    onClick={closeMenu}
                    className="group flex items-start gap-3 p-2 rounded-md hover:bg-[#F4F6F8] transition-colors"
                  >
                    <Camera className="text-[#E11D2E] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#1A2435] group-hover:text-[#E11D2E] transition-colors">Campaign Execution</div>
                      <div className="text-[11px] text-[#64748B]">Mounting photo proof & audit trails</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('resources')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                  location.pathname === '/resources' || location.pathname.startsWith('/resources/') || activeMenu === 'resources'
                    ? 'text-[#E11D2E] bg-red-50/70 font-bold'
                    : 'text-[#1A2435] hover:text-[#E11D2E] hover:bg-[#F4F6F8]'
                }`}
              >
                Resources
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    activeMenu === 'resources' ? 'rotate-180 text-[#E11D2E]' : 'text-[#64748B]'
                  }`}
                />
              </button>

              {activeMenu === 'resources' && (
                <div className="absolute top-full left-0 w-80 p-3 bg-white rounded-lg border border-[#E2E8F0] shadow-xl grid gap-1 z-50">
                  <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                    Knowledge & Playbooks
                  </div>
                  <Link
                    to="/resources"
                    onClick={closeMenu}
                    className="group flex items-start gap-3 p-2 rounded-md hover:bg-[#F4F6F8] transition-colors"
                  >
                    <Layers className="text-[#E11D2E] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#1A2435] group-hover:text-[#E11D2E] transition-colors">Outdoor Advertising Resources</div>
                      <div className="text-[11px] text-[#64748B]">Formats, specs & spatial model</div>
                    </div>
                  </Link>
                  <Link
                    to="/resources/guides-playbooks"
                    onClick={closeMenu}
                    className="group flex items-start gap-3 p-2 rounded-md hover:bg-[#F4F6F8] transition-colors"
                  >
                    <BookOpen className="text-[#E11D2E] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#1A2435] group-hover:text-[#E11D2E] transition-colors">Guides & Playbooks</div>
                      <div className="text-[11px] text-[#64748B]">Media owner best practices</div>
                    </div>
                  </Link>
                  <Link
                    to="/resources/faq"
                    onClick={closeMenu}
                    className="group flex items-start gap-3 p-2 rounded-md hover:bg-[#F4F6F8] transition-colors"
                  >
                    <HelpCircle className="text-[#E11D2E] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#1A2435] group-hover:text-[#E11D2E] transition-colors">FAQ</div>
                      <div className="text-[11px] text-[#64748B]">Platform & operational questions</div>
                    </div>
                  </Link>
                  <Link
                    to="/resources/help-support"
                    onClick={closeMenu}
                    className="group flex items-start gap-3 p-2 rounded-md hover:bg-[#F4F6F8] transition-colors"
                  >
                    <LifeBuoy className="text-[#E11D2E] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#1A2435] group-hover:text-[#E11D2E] transition-colors">Help Center & Support</div>
                      <div className="text-[11px] text-[#64748B]">Operational support & ticketing</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Marketplace Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('marketplace')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                  location.pathname === '/marketplace' || location.pathname.startsWith('/marketplace/') || activeMenu === 'marketplace'
                    ? 'text-[#E11D2E] bg-red-50/70 font-bold'
                    : 'text-[#1A2435] hover:text-[#E11D2E] hover:bg-[#F4F6F8]'
                }`}
              >
                Marketplace
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    activeMenu === 'marketplace' ? 'rotate-180 text-[#E11D2E]' : 'text-[#64748B]'
                  }`}
                />
              </button>

              {activeMenu === 'marketplace' && (
                <div className="absolute top-full left-0 w-80 p-3 bg-white rounded-lg border border-[#E2E8F0] shadow-xl grid gap-1 z-50">
                  <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                    Discovery &amp; Distribution
                  </div>
                  <Link
                    to="/marketplace"
                    onClick={closeMenu}
                    className="group flex items-start gap-3 p-2 rounded-md hover:bg-[#F4F6F8] transition-colors"
                  >
                    <ShoppingBag className="text-[#E11D2E] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#1A2435] group-hover:text-[#E11D2E] transition-colors">Marketplace Overview</div>
                      <div className="text-[11px] text-[#64748B]">Voluntary discovery channel</div>
                    </div>
                  </Link>
                  <Link
                    to="/marketplace/how-it-works"
                    onClick={closeMenu}
                    className="group flex items-start gap-3 p-2 rounded-md hover:bg-[#F4F6F8] transition-colors"
                  >
                    <Store className="text-[#E11D2E] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#1A2435] group-hover:text-[#E11D2E] transition-colors">How It Works</div>
                      <div className="text-[11px] text-[#64748B]">Discovery to campaign execution</div>
                    </div>
                  </Link>
                  <Link
                    to="/marketplace/discover"
                    onClick={closeMenu}
                    className="group flex items-start gap-3 p-2 rounded-md hover:bg-[#F4F6F8] transition-colors"
                  >
                    <Layers className="text-[#E11D2E] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#1A2435] group-hover:text-[#E11D2E] transition-colors">Discover Inventory</div>
                      <div className="text-[11px] text-[#64748B]">For advertisers &amp; media planners</div>
                    </div>
                  </Link>
                  <Link
                    to="/marketplace/agreement"
                    onClick={closeMenu}
                    className="group flex items-start gap-3 p-2 rounded-md hover:bg-[#F4F6F8] transition-colors"
                  >
                    <ShieldCheck className="text-[#E11D2E] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#1A2435] group-hover:text-[#E11D2E] transition-colors">Participation Agreement</div>
                      <div className="text-[11px] text-[#64748B]">Provider terms &amp; autonomy</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Direct Pricing Link */}
            <Link
              to="/pricing"
              onClick={closeMenu}
              className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                location.pathname === '/pricing'
                  ? 'text-[#E11D2E] bg-red-50/70 font-bold'
                  : 'text-[#1A2435] hover:text-[#E11D2E] hover:bg-[#F4F6F8]'
              }`}
            >
              Pricing
            </Link>

            {/* Company Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('company')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                  location.pathname === '/company' || location.pathname.startsWith('/company/') || activeMenu === 'company'
                    ? 'text-[#E11D2E] bg-red-50/70 font-bold'
                    : 'text-[#1A2435] hover:text-[#E11D2E] hover:bg-[#F4F6F8]'
                }`}
              >
                Company
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    activeMenu === 'company' ? 'rotate-180 text-[#E11D2E]' : 'text-[#64748B]'
                  }`}
                />
              </button>

              {activeMenu === 'company' && (
                <div className="absolute top-full right-0 w-72 p-3 bg-white rounded-lg border border-[#E2E8F0] shadow-xl grid gap-1 z-50">
                  <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                    About &amp; Partnerships
                  </div>
                  <Link
                    to="/company"
                    onClick={closeMenu}
                    className="group flex items-start gap-3 p-2 rounded-md hover:bg-[#F4F6F8] transition-colors"
                  >
                    <Info className="text-[#E11D2E] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#1A2435] group-hover:text-[#E11D2E] transition-colors">About SODAARS</div>
                      <div className="text-[11px] text-[#64748B]">Purpose &amp; operating vision</div>
                    </div>
                  </Link>
                  <Link
                    to="/company/partnerships"
                    onClick={closeMenu}
                    className="group flex items-start gap-3 p-2 rounded-md hover:bg-[#F4F6F8] transition-colors"
                  >
                    <TrendingUp className="text-[#E11D2E] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#1A2435] group-hover:text-[#E11D2E] transition-colors">Build With SODAARS</div>
                      <div className="text-[11px] text-[#64748B]">Ecosystem &amp; partner network</div>
                    </div>
                  </Link>
                  <Link
                    to="/company/contact"
                    onClick={closeMenu}
                    className="group flex items-start gap-3 p-2 rounded-md hover:bg-[#F4F6F8] transition-colors"
                  >
                    <Mail className="text-[#E11D2E] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#1A2435] group-hover:text-[#E11D2E] transition-colors">Contact Team</div>
                      <div className="text-[11px] text-[#64748B]">Connect with platform operations</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/signin">
              <Button variant="ghost" size="sm" className="text-[#1A2435] hover:bg-[#F4F6F8]">
                Sign In
              </Button>
            </Link>
            <Link to="/get-started">
              <Button variant="accent" size="sm" rightIcon={<ArrowRight size={14} />}>
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md text-[#1A2435] hover:text-[#E11D2E] hover:bg-[#F4F6F8] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="grid gap-1">
            <div>
              <Link
                to="/solutions"
                onClick={closeMenu}
                className="px-3 py-2 text-sm font-semibold rounded-md hover:bg-[#F4F6F8] flex items-center justify-between text-[#1A2435]"
              >
                <span>Solutions</span>
                <span className="text-[10px] uppercase font-semibold text-[#E11D2E] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  5 Core
                </span>
              </Link>
              <div className="pl-3 pr-1 py-1 grid gap-0.5 border-l-2 border-red-200 ml-3 mt-1">
                <Link
                  to="/solutions/resource-management"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-semibold text-[#1A2435] hover:text-[#E11D2E] hover:bg-[#F4F6F8] rounded transition-colors"
                >
                  Resource Management
                </Link>
                <Link
                  to="/solutions/availability-engine"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-semibold text-[#1A2435] hover:text-[#E11D2E] hover:bg-[#F4F6F8] rounded transition-colors"
                >
                  Availability Engine
                </Link>
                <Link
                  to="/solutions/booking-pipeline"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-semibold text-[#1A2435] hover:text-[#E11D2E] hover:bg-[#F4F6F8] rounded transition-colors"
                >
                  Booking Pipeline
                </Link>
                <Link
                  to="/solutions/customer-crm"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-semibold text-[#1A2435] hover:text-[#E11D2E] hover:bg-[#F4F6F8] rounded transition-colors"
                >
                  Customer CRM
                </Link>
                <Link
                  to="/solutions/campaign-execution"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-semibold text-[#1A2435] hover:text-[#E11D2E] hover:bg-[#F4F6F8] rounded transition-colors"
                >
                  Campaign Execution
                </Link>
              </div>
            </div>
            <div>
              <Link
                to="/resources"
                onClick={closeMenu}
                className="px-3 py-2 text-sm font-semibold rounded-md hover:bg-[#F4F6F8] flex items-center justify-between text-[#1A2435]"
              >
                <span>Resources</span>
                <span className="text-[10px] uppercase font-semibold text-[#E11D2E] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  Knowledge
                </span>
              </Link>
              <div className="pl-3 pr-1 py-1 grid gap-0.5 border-l-2 border-red-200 ml-3 mt-1">
                <Link
                  to="/resources"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-semibold text-[#1A2435] hover:text-[#E11D2E] hover:bg-[#F4F6F8] rounded transition-colors"
                >
                  Outdoor Advertising Resources
                </Link>
                <Link
                  to="/resources/guides-playbooks"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-semibold text-[#1A2435] hover:text-[#E11D2E] hover:bg-[#F4F6F8] rounded transition-colors"
                >
                  Guides & Playbooks
                </Link>
                <Link
                  to="/resources/faq"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-semibold text-[#1A2435] hover:text-[#E11D2E] hover:bg-[#F4F6F8] rounded transition-colors"
                >
                  FAQ
                </Link>
                <Link
                  to="/resources/help-support"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-semibold text-[#1A2435] hover:text-[#E11D2E] hover:bg-[#F4F6F8] rounded transition-colors"
                >
                  Help Center & Support
                </Link>
              </div>
            </div>
            <div>
              <Link
                to="/marketplace"
                onClick={closeMenu}
                className="px-3 py-2 text-sm font-semibold rounded-md hover:bg-[#F4F6F8] flex items-center justify-between text-[#1A2435]"
              >
                <span>Marketplace</span>
                <span className="text-[10px] uppercase font-semibold text-[#E11D2E] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  Discovery
                </span>
              </Link>
              <div className="pl-3 pr-1 py-1 grid gap-0.5 border-l-2 border-red-200 ml-3 mt-1">
                <Link
                  to="/marketplace"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-semibold text-[#1A2435] hover:text-[#E11D2E] hover:bg-[#F4F6F8] rounded transition-colors"
                >
                  Marketplace Overview
                </Link>
                <Link
                  to="/marketplace/how-it-works"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-semibold text-[#1A2435] hover:text-[#E11D2E] hover:bg-[#F4F6F8] rounded transition-colors"
                >
                  How It Works
                </Link>
                <Link
                  to="/marketplace/discover"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-semibold text-[#1A2435] hover:text-[#E11D2E] hover:bg-[#F4F6F8] rounded transition-colors"
                >
                  Discover Inventory
                </Link>
                <Link
                  to="/marketplace/agreement"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-semibold text-[#1A2435] hover:text-[#E11D2E] hover:bg-[#F4F6F8] rounded transition-colors"
                >
                  Participation Agreement
                </Link>
              </div>
            </div>
            <Link
              to="/pricing"
              onClick={closeMenu}
              className="px-3 py-2 text-sm font-semibold rounded-md text-[#1A2435] hover:bg-[#F4F6F8] transition-colors"
            >
              Pricing
            </Link>
            <div>
              <Link
                to="/company"
                onClick={closeMenu}
                className="px-3 py-2 text-sm font-semibold rounded-md hover:bg-[#F4F6F8] flex items-center justify-between text-[#1A2435]"
              >
                <span>Company</span>
                <span className="text-[10px] uppercase font-semibold text-[#E11D2E] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  About
                </span>
              </Link>
              <div className="pl-3 pr-1 py-1 grid gap-0.5 border-l-2 border-red-200 ml-3 mt-1">
                <Link
                  to="/company"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-semibold text-[#1A2435] hover:text-[#E11D2E] hover:bg-[#F4F6F8] rounded transition-colors"
                >
                  About SODAARS
                </Link>
                <Link
                  to="/company/partnerships"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-semibold text-[#1A2435] hover:text-[#E11D2E] hover:bg-[#F4F6F8] rounded transition-colors"
                >
                  Build With SODAARS
                </Link>
                <Link
                  to="/company/contact"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-semibold text-[#1A2435] hover:text-[#E11D2E] hover:bg-[#F4F6F8] rounded transition-colors"
                >
                  Contact Team
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] flex flex-col gap-2">
            <Link to="/signin" onClick={closeMenu} className="w-full">
              <Button variant="outline" size="sm" className="w-full text-[#1A2435] border-[#E2E8F0] hover:bg-[#F4F6F8]">
                Sign In
              </Button>
            </Link>
            <Link to="/get-started" onClick={closeMenu} className="w-full">
              <Button variant="accent" size="sm" className="w-full">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
