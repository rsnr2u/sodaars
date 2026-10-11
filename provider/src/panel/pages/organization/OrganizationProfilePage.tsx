import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  Save,
  RotateCcw,
  FileText,
  MapPin,
  Mail,
  Phone,
  Globe,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Hash,
  Calendar,
  Layers,
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import {
  OrganizationProfile,
  DEFAULT_ORGANIZATION_PROFILE,
} from '../../types/organization';

const STORAGE_KEY = 'sodaars_provider_org_profile';

export const OrganizationProfilePage: React.FC = () => {
  // Load initial profile from localStorage or default
  const [profile, setProfile] = useState<OrganizationProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_ORGANIZATION_PROFILE, ...JSON.parse(saved) };
      }
    } catch {
      // ignore parse errors
    }
    return DEFAULT_ORGANIZATION_PROFILE;
  });

  // Track initial profile for dirty state detection
  const [initialProfile, setInitialProfile] = useState<OrganizationProfile>(profile);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if form has unsaved modifications
  const isDirty = JSON.stringify(profile) !== JSON.stringify(initialProfile);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleChange = (field: keyof OrganizationProfile, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear field-specific error if corrected
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!profile.legalName.trim()) {
      newErrors.legalName = 'Legal Company Name is required';
    }
    if (!profile.tradeName.trim()) {
      newErrors.tradeName = 'Brand / Trade Display Name is required';
    }
    if (!profile.corporateEmail.trim()) {
      newErrors.corporateEmail = 'Corporate Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.corporateEmail)) {
      newErrors.corporateEmail = 'Enter a valid corporate email address';
    }
    if (!profile.corporatePhone.trim()) {
      newErrors.corporatePhone = 'Corporate Phone is required';
    }
    if (!profile.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!profile.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!profile.pincode.trim()) {
      newErrors.pincode = 'PIN Code is required';
    } else if (!/^\d{6}$/.test(profile.pincode.trim())) {
      newErrors.pincode = 'PIN Code must be a 6-digit number';
    }
    if (profile.billingEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.billingEmail)) {
      newErrors.billingEmail = 'Enter a valid billing email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validate()) {
      showToast('Please fix the validation errors before saving.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        setInitialProfile(profile);
        setIsSaving(false);
        showToast('Organization profile updated successfully.');
      } catch {
        setIsSaving(false);
        showToast('Failed to save changes. Please try again.');
      }
    }, 450);
  };

  const handleRevert = () => {
    setProfile(initialProfile);
    setErrors({});
    showToast('Changes discarded. Restored saved profile values.');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg bg-[#171717] text-white text-xs font-medium shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 size={16} className="text-[#F97316] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Actions Card */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C]">
            Organization Administration
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
            Organization Profile
          </h1>
          <p className="text-xs text-[#525252] mt-0.5">
            Legal corporate identity, brand trade name, registered business address, GSTIN tax credentials, and billing contacts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {isDirty && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRevert}
              leftIcon={<RotateCcw size={14} />}
              disabled={isSaving}
            >
              Discard Changes
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save size={14} />}
          >
            Save Profile Changes
          </Button>
        </div>
      </div>
        {/* Unsaved Changes Banner */}
        {isDirty && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3.5 flex items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-600 shrink-0" />
              <span>
                You have unsaved changes in your organization profile. Remember to click <strong>Save Profile Changes</strong> to apply updates.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleRevert}
                className="font-medium text-amber-800 hover:underline"
              >
                Revert
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-2.5 py-1 bg-amber-600 text-white font-medium rounded hover:bg-amber-700 transition-colors"
              >
                Save Now
              </button>
            </div>
          </div>
        )}

        {/* Top Identity & Status Summary Card */}
        <div className="bg-white rounded-lg border border-[#E5E5E5] p-5 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#EA580C] to-[#C2410C] text-white flex items-center justify-center font-extrabold text-2xl shadow-sm shrink-0">
                {profile.tradeName ? profile.tradeName.slice(0, 2).toUpperCase() : 'PO'}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-[#171717]">{profile.tradeName}</h2>
                  <Badge variant="active" size="sm" className="gap-1 flex items-center">
                    <ShieldCheck size={12} className="text-emerald-600" />
                    Verified Organization
                  </Badge>
                  <span className="text-[11px] font-mono text-[#737373] bg-[#F5F5F4] px-2 py-0.5 rounded border border-[#E5E5E5]">
                    {profile.slug}
                  </span>
                </div>
                <p className="text-xs text-[#525252] font-medium">{profile.legalName}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#737373]">
                  <span className="flex items-center gap-1">
                    <Hash size={13} /> CIN: {profile.registrationNumber || '—'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={13} /> Established {profile.dateOfIncorporation ? new Date(profile.dateOfIncorporation).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#E5E5E5]">
              <div className="bg-[#FAFAF9] rounded-lg border border-[#E5E5E5] p-3 text-center min-w-[120px] flex-1 sm:flex-initial">
                <div className="text-[10px] uppercase font-bold text-[#737373] tracking-wider flex items-center justify-center gap-1">
                  <Layers size={12} className="text-[#EA580C]" /> Total Inventory
                </div>
                <div className="text-base font-bold text-[#171717] mt-0.5">
                  {profile.registeredResourceCount} Displays
                </div>
                <div className="text-[10px] text-[#737373]">Active + Inactive</div>
              </div>

              <div className="bg-[#FAFAF9] rounded-lg border border-[#E5E5E5] p-3 text-center min-w-[140px] flex-1 sm:flex-initial">
                <div className="text-[10px] uppercase font-bold text-[#737373] tracking-wider flex items-center justify-center gap-1">
                  <CreditCard size={12} className="text-[#EA580C]" /> Current Plan
                </div>
                <div className="text-base font-bold text-[#EA580C] mt-0.5">
                  Tier 2 (51-100)
                </div>
                <Link
                  to="/panel/organization/subscription"
                  className="text-[10px] font-semibold text-[#EA580C] hover:underline flex items-center justify-center gap-0.5 mt-0.5"
                >
                  Manage Quota <ExternalLink size={10} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1: Legal Identity & Tax / GSTIN */}
          <div className="space-y-6">
            {/* 1. Legal Entity & Brand Identity */}
            <Card
              header={
                <div className="flex items-center gap-2">
                  <Building2 size={17} className="text-[#EA580C]" />
                  <div>
                    <h3 className="text-sm font-bold text-[#171717]">Entity Identity & Trade Name</h3>
                    <p className="text-[11px] text-[#737373]">Official corporate trade names and contact channels.</p>
                  </div>
                </div>
              }
            >
              <div className="space-y-4 text-xs">
                <Input
                  label="Legal Entity Name"
                  required
                  placeholder="e.g. Apex Media Networks Private Limited"
                  value={profile.legalName}
                  onChange={(e) => handleChange('legalName', e.target.value)}
                  error={errors.legalName}
                  helperText="Full registered corporate name matching government incorporation certificates."
                />

                <Input
                  label="Brand / Trade Display Name"
                  required
                  placeholder="e.g. Apex Outdoor Media"
                  value={profile.tradeName}
                  onChange={(e) => handleChange('tradeName', e.target.value)}
                  error={errors.tradeName}
                  helperText="Public display name shown on bookings, proposals, and provider directory."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Corporate Registration Number (CIN / LLPIN)"
                    placeholder="e.g. U74999MH2021PTC368412"
                    value={profile.registrationNumber}
                    onChange={(e) => handleChange('registrationNumber', e.target.value.toUpperCase())}
                    leftElement={<Hash size={14} />}
                  />

                  <Input
                    label="Date of Incorporation"
                    type="date"
                    value={profile.dateOfIncorporation}
                    onChange={(e) => handleChange('dateOfIncorporation', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Primary Corporate Email"
                    type="email"
                    required
                    placeholder="contact@apexoutdoor.com"
                    value={profile.corporateEmail}
                    onChange={(e) => handleChange('corporateEmail', e.target.value)}
                    error={errors.corporateEmail}
                    leftElement={<Mail size={14} />}
                  />

                  <Input
                    label="Corporate Hotline / Phone"
                    type="tel"
                    required
                    placeholder="+91 98201 12345"
                    value={profile.corporatePhone}
                    onChange={(e) => handleChange('corporatePhone', e.target.value)}
                    error={errors.corporatePhone}
                    leftElement={<Phone size={14} />}
                  />
                </div>

                <Input
                  label="Official Website URL"
                  type="url"
                  placeholder="https://apexoutdoor.example.com"
                  value={profile.websiteUrl}
                  onChange={(e) => handleChange('websiteUrl', e.target.value)}
                  leftElement={<Globe size={14} />}
                  helperText="Optional public web presence for customer reference."
                />
              </div>
            </Card>

            {/* 2. Tax & Compliance (GSTIN / PAN) */}
            <Card
              header={
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText size={17} className="text-[#EA580C]" />
                    <div>
                      <h3 className="text-sm font-bold text-[#171717]">Tax Credentials & GSTIN</h3>
                      <p className="text-[11px] text-[#737373]">Tax invoicing parameters and statutory identifiers.</p>
                    </div>
                  </div>
                  <Badge variant="active" size="sm">
                    {profile.gstStatus}
                  </Badge>
                </div>
              }
            >
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="GSTIN (Goods & Services Tax ID)"
                    placeholder="27AABCA1234F1Z5"
                    value={profile.gstin}
                    maxLength={15}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      handleChange('gstin', val);
                      // Auto populate PAN if GSTIN has standard 15-char structure (chars 3 to 12)
                      if (val.length === 15 && !profile.pan) {
                        handleChange('pan', val.slice(2, 12));
                      }
                    }}
                    helperText="15-character Indian State + PAN + Checksum identifier."
                  />

                  <Input
                    label="Permanent Account Number (PAN)"
                    placeholder="AABCA1234F"
                    maxLength={10}
                    value={profile.pan}
                    onChange={(e) => handleChange('pan', e.target.value.toUpperCase())}
                    helperText="10-character corporate income tax identifier."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="w-full flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#171717] tracking-tight">
                      Legal Entity Type
                    </label>
                    <select
                      className="w-full h-9 rounded-md bg-white border border-[#E5E5E5] px-3 text-sm text-[#171717] focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] shadow-xs"
                      value={profile.entityType}
                      onChange={(e) => handleChange('entityType', e.target.value as OrganizationProfile['entityType'])}
                    >
                      <option value="Private Limited">Private Limited Company</option>
                      <option value="Public Limited">Public Limited Company</option>
                      <option value="LLP">Limited Liability Partnership (LLP)</option>
                      <option value="Partnership">Partnership Firm</option>
                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                    </select>
                  </div>

                  <Input
                    label="HSN / SAC Code"
                    value={profile.hsnSacCode}
                    onChange={(e) => handleChange('hsnSacCode', e.target.value)}
                    helperText="Default SAC applied to advertising space billing."
                  />
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200 rounded-md text-[11px] text-[#525252] leading-relaxed">
                  <strong>Tax Invoicing Notice:</strong> Invoices generated through the SODAARS Booking engine automatically quote this GSTIN, SAC code, and corporate legal name on all outgoing client estimates and campaign releases.
                </div>
              </div>
            </Card>
          </div>

          {/* Column 2: Registered Corporate Address & Billing Contact */}
          <div className="space-y-6">
            {/* 3. Registered Office Address */}
            <Card
              header={
                <div className="flex items-center gap-2">
                  <MapPin size={17} className="text-[#EA580C]" />
                  <div>
                    <h3 className="text-sm font-bold text-[#171717]">Registered Office Address</h3>
                    <p className="text-[11px] text-[#737373]">Statutory postal domicile for legal communications and contracts.</p>
                  </div>
                </div>
              }
            >
              <div className="space-y-4 text-xs">
                <Input
                  label="Registered Address Line 1"
                  required
                  placeholder="e.g. Unit 402, 4th Floor, Times Tower"
                  value={profile.addressLine1}
                  onChange={(e) => handleChange('addressLine1', e.target.value)}
                />

                <Input
                  label="Address Line 2 (Optional)"
                  placeholder="e.g. Kamala Mills Compound, Senapati Bapat Marg, Lower Parel"
                  value={profile.addressLine2}
                  onChange={(e) => handleChange('addressLine2', e.target.value)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="City / District"
                    required
                    placeholder="e.g. Mumbai"
                    value={profile.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    error={errors.city}
                  />

                  <Input
                    label="State / Union Territory"
                    required
                    placeholder="e.g. Maharashtra"
                    value={profile.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    error={errors.state}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Postal PIN Code"
                    required
                    maxLength={6}
                    placeholder="400013"
                    value={profile.pincode}
                    onChange={(e) => handleChange('pincode', e.target.value.replace(/\D/g, ''))}
                    error={errors.pincode}
                    helperText="6-digit Indian Postal PIN Code."
                  />

                  <Input
                    label="Country"
                    disabled
                    value={profile.country}
                  />
                </div>
              </div>
            </Card>

            {/* 4. Billing & Accounts Contact */}
            <Card
              header={
                <div className="flex items-center gap-2">
                  <CreditCard size={17} className="text-[#EA580C]" />
                  <div>
                    <h3 className="text-sm font-bold text-[#171717]">Billing & Invoicing Representative</h3>
                    <p className="text-[11px] text-[#737373]">Designated personnel receiving payments, invoices, and credit notices.</p>
                  </div>
                </div>
              }
            >
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Accounts Contact Name"
                    placeholder="e.g. Rajesh Kumar"
                    value={profile.billingContactName}
                    onChange={(e) => handleChange('billingContactName', e.target.value)}
                  />

                  <Input
                    label="Designation / Role"
                    placeholder="e.g. Billing Lead / CFO"
                    value={profile.billingContactDesignation}
                    onChange={(e) => handleChange('billingContactDesignation', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Billing Invoicing Email"
                    type="email"
                    placeholder="accounts@apexoutdoor.com"
                    value={profile.billingEmail}
                    onChange={(e) => handleChange('billingEmail', e.target.value)}
                    error={errors.billingEmail}
                    leftElement={<Mail size={14} />}
                    helperText="Receives automated statements and receipt copies."
                  />

                  <Input
                    label="Billing Contact Phone"
                    type="tel"
                    placeholder="+91 98201 54321"
                    value={profile.billingPhone}
                    onChange={(e) => handleChange('billingPhone', e.target.value)}
                    leftElement={<Phone size={14} />}
                  />
                </div>

                <Input
                  label="Default Settlement & Payment Terms"
                  placeholder="e.g. Net 15 Days from Campaign Commencement"
                  value={profile.defaultPaymentTerms}
                  onChange={(e) => handleChange('defaultPaymentTerms', e.target.value)}
                  helperText="Default payment duration printed on customer commercial proposals."
                />
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Save & Actions Footer */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E5E5E5] pb-10">
          <div className="text-xs text-[#737373]">
            Last verified profile snapshot: <strong className="text-[#171717]">{new Date(profile.verifiedAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
          </div>
          <div className="flex items-center gap-3">
            {isDirty && (
              <Button
                variant="secondary"
                size="md"
                onClick={handleRevert}
                leftIcon={<RotateCcw size={15} />}
                disabled={isSaving}
              >
                Discard Changes
              </Button>
            )}
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              isLoading={isSaving}
              leftIcon={<Save size={15} />}
            >
              Save Profile Changes
            </Button>
          </div>
        </div>
      </div>
  );
};

export default OrganizationProfilePage;
