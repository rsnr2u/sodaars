import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  Eye,
  EyeOff,
  Info,
  Sliders,
  Layers,
  Calendar,
  ArrowLeftRight,
  Building,
  ShieldCheck,
} from 'lucide-react';

export const GetStartedPage: React.FC = () => {
  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the SODAARS Terms and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/panel/dashboard');
    }, 500);
  };

  const modules = [
    {
      icon: Layers,
      title: 'Advertising Resources',
      badge: 'PHYSICAL TIER',
      desc: 'Hoardings, Gantries, Unipoles, Bus Shelters, Digital Displays & Billboard Networks.',
    },
    {
      icon: Calendar,
      title: 'Availability Engine',
      badge: 'TEMPORAL CORE',
      desc: 'Real-time temporal slots, booking holds, dark screens & scheduled site maintenance calendar.',
    },
    {
      icon: ArrowLeftRight,
      title: 'Booking Pipeline',
      badge: 'COMMERCIAL ENGINE',
      desc: 'Direct agency contracts, purchase orders, slot reservations & verified inbound proposals.',
    },
    {
      icon: Building,
      title: 'Customer CRM',
      badge: 'STAKEHOLDER LEDGER',
      desc: 'Enterprise agency directories, bespoke rate cards, contact registries & buyer credit terms.',
    },
    {
      icon: ShieldCheck,
      title: 'Campaign Execution',
      badge: 'PROOF OF FLIGHT',
      desc: 'Mounting verification, timestamped geo-photos, illumination logs & compliance certs.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F4] text-[#171717]">
      {/* 1. Dedicated Header */}
      <header className="w-full bg-white border-b border-[#E5E5E5] px-4 sm:px-6 lg:px-8 py-3.5 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/sodaars-logo.png"
              alt="SODAARS"
              className="h-7 w-auto object-contain transition-transform group-hover:opacity-90"
            />
          </Link>

          {/* Right Header Navigation */}
          <div className="text-xs text-[#525252]">
            Already have an account?{' '}
            <Link
              to="/signin"
              className="text-[#EA580C] font-semibold hover:underline inline-flex items-center gap-1"
            >
              Sign In →
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Sub-header status bar */}
      <div className="w-full bg-[#FAFAF9] border-b border-[#E5E5E5] px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs">
          <div className="font-mono text-[11px] font-bold tracking-wider text-[#525252]">
            SODAARS INFRASTRUCTURE &nbsp;/&nbsp; PROVIDER REGISTRATION
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[#EA580C] font-mono text-[10px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
            GATEWAY: AP-SOUTH-1 ACTIVE
          </div>
        </div>
      </div>

      {/* 3. Main Content Body */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Registration Card */}
          <div className="lg:col-span-5">
            {/* Status dot */}
            <div className="inline-flex items-center gap-2 text-[11px] font-bold text-[#EA580C] uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-[#F97316]" />
              GET STARTED
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight leading-tight">
              Start managing your outdoor advertising with SODAARS.
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#525252] leading-relaxed">
              Create your provider account and begin setting up your advertising resources, availability, bookings, customers and campaign operations.
            </p>

            {/* Registration Form Box */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 sm:p-8 shadow-xs mt-6">
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                    Full Name <span className="text-[#EA580C]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Vikram Malhotra"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5E5] bg-white text-sm text-[#171717] placeholder:text-[#A3A3A3] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] outline-none transition-all"
                  />
                </div>

                {/* Work Email */}
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                    Work Email <span className="text-[#EA580C]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@enterprise-media.com"
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5E5] bg-white text-sm text-[#171717] placeholder:text-[#A3A3A3] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] outline-none transition-all"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                    Company Name <span className="text-[#EA580C]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Apex Media Networks"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5E5] bg-white text-sm text-[#171717] placeholder:text-[#A3A3A3] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] outline-none transition-all"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5E5] bg-white text-sm text-[#171717] placeholder:text-[#A3A3A3] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] outline-none transition-all"
                  />
                </div>

                {/* Passwords grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                      Password <span className="text-[#EA580C]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-3 pr-8 py-2.5 rounded-lg border border-[#E5E5E5] bg-white text-xs sm:text-sm text-[#171717] placeholder:text-[#A3A3A3] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#171717]"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                      Confirm Password <span className="text-[#EA580C]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-3 pr-8 py-2.5 rounded-lg border border-[#E5E5E5] bg-white text-xs sm:text-sm text-[#171717] placeholder:text-[#A3A3A3] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#171717]"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms agreement checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2 text-xs text-[#525252] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="rounded border-[#D4D4D4] text-[#F97316] focus:ring-[#F97316] w-3.5 h-3.5 mt-0.5"
                    />
                    <span>
                      I agree to the SODAARS{' '}
                      <a href="#terms" className="text-[#EA580C] hover:underline">
                        Terms
                      </a>{' '}
                      and{' '}
                      <a href="#privacy" className="text-[#EA580C] hover:underline">
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                </div>

                {/* Create Account CTA */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-4 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isLoading ? 'Creating Provider Account...' : 'Create Provider Account →'}
                </button>

                {/* Sign In link */}
                <div className="text-center text-xs text-[#525252] pt-2">
                  Already have an account?{' '}
                  <Link to="/signin" className="text-[#EA580C] font-semibold hover:underline">
                    Sign In →
                  </Link>
                </div>
              </form>
            </div>

            {/* Info callout notes below card */}
            <div className="mt-4 p-4 rounded-xl bg-white border border-[#E5E5E5] space-y-2 text-xs text-[#525252] shadow-2xs">
              <div className="flex items-start gap-2.5">
                <Info size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                <span>
                  After creating your account, you can continue with provider setup and organization configuration.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Lock size={14} className="text-[#737373] shrink-0 mt-0.5" />
                <span>
                  Your account information is encrypted and strictly used to create and manage your SODAARS provider account.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Connected Platform Showcase */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-[#E5E5E5] p-6 sm:p-8 shadow-xs relative">
            {/* Top row */}
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold text-[#EA580C] uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#F97316]" />
                SODAARS PROVIDER PLATFORM
              </div>
              <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-[#F5F5F4] text-[#737373] border border-[#E5E5E5]">
                INFRASTRUCTURE V4.8
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight leading-tight">
              Your resources. Your operations. One connected platform.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#525252] leading-relaxed max-w-xl">
              SODAARS brings advertising resource management, availability, bookings, customers and campaign execution into one connected provider platform.
            </p>

            {/* 5 Milestone Flow Cards */}
            <div className="relative mt-6 space-y-3">
              {/* Connecting vertical line */}
              <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-[#F97316]" />

              {modules.map((m, i) => {
                const Icon = m.icon;
                return (
                  <div
                    key={i}
                    className="relative flex items-center gap-3.5 p-3.5 rounded-lg border border-[#E5E5E5] bg-white hover:border-orange-300 transition-colors shadow-2xs"
                  >
                    {/* Step Icon Badge */}
                    <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 text-[#F97316] flex items-center justify-center shrink-0 z-10">
                      <Icon size={17} />
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm text-[#171717] truncate">{m.title}</span>
                        <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-[#F5F5F4] text-[#525252] border border-[#E5E5E5] shrink-0">
                          {m.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#525252] mt-0.5 leading-snug">{m.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Highlight note box */}
            <div className="mt-5 p-3 rounded-lg bg-orange-50/70 border border-orange-200 text-xs text-[#9A3412] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] shrink-0" />
              <span>Marketplace participation is managed separately for eligible advertising resources.</span>
            </div>

            {/* Bottom Status strip */}
            <div className="mt-5 p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
              <div className="text-[11px] font-bold text-[#171717] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F97316]" />
                PROVIDER SAAS • MARKETPLACE • CONNECTED OPERATIONS
              </div>
              <div className="text-[11px] text-[#737373] font-mono flex items-center gap-1.5">
                <Sliders size={13} className="text-[#737373]" />
                System v4.8 Active
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 4. Dedicated Footer */}
      <footer className="w-full bg-[#F5F5F4] border-t border-[#E5E5E5] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-[#737373] gap-4">
          <div className="text-center md:text-left">
            <p>
              SODAARS • Outdoor advertising infrastructure for connected resource management, marketplace discovery and operations.
            </p>
            <p className="mt-0.5">© 2026 SODAARS. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-[#171717] transition-colors">
              Privacy
            </a>
            <span>•</span>
            <a href="#terms" className="hover:text-[#171717] transition-colors">
              Terms
            </a>
            <span>•</span>
            <Link to="/company/contact" className="hover:text-[#171717] transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GetStartedPage;
