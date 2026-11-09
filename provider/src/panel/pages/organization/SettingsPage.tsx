import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import {
  Building2,
  Sliders,
  Receipt,
  Users,
  ShoppingBag,
  Bell,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  Camera,
  Mail,
  Phone,
  Globe,
  MapPin,
  ShieldCheck,
  FileText,
  MessageSquare,
  Smartphone,
  ChevronRight,
  Landmark,
  CreditCard,
  Lock,
  Key,
  Upload,
  Stamp,
  Download,
  Copy,
  Check,
  Trash2,
  HardDrive,
  Activity,
  Layers,
  Laptop,
  Tag,
  Wrench,
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import {
  SettingsTabId,
  ProviderSystemSettings,
  DEFAULT_SYSTEM_SETTINGS,
} from '../../types/settings';

const STORAGE_KEY = 'sodaars_provider_settings_hub';
const LEGACY_STORAGE_KEY = 'sodaars_provider_operational_settings';

const VALID_TABS: SettingsTabId[] = [
  'general',
  'operations',
  'finance',
  'subscription',
  'team',
  'marketplace',
  'security',
  'notifications',
];

interface SessionItem {
  id: string;
  device: string;
  location: string;
  ip: string;
  current: boolean;
  lastActive: string;
}

const DEFAULT_SESSIONS: SessionItem[] = [
  {
    id: 'sess-1',
    device: 'Chrome 122 on Windows 11',
    location: 'Mumbai, Maharashtra, India',
    ip: '203.192.241.10',
    current: true,
    lastActive: 'Active Now',
  },
  {
    id: 'sess-2',
    device: 'SODAARS Rigger Mobile App (Android 14)',
    location: 'Turbhe Operations Yard, Navi Mumbai',
    ip: '115.112.44.82',
    current: false,
    lastActive: '2 hours ago',
  },
  {
    id: 'sess-3',
    device: 'Safari on macOS Sonoma',
    location: 'Lower Parel Executive Office, Mumbai',
    ip: '103.87.12.94',
    current: false,
    lastActive: 'Yesterday at 6:40 PM',
  },
];

const PLATFORM_INVOICES = [
  {
    id: 'INV-2026-SOD-0418',
    date: '01 Apr 2026',
    description: 'SODAARS SaaS Annual Plan (Tier 2 - 100 Assets Quota)',
    amount: '₹1,44,000',
    gst: '₹25,920 (18% IGST)',
    total: '₹1,69,920',
    status: 'Paid',
    period: '01 Apr 2026 - 31 Mar 2027',
  },
  {
    id: 'INV-2025-SOD-0391',
    date: '01 Apr 2025',
    description: 'SODAARS SaaS Annual Plan (Tier 1 - 50 Assets Quota)',
    amount: '₹84,000',
    gst: '₹15,120 (18% IGST)',
    total: '₹99,120',
    status: 'Paid',
    period: '01 Apr 2025 - 31 Mar 2026',
  },
  {
    id: 'INV-2024-SOD-0182',
    date: '01 Apr 2024',
    description: 'SODAARS SaaS Initial Platform Onboarding & Setup',
    amount: '₹35,000',
    gst: '₹6,300 (18% IGST)',
    total: '₹41,300',
    status: 'Paid',
    period: 'Setup & Configuration',
  },
];

export const SettingsPage: React.FC = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab State: sync with URL query param ?tab=
  const currentTabParam = searchParams.get('tab') as SettingsTabId;
  const [activeTab, setActiveTab] = useState<SettingsTabId>(
    VALID_TABS.includes(currentTabParam) ? currentTabParam : 'general'
  );

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as SettingsTabId;
    if (tabFromUrl && VALID_TABS.includes(tabFromUrl) && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleSelectTab = (tabId: SettingsTabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  // Load settings from storage
  const [settings, setSettings] = useState<ProviderSystemSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SYSTEM_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // fallback to defaults
    }
    return DEFAULT_SYSTEM_SETTINGS;
  });

  const [initialSettings, setInitialSettings] = useState<ProviderSystemSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Security & Sub-feature state
  const [copiedKey, setCopiedKey] = useState(false);
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionItem[]>(DEFAULT_SESSIONS);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordMessage, setPasswordMessage] = useState<{ text: string; success: boolean } | null>(null);

  const isDirty = JSON.stringify(settings) !== JSON.stringify(initialSettings);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdate = <K extends keyof ProviderSystemSettings>(
    field: K,
    value: ProviderSystemSettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(settings));
        setInitialSettings(settings);
        showToast('Settings & enterprise policies saved successfully.');
      } catch {
        showToast('Failed to save settings. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }, 400);
  };

  const handleResetDefaults = () => {
    setSettings(DEFAULT_SYSTEM_SETTINGS);
    showToast('Reset to system factory defaults. Click Save to apply.');
  };

  const handleDiscard = () => {
    setSettings(initialSettings);
    showToast('Changes discarded. Restored saved configuration.');
  };

  const handleCopyApiKey = () => {
    navigator.clipboard?.writeText(settings.apiKeyMasked || 'sk_live_9a8f4c28109e3e21');
    setCopiedKey(true);
    showToast('API Key copied to clipboard.');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleTestWebhook = () => {
    setPingStatus('Sending test payload...');
    setTimeout(() => {
      setPingStatus('HTTP 200 OK — Ping delivered successfully to webhook endpoint.');
      showToast('Webhook test payload acknowledged with status 200 OK.');
      setTimeout(() => setPingStatus(null), 4000);
    }, 600);
  };

  const handleTerminateOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.current));
    showToast('All other remote device sessions have been revoked.');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      setPasswordMessage({ text: 'Please enter your current password.', success: false });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordMessage({ text: 'New password must be at least 8 characters long.', success: false });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ text: 'New passwords do not match.', success: false });
      return;
    }
    setPasswordMessage({ text: 'Password successfully updated!', success: true });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showToast('Master security credentials updated successfully.');
  };

  // 8 Vertical Menu Sections
  const tabs = [
    {
      id: 'general' as SettingsTabId,
      label: 'General & Profile',
      shortLabel: 'General',
      icon: Building2,
      description: 'Corporate logo, legal entity, signatory & yard address',
    },
    {
      id: 'operations' as SettingsTabId,
      label: 'Operations & Mounting',
      shortLabel: 'Operations',
      icon: Sliders,
      description: 'Hold limits, lead times & POP proof policies',
    },
    {
      id: 'finance' as SettingsTabId,
      label: 'Invoicing, GST & Bank',
      shortLabel: 'Finance & GST',
      icon: Receipt,
      description: 'GSTIN, SAC 998361, TAN, stamp, signature & terms',
    },
    {
      id: 'subscription' as SettingsTabId,
      label: 'Subscription & Quota',
      shortLabel: 'Subscription',
      icon: CreditCard,
      description: 'Tier 2 plan, 84/100 assets meter & platform invoices',
    },
    {
      id: 'team' as SettingsTabId,
      label: 'Team & Permissions',
      shortLabel: 'Team',
      icon: Users,
      description: 'Role-based access, MFA & staff policies',
    },
    {
      id: 'marketplace' as SettingsTabId,
      label: 'Marketplace & Commercial',
      shortLabel: 'Marketplace',
      icon: ShoppingBag,
      description: 'Discovery toggles, discount caps & agency rebates',
    },
    {
      id: 'security' as SettingsTabId,
      label: 'Security & Authentication',
      shortLabel: 'Security',
      icon: Lock,
      description: 'Password change, 2FA app, active sessions & API keys',
    },
    {
      id: 'notifications' as SettingsTabId,
      label: 'Alerts & Notifications',
      shortLabel: 'Alerts',
      icon: Bell,
      description: 'WhatsApp dispatch, SMS alerts & email digests',
    },
  ];

  const content = (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg bg-[#171717] text-white text-xs font-medium shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 border border-stone-800">
          <CheckCircle2 size={16} className="text-[#EA580C]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Primary Actions Card */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded flex items-center gap-1">
              <Sliders size={11} /> Provider Settings Center
            </span>
            <span className="text-[11px] text-[#737373] hidden sm:inline">•</span>
            <span className="text-[11px] text-[#737373] font-medium hidden sm:inline">
              MD ARTS
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight mt-1">
            Settings &amp; System Policies
          </h1>
          <p className="text-xs text-[#525252] mt-0.5">
            Manage organization branding, statutory tax compliance, digital stamp &amp; signature, subscription quota, and security credentials.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {isDirty ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDiscard}
              leftIcon={<RotateCcw size={14} />}
              disabled={isSaving}
            >
              Discard Changes
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResetDefaults}
              leftIcon={<RotateCcw size={14} />}
              disabled={isSaving}
            >
              Reset Defaults
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save size={14} />}
          >
            Save Settings
          </Button>
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      {isDirty && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3.5 flex items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <span>
              You have <strong>unsaved modifications</strong> in your settings. Remember to save to ensure operational and billing consistency.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDiscard}
              className="px-2.5 py-1 text-xs text-amber-800 hover:text-amber-950 font-semibold"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 py-1 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-md shadow-2xs"
            >
              Save Now
            </button>
          </div>
        </div>
      )}

      {/* Two-Column Vertical Menu System */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* LEFT COLUMN: Vertical Settings Navigation Menu */}
        <aside className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-20 space-y-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-2.5 shadow-xs">
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#E2E8F0] mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] font-mono">
                Settings Navigation
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#E11D2E] border border-red-200">
                {tabs.length} Sections
              </span>
            </div>

            <nav className="space-y-1" aria-label="Settings Vertical Menu">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectTab(tab.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all group ${
                      isActive
                        ? 'bg-red-50/80 border-l-3 border-[#E11D2E] text-[#1A2435] shadow-2xs font-bold'
                        : 'text-[#1A2435] font-semibold hover:bg-[#F4F6F8] border-l-3 border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                          isActive
                            ? 'bg-[#E11D2E] text-white shadow-2xs'
                            : 'bg-[#F4F6F8] text-[#64748B] group-hover:bg-[#E2E8F0] group-hover:text-[#1A2435]'
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className={`text-xs leading-tight truncate ${
                            isActive ? 'font-bold text-[#1A2435]' : 'font-semibold text-[#1A2435]'
                          }`}
                        >
                          {tab.label}
                        </div>
                        <div className="text-[11px] text-[#64748B] mt-0.5 leading-snug line-clamp-1">
                          {tab.description}
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      size={14}
                      className={`shrink-0 ml-2 transition-transform ${
                        isActive
                          ? 'text-[#E11D2E] translate-x-0.5'
                          : 'text-[#94A3B8] group-hover:text-[#1A2435]'
                      }`}
                    />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Context & Configuration Status Card */}
          <div className="bg-[#171717] text-white rounded-xl p-4 shadow-sm border border-stone-800 space-y-3 hidden lg:block">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-orange-400">
                ACTIVE TENANT
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-950/80 text-orange-300 border border-orange-800/80 font-bold">
                Tier 2 • {settings.assetQuotaUsed}/{settings.assetQuotaLimit} Assets
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-white truncate">{settings.legalEntityName}</div>
              <div className="text-[11px] text-stone-400 font-mono mt-0.5">SAC: {settings.hsnSacCode}</div>
            </div>
            <div className="pt-2.5 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
              <span>Active Scope:</span>
              <span className="text-white font-medium capitalize">
                {tabs.find((t) => t.id === activeTab)?.shortLabel || activeTab}
              </span>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Active Section Workspace */}
        <div className="flex-1 min-w-0 w-full space-y-6">

          {/* ========================================================================= */}
          {/* 1. GENERAL & PROFILE TAB */}
          {/* ========================================================================= */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Card 1: Visual Identity & Brand Logo */}
              <Card className="p-6">
                <div className="pb-4 border-b border-[#E5E5E5] mb-5">
                  <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                    <Building2 size={16} className="text-[#EA580C]" />
                    Company Branding &amp; Visual Assets
                  </h3>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Your logo appears on client proposals, PDF estimation sheets, invoice headers, and marketplace listings.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Logo Upload & Preview */}
                  <div className="p-4 rounded-xl border border-[#E5E5E5] bg-[#FAFAF9] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#171717]">Official Company Logo</label>
                      <span className="text-[10px] text-[#737373] font-mono">Recommended: 400×120px</span>
                    </div>

                    <div className="h-28 rounded-lg border-2 border-dashed border-[#D4D4D4] bg-white flex flex-col items-center justify-center p-3 text-center transition-colors hover:border-[#EA580C]">
                      {settings.companyLogoUrl ? (
                        <div className="relative group w-full h-full flex items-center justify-center">
                          <img
                            src={settings.companyLogoUrl}
                            alt="Company Logo Preview"
                            className="max-h-20 max-w-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => handleUpdate('companyLogoUrl', '')}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md text-xs shadow-xs hover:bg-red-700"
                            title="Remove Logo"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="w-10 h-10 mx-auto rounded-full bg-orange-50 text-[#EA580C] flex items-center justify-center">
                            <Upload size={18} />
                          </div>
                          <div className="text-xs font-semibold text-[#171717]">
                            Click to upload or drag logo file
                          </div>
                          <div className="text-[10px] text-[#737373]">PNG, SVG, or high-res JPG (Max 2MB)</div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        label="Or Paste Logo Image URL"
                        placeholder="https://.../logo.png"
                        value={settings.companyLogoUrl}
                        onChange={(e) => handleUpdate('companyLogoUrl', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Document Header Letterhead Preview */}
                  <div className="p-4 rounded-xl border border-[#E5E5E5] bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#171717] flex items-center gap-1.5">
                        <FileText size={14} className="text-[#EA580C]" /> Document Header Preview
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                        Live Invoice Mockup
                      </span>
                    </div>

                    <div className="p-3.5 rounded-lg border border-stone-200 bg-stone-50 space-y-2 text-[11px]">
                      <div className="flex items-start justify-between border-b border-stone-200 pb-2">
                        <div>
                          <div className="text-xs font-bold text-[#171717] uppercase tracking-wide">
                            {settings.brandTradeName || 'MD ARTS'}
                          </div>
                          <div className="text-[10px] text-[#525252] font-medium">
                            {settings.legalEntityName || 'MD Arts Outdoor Media Network Pvt Ltd'}
                          </div>
                          <div className="text-[9px] text-[#737373] font-mono mt-0.5">
                            CIN: {settings.cinNumber || 'U74999MH2021PTC368412'} • GSTIN: {settings.gstin}
                          </div>
                        </div>
                        <div className="w-14 h-8 rounded bg-orange-100 border border-orange-300 flex items-center justify-center text-[9px] font-bold text-[#EA580C]">
                          LOGO
                        </div>
                      </div>
                      <div className="text-[10px] text-[#737373] leading-snug">
                        {settings.registeredAddress}, {settings.city}, {settings.state} - {settings.pincode}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Card 2: Legal Corporate Identity */}
              <Card className="p-6">
                <div className="flex items-start justify-between pb-4 border-b border-[#E5E5E5] mb-5">
                  <div>
                    <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                      <Building2 size={16} className="text-[#EA580C]" />
                      Corporate Identity &amp; Legal Organization
                    </h3>
                    <p className="text-xs text-[#737373] mt-0.5">
                      Official corporate information used on legal client proposals, rate cards, and commercial invoices.
                    </p>
                  </div>
                  <Link
                    to="/panel/organization/profile"
                    className="text-xs text-[#EA580C] hover:underline font-semibold flex items-center gap-1"
                  >
                    Full Org Profile <ChevronRight size={14} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Legal Entity Name"
                    value={settings.legalEntityName}
                    onChange={(e) => handleUpdate('legalEntityName', e.target.value)}
                    helperText="Exact name as registered with Ministry of Corporate Affairs (MCA)"
                  />
                  <Input
                    label="Trade / Brand Display Name"
                    value={settings.brandTradeName}
                    onChange={(e) => handleUpdate('brandTradeName', e.target.value)}
                    helperText="Brand name presented to marketplace advertisers and agencies"
                  />
                  <Input
                    label="Corporate Identification Number (CIN / LLPIN)"
                    value={settings.cinNumber}
                    onChange={(e) => handleUpdate('cinNumber', e.target.value)}
                  />
                  <Input
                    label="Date of Incorporation"
                    type="date"
                    value={settings.incorporationDate}
                    onChange={(e) => handleUpdate('incorporationDate', e.target.value)}
                  />
                  <Input
                    label="Official Corporate Email"
                    type="email"
                    value={settings.corporateEmail}
                    onChange={(e) => handleUpdate('corporateEmail', e.target.value)}
                    leftElement={<Mail size={14} />}
                  />
                  <Input
                    label="Corporate Helpline Phone"
                    value={settings.corporatePhone}
                    onChange={(e) => handleUpdate('corporatePhone', e.target.value)}
                    leftElement={<Phone size={14} />}
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Official Website URL"
                      value={settings.websiteUrl}
                      onChange={(e) => handleUpdate('websiteUrl', e.target.value)}
                      leftElement={<Globe size={14} />}
                    />
                  </div>
                </div>
              </Card>

              {/* Card 3: Primary Authorized Signatory */}
              <Card className="p-6">
                <div className="pb-4 border-b border-[#E5E5E5] mb-5">
                  <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                    <Users size={16} className="text-[#EA580C]" />
                    Primary Authorized Signatory
                  </h3>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Official company representative authorized to execute Release Orders (RO), client service agreements, and tax invoices.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Signatory Full Name"
                    value={settings.primarySignatoryName}
                    onChange={(e) => handleUpdate('primarySignatoryName', e.target.value)}
                    helperText="e.g. Rajesh V. Merchant"
                  />
                  <Input
                    label="Official Designation"
                    value={settings.primarySignatoryDesignation}
                    onChange={(e) => handleUpdate('primarySignatoryDesignation', e.target.value)}
                    helperText="e.g. Managing Director & Authorized Signatory"
                  />
                  <Input
                    label="Signatory Phone"
                    value={settings.primarySignatoryPhone}
                    onChange={(e) => handleUpdate('primarySignatoryPhone', e.target.value)}
                    leftElement={<Phone size={14} />}
                  />
                  <Input
                    label="Signatory Email"
                    type="email"
                    value={settings.primarySignatoryEmail}
                    onChange={(e) => handleUpdate('primarySignatoryEmail', e.target.value)}
                    leftElement={<Mail size={14} />}
                  />
                </div>
              </Card>

              {/* Card 4: Registered Headquarters & Yard */}
              <Card className="p-6">
                <div className="pb-4 border-b border-[#E5E5E5] mb-5">
                  <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                    <MapPin size={16} className="text-[#EA580C]" />
                    Registered Headquarters &amp; Operations Yard
                  </h3>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Physical premises for tax jurisdiction and outdoor mounting material staging.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3">
                      <Input
                        label="Registered HQ Address"
                        value={settings.registeredAddress}
                        onChange={(e) => handleUpdate('registeredAddress', e.target.value)}
                      />
                    </div>
                    <Input
                      label="City"
                      value={settings.city}
                      onChange={(e) => handleUpdate('city', e.target.value)}
                    />
                    <Input
                      label="State"
                      value={settings.state}
                      onChange={(e) => handleUpdate('state', e.target.value)}
                    />
                    <Input
                      label="Pincode"
                      value={settings.pincode}
                      onChange={(e) => handleUpdate('pincode', e.target.value)}
                    />
                  </div>

                  <div className="pt-2">
                    <Input
                      label="Field Operations Yard / Warehouse Address"
                      value={settings.dispatchYardAddress}
                      onChange={(e) => handleUpdate('dispatchYardAddress', e.target.value)}
                      helperText="Primary depot where flex rolls, vinyl print banners, and rigging equipment are dispatched"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#171717]">Default Timezone</label>
                      <select
                        value={settings.defaultTimezone}
                        onChange={(e) => handleUpdate('defaultTimezone', e.target.value)}
                        className="h-9 px-3 rounded-md bg-white border border-[#E5E5E5] text-xs text-[#171717] focus:outline-none focus:border-[#F97316]"
                      >
                        <option value="Asia/Kolkata (IST +05:30)">Asia/Kolkata (IST +05:30)</option>
                        <option value="Asia/Dubai (GST +04:00)">Asia/Dubai (GST +04:00)</option>
                        <option value="Asia/Singapore (SGT +08:00)">Asia/Singapore (SGT +08:00)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#171717]">Default Currency</label>
                      <input
                        type="text"
                        disabled
                        value={settings.defaultCurrency}
                        className="h-9 px-3 rounded-md bg-stone-100 border border-[#E5E5E5] text-xs text-stone-600 cursor-not-allowed font-medium"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. OPERATIONS & MOUNTING TAB */}
          {/* ========================================================================= */}
          {activeTab === 'operations' && (
            <div className="space-y-6">
              {/* Policy 1: Hold Expiration */}
              <Card className="p-6">
                <div className="pb-4 border-b border-[#E5E5E5] mb-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                        <Clock size={16} className="text-[#EA580C]" />
                        Booking Hold Expiration &amp; Auto-Release
                      </h3>
                      <p className="text-xs text-[#737373] mt-0.5">
                        Controls how long media inventory stays reserved under temporary hold before auto-releasing back to public availability.
                      </p>
                    </div>
                    <Badge variant="brand">{settings.holdDurationHours}h Standard Hold</Badge>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold text-[#171717] block mb-2">
                      Temporary Hold Window
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[24, 48, 72].map((hours) => (
                        <button
                          key={hours}
                          type="button"
                          onClick={() => handleUpdate('holdDurationHours', hours)}
                          className={`py-3 px-4 rounded-lg border text-left transition-all ${
                            settings.holdDurationHours === hours
                              ? 'border-[#EA580C] bg-orange-50/70 text-[#171717] ring-1 ring-[#EA580C]'
                              : 'border-[#E5E5E5] bg-white text-[#525252] hover:bg-[#F5F5F4]'
                          }`}
                        >
                          <div className="font-bold text-sm text-[#171717]">{hours} Hours</div>
                          <div className="text-[11px] text-[#737373] mt-0.5">
                            {hours === 24 && 'Aggressive fast inventory turnaround'}
                            {hours === 48 && 'Standard industry commercial window'}
                            {hours === 72 && 'Extended agency proposal duration'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-[#171717]">
                        Auto-Release Expired Holds
                      </div>
                      <div className="text-[11px] text-[#737373]">
                        Automatically transition HOLD bookings to EXPIRED and restore calendar availability when the timer expires.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUpdate('autoReleaseExpiredHolds', !settings.autoReleaseExpiredHolds)}
                      className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none p-0.5 ${
                        settings.autoReleaseExpiredHolds ? 'bg-[#EA580C]' : 'bg-stone-300'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                          settings.autoReleaseExpiredHolds ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Hold Grace Period (Hours)"
                      type="number"
                      min={0}
                      max={48}
                      value={settings.holdGracePeriodHours}
                      onChange={(e) => handleUpdate('holdGracePeriodHours', Number(e.target.value))}
                      helperText="Extra cushion granted before hard cancellation is enforced"
                    />
                    <Input
                      label="Minimum Booking Duration (Days)"
                      type="number"
                      min={1}
                      max={90}
                      value={settings.minimumBookingDays}
                      onChange={(e) => handleUpdate('minimumBookingDays', Number(e.target.value))}
                      helperText="Minimum billable flight duration allowed per campaign"
                    />
                  </div>
                </div>
              </Card>

              {/* Policy 2: Mounting & Proof Standards */}
              <Card className="p-6">
                <div className="pb-4 border-b border-[#E5E5E5] mb-5">
                  <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                    <Camera size={16} className="text-[#EA580C]" />
                    Mounting SLA &amp; Proof of Performance (POP) Policy
                  </h3>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Rigger changeover windows and mandatory photographic proof standards for campaign verification.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Mounting Lead Time (Days)"
                      type="number"
                      min={1}
                      max={14}
                      value={settings.mountingLeadTimeDays}
                      onChange={(e) => handleUpdate('mountingLeadTimeDays', Number(e.target.value))}
                      helperText="Days needed between artwork receipt and physical on-site mounting"
                    />
                    <Input
                      label="Consecutive Flight Changeover Buffer (Days)"
                      type="number"
                      min={0}
                      max={5}
                      value={settings.changeoverBufferDays}
                      onChange={(e) => handleUpdate('changeoverBufferDays', Number(e.target.value))}
                      helperText="De-mounting and cleaning buffer between back-to-back clients"
                    />
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                      <div>
                        <div className="text-xs font-bold text-[#171717]">
                          Mandatory GPS Geotagged &amp; Timestamped Photo
                        </div>
                        <div className="text-[11px] text-[#737373]">
                          Require embedded EXIF coordinates and timestamp before rigger photo proof can be marked compliant.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUpdate('requireGpsTimestampPhoto', !settings.requireGpsTimestampPhoto)}
                        className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none p-0.5 ${
                          settings.requireGpsTimestampPhoto ? 'bg-[#EA580C]' : 'bg-stone-300'
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                            settings.requireGpsTimestampPhoto ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                      <div>
                        <div className="text-xs font-bold text-[#171717]">
                          Mandatory Night Illumination Inspection Photo
                        </div>
                        <div className="text-[11px] text-[#737373]">
                          Require separate night photograph verifying floodlights or backlighting LEDs are 100% functional.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUpdate('requireNightIlluminatedPhoto', !settings.requireNightIlluminatedPhoto)}
                        className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none p-0.5 ${
                          settings.requireNightIlluminatedPhoto ? 'bg-[#EA580C]' : 'bg-stone-300'
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                            settings.requireNightIlluminatedPhoto ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Policy 3: Calendar Preferences */}
              <Card className="p-6">
                <div className="pb-4 border-b border-[#E5E5E5] mb-5">
                  <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                    <Calendar size={16} className="text-[#EA580C]" />
                    Calendar &amp; Scheduling Display Preferences
                  </h3>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Default view modes for inventory availability and flight scheduling grids.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#171717]">Default Calendar View</label>
                    <select
                      value={settings.defaultCalendarView}
                      onChange={(e) => handleUpdate('defaultCalendarView', e.target.value as any)}
                      className="h-9 px-3 rounded-md bg-white border border-[#E5E5E5] text-xs text-[#171717] focus:outline-none focus:border-[#F97316]"
                    >
                      <option value="monthly">Monthly Grid Matrix</option>
                      <option value="gantt">Gantt Flight Timeline</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#171717]">Week Starts On</label>
                    <select
                      value={settings.weekStartDay}
                      onChange={(e) => handleUpdate('weekStartDay', e.target.value as any)}
                      className="h-9 px-3 rounded-md bg-white border border-[#E5E5E5] text-xs text-[#171717] focus:outline-none focus:border-[#F97316]"
                    >
                      <option value="monday">Monday (Standard Indian Workweek)</option>
                      <option value="sunday">Sunday</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#171717]">Date Format</label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => handleUpdate('dateFormat', e.target.value as any)}
                      className="h-9 px-3 rounded-md bg-white border border-[#E5E5E5] text-xs text-[#171717] focus:outline-none focus:border-[#F97316]"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 15/10/2026)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Format)</option>
                    </select>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. INVOICING, GST & BANK TAB */}
          {/* ========================================================================= */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              {/* Card 1: Tax Compliance & GST */}
              <Card className="p-6">
                <div className="pb-4 border-b border-[#E5E5E5] mb-5">
                  <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                    <Receipt size={16} className="text-[#EA580C]" />
                    Tax Compliance &amp; GST Identification
                  </h3>
                  <p className="text-xs text-[#737373] mt-0.5">
                    GSTIN and Service Accounting Code (SAC) printed on official tax invoices and estimation sheets.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="GSTIN (Goods and Services Tax ID)"
                    value={settings.gstin}
                    onChange={(e) => handleUpdate('gstin', e.target.value.toUpperCase())}
                    helperText="15-character alphanumeric GST identification number"
                  />
                  <Input
                    label="Permanent Account Number (PAN)"
                    value={settings.pan}
                    onChange={(e) => handleUpdate('pan', e.target.value.toUpperCase())}
                    helperText="10-digit income tax PAN"
                  />
                  <Input
                    label="OOH Service Accounting Code (SAC)"
                    value={settings.hsnSacCode}
                    onChange={(e) => handleUpdate('hsnSacCode', e.target.value)}
                    helperText="Universal Indian SAC for outdoor advertising is 998361"
                  />
                  <Input
                    label="Standard GST Tax Rate (%)"
                    type="number"
                    value={settings.defaultGstRate}
                    onChange={(e) => handleUpdate('defaultGstRate', Number(e.target.value))}
                    helperText="Default rate applied on advertising space (18% = 9% CGST + 9% SGST)"
                  />
                </div>
              </Card>

              {/* Card 2: Statutory Compliance (TAN, MSME, RCM & TDS) */}
              <Card className="p-6">
                <div className="pb-4 border-b border-[#E5E5E5] mb-5">
                  <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                    <ShieldCheck size={16} className="text-[#EA580C]" />
                    Statutory Direct &amp; Indirect Tax Compliance (TAN, MSME, RCM, TDS)
                  </h3>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Mandatory Indian compliance identifiers required for corporate audit, tax deduction, and MSME payment tracking.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="TAN (Tax Deduction & Collection Account No.)"
                    value={settings.tanNumber}
                    onChange={(e) => handleUpdate('tanNumber', e.target.value.toUpperCase())}
                    helperText="10-digit alphanumeric code for TDS certificate issuance"
                  />
                  <div className="space-y-1">
                    <Input
                      label="MSME / Udyam Registration Number"
                      value={settings.msmeNumber}
                      onChange={(e) => handleUpdate('msmeNumber', e.target.value.toUpperCase())}
                      helperText="Provides priority payment rights under MSMED Act, 2006 (Section 15)"
                    />
                  </div>
                  <Input
                    label="Applicable Contractor TDS Deduction Rate (%)"
                    type="number"
                    value={settings.tdsRate}
                    onChange={(e) => handleUpdate('tdsRate', Number(e.target.value))}
                    helperText="Standard TDS rate for corporate advertisement contracts (Section 194C = 2%)"
                  />

                  {/* Reverse Charge Mechanism Toggle */}
                  <div className="p-3.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#171717]">Reverse Charge Mechanism (RCM)</div>
                      <div className="text-[11px] text-[#737373]">
                        Enable if client pays GST directly to government under Section 9(3) / 9(4)
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUpdate('reverseChargeMechanism', !settings.reverseChargeMechanism)}
                      className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none p-0.5 ${
                        settings.reverseChargeMechanism ? 'bg-[#EA580C]' : 'bg-stone-300'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                          settings.reverseChargeMechanism ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </Card>

              {/* Card 3: Standard Production, Mounting & Creative Rate Cards (Default Pricing) */}
              <Card className="p-6">
                <div className="pb-4 border-b border-[#E5E5E5] mb-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                        <Tag size={16} className="text-[#EA580C]" />
                        Standard Production, Mounting &amp; Creative Rate Cards (Default Pricing)
                      </h3>
                      <p className="text-xs text-[#737373] mt-0.5">
                        Baseline rates automatically inherited by all inventory assets during booking and quotation creation.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-50 text-[#EA580C] border border-orange-200 font-semibold">
                      Global Baseline Rates
                    </span>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Default Flex Printing Rate (₹ / sq.ft)"
                      type="number"
                      min={1}
                      max={200}
                      value={settings.defaultPrintingRatePerSqFt}
                      onChange={(e) => handleUpdate('defaultPrintingRatePerSqFt', Number(e.target.value))}
                      helperText="Calculated on asset dimensions: Total Sq.Ft × Rate"
                    />
                    <Input
                      label="Default Rigger Squad Mounting Rate (₹ / sq.ft)"
                      type="number"
                      min={1}
                      max={100}
                      value={settings.defaultMountingRatePerSqFt}
                      onChange={(e) => handleUpdate('defaultMountingRatePerSqFt', Number(e.target.value))}
                      helperText="Physical mounting &amp; tensioning labor per square foot"
                    />
                    <Input
                      label="Master Ad Creative / Design Concept Fee (₹)"
                      type="number"
                      min={0}
                      step={500}
                      value={settings.defaultCreativeDesignFee}
                      onChange={(e) => handleUpdate('defaultCreativeDesignFee', Number(e.target.value))}
                      helperText="Fixed concept creation &amp; dimensional adaptations fee"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#171717]">Default Creative Discount / Courtesy Policy</label>
                      <select
                        value={settings.defaultCreativeDiscountMode}
                        onChange={(e) => handleUpdate('defaultCreativeDiscountMode', e.target.value as any)}
                        className="h-9 px-3 rounded-md bg-white border border-[#E5E5E5] text-xs text-[#171717] focus:outline-none focus:border-[#F97316]"
                      >
                        <option value="COMPLIMENTARY_WAIVER">Complimentary Waiver (Display ~₹3,000~ ₹0 Courtesy Discount)</option>
                        <option value="BILLABLE">Standard Billable Charge (Charge full fee by default)</option>
                        <option value="CLIENT_PROVIDED">Client Brings Ready Artwork (Default unchecked / ₹0)</option>
                      </select>
                      <span className="text-[11px] text-[#737373]">
                        Controls how the quotation builder presents the creative design line item to prospective advertisers.
                      </span>
                    </div>

                    <Input
                      label="Maximum Discretionary Commercial Discount (%)"
                      type="number"
                      min={0}
                      max={50}
                      value={settings.maxCommercialDiscountPercent}
                      onChange={(e) => handleUpdate('maxCommercialDiscountPercent', Number(e.target.value))}
                      helperText="Cap on sales team discretionary discounts on overall quotation subtotal"
                    />
                  </div>

                  {/* Live Simulation Widget */}
                  <div className="p-4 rounded-xl border border-stone-200 bg-[#FAFAF9] space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#171717] flex items-center gap-1.5">
                        <Wrench size={13} className="text-[#EA580C]" /> Live Calculation Example (Standard 18ft × 18ft = 324 sq.ft Hoarding)
                      </span>
                      <span className="text-[10px] font-mono text-stone-500">Live Preview</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                      <div className="p-2.5 rounded-lg bg-white border border-stone-200">
                        <div className="text-[10px] text-stone-500 font-semibold uppercase">Printing Charges</div>
                        <div className="text-sm font-bold font-mono text-stone-900 mt-0.5">
                          ₹{(324 * settings.defaultPrintingRatePerSqFt).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-stone-500">324 sq.ft × ₹{settings.defaultPrintingRatePerSqFt}/sqft</div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white border border-stone-200">
                        <div className="text-[10px] text-stone-500 font-semibold uppercase">Mounting Charges</div>
                        <div className="text-sm font-bold font-mono text-stone-900 mt-0.5">
                          ₹{(324 * settings.defaultMountingRatePerSqFt).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-stone-500">324 sq.ft × ₹{settings.defaultMountingRatePerSqFt}/sqft</div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white border border-stone-200">
                        <div className="text-[10px] text-stone-500 font-semibold uppercase">Ad Creatives / Design</div>
                        <div className="text-sm font-bold font-mono text-stone-900 mt-0.5 flex items-center gap-2">
                          {settings.defaultCreativeDiscountMode === 'COMPLIMENTARY_WAIVER' ? (
                            <>
                              <span className="line-through text-stone-400 font-normal">₹{settings.defaultCreativeDesignFee.toLocaleString('en-IN')}</span>
                              <span className="text-emerald-700">₹0 Free</span>
                            </>
                          ) : (
                            <span>₹{settings.defaultCreativeDesignFee.toLocaleString('en-IN')}</span>
                          )}
                        </div>
                        <div className="text-[10px] text-stone-500">Master concept + resizes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Card 4: Digital Signature & Corporate Rubber Stamp */}
              <Card className="p-6">
                <div className="pb-4 border-b border-[#E5E5E5] mb-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                        <Stamp size={16} className="text-[#EA580C]" />
                        Authorized Signature &amp; Official Rubber Stamp
                      </h3>
                      <p className="text-xs text-[#737373] mt-0.5">
                        Uploaded stamp and signature are automatically affixed to finalized client estimates and GST tax invoices.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                      IT Act 2000 Compliant
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Authorized Signature Box */}
                  <div className="p-4 rounded-xl border border-[#E5E5E5] bg-[#FAFAF9] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#171717]">Authorized Digital Signature</label>
                      <span className="text-[10px] text-[#737373]">Signatory: {settings.primarySignatoryName}</span>
                    </div>

                    <div className="h-28 rounded-lg border-2 border-dashed border-[#D4D4D4] bg-white flex flex-col items-center justify-center p-3 text-center">
                      <div className="font-serif italic text-2xl text-[#1E3A8A] tracking-wider select-none transform -rotate-3">
                        {settings.primarySignatoryName || 'Rajesh V. Merchant'}
                      </div>
                      <div className="text-[9px] text-[#737373] font-mono mt-1 border-t border-stone-200 pt-0.5">
                        Digitally verified by SODAARS Trust Engine
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        label="Or Signature Image URL"
                        placeholder="https://.../signature.png"
                        value={settings.authorizedSignatureUrl}
                        onChange={(e) => handleUpdate('authorizedSignatureUrl', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Corporate Rubber Stamp Box */}
                  <div className="p-4 rounded-xl border border-[#E5E5E5] bg-[#FAFAF9] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#171717]">Official Company Rubber Stamp</label>
                      <span className="text-[10px] text-[#737373]">Round Corporate Seal</span>
                    </div>

                    <div className="h-28 rounded-lg border-2 border-dashed border-[#D4D4D4] bg-white flex flex-col items-center justify-center p-2 text-center">
                      <div className="w-22 h-22 rounded-full border-2 border-purple-800 border-dashed flex flex-col items-center justify-center p-1 text-[8px] font-bold text-purple-900 leading-tight uppercase transform rotate-6 select-none bg-purple-50/50">
                        <span>MD ARTS</span>
                        <span className="text-[7px] text-purple-700 font-mono">★ MUMBAI ★</span>
                        <span className="text-[6.5px] text-purple-800">AUTH. SIGNATORY</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        label="Or Stamp Image URL"
                        placeholder="https://.../stamp.png"
                        value={settings.companyStampUrl}
                        onChange={(e) => handleUpdate('companyStampUrl', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Auto Affix Toggle */}
                <div className="mt-4 flex items-center justify-between p-3.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                  <div>
                    <div className="text-xs font-bold text-[#171717]">
                      Automatically Affix Signature &amp; Stamp on Outgoing Invoices
                    </div>
                    <div className="text-[11px] text-[#737373]">
                      When enabled, system adds official seal and signature watermark to all generated client PDFs.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpdate('autoAffixStampSignature', !settings.autoAffixStampSignature)}
                    className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none p-0.5 ${
                      settings.autoAffixStampSignature ? 'bg-[#EA580C]' : 'bg-stone-300'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                        settings.autoAffixStampSignature ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </Card>

              {/* Card 4: Bank Details */}
              <Card className="p-6">
                <div className="pb-4 border-b border-[#E5E5E5] mb-5">
                  <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                    <Landmark size={16} className="text-[#EA580C]" />
                    Bank Remittance &amp; Direct Transfer Details
                  </h3>
                  <p className="text-xs text-[#737373] mt-0.5">
                    These banking coordinates appear on invoice footers for client NEFT / RTGS payments.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Account Beneficiary Name"
                    value={settings.bankBeneficiary}
                    onChange={(e) => handleUpdate('bankBeneficiary', e.target.value)}
                  />
                  <Input
                    label="Bank Name"
                    value={settings.bankName}
                    onChange={(e) => handleUpdate('bankName', e.target.value)}
                  />
                  <Input
                    label="Current Account Number"
                    value={settings.bankAccountNumber}
                    onChange={(e) => handleUpdate('bankAccountNumber', e.target.value)}
                  />
                  <Input
                    label="IFSC Code"
                    value={settings.bankIfsc}
                    onChange={(e) => handleUpdate('bankIfsc', e.target.value.toUpperCase())}
                  />
                  <Input
                    label="Branch Location"
                    value={settings.bankBranch}
                    onChange={(e) => handleUpdate('bankBranch', e.target.value)}
                  />
                  <Input
                    label="UPI ID / Virtual Payment Address"
                    value={settings.upiId}
                    onChange={(e) => handleUpdate('upiId', e.target.value)}
                  />
                </div>
              </Card>

              {/* Card 5: Prefixes & Payment Credit Terms */}
              <Card className="p-6">
                <div className="pb-4 border-b border-[#E5E5E5] mb-5">
                  <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                    <FileText size={16} className="text-[#EA580C]" />
                    Document Numbering Prefixes &amp; Payment Terms
                  </h3>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Custom serial codes used when generating new bookings, quotations, and commercial invoices.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Booking ID Prefix"
                    value={settings.bookingPrefix}
                    onChange={(e) => handleUpdate('bookingPrefix', e.target.value)}
                    helperText="e.g. MD-BK-"
                  />
                  <Input
                    label="Quotation / RO Prefix"
                    value={settings.proposalPrefix}
                    onChange={(e) => handleUpdate('proposalPrefix', e.target.value)}
                    helperText="e.g. MD-EST-"
                  />
                  <Input
                    label="Tax Invoice Prefix"
                    value={settings.invoicePrefix}
                    onChange={(e) => handleUpdate('invoicePrefix', e.target.value)}
                    helperText="e.g. MD-INV-2026-"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Quotation Validity (Days)"
                    type="number"
                    value={settings.proposalValidityDays}
                    onChange={(e) => handleUpdate('proposalValidityDays', Number(e.target.value))}
                    helperText="Days estimation remains legally binding prior to inventory release"
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#171717]">Default Payment Credit Terms</label>
                    <select
                      value={settings.defaultCreditTerms}
                      onChange={(e) => handleUpdate('defaultCreditTerms', e.target.value)}
                      className="h-9 px-3 rounded-md bg-white border border-[#E5E5E5] text-xs text-[#171717] focus:outline-none focus:border-[#F97316]"
                    >
                      <option value="100% Advance Payment">100% Advance Payment</option>
                      <option value="50% Advance, 50% Post-Mounting Proof">50% Advance, 50% Post-Mounting Proof</option>
                      <option value="Net 15 Days from Commencement">Net 15 Days from Commencement</option>
                      <option value="Net 30 Days from Invoicing">Net 30 Days from Invoicing</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Card 6: Invoice Terms, Conditions & Dispute Jurisdiction */}
              <Card className="p-6">
                <div className="pb-4 border-b border-[#E5E5E5] mb-5">
                  <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                    <FileText size={16} className="text-[#EA580C]" />
                    Legal Terms, Conditions &amp; Dispute Jurisdiction
                  </h3>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Standard contractual clauses printed on the reverse / footer of quotation release orders and commercial tax invoices.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#171717]">Invoice Terms &amp; Conditions (Contract Clauses)</label>
                      <span className="text-[10px] text-[#737373] font-mono">
                        {settings.invoiceTermsAndConditions.length} Characters
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      value={settings.invoiceTermsAndConditions}
                      onChange={(e) => handleUpdate('invoiceTermsAndConditions', e.target.value)}
                      className="p-3 rounded-lg bg-white border border-[#E5E5E5] text-xs text-[#171717] focus:outline-none focus:border-[#EA580C] font-mono leading-relaxed resize-y"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#737373]">
                    <span className="font-semibold text-stone-700">Quick Clause Tags:</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdate(
                          'invoiceTermsAndConditions',
                          settings.invoiceTermsAndConditions + '\n5. Disputes subject to exclusive jurisdiction of courts in ' + settings.city + '.'
                        )
                      }
                      className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 text-[10px] font-medium border border-stone-200"
                    >
                      + Jurisdiction in {settings.city}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdate(
                          'invoiceTermsAndConditions',
                          settings.invoiceTermsAndConditions + '\n6. Delayed payments attract penal interest @ 18% p.a.'
                        )
                      }
                      className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 text-[10px] font-medium border border-stone-200"
                    >
                      + 18% Delay Interest
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdate(
                          'invoiceTermsAndConditions',
                          settings.invoiceTermsAndConditions + '\n7. POP photos provided within 24 hours of flight mounting.'
                        )
                      }
                      className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 text-[10px] font-medium border border-stone-200"
                    >
                      + 24h POP SLA
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. SUBSCRIPTION & QUOTA TAB (NEW!) */}
          {/* ========================================================================= */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              {/* Card 1: Active Subscription Plan */}
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E5E5] gap-4 mb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#171717] flex items-center gap-2">
                        <CreditCard size={16} className="text-[#EA580C]" />
                        SODAARS Enterprise Subscription
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={11} /> Active Plan
                      </span>
                    </div>
                    <p className="text-xs text-[#737373] mt-0.5">
                      Your organization is currently licensed under the SODAARS Provider Operating System.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#171717] px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-[#EA580C]">
                      Professional Tier 2
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#E5E5E5]">
                    <div className="text-[10px] font-bold uppercase text-[#737373]">Current Plan</div>
                    <div className="text-lg font-bold text-[#171717] mt-0.5">Professional (Tier 2)</div>
                    <div className="text-[11px] text-[#737373]">₹1,44,000 / Year + 18% GST</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#E5E5E5]">
                    <div className="text-[10px] font-bold uppercase text-[#737373]">Billing Cycle</div>
                    <div className="text-lg font-bold text-[#171717] mt-0.5">Annual Contract</div>
                    <div className="text-[11px] text-emerald-600 font-medium">Auto-Renews Dec 31, 2026</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#E5E5E5]">
                    <div className="text-[10px] font-bold uppercase text-[#737373]">Account Status</div>
                    <div className="text-lg font-bold text-emerald-700 mt-0.5">Good Standing</div>
                    <div className="text-[11px] text-[#737373]">Zero outstanding balance</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#171717]">Need to expand your billboard capacity?</div>
                    <div className="text-[11px] text-[#737373]">
                      Upgrade to Enterprise Tier to manage unlimited billboards, custom multi-yard routing, and dedicated SLA.
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => showToast('Upgrade request dispatched to SODAARS Enterprise Concierge.')}
                    >
                      Upgrade to Enterprise
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Card 2: Resource Capacity & Quota Meters */}
              <Card className="p-6">
                <div className="pb-4 border-b border-[#E5E5E5] mb-5">
                  <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                    <Activity size={16} className="text-[#EA580C]" />
                    Platform Resource Capacity &amp; Live Quotas
                  </h3>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Real-time monitoring of your licensed outdoor media assets and team seat allocation.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Quota 1: Outdoor Media Assets */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-[#171717] flex items-center gap-1.5">
                        <Layers size={14} className="text-[#EA580C]" /> Billboard &amp; Media Units
                      </span>
                      <span className="font-mono text-[11px]">
                        <strong>{settings.assetQuotaUsed}</strong> of {settings.assetQuotaLimit} Units Active (
                        {Math.round((settings.assetQuotaUsed / settings.assetQuotaLimit) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-stone-200 overflow-hidden">
                      <div
                        className="h-full bg-[#EA580C] rounded-full transition-all duration-500"
                        style={{ width: `${(settings.assetQuotaUsed / settings.assetQuotaLimit) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#737373] mt-1">
                      <span>16 Available asset slots remaining</span>
                      <span>Cap: 100 Assets in Tier 2</span>
                    </div>
                  </div>

                  {/* Quota 2: Team Staff Seats */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-[#171717] flex items-center gap-1.5">
                        <Users size={14} className="text-[#EA580C]" /> Staff &amp; Field Rigger Seats
                      </span>
                      <span className="font-mono text-[11px]">
                        <strong>8</strong> of 15 Team Members (53%)
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-stone-200 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full transition-all duration-500 w-[53%]" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#737373] mt-1">
                      <span>7 Seats available for new invites</span>
                      <span>Cap: 15 Users</span>
                    </div>
                  </div>

                  {/* Quota 3: Cloud POP Media Storage */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-[#171717] flex items-center gap-1.5">
                        <HardDrive size={14} className="text-[#EA580C]" /> High-Res Photographic POP Storage
                      </span>
                      <span className="font-mono text-[11px]">
                        <strong>12.4 GB</strong> of 50.0 GB (25%)
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-stone-200 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-500 w-[25%]" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#737373] mt-1">
                      <span>37.6 GB High-speed CDN storage free</span>
                      <span>Cap: 50 GB Cloud Storage</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Card 3: Platform Tax Invoices (Paid to SODAARS) */}
              <Card className="p-6">
                <div className="pb-4 border-b border-[#E5E5E5] mb-5">
                  <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                    <FileText size={16} className="text-[#EA580C]" />
                    SODAARS Platform SaaS Tax Invoices
                  </h3>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Download official GST tax invoices for platform software subscription and compute charges.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E5E5E5] text-[10px] font-bold uppercase text-[#737373] bg-[#FAFAF9]">
                        <th className="py-2.5 px-3">Invoice #</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Description &amp; Period</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      {PLATFORM_INVOICES.map((inv) => (
                        <tr key={inv.id} className="hover:bg-[#FAFAF9] transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-[#171717]">{inv.id}</td>
                          <td className="py-3 px-3 text-[#525252]">{inv.date}</td>
                          <td className="py-3 px-3">
                            <div className="font-medium text-[#171717]">{inv.description}</div>
                            <div className="text-[10px] text-[#737373] font-mono">{inv.period}</div>
                          </td>
                          <td className="py-3 px-3 font-mono">
                            <div className="font-bold text-[#171717]">{inv.total}</div>
                            <div className="text-[10px] text-[#737373]">{inv.gst}</div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => showToast(`Downloading tax invoice ${inv.id}...`)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold transition-colors"
                            >
                              <Download size={12} /> PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. TEAM & PERMISSIONS TAB */}
          {/* ========================================================================= */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-start justify-between pb-4 border-b border-[#E5E5E5] mb-5">
                  <div>
                    <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                      <Users size={16} className="text-[#EA580C]" />
                      Staff Roster &amp; Role-Based Access Control (RBAC)
                    </h3>
                    <p className="text-xs text-[#737373] mt-0.5">
                      Manage operations managers, field rigger mounting squads, accounts personnel, and sales agents.
                    </p>
                  </div>
                  <Link
                    to="/panel/organization/team"
                    className="text-xs text-[#EA580C] hover:underline font-semibold flex items-center gap-1"
                  >
                    Manage Staff Roster <ChevronRight size={14} />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                    <div className="text-[10px] font-bold uppercase text-[#737373]">Owner / Admin</div>
                    <div className="text-base font-bold text-[#171717] mt-0.5">Full Access</div>
                    <div className="text-[11px] text-[#737373]">Company &amp; Financials</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                    <div className="text-[10px] font-bold uppercase text-[#737373]">Ops Manager</div>
                    <div className="text-base font-bold text-[#171717] mt-0.5">Inventory &amp; Flights</div>
                    <div className="text-[11px] text-[#737373]">Scheduling &amp; Holds</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                    <div className="text-[10px] font-bold uppercase text-[#737373]">Media Rigger</div>
                    <div className="text-base font-bold text-[#171717] mt-0.5">Mounting &amp; POP</div>
                    <div className="text-[11px] text-[#737373]">Field Photo Uploads</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                    <div className="text-[10px] font-bold uppercase text-[#737373]">Finance Desk</div>
                    <div className="text-base font-bold text-[#171717] mt-0.5">Invoicing &amp; GST</div>
                    <div className="text-[11px] text-[#737373]">Billing Reconciliation</div>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#171717]">Default Role for New Staff Invites</label>
                      <select
                        value={settings.defaultNewUserRole}
                        onChange={(e) => handleUpdate('defaultNewUserRole', e.target.value as any)}
                        className="h-9 px-3 rounded-md bg-white border border-[#E5E5E5] text-xs text-[#171717] focus:outline-none focus:border-[#F97316]"
                      >
                        <option value="Operations">Operations Manager</option>
                        <option value="Rigger">Media Rigger / Field Unit</option>
                        <option value="Finance">Finance &amp; Accounts Desk</option>
                        <option value="Sales">Sales &amp; Client Servicing</option>
                      </select>
                    </div>

                    <Input
                      label="Session Inactivity Timeout (Hours)"
                      type="number"
                      min={1}
                      max={72}
                      value={settings.sessionTimeoutHours}
                      onChange={(e) => handleUpdate('sessionTimeoutHours', Number(e.target.value))}
                      helperText="Automatic sign-out window for security compliance"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-[#171717] flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-emerald-600" />
                        Enforce Two-Factor Authentication (2FA) for All Staff
                      </div>
                      <div className="text-[11px] text-[#737373]">
                        Require OTP SMS verification or authenticator app for staff accessing billing ledgers and inventory controls.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUpdate('enforceMfa', !settings.enforceMfa)}
                      className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none p-0.5 ${
                        settings.enforceMfa ? 'bg-[#EA580C]' : 'bg-stone-300'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                          settings.enforceMfa ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. MARKETPLACE & COMMERCIAL TAB */}
          {/* ========================================================================= */}
          {activeTab === 'marketplace' && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-start justify-between pb-4 border-b border-[#E5E5E5] mb-5">
                  <div>
                    <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                      <ShoppingBag size={16} className="text-[#EA580C]" />
                      SODAARS National Marketplace Participation
                    </h3>
                    <p className="text-xs text-[#737373] mt-0.5">
                      Control how national media buyers, digital programmatic agencies, and brands discover your unbooked inventory.
                    </p>
                  </div>
                  <Link
                    to="/panel/organization/marketplace"
                    className="text-xs text-[#EA580C] hover:underline font-semibold flex items-center gap-1"
                  >
                    Marketplace Settings <ChevronRight size={14} />
                  </Link>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-[#171717]">
                        Enable Marketplace Inventory Discovery
                      </div>
                      <div className="text-[11px] text-[#737373]">
                        Publish unreserved billboards and gantries to the verified public SODAARS explorer network.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUpdate('enableMarketplaceDiscovery', !settings.enableMarketplaceDiscovery)}
                      className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none p-0.5 ${
                        settings.enableMarketplaceDiscovery ? 'bg-[#EA580C]' : 'bg-stone-300'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                          settings.enableMarketplaceDiscovery ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-4 rounded-lg bg-white border border-[#E5E5E5] space-y-3">
                    <label className="text-xs font-semibold text-[#171717] block">
                      Marketplace Booking Acceptance Policy
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleUpdate('bookingAcceptanceMode', 'MANUAL_APPROVAL')}
                        className={`p-3.5 rounded-lg border text-left transition-all ${
                          settings.bookingAcceptanceMode === 'MANUAL_APPROVAL'
                            ? 'border-[#EA580C] bg-orange-50/70 text-[#171717] ring-1 ring-[#EA580C]'
                            : 'border-[#E5E5E5] bg-white text-[#525252] hover:bg-[#F5F5F4]'
                        }`}
                      >
                        <div className="font-bold text-xs text-[#171717]">Manual Provider Review &amp; Approval</div>
                        <div className="text-[11px] text-[#737373] mt-1">
                          Every incoming reservation request from marketplace clients requires provider confirmation before hold locks.
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdate('bookingAcceptanceMode', 'AUTO_ACCEPT')}
                        className={`p-3.5 rounded-lg border text-left transition-all ${
                          settings.bookingAcceptanceMode === 'AUTO_ACCEPT'
                            ? 'border-[#EA580C] bg-orange-50/70 text-[#171717] ring-1 ring-[#EA580C]'
                            : 'border-[#E5E5E5] bg-white text-[#525252] hover:bg-[#F5F5F4]'
                        }`}
                      >
                        <div className="font-bold text-xs text-[#171717]">Instant Booking at Floor Rate</div>
                        <div className="text-[11px] text-[#737373] mt-1">
                          Automatically confirms booking and locks calendar when client pays escrow deposit meeting your base floor price.
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <Input
                      label="Maximum Allowed Negotiation Discount (%)"
                      type="number"
                      min={0}
                      max={50}
                      value={settings.maxAgencyDiscountPercent}
                      onChange={(e) => handleUpdate('maxAgencyDiscountPercent', Number(e.target.value))}
                      helperText="Hard discount floor limit to protect media yield"
                    />
                    <Input
                      label="Standard INS Agency Commission (%)"
                      type="number"
                      min={0}
                      max={25}
                      value={settings.standardAgencyCommissionPercent}
                      onChange={(e) => handleUpdate('standardAgencyCommissionPercent', Number(e.target.value))}
                      helperText="Default rebate percentage for accredited advertising agencies (standard: 15%)"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-[#171717]">
                        Display Card Rates Publicly
                      </div>
                      <div className="text-[11px] text-[#737373]">
                        When disabled, prospective marketplace buyers see &quot;Price on Request&quot; instead of explicit rate cards.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUpdate('showPublicRateCards', !settings.showPublicRateCards)}
                      className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none p-0.5 ${
                        settings.showPublicRateCards ? 'bg-[#EA580C]' : 'bg-stone-300'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                          settings.showPublicRateCards ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 7. SECURITY & AUTHENTICATION TAB (NEW!) */}
          {/* ========================================================================= */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Card 1: Master Password Reset */}
              <Card className="p-6">
                <div className="pb-4 border-b border-[#E5E5E5] mb-5">
                  <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                    <Lock size={16} className="text-[#EA580C]" />
                    Update Account Master Password
                  </h3>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Ensure your account is protected by an enterprise-grade password meeting security complexity standards.
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
                  {passwordMessage && (
                    <div
                      className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                        passwordMessage.success
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      {passwordMessage.success ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                      <span>{passwordMessage.text}</span>
                    </div>
                  )}

                  <Input
                    label="Current Password"
                    type="password"
                    placeholder="••••••••••••"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="New Password"
                      type="password"
                      placeholder="••••••••••••"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      helperText="Min. 8 chars with uppercase, number & symbol"
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      placeholder="••••••••••••"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" variant="primary" size="sm" leftIcon={<Lock size={14} />}>
                      Update Password
                    </Button>
                  </div>
                </form>
              </Card>

              {/* Card 2: Two-Factor Authentication (2FA) */}
              <Card className="p-6">
                <div className="pb-4 border-b border-[#E5E5E5] mb-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                        <ShieldCheck size={16} className="text-[#EA580C]" />
                        Two-Factor Authentication (2FA)
                      </h3>
                      <p className="text-xs text-[#737373] mt-0.5">
                        Add an extra layer of security requiring a TOTP code during sign-in.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      2FA ENABLED
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#E5E5E5] bg-[#FAFAF9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[#171717] flex items-center gap-1.5">
                      <Smartphone size={14} className="text-[#EA580C]" /> Authenticator App (TOTP)
                    </div>
                    <div className="text-[11px] text-[#737373]">
                      Configured with Google Authenticator / Microsoft Authenticator / 1Password.
                    </div>
                    <div className="text-[10px] font-mono text-stone-500 pt-1">
                      Backup Secret Key: <span className="bg-stone-200 px-1.5 py-0.5 rounded text-stone-800">ABCD-EFGH-JKLM-NPQR</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => showToast('2FA setup verification modal opened.')}
                      className="px-3 py-1.5 rounded-lg border border-[#E5E5E5] bg-white text-xs font-semibold text-[#171717] hover:bg-[#F5F5F4]"
                    >
                      Reconfigure 2FA
                    </button>
                  </div>
                </div>
              </Card>

              {/* Card 3: Active Device Sessions */}
              <Card className="p-6">
                <div className="flex items-start justify-between pb-4 border-b border-[#E5E5E5] mb-5">
                  <div>
                    <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                      <Laptop size={16} className="text-[#EA580C]" />
                      Active Login Sessions &amp; Devices
                    </h3>
                    <p className="text-xs text-[#737373] mt-0.5">
                      Devices currently authorized to access this organization&apos;s provider console.
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleTerminateOtherSessions}
                    leftIcon={<Trash2 size={13} className="text-red-500" />}
                  >
                    Terminate Other Sessions
                  </Button>
                </div>

                <div className="space-y-3">
                  {sessions.map((sess) => (
                    <div
                      key={sess.id}
                      className="flex items-center justify-between p-3.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-[#171717] flex items-center gap-2">
                          <span>{sess.device}</span>
                          {sess.current && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                              THIS DEVICE
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#737373] flex items-center gap-2">
                          <span>{sess.location}</span>
                          <span>•</span>
                          <span className="font-mono text-[10px]">{sess.ip}</span>
                        </div>
                      </div>

                      <div className="text-[11px] font-medium text-stone-600 shrink-0">
                        {sess.lastActive}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Card 4: API Keys & Webhooks */}
              <Card className="p-6">
                <div className="pb-4 border-b border-[#E5E5E5] mb-5">
                  <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                    <Key size={16} className="text-[#EA580C]" />
                    Developer API Keys &amp; Webhooks
                  </h3>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Connect ERP, billing software, or customized dispatch gateways directly to your live inventory feed.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                      Live Production API Key
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={settings.apiKeyMasked}
                        className="flex-1 h-9 px-3 rounded-md bg-stone-100 border border-[#E5E5E5] text-xs font-mono text-stone-700 select-all"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleCopyApiKey}
                        leftIcon={copiedKey ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      >
                        {copiedKey ? 'Copied' : 'Copy Key'}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => showToast('New API Key generated. Update your external integrations.')}
                      >
                        Roll Key
                      </Button>
                    </div>
                    <div className="text-[10px] text-[#737373] mt-1">
                      Bearer authentication key for REST API v2 endpoints. Never expose this key in client-side code.
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="text-xs font-semibold text-[#171717] block mb-1.5">
                      Webhook Event Notification Endpoint
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={settings.webhookUrl}
                        onChange={(e) => handleUpdate('webhookUrl', e.target.value)}
                        placeholder="https://your-domain.com/webhooks/sodaars"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleTestWebhook}
                        leftIcon={<Activity size={14} />}
                      >
                        Test Ping
                      </Button>
                    </div>
                    {pingStatus && (
                      <div className="mt-2 text-xs font-medium text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 size={13} /> {pingStatus}
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <Input
                      label="Allowed IP Whitelist (CIDR / Comma-Separated)"
                      value={settings.ipWhitelist}
                      onChange={(e) => handleUpdate('ipWhitelist', e.target.value)}
                      helperText="Restrict API calls exclusively to designated corporate VPN / static IPs"
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 8. ALERTS & NOTIFICATIONS TAB */}
          {/* ========================================================================= */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="pb-4 border-b border-[#E5E5E5] mb-5">
                  <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                    <Smartphone size={16} className="text-[#EA580C]" />
                    Dispatch Delivery Channels
                  </h3>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Configure WhatsApp Business API, SMS gateway, and email delivery for instant operational alerts.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Operations Notification Email"
                      type="email"
                      value={settings.notificationEmail}
                      onChange={(e) => handleUpdate('notificationEmail', e.target.value)}
                      leftElement={<Mail size={14} />}
                      helperText="Receives booking change confirmations and financial receipts"
                    />
                    <Input
                      label="WhatsApp Business Alert Number"
                      value={settings.whatsappNumber}
                      onChange={(e) => handleUpdate('whatsappNumber', e.target.value)}
                      leftElement={<MessageSquare size={14} />}
                      helperText="Used for immediate mounting notifications to rigger crews"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                      <div>
                        <div className="text-xs font-bold text-[#171717]">WhatsApp Business Alerts</div>
                        <div className="text-[11px] text-[#737373]">Send real-time alerts via WhatsApp API</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUpdate('whatsappAlertsEnabled', !settings.whatsappAlertsEnabled)}
                        className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none p-0.5 ${
                          settings.whatsappAlertsEnabled ? 'bg-[#EA580C]' : 'bg-stone-300'
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                            settings.whatsappAlertsEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                      <div>
                        <div className="text-xs font-bold text-[#171717]">SMS Priority Dispatch</div>
                        <div className="text-[11px] text-[#737373]">DLT-compliant SMS header: {settings.smsSenderId}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUpdate('smsAlertsEnabled', !settings.smsAlertsEnabled)}
                        className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none p-0.5 ${
                          settings.smsAlertsEnabled ? 'bg-[#EA580C]' : 'bg-stone-300'
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                            settings.smsAlertsEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="pb-4 border-b border-[#E5E5E5] mb-5">
                  <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                    <Bell size={16} className="text-[#EA580C]" />
                    Event Triggers &amp; Notification Rules
                  </h3>
                  <p className="text-xs text-[#737373] mt-0.5">
                    Toggle automatic notifications sent when key media workflow events occur.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      key: 'notifyBookingRequest' as const,
                      title: 'New Booking Hold Placed',
                      desc: 'Notify operations when an agency or client locks inventory with a tentative hold.',
                    },
                    {
                      key: 'notifyHoldExpirationWarning' as const,
                      title: 'Hold Expiring within 2 Hours',
                      desc: 'Urgent notice before inventory auto-releases back to the public pool.',
                    },
                    {
                      key: 'notifyFlightStartSoon' as const,
                      title: 'Upcoming Campaign Flight in 48 Hours',
                      desc: 'Mobilization trigger to inspect flex print delivery and schedule nocturnal rigger crew.',
                    },
                    {
                      key: 'notifyProofUploads' as const,
                      title: 'Proof of Performance (POP) Photo Uploaded',
                      desc: 'Alert when riggers submit day/night photos from the field.',
                    },
                    {
                      key: 'notifyPaymentReceived' as const,
                      title: 'Payment Reconciled & Remittance Confirmed',
                      desc: 'Notify sales and finance when client RTGS/escrow payout is credited.',
                    },
                    {
                      key: 'notifyDailyMorningBriefing' as const,
                      title: 'Daily 9:00 AM Morning Flight Digest',
                      desc: 'Consolidated briefing email listing active flights, mounting today, and expiring holds.',
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-3.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]"
                    >
                      <div>
                        <div className="text-xs font-bold text-[#171717]">{item.title}</div>
                        <div className="text-[11px] text-[#737373]">{item.desc}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUpdate(item.key, !settings[item.key])}
                        className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none p-0.5 ${
                          settings[item.key] ? 'bg-[#EA580C]' : 'bg-stone-300'
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                            settings[item.key] ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  );

  // If accessed directly at /panel/settings, wrap in max-w-7xl container
  if (location.pathname === '/panel/settings') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {content}
      </div>
    );
  }

  // Otherwise (if nested under OrganizationLayout), return content directly
  return content;
};

export default SettingsPage;
