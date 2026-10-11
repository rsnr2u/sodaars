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

export const SettingsPage: React.FC = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab State: sync with URL query param ?tab=
  const currentTabParam = (searchParams.get('tab') as SettingsTabId) || 'general';
  const [activeTab, setActiveTab] = useState<SettingsTabId>(
    ['general', 'operations', 'finance', 'team', 'marketplace', 'notifications'].includes(currentTabParam)
      ? currentTabParam
      : 'general'
  );

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as SettingsTabId;
    if (tabFromUrl && tabFromUrl !== activeTab) {
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
        showToast('Settings & system policies saved successfully.');
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

  // Tab definitions
  const tabs = [
    {
      id: 'general' as SettingsTabId,
      label: 'General & Profile',
      shortLabel: 'General',
      icon: Building2,
      description: 'Legal identity, trade name & operational yards',
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
      description: 'GSTIN, SAC 998361, bank details & prefixes',
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
          <CheckCircle2 size={16} className="text-[#F97316] shrink-0" />
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
              Apex Media Networks
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight mt-1">
            Settings &amp; System Policies
          </h1>
          <p className="text-xs text-[#525252] mt-0.5">
            Configure operational hold rules, mounting SLA buffers, GST &amp; banking details, team roles, and automated notifications.
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
              You have <strong>unsaved modifications</strong> in your settings. Remember to save to ensure operational consistency.
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

      {/* Tabs Navigation Bar */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] p-1.5 shadow-xs overflow-x-auto no-scrollbar">
        <nav className="flex items-center gap-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#171717] text-white shadow-xs'
                    : 'text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4]'
                }`}
              >
                <Icon
                  size={15}
                  className={isActive ? 'text-orange-400' : 'text-[#737373]'}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* TAB CONTENT AREAS */}

      {/* ========================================================================= */}
      {/* 1. GENERAL & PROFILE TAB */}
      {/* ========================================================================= */}
      {activeTab === 'general' && (
        <div className="space-y-6">
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
              {/* Hold Duration Buttons */}
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

              {/* Auto Release Toggle */}
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

          {/* Policy 2: Mounting & Changeovers */}
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

              {/* Verification Toggles */}
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

          {/* Calendar Preferences */}
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
                helperText="e.g. APEX-BK-"
              />
              <Input
                label="Quotation / RO Prefix"
                value={settings.proposalPrefix}
                onChange={(e) => handleUpdate('proposalPrefix', e.target.value)}
                helperText="e.g. APEX-EST-"
              />
              <Input
                label="Tax Invoice Prefix"
                value={settings.invoicePrefix}
                onChange={(e) => handleUpdate('invoicePrefix', e.target.value)}
                helperText="e.g. APEX-INV-2026-"
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TEAM & PERMISSIONS TAB */}
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

            {/* Role Breakdown Badges */}
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

              {/* MFA Toggle */}
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
      {/* 5. MARKETPLACE & COMMERCIAL TAB */}
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
              {/* Discovery Toggle */}
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

              {/* Booking Acceptance Policy */}
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

              {/* Commercial Caps */}
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

              {/* Public Rate Card Display */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-[#171717]">
                    Display Card Rates Publicly
                  </div>
                  <div className="text-[11px] text-[#737373]">
                    When disabled, prospective marketplace buyers see "Price on Request" instead of explicit rate cards.
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
      {/* 6. ALERTS & NOTIFICATIONS TAB */}
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
