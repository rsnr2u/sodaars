# 06 Project Structure Specification
**Project**: SODAARS  
**Document**: Monorepo Directory Organization & Conventions  
**Status**: Source of Truth  
**Version**: 1.0.0

---

## 1. Top-Level Repository Architecture

The SODAARS workspace is organized into clean, segregated top-level directories maintaining complete decoupling between the three product surfaces and the central API core.

```
sodaars/
│
├── docs/                      # Authoritative Technical & Product Documentation
│   ├── README.md
│   ├── 01_PRODUCT_VISION.md
│   └── ...
│
├── backend/                   # Laravel 11.x REST API Core & Database Engine
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── V1/Marketplace/
│   │   │   ├── V1/Provider/
│   │   │   └── V1/Admin/
│   │   ├── Models/
│   │   ├── Services/
│   │   │   ├── AvailabilityEngine/
│   │   │   ├── BookingPipeline/
│   │   │   ├── ResourceService/
│   │   │   ├── CustomerCrmService/
│   │   │   └── CampaignExecutionService/
│   │   └── Policies/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   └── composer.json
│
├── marketplace/               # Marketplace Surface (Next.js + Tailwind CSS)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx               # Marketplace Landing & Hero Search
│   │   │   ├── resources/
│   │   │   │   ├── page.tsx           # Catalog Discovery & Faceted Filters
│   │   │   │   └── [slug]/page.tsx    # Resource Detailed Profile & Availability
│   │   │   ├── booking-request/page.tsx # Booking Request Initiation Flow
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   └── lib/
│   ├── tailwind.config.ts
│   └── package.json
│
├── provider/                  # Unified Provider Surface (React + Vite + Tailwind CSS)
│   │                          # [CRITICAL: HOUSES BOTH PUBLIC WEB & PANEL]
│   ├── src/
│   │   ├── public/            # Provider Public Marketing Website Experience
│   │   │   ├── pages/
│   │   │   │   ├── HomePage.tsx
│   │   │   │   ├── SolutionsPage.tsx
│   │   │   │   ├── ResourcesPage.tsx
│   │   │   │   ├── MarketplacePage.tsx
│   │   │   │   ├── PricingPage.tsx
│   │   │   │   ├── CompanyPage.tsx
│   │   │   │   ├── SignInPage.tsx
│   │   │   │   └── GetStartedPage.tsx
│   │   │   └── components/    # Public Navbar, Footer, Hero, Comparison Cards
│   │   │
│   │   ├── panel/             # Authenticated Provider Panel Experience
│   │   │   ├── layout/
│   │   │   │   ├── Topbar.tsx            # Topbar Navigation Bar (NO SIDEBAR)
│   │   │   │   ├── MegaMenuOperations.tsx # Operations Dropdown Mega Menu
│   │   │   │   ├── MegaMenuCustomers.tsx  # Customers Dropdown Mega Menu
│   │   │   │   ├── MegaMenuReports.tsx    # Reports Dropdown Mega Menu
│   │   │   │   └── MegaMenuOrg.tsx        # Organization Dropdown Mega Menu
│   │   │   ├── modules/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── operations/
│   │   │   │   │   ├── resources/        # Advertising Resources Register
│   │   │   │   │   ├── availability/     # Real-time Calendar & Block Engine
│   │   │   │   │   ├── bookings/         # Booking Pipeline Tracker
│   │   │   │   │   └── campaigns/        # Campaign Execution & Proof Records
│   │   │   │   ├── customers/
│   │   │   │   │   ├── crm/              # Customer CRM Client Directory
│   │   │   │   │   └── activity/         # Customer Interaction & Audit Trail
│   │   │   │   ├── reports/
│   │   │   │   │   ├── operational/
│   │   │   │   │   ├── resource/
│   │   │   │   │   ├── booking/
│   │   │   │   │   └── campaign/
│   │   │   │   └── organization/
│   │   │   │       ├── profile/
│   │   │   │       ├── team/
│   │   │   │       ├── subscription/
│   │   │   │       ├── marketplace/
│   │   │   │       ├── marketplace-agreement/
│   │   │   │       └── settings/
│   │   │
│   │   ├── shared/            # Shared UI Tokens, Buttons, Inputs, HTTP Client
│   │   ├── App.tsx            # Unified Router dividing Public & Panel Trees
│   │   └── main.tsx
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
└── admin/                     # Admin Platform (React + Vite + Tailwind CSS)
    ├── src/
    │   ├── layout/            # Admin Shell & Navigation
    │   ├── modules/
    │   │   ├── dashboard/
    │   │   ├── providers/
    │   │   ├── resources/
    │   │   ├── marketplace/
    │   │   ├── bookings/
    │   │   ├── customers/
    │   │   ├── campaigns/
    │   │   ├── reports/
    │   │   ├── operations/
    │   │   └── settings/
    │   ├── shared/
    │   └── main.tsx
    ├── tailwind.config.js
    ├── vite.config.ts
    └── package.json
```

---

## 2. Structural Validation Rules

### 2.1 The Provider Single-Project Mandate
> [!IMPORTANT]
> The Provider platform must **NEVER** be split into:
> - `provider-public/`
> - `provider-panel/`
>
> They are strictly organized as two route branches (`/` and `/panel/*`) within the single `provider/` Vite project. This ensures unified asset bundling, shared Tailwind themes, and seamless transitions between marketing and authenticated operational states.

### 2.2 Locations Subordination Rule
`locations` must never appear as a top-level module in the `provider/src/panel/modules/` or in the main topbar navigation. Locations are encapsulated as child supporting entities within the `resources/` module.
