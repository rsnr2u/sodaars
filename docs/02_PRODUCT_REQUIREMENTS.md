# 02 Product Requirements Specification
**Project**: SODAARS  
**Document**: Functional & System Product Requirements  
**Status**: Source of Truth  
**Version**: 1.0.0

---

## 1. System-Wide Functional Hierarchy

SODAARS enforces strict functional boundaries between its three user-facing product surfaces, powered by a central API and database.

```
                           ┌────────────────────────┐
                           │      SODAARS CORE      │
                           │  Unified REST API & DB │
                           └───────────┬────────────┘
         ┌─────────────────────────────┼────────────────────────────┐
         ▼                             ▼                            ▼
┌──────────────────┐         ┌────────────────────┐       ┌───────────────────┐
│ 1.0 MARKETPLACE  │         │2.0 PROVIDER ENGINE │       │  3.0 ADMIN TOWER  │
│ Public Discovery │         │Public + Operations │       │ Oversight & Ops   │
└──────────────────┘         └────────────────────┘       └───────────────────┘
```

---

## 2. Product Surface 1: Marketplace (Next.js + Tailwind CSS)

### 2.1 Objectives
The Marketplace serves as a public discovery and acquisition engine for media buyers (brands, agencies, local businesses) to discover, evaluate, and request static outdoor advertising resources.

### 2.2 Functional Requirements Matrix
| Req ID | Capability | Description | Constraints / Rules |
|---|---|---|---|
| `MKT-01` | **Resource Discovery** | Search catalog for static advertising assets across geographic regions. | Only resources with `marketplace_participation = true` and `status = active` are discoverable. |
| `MKT-02` | **Faceted Filtering** | Filter resources by type (hoarding, unipole, gantry, etc.), dimensions, illumination, price range, and date range. | Static media categories only. No digital screen filters. |
| `MKT-03` | **Resource Detail Page** | Display high-resolution photos, location context, technical specs, illumination type, facing, and pricing. | Customer regular price and SODAARS marketplace price are displayed based on commercial rules. |
| `MKT-04` | **Availability Inspection** | View real-time calendar availability for selected dates. | Marketplace participation does not equal instant availability. Existing bookings/blocks must be respected. |
| `MKT-05` | **Booking Request Flow** | User specifies date range, company details, contact person, and campaign notes to submit a request. | **No instant automated confirmation**. All requests transition to `NEW` / `UNDER REVIEW`. |
| `MKT-06` | **Inquiry Status Tracking** | Media buyers receive unique tracking credentials/links to monitor status transitions of their booking requests. | Authentication optional at discovery, mandatory for contract execution [TBD: Guest vs Account model]. |

---

## 3. Product Surface 2: Provider Platform (React + Vite + Tailwind CSS)

The Provider Platform is contained within a **single unified project** housing two distinct web experiences:
1. **Provider Public Website** (Marketing & Acquisition)
2. **Provider Panel** (Authenticated Operational Management)

### 3.1 Sub-Surface A: Provider Public Website
Marketing web presence for onboarding outdoor media asset owners. Contains the following approved static pages:
- **Home**: Platform overview, 5 Core Solutions introduction, enterprise value proposition.
- **Solutions**: Dedicated drill-downs on Resource Management, Availability Engine, Booking Pipeline, Customer CRM, and Campaign Execution.
- **Resources**: Educational content, asset owner documentation, static media best practices.
- **Marketplace**: Explanation of the SODAARS Marketplace channel and commercial model.
- **Pricing**: Transparent subscription tier breakdown (1–50 and 51–100 asset tiers).
- **Company**: Corporate vision, operating philosophy, and provider ecosystem mission.
- **Sign In**: Unified authentication portal for registered provider staff.
- **Get Started**: Onboarding onboarding/registration flow for new asset owners.

### 3.2 Sub-Surface B: Provider Panel (Authenticated Operations)
Enterprise operational control panel utilizing a **strictly topbar-driven navigation architecture with Mega Menus**.

> [!IMPORTANT]
> **NO SIDEBAR IS PERMITTED**. Navigation modules must not be dumped as individual topbar links. Mega Menus are mandatory.

#### Provider Navigation Taxonomy:
```
[ SODAARS ]   [ Dashboard ]   [ Operations ▾ ]   [ Customers ▾ ]   [ Reports ▾ ]   [ Organization ▾ ]   |   (Notifications) (Help) (Profile)
```

#### Detailed Module Breakdown:
1. **Operations Mega Menu**:
   - `PRV-OP-01` **Advertising Resources**: Full asset register (hoardings, unipoles, gantries). Manage specifications, photos, and marketplace participation flags. Locations serve strictly as supporting metadata.
   - `PRV-OP-02` **Availability**: Real-time calendar grid and timeline manager supporting states: *Available, Booked, Hold, Provider Block, Admin Block, Maintenance*.
   - `PRV-OP-03` **Bookings**: Multi-source pipeline tracking provider direct, admin-brokered, and marketplace requests across the 8-stage lifecycle.
   - `PRV-OP-04` **Campaigns**: Execution tracker linking approved bookings to physical mounting records, installer notes, and photo proofs.

2. **Customers Mega Menu**:
   - `PRV-CU-01` **Customer CRM**: Repository of Advertising Agencies, Direct Enterprise Buyers, Local Businesses, and Corporate Brands.
   - `PRV-CU-02` **Customer Activity**: Audit timeline of customer inquiries, contract signatures, renewals, and asset engagements.

3. **Reports Mega Menu**:
   - `PRV-RP-01` **Operational Reports**: Maintenance schedules, mounting turnaround metrics, and inventory health.
   - `PRV-RP-02` **Resource Reports**: Asset utilization rates, vacancy periods, and location performance.
   - `PRV-RP-03` **Booking Reports**: Direct vs. marketplace booking volume, cancellation trends, and pipeline value.
   - `PRV-RP-04` **Campaign Reports**: Proof-of-performance completion metrics and mounting compliance records.

4. **Organization Mega Menu**:
   - `PRV-OR-01` **Organization Profile**: Corporate entity details, legal registration, GSTIN, billing address.
   - `PRV-OR-02` **Team Management**: Staff roster, administrative roles, and permission assignments.
   - `PRV-OR-03` **Subscription**: Current tier overview (1–50 or 51–100 assets), registered asset quota monitor, and renewal dates.
   - `PRV-OR-04` **Marketplace**: Overview of provider resources opted into the public marketplace.
   - `PRV-OR-05` **Marketplace Agreement**: Contractual terms, net settlement pricing schedules, and administrative approvals.
   - `PRV-OR-06` **Settings**: Operational defaults, notification preferences, and system parameters.

---

## 4. Product Surface 3: Admin Platform (React + Vite + Tailwind CSS)

### 4.1 Objectives
An internal operational tower for SODAARS platform administrators, compliance personnel, and marketplace coordinators.

### 4.2 Module Inventory:
- `ADM-01` **Dashboard**: Global platform analytics, active providers, network-wide asset totals, pending approvals.
- `ADM-02` **Providers**: Provider vetting, account activation, KYC review, and subscription health tracking.
- `ADM-03` **Advertising Resources**: Global directory review, technical compliance verification, and administrative blocks.
- `ADM-04` **Marketplace**: Curation of public marketplace listings, markup policy enforcement, and featured inventory.
- `ADM-05` **Bookings**: Global booking intervention, dispute mediation, and status override management.
- `ADM-06` **Customers**: Global buyer directory and cross-network activity tracking.
- `ADM-07` **Campaigns**: Global mounting proof audits and compliance verification.
- `ADM-08` **Reports**: Platform financial summaries, provider payout reconciliations, and inventory utilization reports.
- `ADM-09` **Operations**: Maintenance monitoring, system health, and scheduled job audits.
- `ADM-10` **Platform Settings**: Configurable marketplace markup defaults, tax rules, and system toggles.

---

## 5. Non-Functional System Requirements

1. **Multi-Tenant Data Isolation**: Provider data (clients, pricing, internal notes, photo proofs) must be strictly isolated at the query and database level.
2. **Deterministic State Transitions**: Booking lifecycles and availability calendar blocks must use database-level transaction locks to prevent double-booking.
3. **Audit Trails**: All status transitions (booking approvals, holds, blocks, mounting proof uploads) must log the acting user ID, timestamp, and previous state.
4. **Performance Targets**: Marketplace search and faceted filtering latency < 300ms for datasets up to 100,000 resources.
