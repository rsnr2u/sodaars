# SODAARS Provider Screen Inventory & Specifications
**Project**: SODAARS (Streamline Outdoor Digital Advertising Resource System)  
**Surface**: Provider Experience (Public Website & Authenticated Operational Panel)  
**Document**: Authoritative Screen Inventory, Sub-Views & Behavioral Specifications  
**Status**: Source of Truth  
**Visual Reference**: Google Stitch Project (`https://stitch.withgoogle.com/projects/9803487048175431578`)  
**Version**: 1.1.0

---

## 1. Fixed Provider Navigation Hierarchy

The SODAARS Provider experience contains two distinct environments within the **SAME React + Vite project**:
1. **Public Provider Website** (Pre-Login Marketing & Onboarding)
2. **Provider Panel** (Authenticated Operational SaaS Platform)

### 1.1 Public Provider Website Navigation (Fixed)
```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [SODAARS Brand]      Solutions ▾   Resources ▾   Marketplace ▾   Pricing   Company ▾ │  Sign In  Get Started│
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```
- **Main Navigation**: `Solutions`, `Resources`, `Marketplace`, `Pricing`, `Company`
- **Action Triggers (Right)**: `Sign In`, `Get Started`

### 1.2 Provider Panel Navigation (Fixed Top Navigation Only)
```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [SODAARS Brand]                                            [Global Search]  [🔔] [❓] [👤 Provider]   │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Dashboard │ Advertising Resources │ Availability │ Bookings │ Customers │ Campaigns │ Reports │ Organization ▾│
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```
- **Primary Top Navigation**:
  1. `Dashboard` (`/panel/dashboard`)
  2. `Advertising Resources` (`/panel/resources`)
  3. `Availability` (`/panel/availability`)
  4. `Bookings` (`/panel/bookings`)
  5. `Customers` (`/panel/customers`)
  6. `Campaigns` (`/panel/campaigns`)
  7. `Reports` (`/panel/reports`)
  8. `Organization` (`/panel/organization/*`)
     - Organization Profile (`/panel/organization/profile`)
     - Team Management (`/panel/organization/team`)
     - Subscription (`/panel/organization/subscription`)
     - Marketplace (`/panel/organization/marketplace`)
     - Marketplace Agreement (`/panel/organization/marketplace-agreement`)
     - Settings (`/panel/organization/settings`)

> [!CAUTION]
> **STRICT ARCHITECTURAL INVARIANTS**:
> - **TOP NAVIGATION ONLY. NO SIDEBAR**.
> - **Do NOT rename** navigation items.
> - **Locations are NOT a primary navigation item**. Locations exist strictly as supporting spatial records attached to Advertising Resources.
> - **Leads / Enquiries are NOT primary navigation items**. Inquiries are handled natively within the multi-source Bookings pipeline and Customer CRM.
> - **V1 Scope is Strictly STATIC Outdoor Media**: Hoardings, Billboards, Unipoles, Gantries, Bus Shelters, Pole Ads, Wall Mounts, Rooftops, Bridge Panels, Other Static Assets. (No LED screens, digital screens, or programmatic DOOH).

---

## 2. Core Provider Workflow Chain

Data and operations flow sequentially through the physical and contractual lifecycle:

```
┌────────────────────────┐
│  ADVERTISING RESOURCE  │  Physical display face registered (Unipole, Hoarding, Gantry)
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│      AVAILABILITY      │  Real-time scheduling grid (Available, Booked, Hold, Blocked)
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│        BOOKING         │  Multi-source contract lifecycle (Marketplace / Admin / Direct)
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│        CUSTOMER        │  Client entity record (Agency, Enterprise Buyer, Local Business)
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│        CAMPAIGN        │  Operational display execution & field mounting milestones
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ CAMPAIGN PHOTO PROOF   │  Photo proof uploads associated with campaign execution
└────────────────────────┘
```

---

## 3. Part 1 — Public Provider Website Screens

Pre-login marketing and onboarding experience (`/`).

---

### Screen 1.1: Public Home (`/`)
- **Screen Name**: Public Provider Home
- **Purpose**: Introduce SODAARS to outdoor media asset owners, communicate the value proposition, showcase the 5 Core Solutions, and drive sign-ups.
- **Entry Point**: Direct domain root (`https://provider.sodaars.com/` or `http://localhost:5173/`).
- **Navigation Location**: Public Navbar (`Home`).
- **Page Hierarchy**: Top Navbar → Hero Section → 5 Core Solutions Showcase → Operational Platform Preview → Pricing Teaser → FAQ Teaser → Footer.
- **Main Sections**:
  - *Hero Section*: High-impact editorial headline, sub-headline, primary CTA `Get Started`, secondary CTA `Explore Marketplace`.
  - *5 Core Solutions Grid*: Cards for Resource Management, Availability Engine, Booking Pipeline, Customer CRM, and Campaign Execution.
  - *SaaS Platform Preview*: Visual screenshot/mockup of the high-density Provider Panel topbar interface.
  - *Pricing Snapshot*: Overview of Tier 1 (₹4,999/mo) and Tier 2 (₹8,999/mo) based on total registered resources.
  - *Footer*: Navigation sitemap, legal links, copyright notices.
- **Primary Actions**: `Get Started` (routes to `/get-started`), `Sign In` (routes to `/signin`).
- **Secondary Actions**: `Explore Solutions` (routes to `/solutions`), `View Pricing` (routes to `/pricing`).
- **Data Displayed**: Static marketing copy, solution titles and official descriptions, subscription price points.
- **Forms / Search / Filters**: None.
- **Empty / Loading / Error States**: Static page, no dynamic fetch dependencies.
- **Permissions**: Public (Unauthenticated).
- **Responsive Behavior**: Collapses public navigation links into a mobile slide-out sheet on viewports $< 768\text{px}$.

---

### Screen 1.2: Public Solutions (`/solutions`)
- **Screen Name**: Provider Solutions Showcase
- **Purpose**: Comprehensive deep dive into the 5 Core Solutions for outdoor advertising operators.
- **Entry Point**: Public Navbar → `Solutions` (or via Solutions Mega Menu).
- **Navigation Location**: Public Navbar → `Solutions ▾`.
- **Solutions Mega Menu Structure (Fixed)**:
  1. **Resource Management**: *Hoardings, unipoles & gantries*
  2. **Availability Engine**: *Real-time slot & hold manager*
  3. **Booking Pipeline**: *Direct contracts & client renewals*
  4. **Customer CRM**: *Agencies and direct enterprise buyers*
  5. **Campaign Execution**: *Mounting photo proof & audit trails*
- **Main Sections**:
  - Detailed alternating feature blocks for each of the 5 solutions with high-fidelity UI previews, operational workflows, and specific media operator benefits.
- **Primary Actions**: `Get Started` CTA banner at base of page.
- **Permissions**: Public (Unauthenticated).

---

### Screen 1.3: Public Resources (`/resources`)
- **Screen Name**: Industry Resources & Knowledge Hub
- **Purpose**: Operational guides, static outdoor advertising playbooks, and support documentation for asset owners.
- **Entry Point**: Public Navbar → `Resources ▾`.
- **Resources Mega Menu Structure (Fixed)**:
  1. **Outdoor Advertising Resources**
  2. **Guides & Playbooks**
  3. **FAQ**
  4. **Help Center & Support**
- **Main Sections**: Resource category tabs, featured playbook cards, searchable FAQ accordion, contact support link.
- **Permissions**: Public (Unauthenticated).

---

### Screen 1.4: Public Marketplace Info (`/marketplace`)
- **Screen Name**: Marketplace Channel Overview
- **Purpose**: Educate providers on the SODAARS public Marketplace discovery channel, emphasizing voluntary participation, net pricing control, and provider independence.
- **Entry Point**: Public Navbar → `Marketplace ▾`.
- **Marketplace Mega Menu Structure (Fixed)**:
  1. **Marketplace Overview**
  2. **Browse Advertising Resources** (Link to public Marketplace discovery surface)
  3. **How Marketplace Works**
  4. **Provider Benefits & Control**
  5. **Participation Terms**
  6. **For Advertisers**
  7. **For Providers**
- **Main Sections**: The dual-price model explanation (Regular Customer Price vs SODAARS Net Price), asset-level participation control explanation, disclaimer that Marketplace does not guarantee bookings or revenue.
- **Permissions**: Public (Unauthenticated).

---

### Screen 1.5: Public Pricing (`/pricing`)
- **Screen Name**: Provider Subscription Pricing
- **Purpose**: Transparent presentation of SaaS subscription tiers and commercial terms.
- **Entry Point**: Public Navbar → `Pricing`.
- **Main Sections**:
  - Centered header: "Simple, Predictable SaaS Pricing for Outdoor Media Owners".
  - Two comparison cards:
    - **Tier 1 (1–50 Registered Resources)**: **₹4,999 / month**
    - **Tier 2 (51–100 Registered Resources)**: **₹8,999 / month**
    - Enterprise (>100 Resources): `[TBD / requires business decision]`
  - Explicit rule explanation callout: "Subscription tier is calculated based on TOTAL REGISTERED RESOURCES (Active + Inactive combined)."
  - Commercial exclusions checklist: Zero setup fees, zero booking commissions on direct clients, all 5 core solutions included.
- **Primary Actions**: `Choose Plan` / `Get Started` (routes to `/get-started?tier=...`).
- **Permissions**: Public (Unauthenticated).

---

### Screen 1.6: Public Company (`/company`)
- **Screen Name**: About SODAARS
- **Purpose**: SODAARS mission, operational vision, and corporate identity.
- **Entry Point**: Public Navbar → `Company ▾`.
- **Company Mega Menu Structure (Fixed)**:
  1. **About SODAARS**
  2. **Why SODAARS**
  3. **Contact Team**
- **Main Sections**: Company background, provider-first philosophy, contact information form.
- **Permissions**: Public (Unauthenticated).

---

### Screen 1.7: Sign In (`/signin`)
- **Screen Name**: Provider Authentication Portal
- **Purpose**: Secure credential entry for registered provider staff to access their Provider Panel.
- **Entry Point**: Public Navbar → `Sign In` button.
- **Layout**: Centered card on warm neutral canvas (`#FAFAF9`), SODAARS logo, title "Sign in to Provider Panel".
- **Form Controls**: Work Email input, Password input, "Remember me" checkbox, "Forgot password?" link.
- **Primary Action**: `Sign In` button (Orange).
- **Secondary Action**: `Don't have an account? Get Started`.
- **Validation**: Email format validation, password required. On submit: authenticates via `/api/v1/provider/auth/login`, stores Sanctum token, redirects to `/panel/dashboard`.
- **States**: Loading spinner on button; inline error alert for invalid credentials or suspended accounts.
- **Permissions**: Public (Unauthenticated).

---

### Screen 1.8: Get Started (`/get-started`)
- **Screen Name**: Provider Onboarding & Registration
- **Purpose**: Multi-step onboarding for new media asset owners to register their organization.
- **Entry Point**: Public Navbar → `Get Started` button.
- **Layout**: Progress indicator (Step 1: Organization Details → Step 2: Media Asset Inventory → Step 3: Account Credentials).
- **Form Controls**:
  - Step 1: Legal Company Name, Brand Name, GSTIN (optional/required for billing), Primary Phone, Corporate Email, City/State.
  - Step 2: Estimated Total Registered Resources (1–50, 51–100, >100), Primary Static Asset Types (Hoardings, Unipoles, Gantries, etc.).
  - Step 3: Contact Person Name, Mobile Number, Admin Password.
- **Primary Action**: `Create Organization Account`.
- **Validation**: Mobile number (10 digits), password complexity, company name required.
- **Permissions**: Public (Unauthenticated).

---

## 4. Part 2 — Provider Panel Primary Screens (Authenticated)

Topbar Navigation Only (`/panel/*`). Strictly NO Sidebar.

---

### Screen 2.1: Dashboard (`/panel/dashboard`)
- **Screen Name**: Operational Command Dashboard
- **Purpose**: Real-time snapshot of provider fleet occupancy, active campaigns, pending booking requests, and resource quotas.
- **Entry Point**: Post-login landing page, top navigation `Dashboard`.
- **Navigation Location**: Top Navigation → `Dashboard`.
- **Page Hierarchy**: Top Header → Top Nav → Page Header (Greeting + Title + Quick Action `+ Register Resource`) → 3 Metric/Operational Content Rows.
- **Main Sections**:
  - Row 1: 4 KPI Cards (Total Registered Resources, Fleet Occupancy %, Pending Booking Inquiries, Active Campaigns).
  - Row 2: Pending Bookings Attention Table (60% width) + Active Campaign Field Mounting Widget (40% width).
  - Row 3: 30-Day Fleet Vacancy Horizon mini-calendar.
- **Primary Actions**: Click `+ Register Resource` (opens `ResourceFormDrawer`).
- **Secondary Actions**: Click pending booking row (opens `BookingDetailDrawer`).
- **Data Displayed**: Metric counts, booking codes, client names, targeted asset names, campaign start/end dates, mounting status.
- **States**:
  - *Empty State*: "Welcome to SODAARS. Begin by registering your first physical advertising asset." CTA: `+ Register Resource`.
  - *Loading State*: Skeleton cards with subtle shimmer.
  - *Error State*: Inline banner with "Unable to load dashboard metrics. [Retry]".
- **Permissions**: `owner`, `manager`, `viewer`.
- **Relationships**: Deep-links to Advertising Resources, Bookings, and Campaigns.

---

### Screen 2.2: Advertising Resources (`/panel/resources`)
- **Screen Name**: Advertising Resources Register
- **Purpose**: Central physical inventory management asset register for all static outdoor displays.
- **Entry Point**: Top Navigation → `Advertising Resources`.
- **Navigation Location**: Top Navigation → `Advertising Resources`.
- **Page Hierarchy**: Top Header → Top Nav → Page Header (Breadcrumbs: `Dashboard / Advertising Resources`, Title `Advertising Resources`, Metric Badge `70 Total Registered (45 Active, 25 Inactive)`, Buttons `Export CSV`, `+ Register Resource`) → Filter Bar → Tabular Register.
- **Main Sections**:
  - Filter & Search Bar: Text search, Resource Type filter, Status filter, Marketplace Participation toggle filter, City filter.
  - Inventory Table: High-density rows with thumbnail, asset name, static type, location site, dimensions ($W \times H$, SqFt), illumination, customer price (₹), SODAARS net price (₹), Marketplace toggle switch, status badge, action menu.
- **Primary Actions**: `+ Register Resource` (opens `ResourceFormDrawer`).
- **Secondary Actions**:
  - Click row (opens `ResourceDetailDrawer`).
  - Toggle Marketplace switch inline (opens confirmation dialog).
  - Click `Export CSV` (downloads tabular data).
- **Forms & Validation**:
  - Managed via `ResourceFormDrawer` (sub-view).
- **States**:
  - *Empty State*: "No advertising resources registered yet." CTA: `+ Register First Resource`.
  - *Loading State*: 5 skeleton table rows.
  - *Error State*: "Failed to retrieve inventory register. [Retry]".
  - *Success State*: Toast "Advertising resource saved successfully."
- **Permissions**: `viewer` (read-only); `manager`, `owner` (create/edit/toggle marketplace).
- **Relationships**: Invokes `ResourceFormDrawer`, `LocationInlineModal`, and `ResourceDetailDrawer`.

---

### Screen 2.3: Availability (`/panel/availability`)
- **Screen Name**: Availability Engine & Hold Manager
- **Purpose**: Real-time resource-level scheduling calendar for tracking holds, blocks, reservations, and maintenance.
- **Entry Point**: Top Navigation → `Availability`.
- **Navigation Location**: Top Navigation → `Availability`.
- **Page Hierarchy**: Top Header → Top Nav → Page Header (Title `Availability`, Date Range Navigator, View Toggle: Gantt Timeline / Monthly Calendar, Button `+ Place Block`) → Resource Filter Bar → Interactive Timeline Grid.
- **Main Sections**:
  - Date & View Controls: Month / Quarter navigation, Jump to Today.
  - Timeline Canvas: Vertical asset list (rows) against horizontal calendar days (columns). Color-coded interval blocks:
    - Emerald: `Available`
    - Slate: `Booked`
    - Amber: `Hold`
    - Orange: `Provider Block`
    - Rose: `Admin Block`
    - Stone Gray: `Maintenance`
- **Primary Actions**: Click `+ Place Block` or click-and-drag dates on an asset row (opens `CreateBlockModal`).
- **Secondary Actions**: Click any scheduled block (opens `HoldDetailPopover` or links to Booking).
- **Validation**: Cannot place blocks over confirmed `Booked` or `Admin Block` intervals without prior dispute resolution.
- **States**:
  - *Empty State*: "Register advertising resources to view schedule grid."
  - *Loading State*: Shimmering timeline rows.
  - *Error State*: "Failed to load availability schedules. [Retry]".
- **Permissions**: `viewer` (read-only); `manager`, `owner` (place/remove provider blocks).
- **Relationships**: Schedules are bound directly to `advertising_resources` and `bookings`.

---

### Screen 2.4: Bookings (`/panel/bookings`)
- **Screen Name**: Multi-Source Booking Pipeline
- **Purpose**: Manage booking lifecycles across Marketplace, Admin, and Provider Direct sources.
- **Entry Point**: Top Navigation → `Bookings`.
- **Navigation Location**: Top Navigation → `Bookings`.
- **Page Hierarchy**: Top Header → Top Nav → Page Header (Title `Bookings`, Subtitle `Multi-source contract and inquiry pipeline`, Button `+ Create Direct Booking`) → Status Tabs Bar → Filter Bar → Booking Data Table.
- **Main Sections**:
  - Status Tab Bar: `All`, `Under Review`, `Confirmed`, `Active`, `Completed`, `Cancelled / Declined`.
  - Filter Bar: Search by booking code / client name, Channel source filter (`Marketplace`, `Admin`, `Provider Direct`), Date range.
  - Booking Table: Booking Code (`BKG-...`), Source Badge, Client Name, Targeted Resource, Display Window, Total Value (₹), Net Provider Payout (₹), Status Badge, Action Menu.
- **Primary Actions**: `+ Create Direct Booking` (opens `CreateDirectBookingModal`).
- **Secondary Actions**:
  - Click row (opens `BookingDetailDrawer`).
  - Click `Confirm` (opens `ConfirmBookingModal`).
  - Click `Decline` (opens `DeclineBookingModal`).
- **States**:
  - *Empty State*: "No bookings in this stage."
  - *Loading State*: Shimmering table rows.
  - *Error State*: Inline error toast on failed status transition.
- **Permissions**: `viewer` (read-only); `manager`, `owner` (status transitions).
- **Relationships**: Advances to `campaigns` upon reaching `CONFIRMED`.

---

### Screen 2.5: Customers (`/panel/customers`)
- **Screen Name**: Customer CRM & Client Directory
- **Purpose**: Manage client accounts (Agencies, Direct Enterprise, Local Business, Brands) and relationship history.
- **Entry Point**: Top Navigation → `Customers`.
- **Navigation Location**: Top Navigation → `Customers`.
- **Page Hierarchy**: Top Header → Top Nav → Page Header (Title `Customers`, Button `+ Add Customer`) → Tab Switcher (`Customer CRM` vs `Customer Activity`) → Filter Bar → Table / Activity Stream.
- **Main Sections**:
  - View A (`Customer CRM`): Tabular client directory showing Company Name, Customer Type, Primary Contact, Phone, Email, Active Displays count, Lifetime Contracts count, Status.
  - View B (`Customer Activity`): Chronological audit timeline of inquiries, proposals, contracts, and renewals.
- **Primary Actions**: `+ Add Customer` (opens `CustomerFormDrawer`).
- **Secondary Actions**: Click client row (opens `CustomerProfileDrawer`).
- **States**:
  - *Empty State*: "No customers registered. Add your first agency or direct client."
  - *Loading State*: Skeleton table rows.
- **Permissions**: `viewer` (read-only); `manager`, `owner` (create/edit customers).
- **Relationships**: Customer binds to `bookings` and `campaigns`.

---

### Screen 2.6: Campaigns (`/panel/campaigns`)
- **Screen Name**: Campaign Execution & Mounting Proof
- **Purpose**: Physical field operations tracker, vinyl mounting workflow, and timestamped photo proof logging.
- **Entry Point**: Top Navigation → `Campaigns`.
- **Navigation Location**: Top Navigation → `Campaigns`.
- **Page Hierarchy**: Top Header → Top Nav → Page Header (Title `Campaigns`, Subtitle `Physical display mounting and proof-of-performance execution`, View Toggle: Pipeline / Table) → Filter Bar → Kanban Pipeline / Data Table.
- **Main Sections**:
  - Pipeline Columns: `Planned` → `In Execution` → `Proof Submitted` → `Completed`.
  - Campaign Cards / Rows: Campaign Code, Brand/Title, Asset Name, Location, Display Dates, Execution Status, Photo Proof Badge (`Pending`, `Under Audit`, `Verified`).
- **Primary Actions**: Click `Upload Photo Proof` (opens `MountingProofUploadModal`).
- **Secondary Actions**:
  - Advance status to `In Execution` when mounting starts.
  - Click card/row to open `CampaignDetailDrawer`.
- **Proof Standards**: Photo proof uploads associated with campaign execution subject to manual audit verification. (No automated AI claimed). Specific daytime/nighttime requirements remain subject to future campaign execution specifications.
- **States**:
  - *Empty State*: "No active campaigns currently in execution."
  - *Loading State*: Shimmer cards.
- **Permissions**: `manager`, `owner` (update execution status and upload proofs).
- **Relationships**: Generated automatically upon Booking confirmation.

---

### Screen 2.7: Reports (`/panel/reports`)
- **Screen Name**: Operational & Asset Reports
- **Purpose**: Comprehensive reporting on fleet occupancy, turnaround times, booking revenue distribution, and compliance.
- **Entry Point**: Top Navigation → `Reports`.
- **Navigation Location**: Top Navigation → `Reports`.
- **Page Hierarchy**: Top Header → Top Nav → Page Header (Title `Reports`, Date Range Selector: Month/Quarter/YTD, Button `Export PDF/Excel`) → Tab Switcher → Report Analytics Grid.
- **Main Sections**:
  - Tab 1: `Operational Reports` (Mounting turnaround hours, maintenance downtime logs).
  - Tab 2: `Resource Reports` (Asset occupancy %, vacant days per asset; yield per SqFt marked as `[TBD / Future Specification]`).
  - Tab 3: `Booking Reports` (Direct vs Marketplace booking volume distribution, cancellation trends).
  - Tab 4: `Campaign Reports` (Proof compliance turnaround; verification SLA marked as `[TBD / Future Specification]`).
- **Primary Actions**: `Export Report` (downloads report file).
- **Secondary Actions**: Toggle date presets (Last 30 Days, Q1, YTD).
- **Permissions**: `owner` (full financial access); `manager` (operational and resource metrics only).

---

## 5. Part 3 — Organization Sub-Screens (Screens 8.1 to 8.6)

Accessed via Top Navigation dropdown: `Organization ▾`.

---

### Screen 2.8.1: Organization Profile (`/panel/organization/profile`)
- **Screen Name**: Organization Profile
- **Purpose**: Manage legal entity registration, trade identity, GSTIN / tax information where applicable, and registered office addresses.
- **Entry Point**: Top Navigation → `Organization ▾` → `Organization Profile`.
- **Navigation Location**: Top Navigation → `Organization` → `Organization Profile`.
- **Page Hierarchy**: Top Header → Top Nav → Page Header (Breadcrumbs: `Dashboard / Organization / Profile`, Title `Organization Profile`, Subtitle `Legal corporate identity and tax information`) → Profile Details Card & Address Card.
- **Main Sections**:
  - *Entity Identity Section*: Legal Company Name, Brand/Trade Name, Registration Number, Corporate Email, Phone Number.
  - *Tax & GSTIN Section*: GSTIN / tax information where applicable.
  - *Registered Office Address*: Street address, City, State, Pincode.
  - *Billing Contact*: Accounts representative name, billing email, billing phone.
- **Primary Actions**: `Save Profile Changes` (Orange button).
- **Secondary Actions**: `Cancel / Revert Changes`.
- **Forms & Validation**:
  - Tax Information: GSTIN / tax information where applicable (validation behavior subject to finalized business specification).
  - Email & Phone: Validated syntax; required.
- **Permissions**: `owner` (view and edit); `manager`, `viewer` (view only).
- **States**:
  - *Loading State*: Form skeleton loaders.
  - *Error State*: Inline field validation alerts.
  - *Success State*: Toast "Organization profile updated successfully."
- **Responsive Behavior**: 2-column grid collapses to single-column on viewports $< 1024\text{px}$.

---

### Screen 2.8.2: Team Management (`/panel/organization/team`)
- **Screen Name**: Team Management & Roster
- **Purpose**: Manage staff members, invite internal personnel, and assign access roles.
- **Entry Point**: Top Navigation → `Organization ▾` → `Team Management`.
- **Navigation Location**: Top Navigation → `Organization` → `Team Management`.
- **Page Hierarchy**: Top Header → Top Nav → Page Header (Breadcrumbs: `Dashboard / Organization / Team`, Title `Team Management`, Subtitle `Manage internal staff and operational permissions`, Button `+ Invite Member`) → Team Roster Table.
- **Main Sections**:
  - Active Members Table: Name, Email, Role (`Owner`, `Manager`, `Viewer`), Last Login Date, Status (`Active`, `Invited`), Actions Menu (Edit Role, Resend Invite, Revoke).
  - Pending Invitations Table: Email, Assigned Role, Sent Date, Expiration.
- **Primary Actions**: `+ Invite Member` (opens `InviteMemberModal`).
- **Secondary Actions**: `Edit Role` (changes user permissions), `Revoke Access`.
- **Forms & Validation**:
  - Handled via `InviteMemberModal` (Email required, Role selection required: `manager` or `viewer`).
- **Permissions**: `owner` only.
- **States**:
  - *Loading State*: Table row skeletons.
  - *Success State*: Toast "Invitation sent to employee@domain.com."
- **Responsive Behavior**: Table enables horizontal scroll on smaller viewports.

---

### Screen 2.8.3: Subscription (`/panel/organization/subscription`)
- **Screen Name**: Subscription & Registered Asset Quotas
- **Purpose**: Monitor registered resource counts, active SaaS subscription tier, monthly billing dates, and invoices.
- **Entry Point**: Top Navigation → `Organization ▾` → `Subscription`.
- **Navigation Location**: Top Navigation → `Organization` → `Subscription`.
- **Page Hierarchy**: Top Header → Top Nav → Page Header (Breadcrumbs: `Dashboard / Organization / Subscription`, Title `Subscription & Plan`) → Asset Quota Banner → Active Plan Card → Invoice History Table.
- **Main Sections**:
  - *Total Registered Resource Counter Banner*:
    - Prominently displays: **Total Registered Assets: Active + Inactive Combined** (e.g., `70 Registered Assets: 45 Active, 25 Inactive`).
    - Explanation: "Subscription tiers are anchored to total registered physical displays in the system."
  - *Current Active Tier Card*:
    - **Tier 1 (1–50 Registered Resources)**: ₹4,999 / month
    - **Tier 2 (51–100 Registered Resources)**: ₹8,999 / month
    - Enterprise (>100 Resources): `[TBD / requires business decision]`
    - Shows Next Billing Renewal Date, Billing Status (`Active`, `Past Due`).
  - *Invoices*: Past invoices and downloadable tax invoice functionality are marked as `[TBD / Future Specification]`.
- **Primary Actions**: `Upgrade Tier` (triggers when asset count crosses 50).
- **Permissions**: `owner` only.
- **States**:
  - *Overdue Alert*: Banner alert if subscription invoice is past due.

---

### Screen 2.8.4: Marketplace (`/panel/organization/marketplace`)
- **Screen Name**: Marketplace Channel Management
- **Purpose**: High-level administrative control over provider assets participating in the public SODAARS Marketplace.
- **Entry Point**: Top Navigation → `Organization ▾` → `Marketplace`.
- **Navigation Location**: Top Navigation → `Organization` → `Marketplace`.
- **Page Hierarchy**: Top Header → Top Nav → Page Header (Breadcrumbs: `Dashboard / Organization / Marketplace`, Title `Marketplace Participation`, Subtitle `Control voluntary discovery channel participation across your assets`) → Participation Summary Cards → Opted-In Assets Table.
- **Main Sections**:
  - *Summary Metric Cards*: Total Opted-In Assets, Active Inquiries from Marketplace, Average Agreed Markup %, Total Marketplace Bookings.
  - *Participating Assets Table*: Resource Name, Type, Location, Regular Customer Price (₹), SODAARS Net Price (₹), Participation Toggle (`ON` / `OFF`), Calendar Availability Status.
- **Primary Actions**: Individual resource-level marketplace participation toggle (enables or disables participation per advertising resource).
- **Secondary Actions**: Bulk/batch opt-in actions are marked as `[Optional / Future Enhancement]`.
- **Business Rule Callout**: "Marketplace participation is controlled per advertising resource. Marketplace participation and calendar availability are separate concepts. Participating assets remain subject to your direct holds and bookings."
- **Permissions**: `owner` only.

---

### Screen 2.8.5: Marketplace Agreement (`/panel/organization/marketplace-agreement`)
- **Screen Name**: Marketplace Commercial Agreement
- **Purpose**: Contractual reference defining the commercial terms, SODAARS Price / Provider Marketplace Net Price as the agreed settlement basis for applicable Marketplace transactions, and agreed markup framework.
- **Entry Point**: Top Navigation → `Organization ▾` → `Marketplace Agreement`.
- **Navigation Location**: Top Navigation → `Organization` → `Marketplace Agreement`.
- **Page Hierarchy**: Top Header → Top Nav → Page Header (Breadcrumbs: `Dashboard / Organization / Marketplace Agreement`, Title `Marketplace Agreement`) → Agreement Status Banner → Terms Viewer Card → Commercial Rate Schedule.
- **Main Sections**:
  - *Agreement Status Card*: Status (`Active`, `Draft`, `Pending Approval`), Agreement Code (`AGR-...`), Effective Date.
  - *Commercial Terms Summary*:
    - Provider Settlement Basis: SODAARS Price / Provider Marketplace Net Price as the agreed settlement basis for applicable Marketplace transactions (does not imply any guaranteed commercial outcome).
    - Configurable Commercial Terms: The agreement may contain configurable commercial terms where approved, while the exact contractual workflow remains subject to the Marketplace Agreement specification.
    - Customer Adjustments: SODAARS absorbs platform concessions; net provider settlement remains intact.
  - *Terms Document Viewer*: Embedded scrollable agreement text.
- **Primary Actions**: `Review & Accept Agreement Terms`.
- **Clarification Note**: Signature/countersignature workflow remains `[TBD / Future Specification]`.
- **Permissions**: `owner` only.

---

### Screen 2.8.6: Settings (`/panel/organization/settings`)
- **Screen Name**: Operational Settings
- **Purpose**: Configure system parameters, calendar preferences, and operational notification rules.
- **Entry Point**: Top Navigation → `Organization ▾` → `Settings`.
- **Navigation Location**: Top Navigation → `Organization` → `Settings`.
- **Page Hierarchy**: Top Header → Top Nav → Page Header (Breadcrumbs: `Dashboard / Organization / Settings`, Title `Settings`) → Tabbed Settings Cards.
- **Main Sections**:
  - *Calendar Preferences*: Default calendar view (Gantt vs Monthly), week start day (Monday vs Sunday).
  - *Notification Toggles*: Email alerts for new Marketplace requests, booking status changes, mounting proof uploads.
  - *Hold Expiration Policy*: Explanatory card noting that Hold auto-expiry duration is `[TBD / Future Specification]`.
  - *Operational Defaults*: Marked as `[TBD / Future Specification]`.
- **Primary Actions**: `Save Settings` (Orange button).
- **Permissions**: `owner` only.

---

## 6. Part 4 — Supporting Sub-Views & Modals (Subordinate to Primary Screens)

The following components are **subordinate sub-views** (slide-over drawers, modals, or popovers). They **never exist as standalone routes or primary navigation items**.

> [!NOTE]
> **UI/UX Design Guidance Note**: Specific width values (e.g., ~600px, ~520px, ~640px, ~480px, ~560px) represent initial UI design guidance from the Google Stitch reference. They are NOT immutable product requirements and may be adjusted responsively during implementation while preserving the Stitch visual hierarchy.

---

### 6.1 `ResourceFormDrawer` (Subordinate to Advertising Resources)
- **Type**: Right-Anchored Slide-Over Drawer (~600px approximate width based on UI/UX design reference, adjustable responsively).
- **Purpose**: Register a new static advertising asset or edit existing technical specifications.
- **Trigger**: Click `+ Register Resource` or `Edit Resource` in Advertising Resources.
- **Form Fields**:
  - Resource Name (e.g., "Unipole A - Facing MG Road") — *Required*.
  - Resource Type (Dropdown: Hoarding, Billboard, Unipole, Gantry, Bus Shelter, Pole Ad, Wall Mount, Rooftop, Bridge Panel, Other Static) — *Required*.
  - Physical Location Site: Select from existing sites or click `+ Add New Location` (triggers `LocationInlineModal`) — *Required*.
  - Dimensions: Width (ft), Height (ft) — *Positive numbers; auto-computes Total SqFt*.
  - Orientation (North, South, East, West, etc.).
  - Illumination (Front-Lit, Back-Lit, Non-Lit, Ambient).
  - Traffic Facing (e.g., "Facing inbound traffic from Airport").
  - Customer Regular Price (₹) — *Required*.
  - SODAARS Net Price (₹) — *Required*.
  - Marketplace Participation toggle (`ON` / `OFF`).
  - Description & Site Notes.
  - Photos: Dropzone for Daytime View, Nighttime View, Approach Shot.
- **Validation**: Customer Price must be $\ge$ SODAARS Price; dimensions must be $> 0$.
- **Actions**: `Save Resource` (Primary Orange), `Cancel` (Secondary).

---

### 6.2 `LocationInlineModal` (Subordinate to ResourceFormDrawer)
- **Type**: Centered Modal Dialog (~520px approximate width based on UI/UX design reference, adjustable responsively).
- **Purpose**: Create or modify a physical location/site record inline without navigating away from the resource creation form.
- **Trigger**: Click `+ Add New Location` inside `ResourceFormDrawer`.
- **Form Fields**: Site Name (e.g., "Benz Circle Junction"), Street Address, City, State, Pincode, Landmark, Latitude, Longitude.
- **Rule Enforcement**: Locations are strictly supporting spatial data. **NEVER create `/panel/locations`**.
- **Actions**: `Save & Attach Location` (Returns location ID to `ResourceFormDrawer`), `Cancel`.

---

### 6.3 `ResourceDetailDrawer` (Subordinate to Advertising Resources)
- **Type**: Right-Anchored Slide-Over Drawer (~600px approximate width based on UI/UX design reference, adjustable responsively).
- **Purpose**: Complete read-only inspection of an asset's specs, photography gallery, location map pinpoint, current availability status, and pricing.
- **Trigger**: Click any resource row in Advertising Resources.
- **Sections**: Image Carousel, Quick Badges (Type, Illumination, Status, Marketplace), Specifications Grid, Location Pinpoint, Pricing Breakdown (Customer Rate vs SODAARS Net Price), Recent Bookings List.
- **Actions**: `Edit Specifications` (switches to Form Drawer), `Toggle Marketplace Participation`, `Close`.

---

### 6.4 `CreateBlockModal` (Subordinate to Availability)
- **Type**: Centered Modal Dialog (~480px approximate width based on UI/UX design reference, adjustable responsively).
- **Purpose**: Apply a manual `Provider Block` or `Maintenance` window on an asset.
- **Trigger**: Click `+ Place Block` or drag across dates on the Availability timeline.
- **Form Fields**: Target Resource (pre-selected or dropdown), Start Date, End Date, Block Type (`Provider Block`, `Maintenance`), Operational Notes / Reason.
- **Validation**: Dates must not overlap an existing confirmed `Booked` or `Admin Block` period.
- **Actions**: `Confirm Block` (Orange), `Cancel`.

---

### 6.5 `HoldDetailPopover` (Subordinate to Availability)
- **Type**: Floating Anchored Popover (~320px approximate width based on UI/UX design reference, adjustable responsively).
- **Purpose**: Inspect origin of a provisional `Hold` or `Booked` slot directly on the timeline grid.
- **Data Displayed**: Originating Booking Code, Client Name, Date Window, Hold Status, Time Elapsed.
- **Actions**: `View Full Booking` (navigates to Booking drawer), `Dismiss`.

---

### 6.6 `BookingDetailDrawer` (Subordinate to Bookings)
- **Type**: Right-Anchored Slide-Over Drawer (~640px approximate width based on UI/UX design reference, adjustable responsively).
- **Purpose**: Comprehensive contract inspection, commercial price breakdown, client details, and status transition controls.
- **Trigger**: Click any booking row in Bookings.
- **Sections**:
  - Header: Booking Code (`BKG-2026-1049`), Source Badge (`Marketplace`, `Admin`, `Provider Direct`), Status Badge.
  - Client Card: Company Name, Contact Person, Phone, Email.
  - Display Asset Card: Resource Name, Location, Dimensions, Display Dates.
  - Commercial Ledger: Regular Customer Rate, Provider Net Payout (SODAARS Price), Invoiced Amount.
  - Lifecycle Timeline: Chronological audit history of state changes.
- **Actions**:
  - If `UNDER_REVIEW`: Buttons `Confirm Booking` (opens confirmation modal), `Decline` (opens decline modal).
  - If `CONFIRMED`: Button `View Campaign Execution`.

---

### 6.7 `ConfirmBookingModal` & `DeclineBookingModal` (Subordinate to Bookings)
- **Type**: Centered Confirmation Modals (~480px approximate width based on UI/UX design reference, adjustable responsively).
- **Purpose**: Advance booking from `UNDER_REVIEW` to `PROVIDER_CONFIRMATION` / `CONFIRMED`, or decline request.
- **Decline Fields**: Mandatory dropdown reason (e.g., "Prior offline hold", "Display structural repair", "Artwork conflict") and notes.
- **Actions**: `Confirm Acceptance` (Emerald) or `Confirm Decline` (Rose), `Cancel`.

---

### 6.8 `CreateDirectBookingModal` (Subordinate to Bookings)
- **Type**: Centered / Multi-Step Modal (~560px approximate width based on UI/UX design reference, adjustable responsively).
- **Purpose**: Rapidly book an asset for an offline direct client or agency renewal.
- **Form Fields**: Customer selection (or inline create customer), Resource selection, Start Date, End Date, Contract Rate (₹), Notes.
- **Validation**: Checks Availability Engine in real time; blocks if conflicting reservation exists.
- **Actions**: `Create Direct Booking` (Orange), `Cancel`.

---

### 6.9 `CustomerFormDrawer` & `CustomerProfileDrawer` (Subordinate to Customers)
- **Type**: Right-Anchored Slide-Over Drawers (~540px approximate width based on UI/UX design reference, adjustable responsively).
- **Form Drawer Purpose**: Register a direct agency, enterprise, or local business client (Company Name, Customer Type, Contact Person, Phone, Email, GSTIN, Address).
- **Profile Drawer Purpose**: View client's lifetime booking ledger, active displays, proposal notes, and contact roster.

---

### 6.10 `CampaignDetailDrawer` & `MountingProofUploadModal` (Subordinate to Campaigns)
- **Detail Drawer Purpose**: Inspect physical campaign milestones, display face specs, printer notes, and proof logs (~600px approximate width based on UI/UX design reference, adjustable responsively).
- **Mounting Proof Modal**:
  - Type: Centered Modal Dialog (~520px approximate width based on UI/UX design reference, adjustable responsively).
  - Purpose: Photo proof uploads associated with campaign execution.
  - Fields: Proof Type, File Upload Dropzone, Capture Date/Time, Field Notes.
  - Validation: Photo proof uploads associated with campaign execution subject to manual audit verification. (No automated AI claimed). Specific photo requirements such as daytime/nighttime remain subject to future campaign execution specifications.

---

## 7. Explicit TBD & Future Specifications Register

The following items are strictly preserved as **TBD / Future Specifications** and must not have arbitrary rules or mock behaviors invented during UI development:

1. **Hold Auto-Expiry Threshold**: `[TBD / requires business decision]` — The exact time window (e.g., 24h, 48h, 72h) before a provisional hold automatically lapses is not yet fixed.
2. **Enterprise Tier Pricing (>100 Resources)**: `[TBD / requires business decision]` — Subscription fee structure when total registered resources exceed 100 is not yet fixed.
3. **Marketplace Buyer Authentication at Request Submission**: `[TBD / requires business decision]` — Whether a buyer submits an inquiry as a guest or must complete OTP/account registration upfront is not yet fixed.
4. **Marketplace Agreement Countersignature Workflow**: `[TBD / Future Specification]` — Formal electronic signing/countersignature workflow between Provider and Admin is not yet defined.
5. **Yield per SqFt & Advanced Financial Metrics**: `[TBD / Future Specification]` — Complex algorithmic yield reporting is reserved for future analytics iterations.
6. **Verification SLA & Automated Photo Proof Rules**: `[TBD / Future Specification]` — Fixed SLA deadlines and EXIF automated validation are not part of V1 manual audit.
7. **Downloadable Tax Invoice PDF Generation**: `[TBD / Future Specification]` — Automated invoice rendering pipeline is not yet finalized.
8. **Operational Defaults & Calendar Hold Threshold Configuration**: `[TBD / Future Specification]` — Configurable provider-level hold rules are not yet specified.
9. **Digital / LED / pDOOH Inventory Modules**: `[FUTURE]` — Strictly excluded from V1 static edition.
