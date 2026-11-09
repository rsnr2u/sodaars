import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  Key,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Laptop,
  Clock,
  ArrowLeft,
  ChevronRight,
  RotateCcw,
  Info,
  Check,
  X,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface PasswordCriteria {
  label: string;
  met: boolean;
}

export const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();

  // Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(true);

  // Visibility Toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // 2FA modal state mock
  const [is2FaModalOpen, setIs2FaModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Password Strength Evaluation
  const criteria: PasswordCriteria[] = [
    { label: 'At least 8 characters long (12+ recommended)', met: newPassword.length >= 8 },
    { label: 'Contains uppercase letter (A-Z)', met: /[A-Z]/.test(newPassword) },
    { label: 'Contains lowercase letter (a-z)', met: /[a-z]/.test(newPassword) },
    { label: 'Contains numerical digit (0-9)', met: /[0-9]/.test(newPassword) },
    { label: 'Contains special symbol (!@#$%^&*...)', met: /[^A-Za-z0-9]/.test(newPassword) },
  ];

  const metCount = criteria.filter((c) => c.met).length;

  const getStrengthMeta = () => {
    if (newPassword.length === 0) {
      return { score: 0, label: 'Not entered', color: 'bg-slate-200', text: 'text-slate-400' };
    }
    if (metCount <= 2) {
      return { score: 25, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600' };
    }
    if (metCount === 3 || metCount === 4) {
      return { score: 65, label: 'Medium', color: 'bg-amber-500', text: 'text-amber-600' };
    }
    if (newPassword.length >= 12) {
      return { score: 100, label: 'Very Strong', color: 'bg-emerald-600', text: 'text-emerald-700' };
    }
    return { score: 85, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600' };
  };

  const strength = getStrengthMeta();
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isFormValid =
    currentPassword.trim().length > 0 &&
    metCount >= 3 &&
    passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!currentPassword) {
      setStatusMessage({ type: 'error', text: 'Please enter your current account password.' });
      return;
    }

    if (metCount < 3) {
      setStatusMessage({
        type: 'error',
        text: 'New password does not satisfy minimum enterprise complexity standards.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    if (currentPassword === newPassword) {
      setStatusMessage({
        type: 'error',
        text: 'New password must be different from your current password.',
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      try {
        localStorage.setItem(
          'sodaars_provider_last_pwd_change',
          new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        );
      } catch {}

      setStatusMessage({
        type: 'success',
        text: 'Your password has been changed successfully! Your account credentials have been updated.',
      });

      // Clear fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Master password updated. A confirmation receipt has been sent to admin@mdarts.in.');
    }, 700);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] min-h-[calc(100vh-4rem)]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A2435] text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-slide-up border border-slate-700">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#64748B]">
          <Link to="/panel/dashboard" className="hover:text-[#1A2435] transition-colors">
            Dashboard
          </Link>
          <ChevronRight size={13} />
          <Link to="/panel/settings" className="hover:text-[#1A2435] transition-colors">
            Settings &amp; Security
          </Link>
          <ChevronRight size={13} />
          <span className="font-semibold text-[#1A2435]">Change Password</span>
        </div>

        {/* Page Header */}
        <PageHeader
          eyebrow="Account Security"
          title="Change Password & Security"
          description="Manage your SODAARS master access credentials, rotate login passwords, and configure two-factor authentication."
          actions={
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Security Score: 92/100 (Strong)</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/panel/settings')}
                leftIcon={<ArrowLeft size={14} />}
                className="text-xs border-[#E2E8F0] text-[#1A2435] hover:bg-[#F1F5F9]"
              >
                Back to Settings
              </Button>
            </div>
          }
        />

        {/* Account Info Pill */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1A2435] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              MD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#1A2435]">MD ARTS Outdoor Media Network</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-50 text-[#E11D2E] border border-red-200">
                  Provider Account
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Primary Account Email: <strong className="text-[#1A2435]">admin@mdarts.in</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#64748B] shrink-0 border-t sm:border-t-0 sm:border-l border-[#E2E8F0] pt-2 sm:pt-0 sm:pl-4">
            <div>
              <span className="block text-[11px] text-[#94A3B8]">Last Password Rotation</span>
              <span className="font-semibold text-[#1A2435] flex items-center gap-1 mt-0.5">
                <Clock size={12} className="text-[#E11D2E]" />
                {localStorage.getItem('sodaars_provider_last_pwd_change') || '18 August 2026 (64 days ago)'}
              </span>
            </div>
          </div>
        </div>

        {/* Grid Layout: Main Form + Sidebar Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column (2 Cols): Change Password Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-white border border-[#E2E8F0] shadow-xs">
              <div className="pb-4 border-b border-[#E2E8F0] mb-5">
                <h3 className="text-sm font-bold text-[#1A2435] flex items-center gap-2">
                  <Key size={16} className="text-[#E11D2E]" />
                  <span>Update Account Password</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  Enter your existing password followed by your new password. Passwords must meet SODAARS enterprise criteria to protect your network inventory and financial billing ledgers.
                </p>
              </div>

              {/* Status Alert */}
              {statusMessage && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-medium flex items-start gap-2.5 mb-5 ${
                    statusMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {statusMessage.type === 'success' ? (
                    <CheckCircle2 size={16} className="shrink-0 text-emerald-600 mt-0.5" />
                  ) : (
                    <AlertCircle size={16} className="shrink-0 text-[#E11D2E] mt-0.5" />
                  )}
                  <div className="leading-relaxed">{statusMessage.text}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* 1. CURRENT PASSWORD */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#1A2435]">
                      Current Password <span className="text-[#E11D2E]">*</span>
                    </label>
                    <Link
                      to="/signin"
                      className="text-[11px] font-semibold text-[#E11D2E] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      required
                      className="w-full h-10 pl-3.5 pr-10 rounded-lg bg-white border border-[#E2E8F0] text-sm text-[#1A2435] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#E11D2E] focus:ring-1 focus:ring-[#E11D2E] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1A2435] transition-colors"
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* 2. NEW PASSWORD */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A2435]">
                    New Password <span className="text-[#E11D2E]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Create a strong new password"
                      required
                      className="w-full h-10 pl-3.5 pr-10 rounded-lg bg-white border border-[#E2E8F0] text-sm text-[#1A2435] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#E11D2E] focus:ring-1 focus:ring-[#E11D2E] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1A2435] transition-colors"
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {newPassword.length > 0 && (
                    <div className="pt-2 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#64748B] text-[11px]">Password Strength:</span>
                        <span className={`font-bold text-[11px] ${strength.text}`}>
                          {strength.label} ({strength.score}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full ${strength.color} transition-all duration-300 rounded-full`}
                          style={{ width: `${strength.score}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. CONFIRM PASSWORD */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A2435]">
                    Confirm New Password <span className="text-[#E11D2E]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type your new password"
                      required
                      className={`w-full h-10 pl-3.5 pr-10 rounded-lg bg-white border text-sm text-[#1A2435] placeholder:text-[#94A3B8] focus:outline-none transition-colors ${
                        confirmPassword.length > 0
                          ? passwordsMatch
                            ? 'border-emerald-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                            : 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                          : 'border-[#E2E8F0] focus:border-[#E11D2E] focus:ring-1 focus:ring-[#E11D2E]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1A2435] transition-colors"
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {confirmPassword.length > 0 && (
                    <div className="pt-1">
                      {passwordsMatch ? (
                        <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 size={13} /> Passwords match
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                          <X size={13} /> Passwords do not match
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* 4. SECURITY CHECKLIST */}
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <span className="text-xs font-bold text-[#1A2435] block">
                    Enterprise Password Requirements:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {criteria.map((c, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-1.5 transition-colors ${
                          c.met ? 'text-emerald-700 font-semibold' : 'text-[#64748B]'
                        }`}
                      >
                        {c.met ? (
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                        )}
                        <span className="text-[11px]">{c.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. SESSION REVOCATION CHECKBOX */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
                  <input
                    type="checkbox"
                    id="revokeSessions"
                    checked={revokeOtherSessions}
                    onChange={(e) => setRevokeOtherSessions(e.target.checked)}
                    className="mt-0.5 rounded text-[#E11D2E] focus:ring-[#E11D2E]"
                  />
                  <label htmlFor="revokeSessions" className="text-xs text-[#1A2435] cursor-pointer">
                    <span className="font-bold block">Sign out of all other devices &amp; sessions</span>
                    <span className="text-[11px] text-[#64748B] block mt-0.5">
                      Recommended when rotating passwords to ensure unauthorized browser sessions and cached tokens are immediately revoked.
                    </span>
                  </label>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center gap-3 pt-3 border-t border-[#E2E8F0]">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={isSubmitting || !isFormValid}
                    leftIcon={<Lock size={15} />}
                    className="bg-[#E11D2E] hover:bg-[#C51323] text-white font-bold text-xs px-5 shadow-xs"
                  >
                    {isSubmitting ? 'Updating Password...' : 'Save New Password'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={() => {
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setStatusMessage(null);
                    }}
                    leftIcon={<RotateCcw size={13} />}
                    className="text-xs text-[#64748B] hover:text-[#1A2435]"
                  >
                    Reset Form
                  </Button>
                </div>
              </form>
            </Card>

            {/* Active Device Sessions Review */}
            <Card className="p-6 bg-white border border-[#E2E8F0] shadow-xs">
              <div className="flex items-start justify-between pb-4 border-b border-[#E2E8F0] mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1A2435] flex items-center gap-2">
                    <Laptop size={16} className="text-[#E11D2E]" />
                    <span>Active Authenticated Sessions</span>
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Authorized browser and mobile devices currently logged into this provider account.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('All remote device sessions terminated successfully.')}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                >
                  Log out of other sessions
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#1A2435] flex items-center gap-2">
                      <span>Chrome 122 on Windows 11</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        THIS DEVICE
                      </span>
                    </div>
                    <div className="text-[11px] text-[#64748B]">
                      Mumbai, Maharashtra, India • <span className="font-mono">203.192.241.10</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 shrink-0">Active Now</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#1A2435] flex items-center gap-2">
                      <span>SODAARS Rigger Mobile App (Android 14)</span>
                    </div>
                    <div className="text-[11px] text-[#64748B]">
                      Turbhe Operations Yard, Navi Mumbai • <span className="font-mono">115.112.44.82</span>
                    </div>
                  </div>
                  <span className="text-xs text-[#64748B] shrink-0">2 hours ago</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column (1 Col): 2FA + Password Policy Tips */}
          <div className="space-y-6">
            {/* 2FA Card */}
            <Card className="p-5 bg-white border border-[#E2E8F0] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <h4 className="text-xs font-bold text-[#1A2435] flex items-center gap-2">
                  <Smartphone size={15} className="text-[#E11D2E]" />
                  <span>Two-Factor Authentication</span>
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ENABLED
                </span>
              </div>

              <p className="text-xs text-[#64748B] leading-relaxed">
                Your account is protected by an Authenticator App (Google Authenticator, Microsoft Authenticator, or 1Password).
              </p>

              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#64748B] block">
                  Configured Method
                </span>
                <span className="text-xs font-bold text-[#1A2435] block">
                  TOTP 6-Digit Verification
                </span>
                <span className="text-[11px] text-[#64748B] block">
                  Requested on every new browser login
                </span>
              </div>

              <div className="pt-1 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIs2FaModalOpen(true)}
                  className="w-full text-xs border-[#E2E8F0] text-[#1A2435] hover:bg-[#F1F5F9] justify-center"
                >
                  View 2FA Backup Codes
                </Button>
                <Link
                  to="/panel/settings?tab=security"
                  className="text-center text-xs font-semibold text-[#E11D2E] hover:underline"
                >
                  Configure 2FA Settings →
                </Link>
              </div>
            </Card>

            {/* Password Policy & Best Practices */}
            <Card className="p-5 bg-white border border-[#E2E8F0] shadow-xs space-y-3.5">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
                <ShieldCheck size={16} className="text-emerald-600" />
                <h4 className="text-xs font-bold text-[#1A2435]">Security Policy Guidelines</h4>
              </div>

              <ul className="space-y-2.5 text-xs text-[#64748B] leading-relaxed">
                <li className="flex items-start gap-2">
                  <Check size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>90-Day Rotation:</strong> Outdoor media network owners should rotate credentials quarterly to protect rate cards and client contracts.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>No Credential Sharing:</strong> Do not share master credentials with field rigger crews. Use <Link to="/panel/organization/team" className="text-[#E11D2E] font-semibold hover:underline">Team Management</Link> to invite mounting personnel.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Unique Password:</strong> Do not reuse passwords used on other public OOH portals or personal email accounts.
                  </span>
                </li>
              </ul>
            </Card>

            {/* Quick Links */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-[#1A2435] flex items-center gap-1.5">
                <Info size={14} className="text-[#64748B]" /> Need help with access?
              </span>
              <p className="text-[#64748B] text-[11px] leading-relaxed">
                If you suspect unauthorized access or require emergency account lock, contact the SODAARS Security Desk at <strong>security@sodaars.com</strong> or call <strong>+91 22 4972 8800</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2FA Backup Codes Modal */}
      {is2FaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-[#E2E8F0] shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600" />
                <h3 className="text-sm font-bold text-[#1A2435]">Emergency 2FA Backup Codes</h3>
              </div>
              <button
                onClick={() => setIs2FaModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed">
              If you ever lose access to your authenticator device, each one of these one-time codes can be used once to access your account:
            </p>

            <div className="grid grid-cols-2 gap-2 bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0] font-mono text-xs text-[#1A2435] text-center">
              <span className="p-1.5 bg-white rounded border border-slate-200">8941-2305</span>
              <span className="p-1.5 bg-white rounded border border-slate-200">5512-8874</span>
              <span className="p-1.5 bg-white rounded border border-slate-200">7701-4419</span>
              <span className="p-1.5 bg-white rounded border border-slate-200">3390-1126</span>
              <span className="p-1.5 bg-white rounded border border-slate-200">6248-9031</span>
              <span className="p-1.5 bg-white rounded border border-slate-200">1482-7760</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText('8941-2305\n5512-8874\n7701-4419\n3390-1126\n6248-9031\n1482-7760');
                  showToast('Backup codes copied to clipboard.');
                }}
                className="text-xs"
              >
                Copy Codes
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIs2FaModalOpen(false)}
                className="text-xs bg-[#E11D2E] text-white hover:bg-[#C51323]"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePasswordPage;
