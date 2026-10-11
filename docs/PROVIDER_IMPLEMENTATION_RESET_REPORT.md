# SODAARS — Provider Implementation Reset & Legacy Audit Report
**Project**: SODAARS  
**Document**: Repository Audit, Conflict Identification & Pre-Implementation Cleanup Plan  
**Target Output**: `docs/PROVIDER_IMPLEMENTATION_RESET_REPORT.md`  
**Status**: Pending Review & Explicit Approval  
**Date**: October 1, 2026

---

## 1. Executive Summary

This report performs a comprehensive audit of all existing Provider-related code and tracked files in the SODAARS repository ahead of the Provider implementation reset. 

The objective is to prepare the repository for a clean build strictly adhering to:
- [`docs/ui-ux/PROVIDER_SCREENS.md`](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/ui-ux/PROVIDER_SCREENS.md) (Locked UI/UX source of truth)
- [`docs/ui-ux/PROVIDER_UI_UX.md`](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/ui-ux/PROVIDER_UI_UX.md) (Design system tokens & anti-blue mandate)
- [`docs/ui-ux/STITCH_REFERENCE.md`](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/ui-ux/STITCH_REFERENCE.md) (Google Stitch visual benchmark)

> [!CAUTION]
> **NO APPLICATION CODE HAS BEEN MODIFIED OR DELETED**.  
> This document details the exact file classifications, risks, and proposed cleanup sequence for formal approval before any destructive actions take place.

---

## 2. Legacy Files Discovered in Repository

Analysis of the repository git history (`HEAD` commit `291cfb8`) revealed 104 legacy Provider-related files under `frontend/provider/`. These files represent the previous iteration of the platform.

```
frontend/provider/
├── src/
│   ├── components/
│   │   ├── availability/      (3 files)
│   │   ├── customers/         (4 files)
│   │   ├── enquiries/         (4 files)  <-- Conflicting concept
│   │   ├── layout/            (8 files)  <-- Contains Sidebar.tsx
│   │   ├── leads/             (3 files)  <-- Conflicting concept
│   │   ├── locations/         (6 files)  <-- Conflicting primary page
│   │   ├── resources/         (6 files)
│   │   ├── settings/          (8 files)
│   │   └── ui/                (11 files)
│   ├── pages/
│   │   ├── auth/              (2 files)
│   │   ├── availability/      (1 file)
│   │   ├── customers/         (1 file)
│   │   ├── dashboard/         (1 file)
│   │   ├── enquiries/         (1 file)   <-- Conflicting primary page
│   │   ├── leads/             (1 file)   <-- Conflicting primary page
│   │   ├── locations/         (1 file)   <-- Conflicting primary page
│   │   ├── placeholders/      (5 files)
│   │   ├── resources/         (1 file)
│   │   └── settings/          (1 file)
│   ├── routes/                (3 files)
│   ├── services/              (11 files)
│   ├── styles/                (5 files)  <-- Contains blue tokens
│   └── types/                 (13 files)
├── package.json
└── vite.config.ts
```

---

## 3. Detailed File Classification Matrix

### 3.1 Files That Conflict with Locked UI/UX (Must Be Removed / Replaced)
The following files embody architectural patterns that directly violate the locked SODAARS specifications:

| File Path | Nature of Architectural Conflict |
|---|---|
| `frontend/provider/src/components/layout/Sidebar.tsx` | **Sidebar Layout**: Violates "TOP NAVIGATION ONLY. NO SIDEBAR". |
| `frontend/provider/src/components/layout/AppLayout.tsx` | **Sidebar Container**: Renders desktop sidebar and layout grid incompatible with topbar mega menus. |
| `frontend/provider/src/pages/locations/LocationsPage.tsx` | **Locations as Primary Page**: Violates "Locations are supporting data for Advertising Resources. No `/panel/locations`". |
| `frontend/provider/src/components/locations/LocationTable.tsx` | Standalone location table belonging to the prohibited locations primary page. |
| `frontend/provider/src/components/locations/LocationFilters.tsx` | Standalone location filter bar belonging to the prohibited locations primary page. |
| `frontend/provider/src/components/locations/LocationOverviewDrawer.tsx` | Standalone location drawer for independent location management. |
| `frontend/provider/src/pages/leads/LeadsPage.tsx` | **Leads as Primary Navigation**: Violates "No `/panel/leads`". Inquiries belong to Bookings/Customers. |
| `frontend/provider/src/components/leads/LeadTable.tsx` | Standalone lead table. |
| `frontend/provider/src/components/leads/LeadFilters.tsx` | Standalone lead filters. |
| `frontend/provider/src/components/leads/LeadDetailDrawer.tsx` | Standalone lead drawer. |
| `frontend/provider/src/pages/enquiries/EnquiriesPage.tsx` | **Enquiries as Primary Navigation**: Violates "No `/panel/enquiries`". Unified into Bookings pipeline. |
| `frontend/provider/src/components/enquiries/EnquiryTable.tsx` | Standalone enquiry table. |
| `frontend/provider/src/components/enquiries/EnquiryFilters.tsx` | Standalone enquiry filters. |
| `frontend/provider/src/components/enquiries/EnquiryFormDrawer.tsx` | Standalone enquiry creation drawer. |
| `frontend/provider/src/components/enquiries/EnquiryDetailDrawer.tsx`| Standalone enquiry detail drawer. |
| `frontend/provider/src/styles/tokens.css` | **Blue Tokens**: Contains blue/indigo primary variables (`--color-primary: #2563eb`), directly violating the **Anti-Blue Mandate**. |
| `frontend/provider/src/components/resources/ResourceQuotaBar.tsx` | Evaluated subscription quotas based on active assets only, violating the **Active + Inactive** rule. |
| `frontend/provider/src/components/settings/DirectoryVisibilityCard.tsx`| Uses legacy "Directory" terminology instead of Marketplace participation. |
| `frontend/provider/src/pages/placeholders/*` | Five boilerplate placeholder files (`AvailabilityPage`, `LeadsPage`, `LocationsPage`, `ResourcesPage`, `SettingsPage`). |

### 3.2 Files That Belong Only to Old Provider Implementation (Obsolescent)
- `frontend/provider/src/services/leadService.ts` (API methods for deprecated `/leads` endpoints).
- `frontend/provider/src/services/enquiryService.ts` (API methods for deprecated `/enquiries` endpoints).
- `frontend/provider/src/types/lead.ts` (Deprecated Lead TypeScript interface).
- `frontend/provider/src/types/enquiry.ts` (Deprecated Enquiry TypeScript interface).
- `frontend/provider/src/components/settings/PlanComparisonGrid.tsx` (Old subscription tier representation).

### 3.3 Files That May Be Reusable (Reference Logic & Patterns)
These files contain solid TypeScript structures, API interceptors, or utility algorithms that can be refactored to align with the locked design:

| File Path | Reusable Elements | Refactoring Required |
|---|---|---|
| `frontend/provider/src/services/api.ts` | Axios client instance with Bearer token injection and 401 interceptors. | Keep as foundation; verify API base URL points to Laravel core. |
| `frontend/provider/src/services/authService.ts` | Login, Register, Logout, and Current User endpoints. | Retain authentication flow. |
| `frontend/provider/src/services/resourceService.ts` | CRUD methods for advertising resources. | Ensure endpoints match `/api/v1/provider/operations/resources`. |
| `frontend/provider/src/services/customerService.ts` | Customer directory CRUD operations. | Update to match 4 customer types. |
| `frontend/provider/src/services/availabilityService.ts` | Schedule block queries and conflict detection. | Align with 6 deterministic availability states. |
| `frontend/provider/src/services/teamService.ts` | Staff roster and member invitation methods. | Align with `owner`, `manager`, `viewer` roles. |
| `frontend/provider/src/components/locations/LocationMapPicker.tsx` | Leaflet map picker for pinning latitude/longitude coordinates. | **Repurpose directly** inside `LocationInlineModal`. |
| `frontend/provider/src/components/locations/LocationFormDrawer.tsx` | Form inputs for site address, city, landmark, and coordinates. | **Repurpose directly** into `LocationInlineModal`. |
| `frontend/provider/src/components/ui/*` | Clean primitives: `Button.tsx`, `Card.tsx`, `Input.tsx`, `Modal.tsx`, `Drawer.tsx`, `Table.tsx`, `Badge.tsx`, `Spinner.tsx`. | Restyle tokens to strict Saffron/Orange (`#F97316`) and remove blue styles. |
| `frontend/provider/src/types/resource.ts`, `customer.ts`, `auth.ts`, `team.ts` | Core domain type interfaces. | Verify field alignment against `08_DATABASE_ARCHITECTURE.md`. |

---

## 4. Backend / API Files That Must NOT Be Touched

The Laravel API core (`backend/`) contains shared database models, tenant isolation scopes, migration histories, and authentication controllers that serve across Marketplace, Provider, and Admin.

> [!IMPORTANT]
> **STRICT PRESERVATION RULE**:
> The following backend directories and files must **NEVER** be modified or deleted during the Provider implementation reset:
> - `backend/api/app/Models/*` (`AdvertisingResource`, `Customer`, `Organization`, `User`, `Subscription`, `Location`, etc.)
> - `backend/api/app/Models/Scopes/TenantScope.php` (Core multi-tenant query isolation)
> - `backend/api/app/Http/Controllers/*`
> - `backend/api/database/migrations/*` (All 17 database migration files)
> - `backend/api/routes/api.php`
> - `backend/api/config/*` (`auth.php`, `database.php`, `cors.php`, `sanctum.php`)
> - `backend/api/composer.json`, `composer.lock`
> - `database/` (Raw SQL schemas and backups)

---

## 5. Dependency & Package Configuration Analysis

Inspection of `frontend/provider/package.json`:

```json
{
  "dependencies": {
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-router-dom": "^7.18.3",
    "axios": "^1.20.0",
    "lucide-react": "^1.46.0",
    "react-hook-form": "^7.88.0",
    "@hookform/resolvers": "^5.9.1",
    "zod": "^4.6.5",
    "leaflet": "^1.9.4",
    "@types/leaflet": "^1.9.22",
    "recharts": "^3.10.1"
  }
}
```

### Assessment:
1. **Preserve Foundation**: The installed toolchain (`react@19`, `vite@8`, `react-router-dom@7`, `axios`, `lucide-react`, `react-hook-form`, `zod`, `leaflet`) is modern, high-performance, and perfectly matches the enterprise SaaS requirements.
2. **Tailwind CSS Integration**: Verify that `tailwindcss`, `postcss`, and `autoprefixer` are properly configured in `vite.config.ts` and `tailwind.config.js` with the Saffron/Orange palette tokens.

---

## 6. Project Re-Organization: Meeting the Single-Project Mandate

The SODAARS architecture strictly requires:
> **The Public Provider Website and Provider Panel MUST be inside the SAME React + Vite project/folder (`provider/`).**

### Structure Transition Plan:
To align with [`docs/06_PROJECT_STRUCTURE.md`](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/06_PROJECT_STRUCTURE.md):
1. **Target Folder**: `provider/` (or rename `frontend/provider/` to `provider/`).
2. **Internal Organization**:
   ```
   provider/src/
   ├── public/              # Pre-login Marketing Website Experience
   │   ├── pages/           # Home, Solutions, Resources, Marketplace, Pricing, Company, SignIn, GetStarted
   │   └── components/      # Public Navbar, Footer, SolutionBlocks
   │
   ├── panel/               # Authenticated Operational Platform
   │   ├── layout/          # Topbar.tsx (NO SIDEBAR), PageHeader.tsx
   │   └── modules/         # dashboard, resources, availability, bookings, customers, campaigns, reports, organization
   │
   └── shared/              # Shared UI Primitives, Saffron/Amber Theme Tokens, Axios API Client
   ```

---

## 7. Risks & Mitigation Strategies

| Identified Risk | Impact | Mitigation Strategy |
|---|---|---|
| Accidental deletion of backend logic | High | Keep cleanup operations strictly constrained to the frontend Provider directory (`frontend/provider/`). Never touch `backend/` or `database/`. |
| Lingering blue UI tokens | Medium | Purge `frontend/provider/src/styles/tokens.css` of blue variables; establish `#F97316` and `#F59E0B` as root variables. |
| Loss of map picker functionality | Medium | Isolate `LocationMapPicker.tsx` logic into `LocationInlineModal` before removing standalone location pages. |
| Incomplete route tree | Low | Follow the authoritative route matrix in [`docs/ui-ux/PROVIDER_SCREENS.md`](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/ui-ux/PROVIDER_SCREENS.md) to define all 8 public and 14 panel routes in `AppRoutes.tsx`. |

---

## 8. Recommended Cleanup Sequence (Upon Approval)

When explicit approval is received, the cleanup will execute in this strict, controlled order:

1. **Phase 1: Remove Conflicting Pages & Components**:
   - Delete `frontend/provider/src/components/layout/Sidebar.tsx` and legacy `AppLayout.tsx`.
   - Delete `pages/locations/`, `components/locations/LocationTable.tsx`, `LocationFilters.tsx`, `LocationOverviewDrawer.tsx` (preserving map picker logic for inline use).
   - Delete `pages/leads/`, `components/leads/*`, `services/leadService.ts`, `types/lead.ts`.
   - Delete `pages/enquiries/`, `components/enquiries/*`, `services/enquiryService.ts`, `types/enquiry.ts`.
   - Delete `pages/placeholders/*`.
2. **Phase 2: Purge Blue Design Tokens**:
   - Re-anchor `src/styles/tokens.css` and `main.css` to the Saffron/Orange palette (`#F97316`, `#F59E0B`, `#171717`, `#FAFAF9`).
3. **Phase 3: Scaffold Unified Public & Panel Directory Structure**:
   - Create `src/public/` (for screens 1.1 to 1.8) and `src/panel/` (for screens 2.1 to 2.8).
   - Establish `Topbar.tsx` navigation header with zero sidebar.
   - Set up `AppRoutes.tsx` with clean public/authenticated route segregation.
4. **Phase 4: Verification & Readiness**:
   - Verify zero compile errors, verify package dependencies, and await instruction before screen-by-screen implementation.

---

*Report generated and saved to `docs/PROVIDER_IMPLEMENTATION_RESET_REPORT.md`. Awaiting your review and explicit approval.*
