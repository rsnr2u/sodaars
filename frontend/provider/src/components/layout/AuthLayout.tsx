import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Calendar,
  Inbox,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Lock,
} from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  cardTitle: string;
  cardSubtitle: string;
  isWide?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  cardTitle,
  cardSubtitle,
  isWide = false,
}) => {
  return (
    <div className="auth-split-wrapper">
      {/* =========================================================
          Left Column: Institutional Corporate Hero
          ========================================================= */}
      <aside className="auth-hero-section">
        <div className="auth-hero-content">
          {/* Corporate Brand Lockup */}
          <div className="auth-brand-lockup">
            <div className="auth-brand-emblem">S</div>
            <div className="auth-brand-meta">
              <span className="auth-brand-name">SODAARS</span>
              <span className="auth-brand-tagline">OOH Enterprise Operating System</span>
            </div>
          </div>

          {/* Value Header */}
          <h1 className="auth-hero-title">
            Enterprise OOH Asset Management & Inventory Control
          </h1>

          <p className="auth-hero-desc">
            The authoritative digital platform for commercial outdoor media owners,
            concessionaires, and billboard operators across India.
          </p>

          {/* Institutional Value Modules */}
          <div className="auth-value-modules">
            <div className="auth-value-card">
              <div className="auth-value-icon">
                <Layers size={18} />
              </div>
              <div>
                <div className="auth-value-title">Asset & Location Infrastructure</div>
                <div className="auth-value-text">
                  Master registry for billboards, unipoles, digital LED screens, and gantries with high-precision GPS geocoding and illumination standards.
                </div>
              </div>
            </div>

            <div className="auth-value-card">
              <div className="auth-value-icon">
                <Calendar size={18} />
              </div>
              <div>
                <div className="auth-value-title">Live Availability & Booking Governance</div>
                <div className="auth-value-text">
                  Real-time calendar scheduling engine preventing double-bookings with tentative hold expiries and occupancy tracking.
                </div>
              </div>
            </div>

            <div className="auth-value-card">
              <div className="auth-value-icon">
                <Inbox size={18} />
              </div>
              <div>
                <div className="auth-value-title">Direct Enterprise Campaign Inquiries</div>
                <div className="auth-value-text">
                  Receive qualified campaign requests directly from verified brands and media planning agencies on the Public Directory.
                </div>
              </div>
            </div>

            <div className="auth-value-card">
              <div className="auth-value-icon">
                <ShieldCheck size={18} />
              </div>
              <div>
                <div className="auth-value-title">Multi-Tier Role Governance & Security</div>
                <div className="auth-value-text">
                  Strict tenant isolation with role-based access control across Owner, Operations Manager, and Field Staff personnel.
                </div>
              </div>
            </div>
          </div>

          {/* Key Trust Metrics */}
          <div className="auth-trust-strip">
            <div className="auth-trust-metric">
              <span className="auth-trust-num">5,000+</span>
              <span className="auth-trust-lbl">Active Media Faces</span>
            </div>
            <div className="auth-trust-metric">
              <span className="auth-trust-num">99.9%</span>
              <span className="auth-trust-lbl">Schedule Accuracy</span>
            </div>
            <div className="auth-trust-metric">
              <span className="auth-trust-num">Zero</span>
              <span className="auth-trust-lbl">Broker Commission</span>
            </div>
          </div>
        </div>

        {/* Institutional Footer */}
        <footer className="auth-hero-footer">
          <div className="auth-security-badges">
            <div className="auth-security-badge">
              <CheckCircle2 size={14} style={{ color: '#38bdf8' }} />
              <span>256-Bit SSL Encryption</span>
            </div>
            <div className="auth-security-badge">
              <Lock size={14} style={{ color: '#38bdf8' }} />
              <span>Tenant Data Isolation</span>
            </div>
          </div>

          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="auth-dir-link"
          >
            <span>Public Directory</span>
            <ExternalLink size={12} />
          </a>
        </footer>
      </aside>

      {/* =========================================================
          Right Column: Corporate Form Panel
          ========================================================= */}
      <main className="auth-form-section">
        <div className={`auth-form-container ${isWide ? 'wide-register' : ''}`}>
          <div className="auth-corporate-card">
            {/* Header */}
            <div className="auth-card-header">
              <div className="auth-card-top">
                <Link to="/login" className="auth-card-logo">
                  <div className="auth-card-icon">S</div>
                  <span className="auth-card-brandname">SODAARS</span>
                </Link>
                <span className="auth-card-portal-badge">Provider Portal</span>
              </div>

              <h2 className="auth-card-title">{cardTitle}</h2>
              <p className="auth-card-subtitle">{cardSubtitle}</p>
            </div>

            {/* Form Content */}
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
