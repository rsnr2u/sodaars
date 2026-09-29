import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getApiErrorMessage, getApiFieldErrors } from '../../services/api';
import Input from '../../components/ui/Input';
import {
  Building2,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Circle,
  Info,
  Layers,
  Calendar,
  Inbox,
  ShieldCheck,
  Check,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    mobile: '',
    password: '',
    password_confirmation: '',
    terms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Password validation checks
  const isLengthValid = formData.password.length >= 8;
  const isMatchValid =
    formData.password.length > 0 &&
    formData.password === formData.password_confirmation;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    if (formData.password !== formData.password_confirmation) {
      setErrorMessage('Passwords do not match. Please verify your password confirmation.');
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage('Password must contain at least 8 characters.');
      return;
    }

    if (!formData.terms) {
      setErrorMessage('You must accept the Provider Master Service Agreement to register.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(formData);
      success('Provider organization registered successfully. Welcome to SODAARS!');
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const errors = getApiFieldErrors(err);
      let msg = getApiErrorMessage(err);
      if (errors && Object.keys(errors).length > 0) {
        const firstField = Object.keys(errors)[0];
        const firstMsg = errors[firstField]?.[0];
        if (firstMsg) {
          msg = firstMsg;
        }
      }
      setErrorMessage(msg);
      if (errors) setFieldErrors(errors);
      showError(msg, 'Registration Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="site-page-wrapper">
      {/* =========================================================
          1. Corporate Website Header
          ========================================================= */}
      <header className="site-navbar">
        <div className="site-navbar-inner">
          <Link to="/register" className="site-brand">
            <div className="site-brand-logo-icon">S</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="site-brand-text">SODAARS</span>
              <span className="site-brand-pill">Provider Portal</span>
            </div>
          </Link>

          <nav className="site-nav-links">
            <a href="#features" className="site-nav-link">Platform Features</a>
            <a href="#how-it-works" className="site-nav-link">How It Works</a>
            <a href="#starter-plan" className="site-nav-link">Starter Tier</a>
            <a href="#faq" className="site-nav-link">FAQ</a>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="site-nav-link"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <span>Public Directory</span>
              <ExternalLink size={13} />
            </a>
          </nav>

          <div className="site-nav-actions">
            <Link to="/login" className="site-signin-btn">
              Sign In
            </Link>
            <a href="#register-form" className="site-primary-nav-btn">
              Register Free
            </a>
          </div>
        </div>
      </header>

      {/* =========================================================
          2. High-Impact Website Hero Section with Registration Form
          ========================================================= */}
      <section className="site-hero-section">
        <div className="site-hero-container">
          {/* Left Column: Marketing Pitch & Value Props */}
          <div className="site-hero-left">
            <div className="site-hero-tag">
              <span>🎉 Free Starter Tier Included • Up to 50 Assets</span>
            </div>

            <h1 className="site-hero-heading">
              Grow Your Outdoor Media Business with India&apos;s <span className="accent">#1 OOH Operating Platform</span>
            </h1>

            <p className="site-hero-lead">
              List physical & digital billboard assets, track live calendar availability, eliminate
              double-bookings, and receive verified campaign inquiries directly from top national brands
              and media planning agencies.
            </p>

            {/* Value Highlights */}
            <div className="site-hero-bullets">
              <div className="site-hero-bullet-item">
                <div className="site-hero-bullet-icon">
                  <Check size={14} />
                </div>
                <div className="site-hero-bullet-text">
                  <strong>Zero Intermediary Commissions:</strong> Keep 100% of your booking revenue. All transactions and client deals remain direct.
                </div>
              </div>

              <div className="site-hero-bullet-item">
                <div className="site-hero-bullet-icon">
                  <Check size={14} />
                </div>
                <div className="site-hero-bullet-text">
                  <strong>Complete Inventory Control:</strong> Billboards, Unipoles, Digital LED screens, and Gantries with high-precision GPS geocoding.
                </div>
              </div>

              <div className="site-hero-bullet-item">
                <div className="site-hero-bullet-icon">
                  <Check size={14} />
                </div>
                <div className="site-hero-bullet-text">
                  <strong>Real-Time Availability Engine:</strong> Live interactive scheduling calendar preventing double-bookings with tentative hold expiries.
                </div>
              </div>

              <div className="site-hero-bullet-item">
                <div className="site-hero-bullet-icon">
                  <Check size={14} />
                </div>
                <div className="site-hero-bullet-text">
                  <strong>Direct Inquiries from Brand Planners:</strong> Receive qualified proposals directly from verified advertisers browsing the SODAARS Directory.
                </div>
              </div>
            </div>

            {/* Scale Metrics */}
            <div className="site-hero-stats">
              <div className="site-hero-stat-box">
                <span className="site-hero-stat-number">5,000+</span>
                <span className="site-hero-stat-label">Active Media Faces</span>
              </div>
              <div className="site-hero-stat-box">
                <span className="site-hero-stat-number">₹0</span>
                <span className="site-hero-stat-label">Broker Commission</span>
              </div>
              <div className="site-hero-stat-box">
                <span className="site-hero-stat-number">99.9%</span>
                <span className="site-hero-stat-label">Schedule Accuracy</span>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="site-hero-testimonial">
              <div>
                &ldquo;SODAARS transformed our inventory tracking across Mumbai & Pune. We went from managing hoardings in spreadsheets to closing direct client deals within minutes.&rdquo;
              </div>
              <div className="site-hero-testimonial-author">
                — Director of Media Operations, Metro Outdoor Media
              </div>
            </div>
          </div>

          {/* Right Column: High-Converting Corporate Registration Form */}
          <div className="site-form-card" id="register-form">
            <div className="site-form-card-header">
              <h2 className="site-form-card-title">Create Provider Organization</h2>
              <p className="site-form-card-subtitle">
                Register your media business to start managing billboard inventory and receiving direct buyer inquiries.
              </p>
            </div>

            {/* Starter Tier Callout Banner */}
            <div className="site-plan-banner">
              <Info size={16} style={{ flexShrink: 0 }} />
              <div>
                <strong>Starter Tier Included Free:</strong> Up to 50 advertising assets, live calendar schedules, and public directory profile.
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="site-form-error">
                <AlertCircle size={17} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>{errorMessage}</div>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit}>
              {/* Section 1: Organization & Contact Details */}
              <div className="site-form-divider">
                <Building2 size={14} />
                <span>1. Organization & Contact Information</span>
              </div>

              <Input
                label="Company / Trading Name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="e.g. Apex Media Outdoors Pvt Ltd"
                required
                error={fieldErrors.company_name?.[0]}
                helperText="Official trading brand name as displayed to media buyers on the public directory"
                leftIcon={<Building2 size={16} />}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input
                  label="Principal Contact Name"
                  name="contact_name"
                  value={formData.contact_name}
                  onChange={handleChange}
                  placeholder="e.g. Vikram Malhotra"
                  required
                  error={fieldErrors.contact_name?.[0]}
                  helperText="Primary account administrator"
                  leftIcon={<User size={16} />}
                />

                <Input
                  label="Business Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="operations@apexmedia.com"
                  required
                  error={fieldErrors.email?.[0]}
                  helperText="For inquiry alerts & account login"
                  leftIcon={<Mail size={16} />}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input
                  label="Business Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  error={fieldErrors.phone?.[0]}
                  helperText="Primary corporate telephone"
                  leftIcon={<Phone size={16} />}
                />
                <Input
                  label="Mobile / WhatsApp (Optional)"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="+91 98765 00000"
                  error={fieldErrors.mobile?.[0]}
                  helperText="For urgent campaign inquiry alerts"
                />
              </div>

              {/* Section 2: Security Credentials */}
              <div className="site-form-divider" style={{ marginTop: '1.25rem' }}>
                <Lock size={14} />
                <span>2. Authentication & Access Security</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input
                  label="Account Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  error={fieldErrors.password?.[0]}
                  leftIcon={<Lock size={16} />}
                  rightIcon={
                    <button
                      type="button"
                      className="site-eye-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />

                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                  error={fieldErrors.password_confirmation?.[0]}
                  leftIcon={<Lock size={16} />}
                  rightIcon={
                    <button
                      type="button"
                      className="site-eye-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />
              </div>

              {/* Password Requirements Checklist */}
              <div className="site-pwd-checklist">
                <span className={`site-pwd-crit-item ${isLengthValid ? 'valid' : ''}`}>
                  {isLengthValid ? (
                    <CheckCircle2 size={13} style={{ color: '#059669' }} />
                  ) : (
                    <Circle size={13} />
                  )}
                  <span>8 or more characters</span>
                </span>
                <span className={`site-pwd-crit-item ${isMatchValid ? 'valid' : ''}`}>
                  {isMatchValid ? (
                    <CheckCircle2 size={13} style={{ color: '#059669' }} />
                  ) : (
                    <Circle size={13} />
                  )}
                  <span>Passwords match</span>
                </span>
              </div>

              {/* Legal Terms Acceptance */}
              <div style={{ marginBottom: '1.5rem', marginTop: '0.75rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    color: '#475569',
                    lineHeight: 1.45,
                  }}
                >
                  <input
                    type="checkbox"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    style={{ marginTop: '3px', borderRadius: '3px' }}
                    required
                  />
                  <span>
                    I accept the SODAARS Provider Master Service Agreement, Data Governance Standards,
                    and Direct Media Buyer Contact Policy.
                  </span>
                </label>
                {fieldErrors.terms?.[0] && (
                  <div
                    className="form-error"
                    style={{ marginTop: '0.35rem', color: '#be123c', fontSize: '0.8rem' }}
                  >
                    {fieldErrors.terms[0]}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="site-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Registering Organization...</span>
                ) : (
                  <>
                    <span>Create Provider Account & Start Free</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            <div className="site-form-footer">
              Already have a registered media provider account?{' '}
              <Link to="/login">
                Sign in to your organization
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. Platform Features Grid (#features)
          ========================================================= */}
      <section className="site-section bg-slate" id="features">
        <div className="site-section-inner">
          <div className="site-section-header">
            <span className="site-section-badge">Platform Capabilities</span>
            <h2 className="site-section-title">Everything You Need to Run Commercial Outdoor Media</h2>
            <p className="site-section-subtitle">
              Built specifically for Indian outdoor advertising owners, concessionaires, and media networks.
            </p>
          </div>

          <div className="site-features-grid">
            <div className="site-feature-box">
              <div className="site-feature-box-icon">
                <Layers size={22} />
              </div>
              <h3 className="site-feature-box-title">Asset & Location Registry</h3>
              <p className="site-feature-box-desc">
                High-precision GPS tagging, daytime/nighttime illumination specifications, multi-angle photos, and format attributes for static and digital assets.
              </p>
            </div>

            <div className="site-feature-box">
              <div className="site-feature-box-icon">
                <Calendar size={22} />
              </div>
              <h3 className="site-feature-box-title">Live Availability Engine</h3>
              <p className="site-feature-box-desc">
                Dynamic timeline calendar, automated tentative holds with expiry limits, and real-time conflict checking across all your billboard faces.
              </p>
            </div>

            <div className="site-feature-box">
              <div className="site-feature-box-icon">
                <Inbox size={22} />
              </div>
              <h3 className="site-feature-box-title">Direct Campaign Inquiries</h3>
              <p className="site-feature-box-desc">
                Media buyers and brand planners browsing the SODAARS Public Directory send structured inquiries directly to your private provider inbox.
              </p>
            </div>

            <div className="site-feature-box">
              <div className="site-feature-box-icon">
                <ShieldCheck size={22} />
              </div>
              <h3 className="site-feature-box-title">Enterprise Role Governance</h3>
              <p className="site-feature-box-desc">
                Fine-grained permissions across Owner, Operations Manager, and Field Staff with multi-tenant database isolation and complete audit logging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. How It Works in 3 Steps (#how-it-works)
          ========================================================= */}
      <section className="site-section" id="how-it-works">
        <div className="site-section-inner">
          <div className="site-section-header">
            <span className="site-section-badge">Onboarding Workflow</span>
            <h2 className="site-section-title">How SODAARS Works in 3 Simple Steps</h2>
            <p className="site-section-subtitle">
              Get your media company registered and live on India&apos;s outdoor advertising directory in minutes.
            </p>
          </div>

          <div className="site-steps-grid">
            <div className="site-step-card">
              <div className="site-step-number">1</div>
              <h3 className="site-step-title">Register Your Organization</h3>
              <p className="site-step-text">
                Fill out the registration form above to claim your instant Starter Tier account with Owner privileges and up to 50 asset slots.
              </p>
            </div>

            <div className="site-step-card">
              <div className="site-step-number">2</div>
              <h3 className="site-step-title">Upload Inventory & Rate Cards</h3>
              <p className="site-step-text">
                Add your hoarding locations, billboard specifications, illumination standards, geo-coordinates, photos, and indicative pricing.
              </p>
            </div>

            <div className="site-step-card">
              <div className="site-step-number">3</div>
              <h3 className="site-step-title">Manage Bookings & Inquiries</h3>
              <p className="site-step-text">
                Track availability on the live calendar, place campaign holds, and receive qualified proposals directly from verified national advertisers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          5. Starter Tier Plan Card (#starter-plan)
          ========================================================= */}
      <section className="site-section bg-slate" id="starter-plan">
        <div className="site-section-inner">
          <div className="site-plan-card">
            <div className="site-plan-left">
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#60a5fa', letterSpacing: '0.06em' }}>
                Included on Registration
              </span>
              <h3>Starter Tier</h3>
              <p>
                Everything required to digitize and professionalize your outdoor advertising inventory management.
              </p>
              <div className="site-plan-price-tag">
                <span className="site-plan-price-val">₹0</span>
                <span className="site-plan-price-lbl">Initial Provisioning Included</span>
              </div>
            </div>

            <div className="site-plan-features-list">
              <div className="site-plan-feat-item">
                <Check size={18} />
                <span>Up to 50 physical or digital advertising asset faces</span>
              </div>
              <div className="site-plan-feat-item">
                <Check size={18} />
                <span>Real-time availability schedule & tentative hold engine</span>
              </div>
              <div className="site-plan-feat-item">
                <Check size={18} />
                <span>Customer CRM & direct campaign inquiry management</span>
              </div>
              <div className="site-plan-feat-item">
                <Check size={18} />
                <span>Public Discovery Directory profile & inventory showcase</span>
              </div>
              <div className="site-plan-feat-item">
                <Check size={18} />
                <span>Owner, Operations Manager, and Staff multi-role governance</span>
              </div>
              <div className="site-plan-feat-item">
                <Check size={18} />
                <span>Direct client email & WhatsApp notifications</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          6. FAQ Section (#faq)
          ========================================================= */}
      <section className="site-section" id="faq">
        <div className="site-section-inner">
          <div className="site-section-header">
            <span className="site-section-badge">Help & Knowledge</span>
            <h2 className="site-section-title">Frequently Asked Questions</h2>
            <p className="site-section-subtitle">
              Common questions from outdoor media owners about joining SODAARS.
            </p>
          </div>

          <div className="site-faq-grid">
            <div className="site-faq-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <HelpCircle size={16} style={{ color: '#2563eb' }} />
                <h3 className="site-faq-question" style={{ margin: 0 }}>Does SODAARS take commission on bookings?</h3>
              </div>
              <p className="site-faq-answer">
                No. SODAARS is a pure SaaS operating platform and directory. All negotiations, quotations, commercial agreements, and payments remain 100% direct between you and your client.
              </p>
            </div>

            <div className="site-faq-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <HelpCircle size={16} style={{ color: '#2563eb' }} />
                <h3 className="site-faq-question" style={{ margin: 0 }}>Can I list both static hoardings and digital screens?</h3>
              </div>
              <p className="site-faq-answer">
                Yes. SODAARS provides comprehensive support for static billboards, unipoles, bridge gantries, bus shelters, as well as digital LED billboards with time-slot allocation.
              </p>
            </div>

            <div className="site-faq-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <HelpCircle size={16} style={{ color: '#2563eb' }} />
                <h3 className="site-faq-question" style={{ margin: 0 }}>How soon can I start listing after registering?</h3>
              </div>
              <p className="site-faq-answer">
                Immediately. Upon form submission, your organization workspace is provisioned on the Starter Tier, giving you instant access to add locations, inventory assets, and invite staff.
              </p>
            </div>

            <div className="site-faq-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <HelpCircle size={16} style={{ color: '#2563eb' }} />
                <h3 className="site-faq-question" style={{ margin: 0 }}>Can my operations team have separate access?</h3>
              </div>
              <p className="site-faq-answer">
                Yes. You can invite your team members with granular roles (Operations Manager, Staff) to manage inventory updates and schedules while you retain Owner administration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          7. Corporate Website Footer
          ========================================================= */}
      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="site-footer-top">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '28px', height: '28px', backgroundColor: '#1d4ed8', borderRadius: '4px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  S
                </div>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>SODAARS</span>
              </div>
              <p className="site-footer-brand-desc">
                India&apos;s authoritative outdoor advertising operating system and inventory discovery platform. Connecting commercial media owners with verified brand advertisers.
              </p>
            </div>

            <div>
              <div className="site-footer-col-title">OOH Solutions</div>
              <div className="site-footer-links">
                <span className="site-footer-link">Billboards & Hoardings</span>
                <span className="site-footer-link">Unipoles & Gantries</span>
                <span className="site-footer-link">Digital LED Screens (DOOH)</span>
                <span className="site-footer-link">Transit & Bus Shelters</span>
              </div>
            </div>

            <div>
              <div className="site-footer-col-title">Platform</div>
              <div className="site-footer-links">
                <a href="#features" className="site-footer-link">Asset Registry</a>
                <a href="#features" className="site-footer-link">Live Availability Engine</a>
                <a href="#features" className="site-footer-link">Direct Inquiries CRM</a>
                <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" className="site-footer-link">
                  Public Directory →
                </a>
              </div>
            </div>

            <div>
              <div className="site-footer-col-title">Governance & Security</div>
              <div className="site-footer-links">
                <span className="site-footer-link">256-Bit SSL Encryption</span>
                <span className="site-footer-link">Multi-Tenant Data Isolation</span>
                <span className="site-footer-link">SOC 2 Type II Architecture</span>
                <span className="site-footer-link">Direct Buyer Contact Policy</span>
              </div>
            </div>
          </div>

          <div className="site-footer-bottom">
            <div>
              &copy; {new Date().getFullYear()} SODAARS Media Technologies Private Limited. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>Provider Sign In</Link>
              <a href="#register-form" style={{ color: '#94a3b8', textDecoration: 'none' }}>Register Organization</a>
              <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>Public Discovery</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RegisterPage;
