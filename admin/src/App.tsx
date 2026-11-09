import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';

// Administration Domain Pages
import { DashboardPage } from './pages/administration/DashboardPage';
import { SystemHealthPage } from './pages/administration/SystemHealthPage';
import { PlansPricingPage } from './pages/administration/PlansPricingPage';
import { SubscriberManagementPage } from './pages/administration/SubscriberManagementPage';
import { PaymentHistoryPage } from './pages/administration/PaymentHistoryPage';
import { StaffRolesPage } from './pages/administration/StaffRolesPage';
import { MasterDataPage } from './pages/administration/MasterDataPage';
import { AuditLogsPage } from './pages/administration/AuditLogsPage';
import { SettingsPage } from './pages/administration/SettingsPage';

// Provider Operations Domain Pages
import { ProviderDirectoryPage } from './pages/providers/ProviderDirectoryPage';
import { ProviderDetailPage } from './pages/providers/ProviderDetailPage';
import { KycVerificationDeskPage } from './pages/providers/KycVerificationDeskPage';
import { GlobalResourceRegistryPage } from './pages/providers/GlobalResourceRegistryPage';
import { AdminBlockManagementPage } from './pages/providers/AdminBlockManagementPage';
import { SubscriptionQuotasPage } from './pages/providers/SubscriptionQuotasPage';

// Marketplace Domain Pages (Phase 2 Blueprint)
import { MarketplaceRoadmapPage } from './pages/marketplace/MarketplaceRoadmapPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Admin Layout with 3-Domain Topbar Switcher & Contextual Sidebar */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />

          {/* Domain 1: Administration & Governance */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="health" element={<SystemHealthPage />} />
          <Route path="plans" element={<PlansPricingPage />} />
          <Route path="subscribers" element={<SubscriberManagementPage />} />
          <Route path="payments" element={<PaymentHistoryPage />} />
          <Route path="staff" element={<StaffRolesPage />} />
          <Route path="master-data" element={<MasterDataPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="settings" element={<SettingsPage />} />

          {/* Domain 2: Provider Operations & Inventory */}
          <Route path="providers" element={<ProviderDirectoryPage />} />
          <Route path="providers/:id" element={<ProviderDetailPage />} />
          <Route path="providers/kyc" element={<KycVerificationDeskPage />} />
          <Route path="resources" element={<GlobalResourceRegistryPage />} />
          <Route path="resources/blocks" element={<AdminBlockManagementPage />} />
          <Route path="subscriptions" element={<SubscriptionQuotasPage />} />

          {/* Domain 3: Marketplace (Phase 2 Roadmap) */}
          <Route path="marketplace" element={<MarketplaceRoadmapPage />} />
          <Route path="marketplace/*" element={<MarketplaceRoadmapPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
