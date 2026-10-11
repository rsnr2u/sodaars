# 21 Screen Specifications
**Project**: SODAARS  
**Document**: Detailed UI Screen Specifications & Behavioral Contracts  
**Status**: Source of Truth  
**Visual Reference**: Approved Google Stitch / Flow Design System  
**Version**: 1.0.0

---

## 1. Provider Public Website Screens

The Provider Public Website resides in `provider/src/public/` and features the warm enterprise SaaS design language.

### 1.1 Home Screen (`/`)
- **Purpose**: Brand introduction, enterprise positioning, overview of 5 Core Solutions, conversion to registration.
- **User Role**: Public visitors, media asset owners, media planners.
- **Entry Point**: Direct domain root navigation.
- **Layout**: Sticky header with brand logo & navigation links; hero section with bold headline; 5 Solutions overview cards; platform preview mockup; pricing snapshot; footer.
- **Components**: `PublicNavbar`, `HeroBanner`, `SolutionCardGrid`, `FeatureHighlight`, `PricingTeaser`, `Footer`.
- **Actions**: "Get Started" CTA (routes to `/get-started`), "Sign In" (routes to `/signin`), "Explore Marketplace" (routes to Marketplace).
- **Responsive**: Full mobile hamburger menu for viewport $< 768\text{px}$.

### 1.2 Solutions Screen (`/solutions`)
- **Purpose**: Deep functional explanation of the 5 Core Solutions: Resource Management, Availability Engine, Booking Pipeline, Customer CRM, Campaign Execution.
- **Layout**: Vertical alternating feature sections with high-fidelity diagrams, key operational benefits, and callouts.
- **Components**: `SolutionFeatureBlock`, `WorkflowDiagramPreview`, `CTASection`.

### 1.3 Pricing Screen (`/pricing`)
- **Purpose**: Transparent presentation of subscription tiers:
  - **Tier 1 (1–50 Registered Resources)**: ₹4,999/month
  - **Tier 2 (51–100 Registered Resources)**: ₹8,999/month
- **Layout**: Centered headline, comparison cards, feature inclusion checklist, registered resource quota explainer.
- **Components**: `PricingTierCard`, `FeatureChecklist`, `FAQAccordion`.

### 1.4 Other Public Screens
- **Resources (`/resources`)**: Static outdoor industry guides and operational playbooks.
- **Marketplace (`/marketplace`)**: Marketing explanation of SODAARS Marketplace channel and net settlement model.
- **Company (`/company`)**: Mission statement and provider-first operational principles.
- **Sign In (`/signin`)**: Clean authentication card with email/password inputs, error alerts, and password recovery link.
- **Get Started (`/get-started`)**: Multi-step onboarding form collecting company details, contact person, phone, estimated registered resources, and city.

---

## 2. Provider Panel Screens

Located in `provider/src/panel/`, the Provider Panel strictly employs **Topbar Navigation with Mega Menus** and **zero desktop sidebar**.

### 2.1 Dashboard Screen (`/panel/dashboard`)
- **Purpose**: Operational command center displaying real-time business health.
- **User Role**: Provider Owner, Manager, Viewer.
- **Layout**: 4-column KPI metric row; active campaigns field execution widget; upcoming booking requests card; 30-day occupancy timeline.
- **Components**: `MetricCard`, `CampaignProgressWidget`, `PendingBookingsTable`, `OccupancyMiniCalendar`.
- **Data Dependencies**: `GET /api/v1/provider/dashboard/metrics`.
- **States**: Skeleton card loaders during fetch; zero-state banners if no resources registered.

### 2.2 Operations: Advertising Resources (`/panel/operations/resources`)
- **Purpose**: Primary physical inventory asset register.
- **User Role**: Provider Owner, Manager (Edit/Create); Viewer (Read-only).
- **Layout**: Top action bar with Search, Type filter, Status filter, and "+ Add Resource" button; high-density tabular list; right slide-over Drawer for creation and editing.
- **Components**: `ResourceTable`, `ResourceFilterBar`, `ResourceFormDrawer`, `ResourceDetailDrawer`, `MediaUploadDropzone`.
- **Data Fields**: Resource Name, Type, Location, Dimensions ($W \times H$), Illumination, Facing, Customer Price, SODAARS Price, Marketplace Participation toggle, Status.
- **Actions**: Click row to open detail drawer; inline toggle for Marketplace participation; edit specs; upload photographs.
- **Empty State**: Illustration with message "No advertising resources registered yet" and action button "Register First Resource".

### 2.3 Operations: Availability (`/panel/operations/availability`)
- **Purpose**: Multi-resource real-time calendar and hold manager.
- **Layout**: Header with month/date navigator, zoom controls (Day/Week/Month), and resource filter; interactive Gantt/Timeline grid mapping resources against dates.
- **Components**: `AvailabilityTimelineGrid`, `ScheduleBlockBadge`, `CreateBlockModal`.
- **Visual Color Mapping**:
  - Green: Available
  - Slate: Booked
  - Amber: Hold
  - Orange: Provider Block
  - Rose: Admin Block
  - Neutral Gray: Maintenance
- **Actions**: Drag-to-select date range on resource row to create a manual `Provider Block` or `Maintenance` period.

### 2.4 Operations: Bookings (`/panel/operations/bookings`)
- **Purpose**: Multi-source contract pipeline tracker.
- **Layout**: Tabbed status filters (`All`, `Under Review`, `Confirmed`, `Active`, `Completed`); search bar; structured table displaying Booking Code, Client, Resource, Date Range, Channel Source (Marketplace/Admin/Provider), Net Price, Status.
- **Components**: `BookingTable`, `BookingStatusBadge`, `BookingDetailDrawer`, `ConfirmBookingModal`, `DeclineBookingModal`.
- **Actions**: Review pending request; approve to advance stage; decline with required comment.

### 2.5 Operations: Campaigns (`/panel/operations/campaigns`)
- **Purpose**: Field mounting execution and proof-of-performance logger.
- **Layout**: Operational Kanban or table view organized by execution status: `Planned`, `In Execution`, `Proof Submitted`, `Completed`.
- **Components**: `CampaignTable`, `MountingProofModal`, `PhotoAuditViewer`.
- **Actions**: Upload timestamped mounting photo; submit for proof verification; review audit status.

### 2.6 Customers: Customer CRM (`/panel/customers/crm`)
- **Purpose**: Directory of Agencies, Direct Enterprise Buyers, Local Businesses, and Corporate Brands.
- **Layout**: Search bar; type filter; tabular list showing Company, Primary Contact, Phone, Active Displays, Lifetime Bookings; slide-over profile drawer.
- **Components**: `CustomerTable`, `CustomerFormDrawer`, `CustomerDetailDrawer`.

### 2.7 Customers: Customer Activity (`/panel/customers/activity`)
- **Purpose**: Unified audit timeline of client proposals, signed contracts, renewals, and mounting notices.
- **Components**: `ActivityTimelineList`, `DateRangeFilter`.

### 2.8 Reports Modules (`/panel/reports/*`)
- **Operational Reports**: Maintenance records, field turnaround metrics.
- **Resource Reports**: Asset occupancy percentages, square footage yield.
- **Booking Reports**: Direct vs Marketplace split, conversion ratios.
- **Campaign Reports**: Proof compliance records and verification turnaround times.

### 2.9 Organization Modules (`/panel/organization/*`)
- **Organization Profile (`/panel/organization/profile`)**: Company legal name, registered office, GSTIN, billing contacts.
- **Team Management (`/panel/organization/team`)**: Team roster table; "+ Invite Member" modal; role selector (`owner`, `manager`, `viewer`).
- **Subscription (`/panel/organization/subscription`)**: Registered resource counter, active tier display (Tier 1 ₹4,999 vs Tier 2 ₹8,999), monthly billing renewal date, past GST tax invoice table.
- **Marketplace (`/panel/organization/marketplace`)**: Overview list of opted-in inventory, SODAARS net prices, and performance stats.
- **Marketplace Agreement (`/panel/organization/marketplace-agreement`)**: Electronic contract viewer showing approved terms, agreed markup rate, and platform countersignature status.
- **Settings (`/panel/organization/settings`)**: Notification toggles, operational defaults, and date preferences.

---

## 3. Marketplace Screens (Next.js)

### 3.1 Public Search & Catalog (`/resources`)
- **Layout**: Left-side faceted filter drawer (City, Resource Type, Illumination, Dimensions, Price Range, Available Dates); right-side responsive asset card grid; map toggle view.
- **Components**: `CatalogFilterSidebar`, `ResourceCard`, `PaginationControl`.

### 3.2 Resource Detailed View (`/resources/[slug]`)
- **Layout**: High-res image carousel (daytime, nighttime, approach view); technical specifications card; location map pinpoint; interactive calendar showing availability; booking request submission drawer.
- **Components**: `MediaGallery`, `SpecSheet`, `AvailabilityCalendarWidget`, `BookingRequestForm`.

### 3.3 Booking Request Flow (`/booking-request`)
- **Layout**: Multi-step wizard collecting Campaign Dates, Brand Name, Contact Details, Artwork Readiness, and Billing Details.
- **Components**: `StepWizard`, `OrderSummaryCard`, `ConfirmationReceipt`.
