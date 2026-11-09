'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const performLogin = (userEmail: string, userName: string) => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('sodaars_auth', 'true');
      localStorage.setItem(
        'sodaars_user',
        JSON.stringify({
          name: userName,
          email: userEmail,
          role: 'Media Buyer / Brand Advertiser',
        })
      );
      window.dispatchEvent(new Event('sodaars_auth_change'));
      router.push('/account');
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(email || 'rahul.sharma@brand.in', 'Rahul Sharma');
  };

  return (
    <div className="min-h-[85vh] bg-[#fafafc] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center font-sans">
      <div className="max-w-md mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-semibold text-[#B00020] tracking-wider">
            ADVERTISER & AGENCY PORTAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight">
            Sign In to Book Hoardings
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-sm mx-auto">
            Access your billboard bookings, proof-of-posting reports, and campaign invoices.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-xs space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Email or Mobile Number</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com or 10-digit number"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-zinc-700">Password</label>
                <a href="#" className="text-zinc-500 hover:text-[#B00020] transition-colors">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50"
                />
              </div>
            </div>

            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-full bg-[#B00020] hover:bg-[#8f0019] text-white font-medium text-xs transition-all shadow-xs cursor-pointer active:scale-98 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Instant 1-Click Demo Login */}
              <button
                type="button"
                onClick={() => performLogin('rahul.sharma@brand.in', 'Rahul Sharma')}
                className="w-full py-2.5 px-4 rounded-full border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-medium text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant Demo Login (Rahul Sharma)</span>
              </button>
            </div>
          </form>

          {/* Switch to Register */}
          <div className="pt-4 border-t border-zinc-100 text-center text-xs text-zinc-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-[#B00020] hover:underline">
              Register now
            </Link>
          </div>
        </div>

        {/* Security Trust Note */}
        <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-bit SSL encrypted. Verified Partner protection.</span>
        </div>

      </div>
    </div>
  );
}

