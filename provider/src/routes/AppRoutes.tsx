import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

/* Layouts */
import PublicLayout from '../layouts/PublicLayout';
import PanelLayout from '../layouts/PanelLayout';

/* Public Pages */
import HomePage from '../public/pages/HomePage';
import SolutionsPage from '../public/pages/SolutionsPage';
import ResourceManagementPage from '../public/pages/solutions/ResourceManagementPage';
import AvailabilityEnginePage from '../public/pages/solutions/AvailabilityEnginePage';
import BookingPipelinePage from '../public/pages/solutions/BookingPipelinePage';
import CustomerCRMPage from '../public/pages/solutions/CustomerCRMPage';
import CampaignExecutionPage from '../public/pages/solutions/CampaignExecutionPage';
import ResourcesPage from '../public/pages/ResourcesPage';
import GuidesPlaybooksPage from '../public/pages/resources/GuidesPlaybooksPage';
import FAQPage from '../public/pages/resources/FAQPage';
import HelpSupportPage from '../public/pages/resources/HelpSupportPage';
import MarketplacePage from '../public/pages/MarketplacePage';
import MarketplaceOverviewPage from '../public/pages/marketplace/MarketplaceOverviewPage';
import MarketplaceHowItWorksPage from '../public/pages/marketplace/MarketplaceHowItWorksPage';
import MarketplaceDiscoverPage from '../public/pages/marketplace/MarketplaceDiscoverPage';
import MarketplaceAgreementPublicPage from '../public/pages/marketplace/MarketplaceAgreementPublicPage';
import PricingPage from '../public/pages/PricingPage';
import CompanyPage from '../public/pages/CompanyPage';
import AboutCompanyPage from '../public/pages/company/AboutCompanyPage';
import ContactPage from '../public/pages/company/ContactPage';
import PartnershipsPage from '../public/pages/company/PartnershipsPage';
import SignInPage from '../public/pages/SignInPage';
import GetStartedPage from '../public/pages/GetStartedPage';

/* Provider Panel Pages */
import DashboardPage from '../panel/pages/DashboardPage';
import PanelResourcesPage from '../panel/pages/ResourcesPage';
import AvailabilityPage from '../panel/pages/AvailabilityPage';
import BookingsPage from '../panel/pages/BookingsPage';
import CreateBookingPage from '../panel/pages/CreateBookingPage';
import CustomersPage from '../panel/pages/CustomersPage';
import CustomerBookingsPage from '../panel/pages/CustomerBookingsPage';
import CampaignsPage from '../panel/pages/CampaignsPage';
import FinancePage from '../panel/pages/FinancePage';
import ReportsPage from '../panel/pages/ReportsPage';

import OrganizationLayout from '../panel/layouts/OrganizationLayout';
import OrganizationProfilePage from '../panel/pages/organization/OrganizationProfilePage';
import TeamManagementPage from '../panel/pages/organization/TeamManagementPage';
import SubscriptionPage from '../panel/pages/organization/SubscriptionPage';
import OrgMarketplacePage from '../panel/pages/organization/MarketplacePage';
import MarketplaceAgreementPage from '../panel/pages/organization/MarketplaceAgreementPage';
import SettingsPage from '../panel/pages/organization/SettingsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public Provider Website Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/solutions/resource-management" element={<ResourceManagementPage />} />
        <Route path="/solutions/availability-engine" element={<AvailabilityEnginePage />} />
        <Route path="/solutions/booking-pipeline" element={<BookingPipelinePage />} />
        <Route path="/solutions/customer-crm" element={<CustomerCRMPage />} />
        <Route path="/solutions/campaign-execution" element={<CampaignExecutionPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/resources/outdoor-advertising-resources" element={<ResourcesPage />} />
        <Route path="/resources/guides-playbooks" element={<GuidesPlaybooksPage />} />
        <Route path="/resources/faq" element={<FAQPage />} />
        <Route path="/resources/help-support" element={<HelpSupportPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/marketplace/overview" element={<MarketplaceOverviewPage />} />
        <Route path="/marketplace/how-it-works" element={<MarketplaceHowItWorksPage />} />
        <Route path="/marketplace/discover" element={<MarketplaceDiscoverPage />} />
        <Route path="/marketplace/agreement" element={<MarketplaceAgreementPublicPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/company" element={<CompanyPage />} />
        <Route path="/company/about" element={<AboutCompanyPage />} />
        <Route path="/company/contact" element={<ContactPage />} />
        <Route path="/company/partnerships" element={<PartnershipsPage />} />
        <Route path="/company/why-sodaars" element={<PartnershipsPage />} />
      </Route>

      {/* 2. Standalone Dedicated Auth Routes (Exact 1:1 match with auth design screens) */}
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/login" element={<Navigate to="/signin" replace />} />
      <Route path="/get-started" element={<GetStartedPage />} />
      <Route path="/register" element={<Navigate to="/get-started" replace />} />

      {/* 3. Provider Panel Routes (Top Navigation Only - No Sidebar) */}
      <Route path="/panel" element={<PanelLayout />}>
        <Route index element={<Navigate to="/panel/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="resources" element={<PanelResourcesPage />} />
        <Route path="availability" element={<AvailabilityPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="bookings/create" element={<CreateBookingPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="customers/:customerId/bookings" element={<CustomerBookingsPage />} />
        <Route path="campaigns" element={<CampaignsPage />} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />

        {/* Organization Sub-Routes with Side Sub Menu in Content Area */}
        <Route path="organization" element={<OrganizationLayout />}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<OrganizationProfilePage />} />
          <Route path="team" element={<TeamManagementPage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
          <Route path="marketplace" element={<OrgMarketplacePage />} />
          <Route path="marketplace-agreement" element={<MarketplaceAgreementPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
