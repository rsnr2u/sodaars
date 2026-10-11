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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2.5 text-[#171717] hover:opacity-90 transition-opacity"
          >
            <img
              src="/sodaars-logo.png"
              alt="SODAARS"
              className="h-7 w-auto object-contain"
            />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#EA580C] px-1.5 py-0.5 rounded bg-orange-50 border border-orange-200">
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
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === '/solutions' || location.pathname.startsWith('/solutions/') || activeMenu === 'solutions'
                    ? 'text-[#F97316]'
                    : 'text-[#262626] hover:text-[#171717] hover:bg-[#F5F5F4]'
                }`}
              >
                Solutions
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    activeMenu === 'solutions' ? 'rotate-180 text-[#F97316]' : 'text-[#737373]'
                  }`}
                />
              </button>

              {activeMenu === 'solutions' && (
                <div className="absolute top-full left-0 w-80 p-3 bg-white rounded-lg border border-[#E5E5E5] shadow-lg grid gap-1">
                  <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
                    5 Core Solutions
                  </div>
                  <Link
                    to="/solutions/resource-management"
                    onClick={closeMenu}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-[#FAFAF9] transition-colors"
                  >
                    <Layers className="text-[#F97316] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#171717]">Resource Management</div>
                      <div className="text-[11px] text-[#737373]">Hoardings, unipoles & gantries</div>
                    </div>
                  </Link>
                  <Link
                    to="/solutions/availability-engine"
                    onClick={closeMenu}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-[#FAFAF9] transition-colors"
                  >
                    <Calendar className="text-[#F97316] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#171717]">Availability Engine</div>
                      <div className="text-[11px] text-[#737373]">Real-time slot & hold manager</div>
                    </div>
                  </Link>
                  <Link
                    to="/solutions/booking-pipeline"
                    onClick={closeMenu}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-[#FAFAF9] transition-colors"
                  >
                    <FileText className="text-[#F97316] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#171717]">Booking Pipeline</div>
                      <div className="text-[11px] text-[#737373]">Direct contracts & client renewals</div>
                    </div>
                  </Link>
                  <Link
                    to="/solutions/customer-crm"
                    onClick={closeMenu}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-[#FAFAF9] transition-colors"
                  >
                    <Users className="text-[#F97316] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#171717]">Customer CRM</div>
                      <div className="text-[11px] text-[#737373]">Agencies and direct buyers</div>
                    </div>
                  </Link>
                  <Link
                    to="/solutions/campaign-execution"
                    onClick={closeMenu}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-[#FAFAF9] transition-colors"
                  >
                    <Camera className="text-[#F97316] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#171717]">Campaign Execution</div>
                      <div className="text-[11px] text-[#737373]">Mounting photo proof & audit trails</div>
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
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === '/resources' || location.pathname.startsWith('/resources/') || activeMenu === 'resources'
                    ? 'text-[#F97316]'
                    : 'text-[#262626] hover:text-[#171717] hover:bg-[#F5F5F4]'
                }`}
              >
                Resources
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    activeMenu === 'resources' ? 'rotate-180 text-[#F97316]' : 'text-[#737373]'
                  }`}
                />
              </button>

              {activeMenu === 'resources' && (
                <div className="absolute top-full left-0 w-80 p-3 bg-white rounded-lg border border-[#E5E5E5] shadow-lg grid gap-1">
                  <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
                    Knowledge & Playbooks
                  </div>
                  <Link
                    to="/resources"
                    onClick={closeMenu}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-[#FAFAF9] transition-colors"
                  >
                    <Layers className="text-[#F97316] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#171717]">Outdoor Advertising Resources</div>
                      <div className="text-[11px] text-[#737373]">Formats, specs & spatial model</div>
                    </div>
                  </Link>
                  <Link
                    to="/resources/guides-playbooks"
                    onClick={closeMenu}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-[#FAFAF9] transition-colors"
                  >
                    <BookOpen className="text-[#F97316] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#171717]">Guides & Playbooks</div>
                      <div className="text-[11px] text-[#737373]">Media owner best practices</div>
                    </div>
                  </Link>
                  <Link
                    to="/resources/faq"
                    onClick={closeMenu}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-[#FAFAF9] transition-colors"
                  >
                    <HelpCircle className="text-[#F97316] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#171717]">FAQ</div>
                      <div className="text-[11px] text-[#737373]">Platform & operational questions</div>
                    </div>
                  </Link>
                  <Link
                    to="/resources/help-support"
                    onClick={closeMenu}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-[#FAFAF9] transition-colors"
                  >
                    <LifeBuoy className="text-[#F97316] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#171717]">Help Center & Support</div>
                      <div className="text-[11px] text-[#737373]">Operational support & ticketing</div>
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
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === '/marketplace' || location.pathname.startsWith('/marketplace/') || activeMenu === 'marketplace'
                    ? 'text-[#F97316]'
                    : 'text-[#262626] hover:text-[#171717] hover:bg-[#F5F5F4]'
                }`}
              >
                Marketplace
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    activeMenu === 'marketplace' ? 'rotate-180 text-[#F97316]' : 'text-[#737373]'
                  }`}
                />
              </button>

              {activeMenu === 'marketplace' && (
                <div className="absolute top-full left-0 w-80 p-3 bg-white rounded-lg border border-[#E5E5E5] shadow-lg grid gap-1">
                  <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
                    Discovery &amp; Distribution
                  </div>
                  <Link
                    to="/marketplace"
                    onClick={closeMenu}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-[#FAFAF9] transition-colors"
                  >
                    <ShoppingBag className="text-[#F97316] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#171717]">Marketplace Overview</div>
                      <div className="text-[11px] text-[#737373]">Voluntary discovery channel</div>
                    </div>
                  </Link>
                  <Link
                    to="/marketplace/how-it-works"
                    onClick={closeMenu}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-[#FAFAF9] transition-colors"
                  >
                    <Store className="text-[#F97316] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#171717]">How It Works</div>
                      <div className="text-[11px] text-[#737373]">Discovery to campaign execution</div>
                    </div>
                  </Link>
                  <Link
                    to="/marketplace/discover"
                    onClick={closeMenu}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-[#FAFAF9] transition-colors"
                  >
                    <Layers className="text-[#F97316] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#171717]">Discover Inventory</div>
                      <div className="text-[11px] text-[#737373]">For advertisers &amp; media planners</div>
                    </div>
                  </Link>
                  <Link
                    to="/marketplace/agreement"
                    onClick={closeMenu}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-[#FAFAF9] transition-colors"
                  >
                    <ShieldCheck className="text-[#F97316] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#171717]">Participation Agreement</div>
                      <div className="text-[11px] text-[#737373]">Provider terms &amp; autonomy</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Direct Pricing Link */}
            <Link
              to="/pricing"
              onClick={closeMenu}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === '/pricing'
                  ? 'text-[#F97316]'
                  : 'text-[#262626] hover:text-[#171717] hover:bg-[#F5F5F4]'
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
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === '/company' || location.pathname.startsWith('/company/') || activeMenu === 'company'
                    ? 'text-[#F97316]'
                    : 'text-[#262626] hover:text-[#171717] hover:bg-[#F5F5F4]'
                }`}
              >
                Company
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    activeMenu === 'company' ? 'rotate-180 text-[#F97316]' : 'text-[#737373]'
                  }`}
                />
              </button>

              {activeMenu === 'company' && (
                <div className="absolute top-full right-0 w-72 p-3 bg-white rounded-lg border border-[#E5E5E5] shadow-lg grid gap-1">
                  <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
                    About &amp; Partnerships
                  </div>
                  <Link
                    to="/company"
                    onClick={closeMenu}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-[#FAFAF9] transition-colors"
                  >
                    <Info className="text-[#F97316] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#171717]">About SODAARS</div>
                      <div className="text-[11px] text-[#737373]">Purpose &amp; operating vision</div>
                    </div>
                  </Link>
                  <Link
                    to="/company/partnerships"
                    onClick={closeMenu}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-[#FAFAF9] transition-colors"
                  >
                    <TrendingUp className="text-[#F97316] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#171717]">Build With SODAARS</div>
                      <div className="text-[11px] text-[#737373]">Ecosystem &amp; partner network</div>
                    </div>
                  </Link>
                  <Link
                    to="/company/contact"
                    onClick={closeMenu}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-[#FAFAF9] transition-colors"
                  >
                    <Mail className="text-[#F97316] shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-xs font-semibold text-[#171717]">Contact Team</div>
                      <div className="text-[11px] text-[#737373]">Connect with platform operations</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/signin">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/get-started">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight size={14} />}>
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4]"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E5E5E5] bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="grid gap-1">
            <div>
              <Link
                to="/solutions"
                onClick={closeMenu}
                className="px-3 py-2 text-sm font-semibold rounded-md hover:bg-[#F5F5F4] flex items-center justify-between text-[#171717]"
              >
                <span>Solutions</span>
                <span className="text-[10px] uppercase font-semibold text-[#F97316] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  5 Core
                </span>
              </Link>
              <div className="pl-3 pr-1 py-1 grid gap-0.5 border-l-2 border-orange-200 ml-3 mt-1">
                <Link
                  to="/solutions/resource-management"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-medium text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4] rounded"
                >
                  Resource Management
                </Link>
                <Link
                  to="/solutions/availability-engine"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-medium text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4] rounded"
                >
                  Availability Engine
                </Link>
                <Link
                  to="/solutions/booking-pipeline"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-medium text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4] rounded"
                >
                  Booking Pipeline
                </Link>
                <Link
                  to="/solutions/customer-crm"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-medium text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4] rounded"
                >
                  Customer CRM
                </Link>
                <Link
                  to="/solutions/campaign-execution"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-medium text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4] rounded"
                >
                  Campaign Execution
                </Link>
              </div>
            </div>
            <div>
              <Link
                to="/resources"
                onClick={closeMenu}
                className="px-3 py-2 text-sm font-semibold rounded-md hover:bg-[#F5F5F4] flex items-center justify-between text-[#171717]"
              >
                <span>Resources</span>
                <span className="text-[10px] uppercase font-semibold text-[#F97316] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  Knowledge
                </span>
              </Link>
              <div className="pl-3 pr-1 py-1 grid gap-0.5 border-l-2 border-orange-200 ml-3 mt-1">
                <Link
                  to="/resources"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-medium text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4] rounded"
                >
                  Outdoor Advertising Resources
                </Link>
                <Link
                  to="/resources/guides-playbooks"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-medium text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4] rounded"
                >
                  Guides & Playbooks
                </Link>
                <Link
                  to="/resources/faq"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-medium text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4] rounded"
                >
                  FAQ
                </Link>
                <Link
                  to="/resources/help-support"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-medium text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4] rounded"
                >
                  Help Center & Support
                </Link>
              </div>
            </div>
            <div>
              <Link
                to="/marketplace"
                onClick={closeMenu}
                className="px-3 py-2 text-sm font-semibold rounded-md hover:bg-[#F5F5F4] flex items-center justify-between text-[#171717]"
              >
                <span>Marketplace</span>
                <span className="text-[10px] uppercase font-semibold text-[#F97316] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  Discovery
                </span>
              </Link>
              <div className="pl-3 pr-1 py-1 grid gap-0.5 border-l-2 border-orange-200 ml-3 mt-1">
                <Link
                  to="/marketplace"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-medium text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4] rounded"
                >
                  Marketplace Overview
                </Link>
                <Link
                  to="/marketplace/how-it-works"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-medium text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4] rounded"
                >
                  How It Works
                </Link>
                <Link
                  to="/marketplace/discover"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-medium text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4] rounded"
                >
                  Discover Inventory
                </Link>
                <Link
                  to="/marketplace/agreement"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-medium text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4] rounded"
                >
                  Participation Agreement
                </Link>
              </div>
            </div>
            <Link
              to="/pricing"
              onClick={closeMenu}
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-[#F5F5F4]"
            >
              Pricing
            </Link>
            <div>
              <Link
                to="/company"
                onClick={closeMenu}
                className="px-3 py-2 text-sm font-semibold rounded-md hover:bg-[#F5F5F4] flex items-center justify-between text-[#171717]"
              >
                <span>Company</span>
                <span className="text-[10px] uppercase font-semibold text-[#F97316] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  About
                </span>
              </Link>
              <div className="pl-3 pr-1 py-1 grid gap-0.5 border-l-2 border-orange-200 ml-3 mt-1">
                <Link
                  to="/company"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-medium text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4] rounded"
                >
                  About SODAARS
                </Link>
                <Link
                  to="/company/partnerships"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-medium text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4] rounded"
                >
                  Build With SODAARS
                </Link>
                <Link
                  to="/company/contact"
                  onClick={closeMenu}
                  className="px-2 py-1.5 text-xs font-medium text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4] rounded"
                >
                  Contact Team
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5E5E5] flex flex-col gap-2">
            <Link to="/signin" onClick={closeMenu} className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link to="/get-started" onClick={closeMenu} className="w-full">
              <Button variant="primary" size="sm" className="w-full">
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
