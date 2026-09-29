import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../services/api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import {
  MapPin,
  Layers,
  Inbox,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Building,
} from 'lucide-react';

interface MetricCounts {
  locations: number | null;
  resources: number | null;
  leads: number | null;
}

export const DashboardPage: React.FC = () => {
  const { user, activeOrg, role } = useAuth();
  const [counts, setCounts] = useState<MetricCounts>({
    locations: null,
    resources: null,
    leads: null,
  });
  const [isLoadingCounts, setIsLoadingCounts] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchRealCounts = async () => {
      try {
        // Retrieve real counts from existing frozen endpoints using per_page=1 to extract pagination total
        const [locationsRes, resourcesRes, leadsRes] = await Promise.allSettled([
          apiClient.get('/tenant/locations?per_page=1'),
          apiClient.get('/tenant/advertising-resources?per_page=1'),
          apiClient.get('/tenant/leads?per_page=1'),
        ]);

        if (!isMounted) return;

        setCounts({
          locations:
            locationsRes.status === 'fulfilled'
              ? locationsRes.value.data?.data?.pagination?.total ?? 0
              : 0,
          resources:
            resourcesRes.status === 'fulfilled'
              ? resourcesRes.value.data?.data?.pagination?.total ?? 0
              : 0,
          leads:
            leadsRes.status === 'fulfilled'
              ? leadsRes.value.data?.data?.pagination?.total ?? 0
              : 0,
        });
      } catch {
        if (isMounted) {
          setCounts({ locations: 0, resources: 0, leads: 0 });
        }
      } finally {
        if (isMounted) setIsLoadingCounts(false);
      }
    };

    fetchRealCounts();

    return () => {
      isMounted = false;
    };
  }, [activeOrg?.uuid]);

  const isVerified = activeOrg?.verification_status === 'VERIFIED';
  const roleLabel = role ? role.replace('PROVIDER_', '') : 'STAFF';

  return (
    <div>
      {/* Welcome Header */}
      <div className="page-header">
        <div className="page-header-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <h1>Operational Dashboard</h1>
            <Badge variant="primary">{roleLabel}</Badge>
          </div>
          <p>
            Welcome, <strong>{user?.name}</strong>. Managing assets for{' '}
            <strong>{activeOrg?.trading_name || activeOrg?.name}</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <ExternalLink size={14} />
            <span>View Public Directory</span>
          </a>
        </div>
      </div>

      {/* Organization Status Banner */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}
      >
        <div
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: isVerified ? 'var(--emerald-50)' : 'var(--amber-50)',
            border: `1px solid ${isVerified ? '#a7f3d0' : '#fde68a'}`,
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          {isVerified ? (
            <ShieldCheck size={28} style={{ color: 'var(--emerald-600)', flexShrink: 0 }} />
          ) : (
            <AlertCircle size={28} style={{ color: 'var(--amber-600)', flexShrink: 0 }} />
          )}
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-heading)' }}>
              Verification: {isVerified ? 'Verified Media Provider' : 'Under Verification'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {isVerified
                ? 'Your organization is verified to appear on the public directory.'
                : 'Account undergoing platform compliance verification.'}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--surface-white)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <Building size={26} style={{ color: 'var(--blue-600)', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-heading)' }}>
              Directory Visibility: {activeOrg?.public_directory_visible ? 'Enabled (ON)' : 'Disabled (OFF)'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Public directory showcases verified inventory when enabled.
            </div>
          </div>
        </div>
      </div>

      {/* Real Count Metric Cards (No fabricated metrics) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        {/* Total Locations */}
        <Card bodyClassName="metric-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>
              Site Locations
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--blue-50)',
                color: 'var(--blue-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MapPin size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-heading)', lineHeight: 1 }}>
            {isLoadingCounts ? '...' : counts.locations ?? 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Physical locations registered
          </div>
        </Card>

        {/* Total Advertising Resources */}
        <Card bodyClassName="metric-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>
              Advertising Resources
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--orange-50)',
                color: 'var(--orange-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Layers size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-heading)', lineHeight: 1 }}>
            {isLoadingCounts ? '...' : counts.resources ?? 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Hoardings, unipoles & DOOH screens
          </div>
        </Card>

        {/* Total Directory Leads */}
        <Card bodyClassName="metric-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>
              Inbound Directory Leads
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--blue-50)',
                color: 'var(--blue-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Inbox size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-heading)', lineHeight: 1 }}>
            {isLoadingCounts ? '...' : counts.leads ?? 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Inquiries from public directory
          </div>
        </Card>
      </div>

      {/* Incremental Integration Roadmap */}
      <Card
        title="Provider SaaS Frontend Integration Roadmap"
        subtitle="Current Stage: Step 1 Foundation & Shell established"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--blue-50)',
              border: '1px solid var(--blue-200)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
            }}
          >
            <CheckCircle2 size={20} style={{ color: 'var(--blue-600)', marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--blue-900)' }}>
                Step 1: Foundation & Application Shell (Current)
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--blue-800)', marginTop: '2px' }}>
                Authentication, session persistence, responsive dark navy sidebar, breadcrumbs, multi-tenant organization switching, and design system tokens.
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--canvas-bg)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
            }}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'var(--border-medium)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '2px',
                flexShrink: 0,
              }}
            >
              2
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-heading)' }}>
                Step 2: Location Management & Site Media (Upcoming)
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Interactive site location registry, Leaflet map pin picker, and Stage 9 photo uploader.
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--canvas-bg)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
            }}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'var(--border-medium)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '2px',
                flexShrink: 0,
              }}
            >
              3
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-heading)' }}>
                Step 3: Advertising Resources & Technical Specs (Upcoming)
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Hoardings, unipoles, DOOH specifications, indicative rate card setup, immutable slugs, and media gallery.
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--canvas-bg)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
            }}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'var(--border-medium)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '2px',
                flexShrink: 0,
              }}
            >
              4
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-heading)' }}>
                Step 4: Availability Matrix & Directory Lead Inbox (Upcoming)
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Inventory calendar timeline, hold placement, and incoming public directory lead management with state machine.
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
