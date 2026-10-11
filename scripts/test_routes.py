import os
import re
import json

src_dir = r"c:\xampp\htdocs\DIGITALKSIND\sodaars\provider\src"

# Route definitions from AppRoutes.tsx
DEFINED_ROUTES = {
    "/": {"name": "Home Page", "component": "HomePage", "section": "Public Portal", "type": "Page"},
    "/solutions": {"name": "Solutions Hub", "component": "SolutionsPage", "section": "Public Portal", "type": "Page"},
    "/solutions/resource-management": {"name": "Resource Management Solution", "component": "ResourceManagementPage", "section": "Public Portal", "type": "Page"},
    "/solutions/availability-engine": {"name": "Availability Engine Solution", "component": "AvailabilityEnginePage", "section": "Public Portal", "type": "Page"},
    "/solutions/booking-pipeline": {"name": "Booking Pipeline Solution", "component": "BookingPipelinePage", "section": "Public Portal", "type": "Page"},
    "/solutions/customer-crm": {"name": "Customer CRM Solution", "component": "CustomerCRMPage", "section": "Public Portal", "type": "Page"},
    "/solutions/campaign-execution": {"name": "Campaign Execution Solution", "component": "CampaignExecutionPage", "section": "Public Portal", "type": "Page"},
    "/resources": {"name": "Resources & Documentation", "component": "ResourcesPage", "section": "Public Portal", "type": "Page"},
    "/resources/outdoor-advertising-resources": {"name": "Outdoor Advertising Media Formats", "component": "ResourcesPage", "section": "Public Portal", "type": "Page"},
    "/resources/guides-playbooks": {"name": "Guides & Playbooks", "component": "GuidesPlaybooksPage", "section": "Public Portal", "type": "Page"},
    "/resources/faq": {"name": "Frequently Asked Questions", "component": "FAQPage", "section": "Public Portal", "type": "Page"},
    "/resources/help-support": {"name": "Help & Support Center", "component": "HelpSupportPage", "section": "Public Portal", "type": "Page"},
    "/marketplace": {"name": "Marketplace Hub", "component": "MarketplacePage", "section": "Public Portal", "type": "Page"},
    "/marketplace/overview": {"name": "Marketplace Overview", "component": "MarketplaceOverviewPage", "section": "Public Portal", "type": "Page"},
    "/marketplace/how-it-works": {"name": "Marketplace How It Works", "component": "MarketplaceHowItWorksPage", "section": "Public Portal", "type": "Page"},
    "/marketplace/discover": {"name": "Marketplace Discover Inventory", "component": "MarketplaceDiscoverPage", "section": "Public Portal", "type": "Page"},
    "/marketplace/agreement": {"name": "Marketplace Master Agreement (Public)", "component": "MarketplaceAgreementPublicPage", "section": "Public Portal", "type": "Page"},
    "/pricing": {"name": "Pricing & Plans", "component": "PricingPage", "section": "Public Portal", "type": "Page"},
    "/company": {"name": "Company Hub", "component": "CompanyPage", "section": "Public Portal", "type": "Page"},
    "/company/about": {"name": "About SODAARS", "component": "AboutCompanyPage", "section": "Public Portal", "type": "Page"},
    "/company/contact": {"name": "Contact Sales & Support", "component": "ContactPage", "section": "Public Portal", "type": "Page"},
    "/company/partnerships": {"name": "Partnerships & Network", "component": "PartnershipsPage", "section": "Public Portal", "type": "Page"},
    "/company/why-sodaars": {"name": "Why SODAARS (Platform Advantage)", "component": "PartnershipsPage", "section": "Public Portal", "type": "Page"},
    
    # Auth
    "/signin": {"name": "Provider Sign In", "component": "SignInPage", "section": "Authentication", "type": "Auth"},
    "/login": {"name": "Login (Alias)", "component": "Navigate to /signin", "section": "Authentication", "type": "Redirect"},
    "/get-started": {"name": "Provider Onboarding & Registration", "component": "GetStartedPage", "section": "Authentication", "type": "Auth"},
    "/register": {"name": "Register (Alias)", "component": "Navigate to /get-started", "section": "Authentication", "type": "Redirect"},
    
    # Provider Panel
    "/panel": {"name": "Panel Root", "component": "Navigate to /panel/dashboard", "section": "Provider Panel", "type": "Redirect"},
    "/panel/dashboard": {"name": "Executive Operations Dashboard", "component": "DashboardPage", "section": "Provider Panel", "type": "Panel Core"},
    "/panel/resources": {"name": "Advertising Inventory & Resources", "component": "PanelResourcesPage", "section": "Provider Panel", "type": "Panel Core"},
    "/panel/availability": {"name": "Availability Matrix & Calendar", "component": "AvailabilityPage", "section": "Provider Panel", "type": "Panel Core"},
    "/panel/bookings": {"name": "Booking Pipeline & Orders", "component": "BookingsPage", "section": "Provider Panel", "type": "Panel Core"},
    "/panel/bookings/create": {"name": "Create New Booking Reservation", "component": "CreateBookingPage", "section": "Provider Panel", "type": "Panel Sub-Page"},
    "/panel/customers": {"name": "Agency & Advertiser CRM", "component": "CustomersPage", "section": "Provider Panel", "type": "Panel Core"},
    "/panel/customers/:customerId/bookings": {"name": "Customer Booking History Ledger", "component": "CustomerBookingsPage", "section": "Provider Panel", "type": "Panel Dynamic"},
    "/panel/campaigns": {"name": "Campaign Mounting & POP Proofs", "component": "CampaignsPage", "section": "Provider Panel", "type": "Panel Core"},
    "/panel/finance": {"name": "GST Tax Invoicing & Realization", "component": "FinancePage", "section": "Provider Panel", "type": "Panel Core"},
    "/panel/reports": {"name": "Executive Analytics & MIS Export", "component": "ReportsPage", "section": "Provider Panel", "type": "Panel Core"},
    
    # Organization
    "/panel/organization": {"name": "Organization Root", "component": "Navigate to profile", "section": "Organization & Settings", "type": "Redirect"},
    "/panel/organization/profile": {"name": "Organization Profile & Branding", "component": "OrganizationProfilePage", "section": "Organization & Settings", "type": "Org Sub-Page"},
    "/panel/organization/team": {"name": "Team & Access Permissions", "component": "TeamManagementPage", "section": "Organization & Settings", "type": "Org Sub-Page"},
    "/panel/organization/subscription": {"name": "SaaS Subscription & Tier", "component": "SubscriptionPage", "section": "Organization & Settings", "type": "Org Sub-Page"},
    "/panel/organization/marketplace": {"name": "Marketplace Listing Preferences", "component": "OrgMarketplacePage", "section": "Organization & Settings", "type": "Org Sub-Page"},
    "/panel/organization/marketplace-agreement": {"name": "Provider Master Agreement Legal Terms", "component": "MarketplaceAgreementPage", "section": "Organization & Settings", "type": "Org Sub-Page"},
    "/panel/organization/settings": {"name": "System Security & Notifications", "component": "SettingsPage", "section": "Organization & Settings", "type": "Org Sub-Page"},
}

def resolve_target_screen(url):
    clean_url = url.split("?")[0].split("#")[0].rstrip("/")
    if not clean_url:
        clean_url = "/"
    
    if clean_url in DEFINED_ROUTES:
        info = DEFINED_ROUTES[clean_url]
        return info["name"], info["component"], "Valid & Routed"
    
    # Check dynamic customer booking pattern: /panel/customers/.../bookings
    if re.match(r"^/panel/customers/[^/]+/bookings$", clean_url):
        return "Customer Booking History Ledger", "CustomerBookingsPage", "Valid & Routed"
    
    # Check relative paths like "profile", "team", "settings" if inside organization
    if clean_url in ["profile", "team", "subscription", "marketplace", "marketplace-agreement", "settings"]:
        full = f"/panel/organization/{clean_url}"
        if full in DEFINED_ROUTES:
            info = DEFINED_ROUTES[full]
            return info["name"], info["component"], "Valid & Routed (Relative)"
            
    if url.startswith("#"):
        return "Same Page Anchor Section", "In-Page Scroll", "Hash Anchor (#)"
    
    if url.startswith("http://") or url.startswith("https://"):
        return "External Website / Service", "External Link", "External URL"
        
    if url.startswith("mailto:") or url.startswith("tel:"):
        return "Direct Contact Link", "System Handler", "Protocol Link"
        
    return "Unrouted / Missing Route", "None (Potential 404)", "Missing Route / Audit Required"

print("Setup completed.")
