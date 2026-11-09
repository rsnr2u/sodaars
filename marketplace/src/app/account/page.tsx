'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound, 
  LogOut, 
  Calendar,
  Building,
  Phone,
  CheckCircle2,
  FileCheck2,
  Layers
} from 'lucide-react';
import { formatCurrencyINR } from '@/lib/utils';

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'campaigns'>(
    tabParam === 'security' ? 'security' : 'profile'
  );

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Rahul Sharma');
  const [userEmail, setUserEmail] = useState('rahul.sharma@brand.in');
  const [userPhone, setUserPhone] = useState('+91 98201 44521');
  const [companyName, setCompanyName] = useState('Apex Marketing Labs Pvt Ltd');
  const [gstin, setGstin] = useState('27AABCA1234F1Z8');

  // Change password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMessage, setPwdMessage] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (tabParam === 'security') {
      setActiveTab('security');
    }
  }, [tabParam]);

  useEffect(() => {
    const auth = localStorage.getItem('sodaars_auth');
    const user = localStorage.getItem('sodaars_user');
    if (auth === 'true') {
      setIsLoggedIn(true);
      if (user) {
        try {
          const parsed = JSON.parse(user);
          if (parsed.name) setUserName(parsed.name);
          if (parsed.email) setUserEmail(parsed.email);
        } catch {
          // ignore
        }
      }
    } else {
      // If not logged in, redirect to login page
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sodaars_auth');
    localStorage.removeItem('sodaars_user');
    window.dispatchEvent(new Event('sodaars_auth_change'));
    setIsLoggedIn(false);
    router.push('/login');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(
      'sodaars_user',
      JSON.stringify({ name: userName, email: userEmail })
    );
    window.dispatchEvent(new Event('sodaars_auth_change'));
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwdMessage('Passwords do not match. Please re-enter.');
      return;
    }
    setPwdMessage('Password successfully changed!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPwdMessage(''), 3000);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-[#B00020] flex items-center justify-center mb-4">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-semibold text-zinc-900">Sign In to View Your Account</h1>
        <p className="text-sm text-zinc-600 max-w-md mt-2 mb-6">
          You need an active session to view your profile, manage security settings, and track campaigns.
        </p>
        <Link
          href="/login"
          className="px-6 py-2.5 rounded-full bg-[#B00020] hover:bg-[#8f0019] text-white font-medium text-xs shadow-xs"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafc] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Account Header */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#B00020] border border-rose-100 flex items-center justify-center text-2xl font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">
                  {userName}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-medium border border-emerald-100 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Advertiser
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                {companyName} • {userEmail}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 hover:bg-rose-50 hover:text-rose-600 text-zinc-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-200 gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#B00020] text-[#B00020]'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'border-[#B00020] text-[#B00020]'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Change Password</span>
          </button>

          <button
            onClick={() => setActiveTab('campaigns')}
            className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'campaigns'
                ? 'border-[#B00020] text-[#B00020]'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Active Bookings</span>
          </button>
        </div>

        {/* TAB 1: MY PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">Personal & Company Information</h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Manage your primary contact and billing details for billboard campaign contracts.
              </p>
            </div>

            {profileSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile details successfully updated!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700">Work Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700">Company / Agency Name</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-zinc-700">GSTIN Number (for Tax Invoices)</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#B00020] hover:bg-[#8f0019] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: CHANGE PASSWORD */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">Change Password</h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Update your account password to maintain secure access to your media bookings.
              </p>
            </div>

            {pwdMessage && (
              <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                pwdMessage.includes('successfully')
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {pwdMessage.includes('successfully') ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                )}
                <span>{pwdMessage}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">Current Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">New Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">Confirm New Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#B00020] hover:bg-[#8f0019] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: ACTIVE BOOKINGS */}
        {activeTab === 'campaigns' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-2xs">
                <span className="text-[11px] uppercase font-semibold text-zinc-400 block">Active Bookings</span>
                <span className="text-xl font-semibold text-zinc-900 mt-1 block">2 Hoardings</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-2xs">
                <span className="text-[11px] uppercase font-semibold text-zinc-400 block">Total Escrow</span>
                <span className="text-xl font-semibold text-[#B00020] mt-1 block">₹3,55,000</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-2xs">
                <span className="text-[11px] uppercase font-semibold text-zinc-400 block">Photo Proof</span>
                <span className="text-xl font-semibold text-emerald-600 mt-1 block">Verified</span>
              </div>
            </div>

            {/* Campaign Item */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Live On Display
                  </span>
                </div>
                <span className="text-xs text-zinc-400 font-mono">BKG-98421</span>
              </div>

              <div>
                <h3 className="font-semibold text-zinc-900 text-sm">
                  SV Road Junction Billboard — Bandra West, Mumbai
                </h3>
                <p className="text-xs text-zinc-500 font-normal mt-0.5">
                  40 × 20 ft • 800 sq.ft • Front-lit • 1,45,000 daily impressions
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-zinc-100 text-zinc-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Flight: Nov 01 – Nov 30, 2026</span>
                </div>
                <Link
                  href="/track"
                  className="text-xs font-semibold text-[#B00020] hover:underline flex items-center gap-1"
                >
                  <span>View Photo Proof</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Account...</div>}>
      <AccountContent />
    </Suspense>
  );
}
