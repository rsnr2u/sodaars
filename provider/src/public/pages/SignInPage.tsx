import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  User,
  Sliders,
  Layers,
  Calendar,
  ArrowLeftRight,
  Building,
  ShieldCheck,
} from 'lucide-react';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/panel/dashboard');
    }, 400);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/panel/dashboard');
    }, 400);
  };

  const modules = [
    {
      icon: Layers,
      title: 'Advertising Resources',
      badge: 'PHYSICAL TIER',
      desc: 'Hoardings, Gantries, Unipoles, Bus Shelters',
    },
    {
      icon: Calendar,
      title: 'Availability Engine',
      badge: 'TEMPORAL CORE',
      desc: 'Real-time temporal slots, holds & scheduled maintenance',
    },
    {
      icon: ArrowLeftRight,
      title: 'Booking Pipeline',
      badge: 'COMMERCIAL ENGINE',
      desc: 'Direct agency contracts & verified marketplace requests',
    },
    {
      icon: Building,
      title: 'Customer CRM',
      badge: 'STAKEHOLDER LEDGER',
      desc: 'Verified agency records, rate cards & direct buyer terms',
    },
    {
      icon: ShieldCheck,
      title: 'Campaign Execution',
      badge: 'PROOF OF FLIGHT',
      desc: 'Mounting proofs, timestamped geo-photos & immutable audit logs',
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
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-xs font-semibold text-[#171717] hover:text-[#F97316] flex items-center gap-1 transition-colors"
            >
              Back to SODAARS <ArrowRight size={13} />
            </Link>
            <div className="w-8 h-8 rounded-full bg-[#854D0E] text-white flex items-center justify-center shadow-xs">
              <User size={15} />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Content Body */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sign In Card */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-[#E5E5E5] p-6 sm:p-8 shadow-xs">
            {/* Status dot */}
            <div className="inline-flex items-center gap-2 text-[11px] font-bold text-[#EA580C] uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-[#F97316]" />
              SODAARS PROVIDER PLATFORM
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
              Welcome back.
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#525252] leading-relaxed">
              Sign in to manage your outdoor advertising resources, availability, bookings, customers and campaigns.
            </p>

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Work Email */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#171717]">Work Email</label>
                  <span className="text-[10px] font-semibold text-[#737373] tracking-wider uppercase">
                    ENTERPRISE SINGLE SIGN-ON
                  </span>
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@enterprise-media.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5E5] bg-white text-sm text-[#171717] placeholder:text-[#A3A3A3] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] outline-none transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#171717]">Password</label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-lg border border-[#E5E5E5] bg-white text-sm text-[#171717] placeholder:text-[#A3A3A3] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#171717]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 text-[#525252] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#D4D4D4] text-[#F97316] focus:ring-[#F97316] w-3.5 h-3.5"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" className="text-[#EA580C] font-semibold hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? 'Signing in...' : 'Sign In →'}
              </button>

              {/* OR Divider */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E5E5E5]" />
                </div>
                <span className="relative bg-white px-3 text-[11px] font-medium text-[#737373] uppercase tracking-wider">
                  OR
                </span>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-lg border border-[#E5E5E5] hover:bg-[#FAFAF9] text-[#171717] font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Create account link */}
              <div className="text-center text-xs text-[#525252] pt-3">
                New to SODAARS?{' '}
                <Link to="/get-started" className="text-[#EA580C] font-semibold hover:underline">
                  Create an account →
                </Link>
              </div>
            </form>

            {/* Security footnote */}
            <div className="mt-6 pt-4 border-t border-[#F5F5F4] flex items-center justify-center gap-1.5 text-[11px] text-[#737373]">
              <Lock size={12} className="text-[#737373]" />
              <span>Sign in securely to your SODAARS account.</span>
            </div>
          </div>

          {/* Right Column: Connected Platform Showcase */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-[#E5E5E5] p-6 sm:p-8 shadow-xs relative">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#EA580C] text-[11px] font-semibold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-[#F97316]" />
              SODAARS PROVIDER PLATFORM
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight leading-tight">
              Your outdoor advertising operations, connected.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#525252] leading-relaxed max-w-xl">
              Manage advertising resources, availability, bookings, customers and campaign execution from one connected platform.
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
                      <p className="text-xs text-[#525252] mt-0.5 truncate">{m.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Status strip */}
            <div className="mt-6 p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
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

      {/* 3. Dedicated Footer */}
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

export default SignInPage;
