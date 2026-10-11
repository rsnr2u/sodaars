import os
import re
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

SRC_DIR = r"c:\xampp\htdocs\DIGITALKSIND\sodaars\provider\src"
OUTPUT_EXCEL = r"c:\xampp\htdocs\DIGITALKSIND\sodaars\SODAARS_Project_Links_Audit.xlsx"

# 1. Definitive Routes from AppRoutes.tsx
APP_ROUTES = [
    # Public Website
    {"path": "/", "screen": "Home Page", "component": "HomePage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route"},
    {"path": "/solutions", "screen": "Solutions Hub", "component": "SolutionsPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route"},
    {"path": "/solutions/resource-management", "screen": "Resource Management Solution", "component": "ResourceManagementPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route"},
    {"path": "/solutions/availability-engine", "screen": "Availability Engine Solution", "component": "AvailabilityEnginePage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route"},
    {"path": "/solutions/booking-pipeline", "screen": "Booking Pipeline Solution", "component": "BookingPipelinePage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route"},
    {"path": "/solutions/customer-crm", "screen": "Customer CRM Solution", "component": "CustomerCRMPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route"},
    {"path": "/solutions/campaign-execution", "screen": "Campaign Execution Solution", "component": "CampaignExecutionPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route"},
    {"path": "/resources", "screen": "Resources Hub", "component": "ResourcesPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route"},
    {"path": "/resources/outdoor-advertising-resources", "screen": "Outdoor Media Formats & Specs", "component": "ResourcesPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route"},
    {"path": "/resources/guides-playbooks", "screen": "OOH Guides & Playbooks", "component": "GuidesPlaybooksPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route"},
    {"path": "/resources/faq", "screen": "Frequently Asked Questions", "component": "FAQPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route"},
    {"path": "/resources/help-support", "screen": "Help & Support Desk", "component": "HelpSupportPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route"},
    {"path": "/marketplace", "screen": "Marketplace Hub", "component": "MarketplacePage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route"},
    {"path": "/marketplace/overview", "screen": "Marketplace Overview", "component": "MarketplaceOverviewPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route"},
    {"path": "/marketplace/how-it-works", "screen": "Marketplace How It Works", "component": "MarketplaceHowItWorksPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route"},
    {"path": "/marketplace/discover", "screen": "Marketplace Discover Inventory", "component": "MarketplaceDiscoverPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route"},
    {"path": "/marketplace/agreement", "screen": "Marketplace Master Agreement (Public)", "component": "MarketplaceAgreementPublicPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route"},
    {"path": "/pricing", "screen": "Pricing & SaaS Plans", "component": "PricingPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route"},
    {"path": "/company", "screen": "Company Hub", "component": "CompanyPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route"},
    {"path": "/company/about", "screen": "About SODAARS", "component": "AboutCompanyPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route"},
    {"path": "/company/contact", "screen": "Contact Us & Inquiries", "component": "ContactPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route"},
    {"path": "/company/partnerships", "screen": "Partnerships & Alliances", "component": "PartnershipsPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route"},
    {"path": "/company/why-sodaars", "screen": "Why SODAARS Value Proposition", "component": "PartnershipsPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route"},

    # Auth
    {"path": "/signin", "screen": "Provider Sign In", "component": "SignInPage.tsx", "section": "Authentication", "layout": "Standalone", "status": "Active Route"},
    {"path": "/login", "screen": "Sign In (Alias Redirect)", "component": "Redirect -> /signin", "section": "Authentication", "layout": "Standalone", "status": "Redirect Alias"},
    {"path": "/get-started", "screen": "Provider Onboarding & Registration", "component": "GetStartedPage.tsx", "section": "Authentication", "layout": "Standalone", "status": "Active Route"},
    {"path": "/register", "screen": "Registration (Alias Redirect)", "component": "Redirect -> /get-started", "section": "Authentication", "layout": "Standalone", "status": "Redirect Alias"},

    # Provider Panel Core
    {"path": "/panel", "screen": "Panel Home (Redirect)", "component": "Redirect -> /panel/dashboard", "section": "Provider Panel", "layout": "PanelLayout", "status": "Redirect Alias"},
    {"path": "/panel/dashboard", "screen": "Executive Operations Dashboard", "component": "DashboardPage.tsx", "section": "Provider Panel", "layout": "PanelLayout", "status": "Active Route"},
    {"path": "/panel/resources", "screen": "Advertising Inventory & Resources", "component": "ResourcesPage.tsx", "section": "Provider Panel", "layout": "PanelLayout", "status": "Active Route"},
    {"path": "/panel/availability", "screen": "Availability Matrix & Calendar", "component": "AvailabilityPage.tsx", "section": "Provider Panel", "layout": "PanelLayout", "status": "Active Route"},
    {"path": "/panel/bookings", "screen": "Booking Pipeline & Orders", "component": "BookingsPage.tsx", "section": "Provider Panel", "layout": "PanelLayout", "status": "Active Route"},
    {"path": "/panel/bookings/create", "screen": "Create New Booking Reservation", "component": "CreateBookingPage.tsx", "section": "Provider Panel", "layout": "PanelLayout", "status": "Active Route"},
    {"path": "/panel/customers", "screen": "Agency & Advertiser CRM", "component": "CustomersPage.tsx", "section": "Provider Panel", "layout": "PanelLayout", "status": "Active Route"},
    {"path": "/panel/customers/:customerId/bookings", "screen": "Customer Booking History Ledger", "component": "CustomerBookingsPage.tsx", "section": "Provider Panel", "layout": "PanelLayout", "status": "Active Dynamic Route"},
    {"path": "/panel/campaigns", "screen": "Campaign Mounting & POP Proofs", "component": "CampaignsPage.tsx", "section": "Provider Panel", "layout": "PanelLayout", "status": "Active Route"},
    {"path": "/panel/finance", "screen": "GST Tax Invoicing & Realization", "component": "FinancePage.tsx", "section": "Provider Panel", "layout": "PanelLayout", "status": "Active Route"},
    {"path": "/panel/reports", "screen": "Executive Analytics & MIS Export", "component": "ReportsPage.tsx", "section": "Provider Panel", "layout": "PanelLayout", "status": "Active Route"},

    # Organization & Settings
    {"path": "/panel/organization", "screen": "Organization Root (Redirect)", "component": "Redirect -> /panel/organization/profile", "section": "Organization", "layout": "OrganizationLayout", "status": "Redirect Alias"},
    {"path": "/panel/organization/profile", "screen": "Organization Profile & Branding", "component": "OrganizationProfilePage.tsx", "section": "Organization", "layout": "OrganizationLayout", "status": "Active Route"},
    {"path": "/panel/organization/team", "screen": "Team & Access Permissions", "component": "TeamManagementPage.tsx", "section": "Organization", "layout": "OrganizationLayout", "status": "Active Route"},
    {"path": "/panel/organization/subscription", "screen": "SaaS Subscription & Tier", "component": "SubscriptionPage.tsx", "section": "Organization", "layout": "OrganizationLayout", "status": "Active Route"},
    {"path": "/panel/organization/marketplace", "screen": "Marketplace Listing Preferences", "component": "MarketplacePage.tsx", "section": "Organization", "layout": "OrganizationLayout", "status": "Active Route"},
    {"path": "/panel/organization/marketplace-agreement", "screen": "Provider Master Agreement Legal Terms", "component": "MarketplaceAgreementPage.tsx", "section": "Organization", "layout": "OrganizationLayout", "status": "Active Route"},
    {"path": "/panel/organization/settings", "screen": "System Security & Notifications", "component": "SettingsPage.tsx", "section": "Organization", "layout": "OrganizationLayout", "status": "Active Route"},
]

ROUTES_MAP = {r["path"]: r for r in APP_ROUTES}

# Screen friendly names lookup from file relative path
FILE_SCREEN_NAMES = {
    # Public Components
    "public/components/PublicNavbar.tsx": "Public Header / Main Navigation Megamenu",
    "public/components/PublicFooter.tsx": "Public Portal Global Footer",
    # Public Pages
    "public/pages/HomePage.tsx": "Public Home Page",
    "public/pages/SolutionsPage.tsx": "Solutions Overview Hub",
    "public/pages/solutions/ResourceManagementPage.tsx": "Resource Management Solution Page",
    "public/pages/solutions/AvailabilityEnginePage.tsx": "Availability Engine Solution Page",
    "public/pages/solutions/BookingPipelinePage.tsx": "Booking Pipeline Solution Page",
    "public/pages/solutions/CustomerCRMPage.tsx": "Customer CRM Solution Page",
    "public/pages/solutions/CampaignExecutionPage.tsx": "Campaign Execution Solution Page",
    "public/pages/ResourcesPage.tsx": "Outdoor Media Resources Hub",
    "public/pages/resources/GuidesPlaybooksPage.tsx": "Guides & Playbooks Page",
    "public/pages/resources/FAQPage.tsx": "FAQ Page",
    "public/pages/resources/HelpSupportPage.tsx": "Help & Support Center Page",
    "public/pages/resources/OutdoorResourcesPage.tsx": "Outdoor Media Spec Sheet Page",
    "public/pages/MarketplacePage.tsx": "Marketplace Hub Page",
    "public/pages/marketplace/MarketplaceOverviewPage.tsx": "Marketplace Overview Page",
    "public/pages/marketplace/MarketplaceHowItWorksPage.tsx": "Marketplace How It Works Page",
    "public/pages/marketplace/MarketplaceDiscoverPage.tsx": "Marketplace Discover Inventory Page",
    "public/pages/marketplace/MarketplaceAgreementPublicPage.tsx": "Marketplace Agreement (Public View)",
    "public/pages/PricingPage.tsx": "Pricing & SaaS Plans Page",
    "public/pages/CompanyPage.tsx": "Company Overview Page",
    "public/pages/company/AboutCompanyPage.tsx": "About SODAARS Page",
    "public/pages/company/ContactPage.tsx": "Contact Us Page",
    "public/pages/company/PartnershipsPage.tsx": "Partnerships Page",
    "public/pages/SignInPage.tsx": "Sign In Screen",
    "public/pages/GetStartedPage.tsx": "Get Started / Registration Screen",

    # Panel Layouts & Menus
    "panel/components/TopNavigation.tsx": "Provider Panel Top Navigation Bar",
    "panel/components/PanelTopbar.tsx": "Provider Panel Header & User Action Bar",
    "panel/components/TopHeader.tsx": "Panel Top Utility Header",
    "panel/components/PageHeader.tsx": "Page Header Breadcrumb Banner",
    "panel/layouts/OrganizationLayout.tsx": "Organization Settings Sidebar & Layout",
    "panel/layouts/ProviderPanelLayout.tsx": "Provider Panel Master Wrapper",

    # Panel Pages
    "panel/pages/DashboardPage.tsx": "Executive Operations Dashboard",
    "panel/pages/ResourcesPage.tsx": "Resource & Media Asset Management",
    "panel/pages/AvailabilityPage.tsx": "Availability Matrix & Capacity Calendar",
    "panel/pages/BookingsPage.tsx": "Booking Pipeline & Reservations Ledger",
    "panel/pages/CreateBookingPage.tsx": "Create Booking Multi-Step Wizard",
    "panel/pages/CustomersPage.tsx": "Advertiser & Agency CRM Directory",
    "panel/pages/CustomerBookingsPage.tsx": "Customer Booking History View",
    "panel/pages/CampaignsPage.tsx": "Campaign Operations & POP Photo Mounting",
    "panel/pages/FinancePage.tsx": "GST Tax Invoicing & Commercial Collections",
    "panel/pages/ReportsPage.tsx": "Executive Analytics & MIS Data Reports",
    "panel/pages/organization/OrganizationProfilePage.tsx": "Organization Profile & Branding",
    "panel/pages/organization/TeamManagementPage.tsx": "Team & Access Roles",
    "panel/pages/organization/SubscriptionPage.tsx": "SaaS Subscription & Billing",
    "panel/pages/organization/MarketplacePage.tsx": "Marketplace Listing Preferences",
    "panel/pages/organization/MarketplaceAgreementPage.tsx": "Marketplace Agreement & Signoff",
    "panel/pages/organization/SettingsPage.tsx": "System Security & Notifications",

    # Panel Drawers / Modals
    "panel/components/customers/CustomerProfileDrawer.tsx": "Customer Profile Drawer",
    "panel/components/resources/ResourceDetailDrawer.tsx": "Resource Details Drawer",
    "panel/components/resources/AddResourceModal.tsx": "Add Resource Modal",
    "panel/components/resources/ImportInventoryDrawer.tsx": "Import Inventory Drawer",
    "panel/components/campaigns/PhotoProofUploadModal.tsx": "Photo Proof Upload Modal",
    "panel/components/campaigns/CampaignDetailModal.tsx": "Campaign Detail Modal",
    "panel/components/finance/InvoiceViewerModal.tsx": "GST Tax Invoice Viewer Modal",
    "panel/components/booking-builder/Step1ClientResource.tsx": "Booking Builder - Step 1",
    "panel/components/booking-builder/Step2DatesRate.tsx": "Booking Builder - Step 2",
    "panel/components/booking-builder/Step3ReviewConfirm.tsx": "Booking Builder - Step 3",
}

def clean_label(text):
    if not text:
        return ""
    # Strip JSX tags and brackets
    cleaned = re.sub(r'<[^>]+>', ' ', text)
    cleaned = re.sub(r'\{[^}]+\}', ' ', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

def extract_all_links():
    all_links = []
    
    for root, _, files in os.walk(SRC_DIR):
        for file in files:
            if not file.endswith(('.tsx', '.ts')):
                continue
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, SRC_DIR).replace('\\', '/')
            
            with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()
                
            content = "".join(lines)
            
            screen_name = FILE_SCREEN_NAMES.get(rel_path, f"Component: {os.path.basename(rel_path)}")
            
            # 1. Regex for <Link to="..." or <NavLink to="..."
            # Matching multi-line or single-line
            link_pattern = re.compile(
                r'<(Link|NavLink)\s+([^>]*?)to=(?:["\']([^"\']+)["\']|\{[`"\']([^`"\']+)[`"\']\}|\{([^}]+)\})([^>]*?)>(.*?)</\1>',
                re.DOTALL
            )
            for m in link_pattern.finditer(content):
                tag = m.group(1)
                before_to = m.group(2)
                url_str = m.group(3) or m.group(4) or m.group(5) or ""
                after_to = m.group(6)
                children = m.group(7)
                
                # compute approximate line number
                start_pos = m.start()
                line_no = content[:start_pos].count('\n') + 1
                
                # Check for dynamic expressions like `${customerId}`
                url = url_str.strip()
                label = clean_label(children)
                
                # Fallback label if empty or icon
                if not label:
                    if 'Logo' in children or 'logo' in children or 'SODAARS' in children or 'sodaars' in rel_path:
                        label = "SODAARS Brand Logo"
                    elif 'Arrow' in children or 'Chevron' in children:
                        label = "Icon / Arrow CTA"
                    else:
                        label = f"Interactive {tag} Link"

                all_links.append({
                    "source_file": rel_path,
                    "line_no": line_no,
                    "source_screen": screen_name,
                    "element_type": f"<{tag}>",
                    "url": url,
                    "label": label[:60],
                    "raw_context": m.group(0)[:120].replace('\n', ' ')
                })
                
            # 2. Regex for self-closing <Link to="..." ... />
            self_closing_link_pattern = re.compile(
                r'<(Link|NavLink)\s+([^>]*?)to=(?:["\']([^"\']+)["\']|\{[`"\']([^`"\']+)[`"\']\}|\{([^}]+)\})([^>]*?)/>',
                re.DOTALL
            )
            for m in self_closing_link_pattern.finditer(content):
                tag = m.group(1)
                url = (m.group(3) or m.group(4) or m.group(5) or "").strip()
                line_no = content[:m.start()].count('\n') + 1
                all_links.append({
                    "source_file": rel_path,
                    "line_no": line_no,
                    "source_screen": screen_name,
                    "element_type": f"<{tag} />",
                    "url": url,
                    "label": "Self-closing Link CTA",
                    "raw_context": m.group(0)[:120].replace('\n', ' ')
                })

            # 3. Regex for <a href="..."
            a_pattern = re.compile(
                r'<a\s+([^>]*?)href=(?:["\']([^"\']+)["\']|\{[`"\']([^`"\']+)[`"\']\}|\{([^}]+)\})([^>]*?)>(.*?)</a>',
                re.DOTALL
            )
            for m in a_pattern.finditer(content):
                url = (m.group(2) or m.group(3) or m.group(4) or "").strip()
                children = m.group(6)
                line_no = content[:m.start()].count('\n') + 1
                label = clean_label(children)
                if not label:
                    label = "Hyperlink"
                all_links.append({
                    "source_file": rel_path,
                    "line_no": line_no,
                    "source_screen": screen_name,
                    "element_type": "<a>",
                    "url": url,
                    "label": label[:60],
                    "raw_context": m.group(0)[:120].replace('\n', ' ')
                })

            # 4. Regex for navigate('...')
            nav_pattern = re.compile(
                r'navigate\((?:["\']([^"\']+)["\']|`([^`]+)`)',
                re.DOTALL
            )
            for m in nav_pattern.finditer(content):
                url = (m.group(1) or m.group(2) or "").strip()
                line_no = content[:m.start()].count('\n') + 1
                all_links.append({
                    "source_file": rel_path,
                    "line_no": line_no,
                    "source_screen": screen_name,
                    "element_type": "navigate()",
                    "url": url,
                    "label": "Programmatic Action / CTA",
                    "raw_context": m.group(0)[:120].replace('\n', ' ')
                })

    return all_links

def categorize_and_audit(link_item):
    url = link_item["url"]
    source = link_item["source_file"]
    
    # Clean URL for matching
    clean_url = url.split("?")[0].split("#")[0].rstrip("/")
    if not clean_url:
        clean_url = "/"
        
    target_screen = "Unknown Target"
    target_component = "None"
    audit_status = "Unrouted / Missing"
    category = "General"
    notes = ""

    # Check external URLs
    if url.startswith(("http://", "https://")):
        target_screen = "External Web Resource"
        target_component = "External Website"
        audit_status = "External Link"
        category = "External Resource"
        notes = f"External link target ({url})"
        return target_screen, target_component, audit_status, category, notes
        
    if url.startswith(("mailto:", "tel:")):
        target_screen = "System Protocol Contact"
        target_component = "Mail / Tel Protocol"
        audit_status = "Protocol Link"
        category = "Direct Contact"
        notes = "Opens default mail or telephone client"
        return target_screen, target_component, audit_status, category, notes

    # Check hash anchors
    if url.startswith("#"):
        target_screen = f"In-Page Anchor ({url})"
        target_component = "In-Page Scroll Element"
        if url in ["#", "#!"]:
            audit_status = "Placeholder Anchor (#)"
            notes = "Empty hash placeholder; needs concrete route or modal trigger"
        else:
            audit_status = "Valid Hash Anchor"
            notes = f"Scrolls to #{url.lstrip('#')} section"
        category = "In-Page Anchor"
        return target_screen, target_component, audit_status, category, notes

    # Relative paths in organization sub-menu
    if "organization" in source.lower() and url in ["profile", "team", "subscription", "marketplace", "marketplace-agreement", "settings"]:
        full_path = f"/panel/organization/{url}"
        route_info = ROUTES_MAP.get(full_path)
        if route_info:
            return route_info["screen"], route_info["component"], "Valid & Routed (Relative)", "Organization & Settings", "Relative sub-route within OrganizationLayout"

    # Dynamic route matching: e.g. /panel/customers/.../bookings
    if re.search(r'/panel/customers/[^/]+/bookings', url) or '${customer' in url:
        return "Customer Booking History Ledger", "CustomerBookingsPage.tsx", "Valid Dynamic Route", "Provider Panel Core", "Dynamic route with :customerId parameter"

    # Direct match in AppRoutes
    if clean_url in ROUTES_MAP:
        r = ROUTES_MAP[clean_url]
        target_screen = r["screen"]
        target_component = r["component"]
        category = r["section"]
        if r["status"] == "Active Route":
            audit_status = "Valid & Routed"
            notes = "Route matches active page component in AppRoutes.tsx"
        elif r["status"] == "Redirect Alias":
            audit_status = "Redirect Route"
            notes = f"Valid alias route that redirects ({r['component']})"
        else:
            audit_status = "Valid Dynamic Route"
            notes = "Dynamic parameter route"
        return target_screen, target_component, audit_status, category, notes

    # Common unrouted pages (Audit findings!)
    if clean_url in ["/privacy", "/terms", "/legal", "/security"]:
        target_screen = f"{clean_url.lstrip('/').title()} Policy Page"
        target_component = "Missing Page Component"
        audit_status = "Missing Route (Footer Legal)"
        category = "Legal & Compliance"
        notes = "Footer link exists, but route not registered in AppRoutes.tsx (Falls back to Home)"
        return target_screen, target_component, audit_status, category, notes

    if clean_url in ["/careers", "/press", "/blog"]:
        target_screen = f"Company {clean_url.lstrip('/').title()}"
        target_component = "Missing Page Component"
        audit_status = "Missing Route (Company Content)"
        category = "Company"
        notes = "Link exists in footer/megamenu, but route not yet defined in AppRoutes.tsx"
        return target_screen, target_component, audit_status, category, notes

    # General missing route
    target_screen = f"Unregistered Route ({url})"
    target_component = "None"
    audit_status = "Missing Route / Unrouted"
    category = "Unclassified"
    notes = "Route not defined in AppRoutes.tsx; hits fallback redirect to Home (/)"
    return target_screen, target_component, audit_status, category, notes

print("Extraction script prepared.")
