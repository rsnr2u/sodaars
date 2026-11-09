'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Building2, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Sparkles,
  Phone,
  Mail,
  User
} from 'lucide-react';
import { POPULAR_CITIES } from '@/data/mockMarketplaceData';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('sodaars_auth', 'true');
      localStorage.setItem(
        'sodaars_user',
        JSON.stringify({
          name: name || 'Rahul Sharma',
          email: email || 'rahul.sharma@brand.in',
          company: company || 'Brand Advertisers',
        })
      );
      window.dispatchEvent(new Event('sodaars_auth_change'));
      router.push('/account');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#fafafc] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center font-sans">
      <div className="max-w-xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-semibold text-[#B00020] tracking-wider">
            ADVERTISER & AGENCY PORTAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto">
            Book verified billboards and DOOH across 50+ metro cities with direct concessionaire rates and 100% escrow protection.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Type Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase font-semibold text-zinc-500 tracking-wider block">
                I am registering as:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'brand', label: 'Brand / Direct' },
                  { id: 'agency', label: 'Media Agency' },
                  { id: 'business', label: 'Local Business' },
                ].map((t, idx) => (
                  <label
                    key={t.id}
                    className="flex items-center justify-center p-2.5 rounded-xl border border-zinc-200 hover:border-zinc-300 text-xs font-medium text-zinc-800 cursor-pointer has-checked:border-[#B00020] has-checked:bg-rose-50/60 has-checked:text-[#B00020] transition-colors text-center"
                  >
                    <input
                      type="radio"
                      name="accountType"
                      value={t.id}
                      defaultChecked={idx === 0}
                      className="sr-only"
                    />
                    <span>{t.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Full Name & Company Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700">Company / Agency Name</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Apex Marketing Labs"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50"
                  />
                </div>
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahul@company.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700">Mobile Number</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-semibold text-zinc-500">+91</span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98201 44521"
                    className="w-full pl-11 pr-3 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50"
                  />
                </div>
              </div>
            </div>

            {/* Target Metro & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700">Primary Metro Market</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50 cursor-pointer"
                  >
                    {POPULAR_CITIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                    <option value="Pan-India">Pan-India Multi-City</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50"
                  />
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-full bg-[#B00020] hover:bg-[#8f0019] text-white font-medium text-xs transition-all shadow-xs cursor-pointer active:scale-98 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Creating Account...' : 'Create Advertiser Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-zinc-100 grid grid-cols-3 gap-2 text-center text-[11px] text-zinc-500">
            <div className="space-y-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto" />
              <span className="block font-medium text-zinc-700">100% Escrow</span>
              <span>Funds safe</span>
            </div>
            <div className="space-y-0.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mx-auto" />
              <span className="block font-medium text-zinc-700">Direct Rates</span>
              <span>No broker markup</span>
            </div>
            <div className="space-y-0.5">
              <Sparkles className="w-4 h-4 text-purple-600 mx-auto" />
              <span className="block font-medium text-zinc-700">Photo Proof</span>
              <span>Day & Night shots</span>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-zinc-500">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-[#B00020] hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
