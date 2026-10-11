# 11 Provider Platform Specification
**Project**: SODAARS  
**Document**: Unified Provider Experience (Public Website & Operational Panel)  
**Status**: Source of Truth  
**Version**: 1.0.0

---

## 1. Unified Project Mandate

The Provider Platform is contained in a single unified codebase:
`provider/` powered by **React**, **Vite**, and **Tailwind CSS**.

It houses two distinct user experiences:
1. **Provider Public Website**: Marketing, education, and onboarding portal for outdoor asset owners.
2. **Provider Panel**: High-efficiency operational web application for managing media assets, schedules, clients, and campaigns.

> [!IMPORTANT]
> The Provider platform must never be fragmented into multiple projects. Shared Tailwind styling tokens, type definitions, and API client libraries are maintained centrally within this folder.

---

## 2. Experience A: Provider Public Website

Marketing-facing presentation delivering the SODAARS value proposition to media owners. Uses the warm enterprise SaaS design language (Orange `#F97316`, Amber `#F59E0B`, Dark `#171717`).

### 2.1 Approved Page Inventory
1. **Home (`/`)**: High-impact editorial hero, value proposition, 5 Core Solutions overview, interactive platform preview, social proof metrics `[TBD: Verified Metrics Only]`, and footer.
2. **Solutions (`/solutions`)**: Deep dive into the 5 Core Solutions:
   - *Resource Management* (Hoardings, unipoles & gantries)
   - *Availability Engine* (Real-time slot & hold manager)
   - *Booking Pipeline* (Direct contracts & client renewals)
   - *Customer CRM* (Agencies and direct enterprise buyers)
   - *Campaign Execution* (Mounting photo proof & audit trails)
3. **Resources (`/resources`)**: Static outdoor industry guides, operational whitepapers, and operational best practices.
4. **Marketplace (`/marketplace`)**: Explaining the discovery channel, voluntary opt-in model, and net pricing mechanics.
5. **Pricing (`/pricing`)**: Clear breakdown of the two subscription tiers:
   - **Tier 1 (1–50 Registered Resources)**: **₹4,999 / month**
   - **Tier 2 (51–100 Registered Resources)**: **₹8,999 / month**
6. **Company (`/company`)**: Mission statement, engineering culture, and commitment to provider sovereignty.
7. **Sign In (`/signin`)**: Secure login portal for provider staff with tenant redirect.
8. **Get Started (`/get-started`)**: Step-by-step onboarding flow collecting corporate details, GSTIN, and asset volume estimates.

---

## 3. Experience B: Provider Panel Architecture

The Provider Panel is an authenticated operational workspace designed for daily inventory scheduling, field coordination, and financial tracking.

### 3.1 Strict Navigation Rules
> [!CAUTION]
> 1. **DO NOT USE A SIDEBAR**: Desktop and tablet layouts must rely on the topbar navigation.
> 2. **DO NOT DISPLAY ALL MODULES INDIVIDUALLY IN THE TOPBAR**: Flat topbars cause visual clutter and reduce focus.
> 3. **USE MEGA MENUS**: All sub-modules must be organized into four authoritative Mega Menus.

### 3.2 Topbar Hierarchy & Layout

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [SODAARS]  Dashboard  Operations ▾   Customers ▾   Reports ▾   Organization ▾  │  [🔔] [❓] [👤 Profile]│
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Authoritative Mega Menu Structures

#### 1. Operations Mega Menu
Designed for daily operational execution and field coordination:
- **Advertising Resources**: Complete inventory register of physical assets (hoardings, unipoles, gantries). Manage technical specs, illumination, dimensions, photos, and marketplace participation flags. *(Locations are managed as supporting metadata within resources)*.
- **Availability**: Multi-asset calendar grid tracking real-time states (*Available, Booked, Hold, Provider Block, Admin Block, Maintenance*).
- **Bookings**: Multi-source pipeline tracking contracts initiated via Marketplace, Admin, or Provider Direct.
- **Campaigns**: Execution logs tracking vinyl mounting, field worker notes, timestamped photo proofs, and client sign-offs.

#### 2. Customers Mega Menu
Dedicated to relationship management and contract continuity:
- **Customer CRM**: Client directory of Advertising Agencies, Direct Enterprise Buyers, Local Businesses, and Corporate Brands.
- **Customer Activity**: Chronological audit trail of customer interactions, signed proposals, active displays, and renewal dates.

#### 3. Reports Mega Menu
Operational intelligence and asset utilization analytics:
- **Operational Reports**: Turnaround times for vinyl mounting, maintenance downtime, and structural inspection logs.
- **Resource Reports**: Occupancy rates per asset, vacancy duration, and revenue generated per square foot.
- **Booking Reports**: Pipeline conversion analysis, direct vs. marketplace distribution, and cancellation trends.
- **Campaign Reports**: Proof-of-performance audit logs and client acceptance compliance.

#### 4. Organization Mega Menu
Administrative, legal, commercial, and platform settings:
- **Organization Profile**: Corporate entity name, registered address, GSTIN, and billing contacts.
- **Team Management**: Staff roster, administrative roles (`owner`, `manager`, `viewer`), and permission assignments.
- **Subscription**: Current registered resource count, tier status (1–50 vs 51–100), billing schedule, and tax invoices.
- **Marketplace**: Overview of assets currently opted into the SODAARS public marketplace.
- **Marketplace Agreement**: Contractual terms, approved net pricing schedules, and administrative counter-approvals.
- **Settings**: System preferences, notification rules, calendar defaults, and operational parameters.
