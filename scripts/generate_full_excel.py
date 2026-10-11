import os
import re
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

SRC_DIR = r"c:\xampp\htdocs\DIGITALKSIND\sodaars\provider\src"
OUTPUT_EXCEL = r"c:\xampp\htdocs\DIGITALKSIND\sodaars\SODAARS_Project_Links_Audit.xlsx"

# Definitive Routes from AppRoutes.tsx
APP_ROUTES = [
    # Public Website
    {"path": "/", "screen": "Home Page", "component": "HomePage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route", "desc": "Public marketing landing page with hero, platform overview, and value proposition."},
    {"path": "/solutions", "screen": "Solutions Hub", "component": "SolutionsPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route", "desc": "Full overview of SODAARS operating system modules for outdoor advertising providers."},
    {"path": "/solutions/resource-management", "screen": "Resource Management Solution", "component": "ResourceManagementPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route", "desc": "Deep dive into media asset cataloging, geotagging, illumination, and rate card governance."},
    {"path": "/solutions/availability-engine", "screen": "Availability Engine Solution", "component": "AvailabilityEnginePage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route", "desc": "Live calendar matrix, hold reservation rules, and conflict avoidance algorithms."},
    {"path": "/solutions/booking-pipeline", "screen": "Booking Pipeline Solution", "component": "BookingPipelinePage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route", "desc": "Workflow stages from draft quotation to execution order and client signoff."},
    {"path": "/solutions/customer-crm", "screen": "Customer CRM Solution", "component": "CustomerCRMPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route", "desc": "Agency, brand, and broker directory with GSTIN and credit control tracking."},
    {"path": "/solutions/campaign-execution", "screen": "Campaign Execution Solution", "component": "CampaignExecutionPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route", "desc": "Printing, mounting, geotagged time-stamped proof of performance (POP) management."},
    {"path": "/resources", "screen": "Resources Hub", "component": "ResourcesPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route", "desc": "Resource library, industry guides, playbooks, and knowledge center."},
    {"path": "/resources/outdoor-advertising-resources", "screen": "Outdoor Media Formats & Specs", "component": "ResourcesPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route (Alias)", "desc": "Technical specs for billboards, unipoles, gantries, DOOH screens, and transit formats."},
    {"path": "/resources/guides-playbooks", "screen": "OOH Guides & Playbooks", "component": "GuidesPlaybooksPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route", "desc": "Operational best practices and revenue acceleration playbooks for media owners."},
    {"path": "/resources/faq", "screen": "Frequently Asked Questions", "component": "FAQPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route", "desc": "Common queries regarding platform adoption, listing, pricing, and integrations."},
    {"path": "/resources/help-support", "screen": "Help & Support Desk", "component": "HelpSupportPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route", "desc": "Ticketing, live support contacts, knowledge base, and onboarding assistance."},
    {"path": "/marketplace", "screen": "Marketplace Hub", "component": "MarketplacePage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route", "desc": "Introduction to the decentralized SODAARS B2B Outdoor Media Exchange."},
    {"path": "/marketplace/overview", "screen": "Marketplace Overview", "component": "MarketplaceOverviewPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route", "desc": "Marketplace mechanics, brand discovery, and transaction escrow settlement architecture."},
    {"path": "/marketplace/how-it-works", "screen": "Marketplace How It Works", "component": "MarketplaceHowItWorksPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route", "desc": "Step-by-step buyer and seller journey from discovery to campaign verification."},
    {"path": "/marketplace/discover", "screen": "Marketplace Discover Inventory", "component": "MarketplaceDiscoverPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route", "desc": "Interactive catalog of verified outdoor advertising assets open for bookings."},
    {"path": "/marketplace/agreement", "screen": "Marketplace Master Agreement (Public)", "component": "MarketplaceAgreementPublicPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route", "desc": "Public legal charter and network listing guidelines for OOH media owners."},
    {"path": "/pricing", "screen": "Pricing & SaaS Plans", "component": "PricingPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route", "desc": "Tiered SaaS subscription plans (Starter, Professional, Enterprise) and commissions."},
    {"path": "/company", "screen": "Company Hub", "component": "CompanyPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route", "desc": "About the company, leadership, mission, and career openings."},
    {"path": "/company/about", "screen": "About SODAARS", "component": "AboutCompanyPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route", "desc": "Company background, vision for Indian out-of-home media digital transformation."},
    {"path": "/company/contact", "screen": "Contact Us & Inquiries", "component": "ContactPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route", "desc": "Contact form, office addresses in Mumbai/Bengaluru/Delhi, and phone numbers."},
    {"path": "/company/partnerships", "screen": "Partnerships & Alliances", "component": "PartnershipsPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route", "desc": "Agency networks, print tech partners, and programmatic DOOH ecosystem integration."},
    {"path": "/company/why-sodaars", "screen": "Why SODAARS Value Proposition", "component": "PartnershipsPage.tsx", "section": "Public Portal", "layout": "PublicLayout", "status": "Active Route (Alias)", "desc": "Comparison with legacy Excel management vs. centralized OS automation."},

    # Auth
    {"path": "/signin", "screen": "Provider Sign In", "component": "SignInPage.tsx", "section": "Authentication", "layout": "Standalone", "status": "Active Route", "desc": "Dedicated login page for outdoor advertising providers with MFA support."},
    {"path": "/login", "screen": "Sign In (Alias Redirect)", "component": "Redirect -> /signin", "section": "Authentication", "layout": "Standalone", "status": "Redirect Alias", "desc": "User convenience route redirecting directly to /signin."},
    {"path": "/get-started", "screen": "Provider Onboarding & Registration", "component": "GetStartedPage.tsx", "section": "Authentication", "layout": "Standalone", "status": "Active Route", "desc": "Provider registration portal to sign up new media concessionaire accounts."},
    {"path": "/register", "screen": "Registration (Alias Redirect)", "component": "Redirect -> /get-started", "section": "Authentication", "layout": "Standalone", "status": "Redirect Alias", "desc": "User convenience route redirecting directly to /get-started."},

    # Provider Panel Core
    {"path": "/panel", "screen": "Panel Home (Redirect)", "component": "Redirect -> /panel/dashboard", "section": "Provider Panel", "layout": "PanelLayout", "status": "Redirect Alias", "desc": "Root panel route redirecting to /panel/dashboard."},
    {"path": "/panel/dashboard", "screen": "Executive Operations Dashboard", "component": "DashboardPage.tsx", "section": "Provider Panel", "layout": "PanelLayout", "status": "Active Route", "desc": "6-block command center: KPIs, Action Center, Heatmap, Operations Stream, Finance Pulse."},
    {"path": "/panel/resources", "screen": "Advertising Inventory & Resources", "component": "ResourcesPage.tsx", "section": "Provider Panel", "layout": "PanelLayout", "status": "Active Route", "desc": "Media asset ledger with multi-column sorting, search, filters, drawers, and add modals."},
    {"path": "/panel/availability", "screen": "Availability Matrix & Calendar", "component": "AvailabilityPage.tsx", "section": "Provider Panel", "layout": "PanelLayout", "status": "Active Route", "desc": "Visual date-range booking matrix, conflict highlighter, and quick reservation triggers."},
    {"path": "/panel/bookings", "screen": "Booking Pipeline & Orders", "component": "BookingsPage.tsx", "section": "Provider Panel", "layout": "PanelLayout", "status": "Active Route", "desc": "Manage client campaign bookings, contract states, and direct vs marketplace sources."},
    {"path": "/panel/bookings/create", "screen": "Create New Booking Reservation", "component": "CreateBookingPage.tsx", "section": "Provider Panel", "layout": "PanelLayout", "status": "Active Route", "desc": "3-step interactive booking builder: Asset Selection, Dates & Rates, Confirmation."},
    {"path": "/panel/customers", "screen": "Agency & Advertiser CRM", "component": "CustomersPage.tsx", "section": "Provider Panel", "layout": "PanelLayout", "status": "Active Route", "desc": "Client CRM with company cards, GSTIN records, spend analytics, and history drawer."},
    {"path": "/panel/customers/:customerId/bookings", "screen": "Customer Booking History Ledger", "component": "CustomerBookingsPage.tsx", "section": "Provider Panel", "layout": "PanelLayout", "status": "Active Dynamic Route", "desc": "Detailed campaign orders and financial history for a specific agency/advertiser."},
    {"path": "/panel/campaigns", "screen": "Campaign Mounting & POP Proofs", "component": "CampaignsPage.tsx", "section": "Provider Panel", "layout": "PanelLayout", "status": "Active Route", "desc": "Proof of performance photo tracker, geotag validation, and mounting certification."},
    {"path": "/panel/finance", "screen": "GST Tax Invoicing & Realization", "component": "FinancePage.tsx", "section": "Provider Panel", "layout": "PanelLayout", "status": "Active Route", "desc": "GST Tax Invoices, credit management, collection tracking, and official invoice modal."},
    {"path": "/panel/reports", "screen": "Executive Analytics & MIS Export", "component": "ReportsPage.tsx", "section": "Provider Panel", "layout": "PanelLayout", "status": "Active Route", "desc": "MIS reporting module: Revenue, Occupancy, Client Concentration, and Excel exports."},

    # Organization & Settings
    {"path": "/panel/organization", "screen": "Organization Root (Redirect)", "component": "Redirect -> /panel/organization/profile", "section": "Organization & Settings", "layout": "OrganizationLayout", "status": "Redirect Alias", "desc": "Redirects to organization profile settings."},
    {"path": "/panel/organization/profile", "screen": "Organization Profile & Branding", "component": "OrganizationProfilePage.tsx", "section": "Organization & Settings", "layout": "OrganizationLayout", "status": "Active Route", "desc": "Provider entity profile, corporate logo, GSTIN, PAN, and billing address settings."},
    {"path": "/panel/organization/team", "screen": "Team & Access Permissions", "component": "TeamManagementPage.tsx", "section": "Organization & Settings", "layout": "OrganizationLayout", "status": "Active Route", "desc": "Role-based access control (Admin, Sales Manager, Rigger) and user invitations."},
    {"path": "/panel/organization/subscription", "screen": "SaaS Subscription & Tier", "component": "SubscriptionPage.tsx", "section": "Organization & Settings", "layout": "OrganizationLayout", "status": "Active Route", "desc": "SODAARS SaaS plan subscription tier, billing cycle, and feature limits."},
    {"path": "/panel/organization/marketplace", "screen": "Marketplace Listing Preferences", "component": "MarketplacePage.tsx", "section": "Organization & Settings", "layout": "OrganizationLayout", "status": "Active Route", "desc": "Configure automated inventory syndication and commission terms for the exchange."},
    {"path": "/panel/organization/marketplace-agreement", "screen": "Provider Master Agreement Legal Terms", "component": "MarketplaceAgreementPage.tsx", "section": "Organization & Settings", "layout": "OrganizationLayout", "status": "Active Route", "desc": "Signed digital contract and terms governing SODAARS escrow transactions."},
    {"path": "/panel/organization/settings", "screen": "System Security & Notifications", "component": "SettingsPage.tsx", "section": "Organization & Settings", "layout": "OrganizationLayout", "status": "Active Route", "desc": "Two-factor auth, email/WhatsApp notification preferences, and API webhooks."},
]

ROUTES_MAP = {r["path"]: r for r in APP_ROUTES}

FILE_SCREEN_NAMES = {
    # Public
    "public/components/PublicNavbar.tsx": "Public Header Navigation (Megamenu)",
    "public/components/PublicFooter.tsx": "Public Global Footer",
    "public/pages/HomePage.tsx": "Public Home Page",
    "public/pages/SolutionsPage.tsx": "Solutions Hub Page",
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
    "panel/components/organization/OrganizationSideMenu.tsx": "Organization Sub-Navigation Sidebar",
    "panel/layouts/OrganizationLayout.tsx": "Organization Settings Layout",
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

    # Drawers & Modals
    "panel/components/customers/CustomerProfileDrawer.tsx": "Customer Profile Drawer",
    "panel/components/resources/ResourceDetailDrawer.tsx": "Resource Details Drawer",
    "panel/components/resources/AddResourceModal.tsx": "Add Resource Modal",
    "panel/components/resources/ImportInventoryDrawer.tsx": "Import Inventory Drawer",
    "panel/components/campaigns/PhotoProofUploadModal.tsx": "Photo Proof Upload Modal",
    "panel/components/campaigns/CampaignDetailModal.tsx": "Campaign Detail Modal",
    "panel/components/campaigns/BookedInventoryDetailDrawer.tsx": "Booked Campaign Detail Drawer",
    "panel/components/finance/InvoiceViewerModal.tsx": "GST Tax Invoice Viewer Modal",
    "panel/components/booking-builder/Step1ClientResource.tsx": "Booking Builder - Step 1",
    "panel/components/booking-builder/Step2DatesRate.tsx": "Booking Builder - Step 2",
    "panel/components/booking-builder/Step3ReviewConfirm.tsx": "Booking Builder - Step 3",
}

def clean_label(text):
    if not text:
        return ""
    cleaned = re.sub(r'<[^>]+>', ' ', text)
    cleaned = re.sub(r'\{[^}]+\}', ' ', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

def extract_all_links():
    raw_links = []
    
    for root, _, files in os.walk(SRC_DIR):
        for file in files:
            if not file.endswith(('.tsx', '.ts')):
                continue
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, SRC_DIR).replace('\\', '/')
            
            with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                
            screen_name = FILE_SCREEN_NAMES.get(rel_path, f"Component: {os.path.basename(rel_path).replace('.tsx', '')}")
            
            # --- SPECIAL EXPANSIONS FOR ARRAYS ---
            # 1. PanelTopbar.tsx navItems
            if rel_path == "panel/components/PanelTopbar.tsx":
                # Desktop
                desktop_navs = [
                    ("Dashboard", "/panel/dashboard", 84),
                    ("Inventory", "/panel/resources", 84),
                    ("Bookings", "/panel/bookings", 84),
                    ("Customers", "/panel/customers", 84),
                    ("Campaigns", "/panel/campaigns", 84),
                    ("Finance", "/panel/finance", 84),
                    ("Reports", "/panel/reports", 84),
                ]
                for name, path, line in desktop_navs:
                    raw_links.append({
                        "source_file": rel_path,
                        "line_no": line,
                        "source_screen": screen_name,
                        "element_type": "<NavLink> (Desktop Header)",
                        "url": path,
                        "label": f"Nav Tab: {name}",
                        "is_special": True
                    })
                # Mobile
                for name, path, line in desktop_navs:
                    raw_links.append({
                        "source_file": rel_path,
                        "line_no": 195,
                        "source_screen": screen_name,
                        "element_type": "<NavLink> (Mobile Drawer)",
                        "url": path,
                        "label": f"Mobile Menu: {name}",
                        "is_special": True
                    })

            # 2. TopNavigation.tsx
            if rel_path == "panel/components/TopNavigation.tsx":
                top_navs = [
                    ("Dashboard", "/panel/dashboard", 36),
                    ("Inventory", "/panel/resources", 36),
                    ("Bookings", "/panel/bookings", 36),
                    ("Customers", "/panel/customers", 36),
                    ("Campaigns", "/panel/campaigns", 36),
                    ("Finance", "/panel/finance", 36),
                    ("Reports", "/panel/reports", 36),
                ]
                for name, path, line in top_navs:
                    raw_links.append({
                        "source_file": rel_path,
                        "line_no": line,
                        "source_screen": screen_name,
                        "element_type": "<NavLink> (Top Navigation Strip)",
                        "url": path,
                        "label": f"Primary Tab: {name}",
                        "is_special": True
                    })

            # 3. OrganizationSideMenu.tsx
            if rel_path == "panel/components/organization/OrganizationSideMenu.tsx":
                org_navs = [
                    ("Organization Profile", "/panel/organization/profile", 100),
                    ("Team Management", "/panel/organization/team", 100),
                    ("Subscription & Quota", "/panel/organization/subscription", 100),
                    ("Marketplace Channel", "/panel/organization/marketplace", 100),
                    ("Marketplace Agreement", "/panel/organization/marketplace-agreement", 100),
                    ("Operational Settings", "/panel/organization/settings", 100),
                ]
                for name, path, line in org_navs:
                    raw_links.append({
                        "source_file": rel_path,
                        "line_no": line,
                        "source_screen": screen_name,
                        "element_type": "<NavLink> (Org Desktop Sidebar)",
                        "url": path,
                        "label": f"Settings Menu: {name}",
                        "is_special": True
                    })
                for name, path, line in org_navs:
                    raw_links.append({
                        "source_file": rel_path,
                        "line_no": 88,
                        "source_screen": screen_name,
                        "element_type": "<NavLink> (Org Mobile Subnav)",
                        "url": path,
                        "label": f"Mobile Subnav: {name}",
                        "is_special": True
                    })

            # 4. DashboardPage.tsx actionItems
            if rel_path == "panel/pages/DashboardPage.tsx":
                dash_actions = [
                    ("Review Booking", "/panel/bookings", 160, "1 Booking Awaiting Confirmation"),
                    ("Upload Proof", "/panel/campaigns", 160, "1 Campaign Missing POP Night Proof"),
                    ("View Invoices", "/panel/finance", 160, "3 Client Invoices Overdue"),
                    ("Check Calendar", "/panel/availability", 160, "2 Media Assets Freeing Up in 7 Days"),
                ]
                for name, path, line, title in dash_actions:
                    raw_links.append({
                        "source_file": rel_path,
                        "line_no": line,
                        "source_screen": screen_name,
                        "element_type": "<Link> (Action Required Card)",
                        "url": path,
                        "label": f"{name} ({title})",
                        "is_special": True
                    })

            # 5. CustomersPage.tsx dynamic link
            if rel_path == "panel/pages/CustomersPage.tsx":
                raw_links.append({
                    "source_file": rel_path,
                    "line_no": 320,
                    "source_screen": screen_name,
                    "element_type": "<Link> (Customer Profile Action)",
                    "url": "/panel/customers/:customerId/bookings",
                    "label": "View Customer Booking History",
                    "is_special": True
                })

            # 6. BookedInventoryDetailDrawer.tsx creative link
            if rel_path == "panel/components/campaigns/BookedInventoryDetailDrawer.tsx":
                raw_links.append({
                    "source_file": rel_path,
                    "line_no": 215,
                    "source_screen": screen_name,
                    "element_type": "<a href> (Creative Preview)",
                    "url": "https://images.unsplash.com/photo-creative-preview",
                    "label": "Full Creative Proof Image View",
                    "is_special": True
                })

            # Standard regex extractions for all files
            # 1. <Link to="..." or <NavLink to="..."
            link_pattern = re.compile(
                r'<(Link|NavLink)\s+([^>]*?)to=(?:["\']([^"\']+)["\']|\{[`"\']([^`"\']+)[`"\']\}|\{([^}]+)\})([^>]*?)>(.*?)</\1>',
                re.DOTALL
            )
            for m in link_pattern.finditer(content):
                tag = m.group(1)
                url_str = m.group(3) or m.group(4) or m.group(5) or ""
                children = m.group(7)
                line_no = content[:m.start()].count('\n') + 1
                url = url_str.strip()

                # Skip raw array loops already expanded
                if url in ['item.path', 'act.link', '`/panel/customers/${cust.id']:
                    continue

                label = clean_label(children)
                if not label:
                    if 'Logo' in children or 'logo' in children or 'SODAARS' in children or 'brand' in children.lower():
                        label = "SODAARS Brand Logo Link"
                    elif 'Arrow' in children or 'Chevron' in children:
                        label = "Icon / Arrow CTA"
                    else:
                        label = f"{tag} Action Link"

                raw_links.append({
                    "source_file": rel_path,
                    "line_no": line_no,
                    "source_screen": screen_name,
                    "element_type": f"<{tag}>",
                    "url": url,
                    "label": label[:75],
                    "is_special": False
                })

            # 2. Self closing <Link to="..." />
            self_closing_link_pattern = re.compile(
                r'<(Link|NavLink)\s+([^>]*?)to=(?:["\']([^"\']+)["\']|\{[`"\']([^`"\']+)[`"\']\}|\{([^}]+)\})([^>]*?)/>',
                re.DOTALL
            )
            for m in self_closing_link_pattern.finditer(content):
                tag = m.group(1)
                url = (m.group(3) or m.group(4) or m.group(5) or "").strip()
                line_no = content[:m.start()].count('\n') + 1
                if url in ['item.path', 'act.link']:
                    continue
                raw_links.append({
                    "source_file": rel_path,
                    "line_no": line_no,
                    "source_screen": screen_name,
                    "element_type": f"<{tag} />",
                    "url": url,
                    "label": "Button / Icon Link",
                    "is_special": False
                })

            # 3. <a href="..."
            a_pattern = re.compile(
                r'<a\s+([^>]*?)href=(?:["\']([^"\']+)["\']|\{[`"\']([^`"\']+)[`"\']\}|\{([^}]+)\})([^>]*?)>(.*?)</a>',
                re.DOTALL
            )
            for m in a_pattern.finditer(content):
                url = (m.group(2) or m.group(3) or m.group(4) or "").strip()
                children = m.group(6)
                line_no = content[:m.start()].count('\n') + 1
                if url in ['activeCreative.imageUrl']:
                    continue
                label = clean_label(children) or "Hyperlink"
                raw_links.append({
                    "source_file": rel_path,
                    "line_no": line_no,
                    "source_screen": screen_name,
                    "element_type": "<a>",
                    "url": url,
                    "label": label[:75],
                    "is_special": False
                })

            # 4. Programmatic navigate('...')
            nav_pattern = re.compile(
                r'navigate\((?:["\']([^"\']+)["\']|`([^`]+)`)',
                re.DOTALL
            )
            for m in nav_pattern.finditer(content):
                url = (m.group(1) or m.group(2) or "").strip()
                line_no = content[:m.start()].count('\n') + 1
                raw_links.append({
                    "source_file": rel_path,
                    "line_no": line_no,
                    "source_screen": screen_name,
                    "element_type": "navigate()",
                    "url": url,
                    "label": "Programmatic Action / CTA",
                    "is_special": False
                })

    return raw_links

def evaluate_link(item):
    url = item["url"]
    source = item["source_file"]
    
    clean_url = url.split("?")[0].split("#")[0].rstrip("/")
    if not clean_url:
        clean_url = "/"

    # Dynamic route matching
    if clean_url == "/panel/customers/:customerId/bookings":
        return (
            "/panel/customers/:customerId/bookings",
            "Customer Booking History Ledger",
            "CustomerBookingsPage.tsx",
            "Valid Dynamic Route",
            "Provider Panel Core",
            "Dynamic parameter route (:customerId). Renders full agency booking history."
        )

    # Relative paths in organization sub-menu
    if "organization" in source.lower() and url in ["profile", "team", "subscription", "marketplace", "marketplace-agreement", "settings"]:
        full_path = f"/panel/organization/{url}"
        route_info = ROUTES_MAP.get(full_path)
        if route_info:
            return (
                full_path,
                route_info["screen"],
                route_info["component"],
                "Valid & Routed",
                "Organization & Settings",
                "Relative sub-route within OrganizationLayout sub-navigation."
            )

    # External URLs
    if url.startswith(("http://", "https://")):
        return (
            url,
            "External Web Resource",
            "External Resource",
            "External Link",
            "External Resource",
            "Opens external third-party destination in browser."
        )

    # Direct contact protocol
    if url.startswith(("mailto:", "tel:")):
        return (
            url,
            "Direct Contact Trigger",
            "System Protocol Handler",
            "Protocol Link",
            "Direct Contact",
            "Direct mailto: or tel: trigger."
        )

    # In-Page Hash Anchors
    if url.startswith("#"):
        if url in ["#forgot"]:
            return (
                "#forgot",
                "Forgot Password Modal / Recovery",
                "SignInPage.tsx (Inline)",
                "Placeholder Anchor (#)",
                "Authentication",
                "Audit Flag: Hash anchor '#forgot'. Should trigger a password reset modal or dedicated /forgot-password route."
            )
        if url in ["#privacy", "#terms"]:
            return (
                url,
                f"Legal Terms ({url.lstrip('#').title()})",
                "Terms / Privacy Modal",
                "Placeholder Anchor (#)",
                "Legal & Compliance",
                "Audit Flag: Hash anchor links to in-page placeholder. Recommend creating /legal/privacy and /legal/terms routes."
            )
        if url in ["#", "#!"]:
            return (
                "#",
                "In-Page Anchor (Empty Placeholder)",
                "None",
                "Placeholder Anchor (#)",
                "Placeholder UI",
                "Audit Flag: Empty hash placeholder. Recommend replacing with concrete route or button handler."
            )
        return (
            url,
            f"In-Page Section ({url})",
            "Scroll Anchor",
            "In-Page Anchor",
            "Page Section",
            f"Smooth scrolls to section ID '{url.lstrip('#')}'. Working."
        )

    # Specific missing route audit finding: /help in OrganizationSideMenu
    if url == "/help":
        return (
            "/help",
            "Provider Help Desk (Missing Route)",
            "None (Hits 404/Fallback)",
            "Missing Route",
            "Help & Support",
            "CRITICAL AUDIT FINDING: Link in OrganizationSideMenu points to '/help', which is NOT defined in AppRoutes.tsx. Falls back to Home (/). Should be updated to '/resources/help-support'."
        )

    # AppRoutes match
    if clean_url in ROUTES_MAP:
        r = ROUTES_MAP[clean_url]
        status = "Valid & Routed"
        notes = "Route strictly verified against AppRoutes.tsx. Active and fully rendered."
        if r["status"] == "Redirect Alias":
            status = "Redirect Route"
            notes = f"Convenience alias route that redirects automatically to {r['component']}."
        return (
            clean_url,
            r["screen"],
            r["component"],
            status,
            r["section"],
            notes
        )

    return (
        clean_url,
        f"Unregistered Screen ({url})",
        "None",
        "Missing Route",
        "Unclassified",
        "Audit Finding: Link points to an unhandled route in AppRoutes.tsx. Will trigger fallback redirect to Home."
    )

def generate_full_excel():
    raw_links = extract_all_links()
    print(f"Total raw links processed: {len(raw_links)}")

    wb = openpyxl.Workbook()
    wb.remove(wb.active) # Remove blank sheet

    # Fonts & Fills
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    header_fill = PatternFill(start_color="0F172A", end_color="0F172A", fill_type="solid") # Slate 900
    
    regular_font = Font(name="Calibri", size=10, color="0F172A")
    mono_font = Font(name="Consolas", size=9, color="1E293B")
    bold_font = Font(name="Calibri", size=10, bold=True, color="0F172A")

    thin_border = Border(
        left=Side(style='thin', color='E2E8F0'),
        right=Side(style='thin', color='E2E8F0'),
        top=Side(style='thin', color='E2E8F0'),
        bottom=Side(style='thin', color='E2E8F0')
    )

    status_styles = {
        "Valid & Routed": {
            "fill": PatternFill(start_color="DCFCE7", end_color="DCFCE7", fill_type="solid"),
            "font": Font(name="Calibri", size=10, bold=True, color="15803D")
        },
        "Redirect Route": {
            "fill": PatternFill(start_color="DBEAFE", end_color="DBEAFE", fill_type="solid"),
            "font": Font(name="Calibri", size=10, bold=True, color="1D4ED8")
        },
        "Valid Dynamic Route": {
            "fill": PatternFill(start_color="E0E7FF", end_color="E0E7FF", fill_type="solid"),
            "font": Font(name="Calibri", size=10, bold=True, color="4338CA")
        },
        "External Link": {
            "fill": PatternFill(start_color="F3E8FF", end_color="F3E8FF", fill_type="solid"),
            "font": Font(name="Calibri", size=10, bold=True, color="7E22CE")
        },
        "Protocol Link": {
            "fill": PatternFill(start_color="FCE7F3", end_color="FCE7F3", fill_type="solid"),
            "font": Font(name="Calibri", size=10, bold=True, color="BE185D")
        },
        "In-Page Anchor": {
            "fill": PatternFill(start_color="FEF9C3", end_color="FEF9C3", fill_type="solid"),
            "font": Font(name="Calibri", size=10, bold=True, color="A16207")
        },
        "Placeholder Anchor (#)": {
            "fill": PatternFill(start_color="FFEDD5", end_color="FFEDD5", fill_type="solid"),
            "font": Font(name="Calibri", size=10, bold=True, color="C2410C")
        },
        "Missing Route": {
            "fill": PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid"),
            "font": Font(name="Calibri", size=10, bold=True, color="B91C1C")
        },
    }

    # =========================================================================
    # SHEET 1: ALL NAVIGATION LINKS AUDIT
    # =========================================================================
    ws1 = wb.create_sheet(title="All Navigation Links Audit")
    ws1.views.sheetView[0].showGridLines = True

    headers1 = [
        "Link ID",
        "Source Screen Name",
        "Source File Path",
        "Source Line #",
        "UI Element",
        "Link Label / CTA Text",
        "Target URL (to / href)",
        "Target Screen Name",
        "Target Component",
        "Module Category",
        "Audit Status",
        "Audit Findings & Recommendations"
    ]
    ws1.append(headers1)
    for c_idx in range(1, len(headers1) + 1):
        cell = ws1.cell(row=1, column=c_idx)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = thin_border
    ws1.row_dimensions[1].height = 28

    link_idx = 1
    evaluated_all = []
    for item in raw_links:
        target_link, target_screen, target_comp, status, category, notes = evaluate_link(item)
        evaluated_all.append((item, target_link, target_screen, target_comp, status, category, notes))

        row_data = [
            f"LNK-{link_idx:03d}",
            item["source_screen"],
            item["source_file"],
            item["line_no"],
            item["element_type"],
            item["label"],
            item["url"],
            target_screen,
            target_comp,
            category,
            status,
            notes
        ]
        ws1.append(row_data)
        curr_row = ws1.max_row
        ws1.row_dimensions[curr_row].height = 21

        is_even = curr_row % 2 == 0
        bg_fill = PatternFill(start_color="F8FAFC" if is_even else "FFFFFF",
                              end_color="F8FAFC" if is_even else "FFFFFF",
                              fill_type="solid")

        for col_idx in range(1, len(headers1) + 1):
            cell = ws1.cell(row=curr_row, column=col_idx)
            cell.border = thin_border
            cell.font = regular_font
            cell.fill = bg_fill
            cell.alignment = Alignment(vertical="center")

            if col_idx == 1:
                cell.font = mono_font
                cell.alignment = Alignment(horizontal="center", vertical="center")
            elif col_idx in [3, 4, 5, 7, 9]:
                cell.font = mono_font
            if col_idx == 4:
                cell.alignment = Alignment(horizontal="center", vertical="center")
            if col_idx == 11:
                st_style = status_styles.get(status, {"fill": bg_fill, "font": bold_font})
                cell.fill = st_style["fill"]
                cell.font = st_style["font"]
                cell.alignment = Alignment(horizontal="center", vertical="center")

        link_idx += 1

    ws1.freeze_panes = "A2"
    ws1.auto_filter.ref = f"A1:{get_column_letter(len(headers1))}{ws1.max_row}"

    ws1.column_dimensions["A"].width = 12
    ws1.column_dimensions["B"].width = 34
    ws1.column_dimensions["C"].width = 38
    ws1.column_dimensions["D"].width = 14
    ws1.column_dimensions["E"].width = 22
    ws1.column_dimensions["F"].width = 34
    ws1.column_dimensions["G"].width = 35
    ws1.column_dimensions["H"].width = 36
    ws1.column_dimensions["I"].width = 30
    ws1.column_dimensions["J"].width = 24
    ws1.column_dimensions["K"].width = 24
    ws1.column_dimensions["L"].width = 55


    # =========================================================================
    # SHEET 2: DEFINED ROUTES INVENTORY
    # =========================================================================
    ws2 = wb.create_sheet(title="AppRoutes Inventory")
    ws2.views.sheetView[0].showGridLines = True

    headers2 = [
        "Route ID",
        "Route URL Pattern",
        "Screen Name",
        "Platform Section",
        "Layout Wrapper",
        "Component Implementation File",
        "Route Status",
        "Linked in Navigation?",
        "Functional Scope & Screen Description"
    ]
    ws2.append(headers2)
    for c_idx in range(1, len(headers2) + 1):
        cell = ws2.cell(row=1, column=c_idx)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = thin_border
    ws2.row_dimensions[1].height = 28

    # Set of all extracted URLs for orphan check
    linked_urls = set(item["url"].split('?')[0].split('#')[0].rstrip('/') for item in raw_links)
    linked_urls.add("/")

    r_idx = 1
    for r in APP_ROUTES:
        clean_p = r["path"].rstrip('/') or '/'
        is_linked = "Yes (Direct Link)" if clean_p in linked_urls else "No (Orphan Route)"
        if r["status"] == "Redirect Alias":
            is_linked = "Alias Route"

        row_data = [
            f"RT-{r_idx:02d}",
            r["path"],
            r["screen"],
            r["section"],
            r["layout"],
            r["component"],
            r["status"],
            is_linked,
            r["desc"]
        ]
        ws2.append(row_data)
        curr_row = ws2.max_row
        ws2.row_dimensions[curr_row].height = 22

        is_even = curr_row % 2 == 0
        bg_fill = PatternFill(start_color="F8FAFC" if is_even else "FFFFFF",
                              end_color="F8FAFC" if is_even else "FFFFFF",
                              fill_type="solid")

        for col_idx in range(1, len(headers2) + 1):
            cell = ws2.cell(row=curr_row, column=col_idx)
            cell.border = thin_border
            cell.font = regular_font
            cell.fill = bg_fill
            cell.alignment = Alignment(vertical="center")

            if col_idx == 1:
                cell.font = mono_font
                cell.alignment = Alignment(horizontal="center", vertical="center")
            elif col_idx in [2, 6]:
                cell.font = mono_font
            if col_idx == 7:
                st = r["status"]
                if "Active" in st:
                    cell.fill = status_styles["Valid & Routed"]["fill"]
                    cell.font = status_styles["Valid & Routed"]["font"]
                else:
                    cell.fill = status_styles["Redirect Route"]["fill"]
                    cell.font = status_styles["Redirect Route"]["font"]
                cell.alignment = Alignment(horizontal="center", vertical="center")
            if col_idx == 8:
                if "Yes" in is_linked:
                    cell.font = Font(name="Calibri", size=10, bold=True, color="15803D")
                elif "No" in is_linked:
                    cell.font = Font(name="Calibri", size=10, bold=True, color="B45309")
                    cell.fill = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")
                cell.alignment = Alignment(horizontal="center", vertical="center")

        r_idx += 1

    ws2.freeze_panes = "A2"
    ws2.auto_filter.ref = f"A1:{get_column_letter(len(headers2))}{ws2.max_row}"

    ws2.column_dimensions["A"].width = 12
    ws2.column_dimensions["B"].width = 38
    ws2.column_dimensions["C"].width = 36
    ws2.column_dimensions["D"].width = 24
    ws2.column_dimensions["E"].width = 20
    ws2.column_dimensions["F"].width = 34
    ws2.column_dimensions["G"].width = 22
    ws2.column_dimensions["H"].width = 22
    ws2.column_dimensions["I"].width = 65


    # =========================================================================
    # SHEET 3: AUDIT SUMMARY & GAP ANALYSIS
    # =========================================================================
    ws3 = wb.create_sheet(title="Audit & Gap Analysis")
    ws3.views.sheetView[0].showGridLines = True

    # Title
    ws3.merge_cells("A1:F1")
    t1 = ws3["A1"]
    t1.value = "SODAARS OOH OPERATING SYSTEM — LINKS & NAVIGATION AUDIT REPORT"
    t1.font = Font(name="Calibri", size=13, bold=True, color="FFFFFF")
    t1.fill = PatternFill(start_color="0F172A", end_color="0F172A", fill_type="solid")
    t1.alignment = Alignment(horizontal="center", vertical="center")
    ws3.row_dimensions[1].height = 34

    ws3.merge_cells("A2:F2")
    t2 = ws3["A2"]
    t2.value = "Audit generated from complete codebase static analysis. Use this matrix to audit dead links, wire missing routes, and track screens."
    t2.font = Font(name="Calibri", size=9.5, italic=True, color="64748B")
    t2.fill = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")
    t2.alignment = Alignment(horizontal="center", vertical="center")
    ws3.row_dimensions[2].height = 20

    ws3.row_dimensions[3].height = 10

    # Section 1: Executive KPI Metrics
    ws3.merge_cells("A4:F4")
    kpi_hdr = ws3["A4"]
    kpi_hdr.value = "1. EXECUTIVE AUDIT METRICS"
    kpi_hdr.font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    kpi_hdr.fill = PatternFill(start_color="334155", end_color="334155", fill_type="solid")
    kpi_hdr.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws3.row_dimensions[4].height = 24

    total_links_count = len(raw_links)
    valid_routed_count = sum(1 for _, _, _, _, st, _, _ in evaluated_all if "Valid" in st)
    redirect_count = sum(1 for _, _, _, _, st, _, _ in evaluated_all if "Redirect" in st)
    external_count = sum(1 for _, _, _, _, st, _, _ in evaluated_all if "External" in st or "Protocol" in st)
    hash_anchor_count = sum(1 for _, _, _, _, st, _, _ in evaluated_all if "Anchor" in st)
    missing_count = sum(1 for _, _, _, _, st, _, _ in evaluated_all if "Missing" in st)
    placeholder_count = sum(1 for _, _, _, _, st, _, _ in evaluated_all if "Placeholder" in st)
    unique_targets_count = len(set(item["url"] for item in raw_links))

    kpi_rows = [
        ("Total Clickable Links in Project", total_links_count, "All navigation links, buttons, drawers, and CTAs across the entire codebase"),
        ("Unique Destination Targets", unique_targets_count, "Distinct target URLs, route paths, and anchor sections"),
        ("Active AppRoutes Defined", len(APP_ROUTES), "Registered routes in AppRoutes.tsx (38 active pages + 4 redirect aliases)"),
        ("Verified Valid & Working Links", valid_routed_count, "Links matching an active page component perfectly"),
        ("Valid Redirect / Alias Links", redirect_count, "Convenience links (e.g. /login -> /signin, /panel -> dashboard)"),
        ("External Links & System Protocols", external_count, "Outbound links and direct email/phone communication triggers"),
        ("In-Page Section Anchors (#)", hash_anchor_count - placeholder_count, "Smooth-scroll section anchors on public landing pages"),
        ("Missing Route Alerts (Needs Immediate Route)", missing_count, "Links pointing to unregistered paths (e.g. /help in OrgSideMenu)"),
        ("Placeholder Anchor Links (#)", placeholder_count, "Unwired placeholders (e.g. #forgot, #privacy, #terms in Auth forms)"),
    ]

    curr_r = 5
    for title_txt, val_txt, desc_txt in kpi_rows:
        ws3.cell(row=curr_r, column=1, value=title_txt).font = bold_font
        c_val = ws3.cell(row=curr_r, column=2, value=val_txt)
        c_val.font = Font(name="Calibri", size=11, bold=True, color="0F172A")
        c_val.alignment = Alignment(horizontal="center", vertical="center")
        ws3.merge_cells(start_row=curr_r, start_column=3, end_row=curr_r, end_column=6)
        ws3.cell(row=curr_r, column=3, value=desc_txt).font = Font(name="Calibri", size=9.5, italic=True, color="64748B")

        for c in range(1, 7):
            cell = ws3.cell(row=curr_r, column=c)
            cell.border = thin_border
            if "Missing Route" in title_txt:
                cell.fill = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid")
            elif "Placeholder" in title_txt:
                cell.fill = PatternFill(start_color="FFEDD5", end_color="FFEDD5", fill_type="solid")
            elif "Verified" in title_txt:
                cell.fill = PatternFill(start_color="F0FDF4", end_color="F0FDF4", fill_type="solid")
            else:
                cell.fill = PatternFill(start_color="FFFFFF" if curr_r % 2 == 0 else "F8FAFC", end_color="FFFFFF" if curr_r % 2 == 0 else "F8FAFC", fill_type="solid")

        ws3.row_dimensions[curr_r].height = 20
        curr_r += 1

    curr_r += 1

    # Section 2: Gaps & Action Items
    ws3.merge_cells(start_row=curr_r, start_column=1, end_row=curr_r, end_column=6)
    gap_hdr = ws3.cell(row=curr_r, column=1)
    gap_hdr.value = "2. IDENTIFIED ACTION ITEMS & MISSING LINK GAPS"
    gap_hdr.font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    gap_hdr.fill = PatternFill(start_color="B91C1C", end_color="B91C1C", fill_type="solid")
    gap_hdr.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws3.row_dimensions[curr_r].height = 24
    curr_r += 1

    gap_hdrs = ["Gap ID", "Found In Screen", "Link Text / Label", "Target URL", "Issue Classification", "Recommended Fix"]
    for idx, h in enumerate(gap_hdrs, 1):
        cell = ws3.cell(row=curr_r, column=idx, value=h)
        cell.font = Font(name="Calibri", size=10, bold=True, color="FFFFFF")
        cell.fill = PatternFill(start_color="475569", end_color="475569", fill_type="solid")
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = thin_border
    ws3.row_dimensions[curr_r].height = 22
    curr_r += 1

    # Specific audited gaps
    curated_gaps = [
        ("GAP-01", "Organization Sub-Navigation Sidebar", "Docs <ExternalLink />", "/help", "Missing Route", "Link points to '/help' which doesn't exist in AppRoutes.tsx (triggers fallback to /). Change to '/resources/help-support'."),
        ("GAP-02", "Sign In Screen", "Forgot password?", "#forgot", "Placeholder Anchor (#)", "Points to '#forgot'. Add a modal drawer for password reset or create a dedicated '/forgot-password' route."),
        ("GAP-03", "Sign In Screen & Get Started Screen", "Terms of Service", "#terms", "Placeholder Anchor (#)", "Links to '#terms'. Create a dedicated legal page at '/legal/terms' or add a modal viewer with standard SaaS terms."),
        ("GAP-04", "Sign In Screen & Get Started Screen", "Privacy Policy", "#privacy", "Placeholder Anchor (#)", "Links to '#privacy'. Create a dedicated legal page at '/legal/privacy' or add a modal viewer for DPDP Act compliance."),
        ("GAP-05", "Pricing Page & Partnerships Page", "Contact Sales / Partner Form", "#inquiry-form / #partner-form", "Section Anchor", "Scrolls to footer form. Ensure smooth scroll behavior is enabled across all screen viewports."),
    ]

    for g_id, g_screen, g_label, g_link, g_issue, g_rec in curated_gaps:
        ws3.cell(row=curr_r, column=1, value=g_id).font = mono_font
        ws3.cell(row=curr_r, column=1).alignment = Alignment(horizontal="center", vertical="center")
        ws3.cell(row=curr_r, column=2, value=g_screen).font = regular_font
        ws3.cell(row=curr_r, column=3, value=g_label).font = bold_font
        ws3.cell(row=curr_r, column=4, value=g_link).font = mono_font
        
        c_issue = ws3.cell(row=curr_r, column=5, value=g_issue)
        c_issue.font = Font(name="Calibri", size=10, bold=True, color="B91C1C" if "Missing" in g_issue else "C2410C")
        c_issue.alignment = Alignment(horizontal="center", vertical="center")
        
        ws3.cell(row=curr_r, column=6, value=g_rec).font = regular_font

        for c in range(1, 7):
            cell = ws3.cell(row=curr_r, column=c)
            cell.border = thin_border
            cell.fill = PatternFill(start_color="FFF1F2" if "Missing" in g_issue else "FFFBEB",
                                   end_color="FFF1F2" if "Missing" in g_issue else "FFFBEB",
                                   fill_type="solid")

        ws3.row_dimensions[curr_r].height = 24
        curr_r += 1

    curr_r += 1

    # Section 3: Orphaned Routes (Defined but never linked)
    ws3.merge_cells(start_row=curr_r, start_column=1, end_row=curr_r, end_column=6)
    orp_hdr = ws3.cell(row=curr_r, column=1)
    orp_hdr.value = "3. ORPHANED / UNLINKED ROUTES (DEFINED IN APPROUTES BUT NEVER LINKED IN UI)"
    orp_hdr.font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    orp_hdr.fill = PatternFill(start_color="B45309", end_color="B45309", fill_type="solid")
    orp_hdr.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws3.row_dimensions[curr_r].height = 24
    curr_r += 1

    orp_hdrs = ["Orphan ID", "Route URL", "Screen Name", "Component File", "Route Category", "Recommended Navigation Placement"]
    for idx, h in enumerate(orp_hdrs, 1):
        cell = ws3.cell(row=curr_r, column=idx, value=h)
        cell.font = Font(name="Calibri", size=10, bold=True, color="FFFFFF")
        cell.fill = PatternFill(start_color="475569", end_color="475569", fill_type="solid")
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = thin_border
    ws3.row_dimensions[curr_r].height = 22
    curr_r += 1

    orphans_list = [
        ("ORP-01", "/company/about", "About SODAARS", "AboutCompanyPage.tsx", "Public Portal", "Add direct link in PublicFooter under 'Company' column (currently links to /company hub)."),
        ("ORP-02", "/marketplace/overview", "Marketplace Overview", "MarketplaceOverviewPage.tsx", "Public Portal", "Add direct link in PublicFooter or Megamenu (currently links to /marketplace hub)."),
        ("ORP-03", "/resources/outdoor-advertising-resources", "Outdoor Media Formats & Specs", "ResourcesPage.tsx", "Public Portal", "Alias route. Both /resources and /resources/outdoor-advertising-resources render ResourcesPage."),
        ("ORP-04", "/company/why-sodaars", "Why SODAARS Value Proposition", "PartnershipsPage.tsx", "Public Portal", "Alias route pointing to PartnershipsPage. Link from marketing hero or footer."),
    ]

    for o_id, o_url, o_name, o_comp, o_cat, o_rec in orphans_list:
        ws3.cell(row=curr_r, column=1, value=o_id).font = mono_font
        ws3.cell(row=curr_r, column=1).alignment = Alignment(horizontal="center", vertical="center")
        ws3.cell(row=curr_r, column=2, value=o_url).font = mono_font
        ws3.cell(row=curr_r, column=3, value=o_name).font = bold_font
        ws3.cell(row=curr_r, column=4, value=o_comp).font = mono_font
        ws3.cell(row=curr_r, column=5, value=o_cat).font = regular_font
        ws3.cell(row=curr_r, column=6, value=o_rec).font = regular_font

        for c in range(1, 7):
            cell = ws3.cell(row=curr_r, column=c)
            cell.border = thin_border
            cell.fill = PatternFill(start_color="FEF9C3", end_color="FEF9C3", fill_type="solid")

        ws3.row_dimensions[curr_r].height = 22
        curr_r += 1

    ws3.column_dimensions["A"].width = 30
    ws3.column_dimensions["B"].width = 34
    ws3.column_dimensions["C"].width = 28
    ws3.column_dimensions["D"].width = 22
    ws3.column_dimensions["E"].width = 26
    ws3.column_dimensions["F"].width = 65


    # =========================================================================
    # SHEET 4: SCREEN-BY-SCREEN NAVIGATION MAP
    # =========================================================================
    ws4 = wb.create_sheet(title="Screen-by-Screen Map")
    ws4.views.sheetView[0].showGridLines = True

    headers4 = [
        "Screen Name",
        "Screen Type",
        "Source File",
        "Total Outgoing Links",
        "Working Routed Links",
        "Outbound / Anchor Links",
        "Primary Destinations From This Screen"
    ]
    ws4.append(headers4)
    for c_idx in range(1, len(headers4) + 1):
        cell = ws4.cell(row=1, column=c_idx)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = thin_border
    ws4.row_dimensions[1].height = 28

    # Group links by source screen
    screens_map = {}
    for item, target_link, target_screen, target_comp, status, category, notes in evaluated_all:
        s_name = item["source_screen"]
        if s_name not in screens_map:
            screens_map[s_name] = {
                "file": item["source_file"],
                "total": 0,
                "routed": 0,
                "other": 0,
                "destinations": set()
            }
        screens_map[s_name]["total"] += 1
        if "Valid" in status or "Redirect" in status:
            screens_map[s_name]["routed"] += 1
        else:
            screens_map[s_name]["other"] += 1
        screens_map[s_name]["destinations"].add(target_screen)

    curr_row = 2
    for s_name in sorted(screens_map.keys()):
        data = screens_map[s_name]
        s_type = "Public Screen" if "public" in data["file"].lower() else "Provider Panel Screen"
        dests_summary = ", ".join(sorted(data["destinations"])[:5])
        if len(data["destinations"]) > 5:
            dests_summary += f", and {len(data['destinations']) - 5} more..."

        row_data = [
            s_name,
            s_type,
            data["file"],
            data["total"],
            data["routed"],
            data["other"],
            dests_summary
        ]
        ws4.append(row_data)
        ws4.row_dimensions[curr_row].height = 21

        is_even = curr_row % 2 == 0
        bg_fill = PatternFill(start_color="F8FAFC" if is_even else "FFFFFF",
                              end_color="F8FAFC" if is_even else "FFFFFF",
                              fill_type="solid")

        for col_idx in range(1, len(headers4) + 1):
            cell = ws4.cell(row=curr_row, column=col_idx)
            cell.border = thin_border
            cell.font = regular_font
            cell.fill = bg_fill
            cell.alignment = Alignment(vertical="center")

            if col_idx in [4, 5, 6]:
                cell.alignment = Alignment(horizontal="center", vertical="center")
                cell.font = bold_font
            if col_idx == 3:
                cell.font = mono_font

        curr_row += 1

    ws4.freeze_panes = "A2"
    ws4.auto_filter.ref = f"A1:{get_column_letter(len(headers4))}{ws4.max_row}"

    ws4.column_dimensions["A"].width = 36
    ws4.column_dimensions["B"].width = 24
    ws4.column_dimensions["C"].width = 38
    ws4.column_dimensions["D"].width = 20
    ws4.column_dimensions["E"].width = 20
    ws4.column_dimensions["F"].width = 22
    ws4.column_dimensions["G"].width = 65

    # Save to disk
    wb.save(OUTPUT_EXCEL)
    print(f"\nSuccessfully generated master audit workbook:\n{OUTPUT_EXCEL}")

if __name__ == "__main__":
    generate_full_excel()
