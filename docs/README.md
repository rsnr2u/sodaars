# SODAARS Technical and Product Documentation
**Streamline Outdoor Digital Advertising Resource System**

Welcome to the definitive product and technical documentation repository for **SODAARS**. This documentation serves as the single source of truth for the entire architectural rebuild and subsequent development phases.

---

## 1. System Overview

SODAARS is an enterprise-grade platform engineered to streamline static outdoor advertising operations, inventory management, availability scheduling, booking lifecycles, customer CRM, and marketplace discovery.

The platform is partitioned into three discrete product surfaces connected to a unified core:

```
SODAARS
│
├── MARKETPLACE
│   └── Next.js + Tailwind CSS
│
├── PROVIDER
│   └── React + Vite + Tailwind CSS
│       ├── Provider Public Website
│       └── Provider Panel (Topbar Navigation + Mega Menus)
│
├── ADMIN
│   └── React + Vite + Tailwind CSS
│
└── BACKEND / API
    └── Laravel + REST API + MySQL
```

---

## 2. Documentation Directory

| Document | Name | Description |
|---|---|---|
| [01_PRODUCT_VISION.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/01_PRODUCT_VISION.md) | Product Vision | Strategic scope, core principles, V1 static boundary, and long-term roadmap |
| [02_PRODUCT_REQUIREMENTS.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/02_PRODUCT_REQUIREMENTS.md) | Product Requirements | Functional capabilities across Marketplace, Provider, and Admin platforms |
| [03_BUSINESS_REQUIREMENTS.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/03_BUSINESS_REQUIREMENTS.md) | Business Requirements | Commercial rules, subscription tiers, pricing logic, and stakeholder obligations |
| [04_SYSTEM_ARCHITECTURE.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/04_SYSTEM_ARCHITECTURE.md) | System Architecture | Tiered topology, micro-service boundaries, data flow, and integration architecture |
| [05_TECHNOLOGY_STACK.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/05_TECHNOLOGY_STACK.md) | Technology Stack | Hard-fixed framework versions, toolchains, runtime configurations, and constraints |
| [06_PROJECT_STRUCTURE.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/06_PROJECT_STRUCTURE.md) | Project Structure | Monorepo layout, directory trees, file conventions, and component boundaries |
| [07_USER_ROLES_PERMISSIONS.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/07_USER_ROLES_PERMISSIONS.md) | User Roles & Permissions | Role-Based Access Control (RBAC), permission matrix, and tenancy guardrails |
| [08_DATABASE_ARCHITECTURE.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/08_DATABASE_ARCHITECTURE.md) | Database Architecture | Entity Relationship definitions, MySQL schemas, indexing, and foreign constraints |
| [09_API_ARCHITECTURE.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/09_API_ARCHITECTURE.md) | API Architecture | REST API design, endpoint contracts, response structures, and error standards |
| [10_MARKETPLACE.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/10_MARKETPLACE.md) | Marketplace Platform | Customer discovery, search/filtering, resource profiles, and booking inquiries |
| [11_PROVIDER_PLATFORM.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/11_PROVIDER_PLATFORM.md) | Provider Platform | Public marketing web presence and topbar mega-menu operational panel |
| [12_ADMIN_PLATFORM.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/12_ADMIN_PLATFORM.md) | Admin Platform | Platform governance, provider verification, commercial agreements, and dispute handling |
| [13_BOOKING_WORKFLOW.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/13_BOOKING_WORKFLOW.md) | Booking Workflow | Multi-source booking lifecycle from inquiry to payment, confirmation, and closeout |
| [14_AVAILABILITY_ENGINE.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/14_AVAILABILITY_ENGINE.md) | Availability Engine | Real-time calendar holds, status transitions, conflicts, and block mechanisms |
| [15_RESOURCE_MANAGEMENT.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/15_RESOURCE_MANAGEMENT.md) | Resource Management | Resource vs. Location data separation, asset metadata, dimensions, and specifications |
| [16_CUSTOMER_CRM.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/16_CUSTOMER_CRM.md) | Customer CRM | Client directory, relationship classifications, direct booking histories, and campaigns |
| [17_CAMPAIGN_EXECUTION.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/17_CAMPAIGN_EXECUTION.md) | Campaign Execution | Mounting milestones, photo proof logs, execution states, and audit trails |
| [18_SUBSCRIPTION_BILLING.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/18_SUBSCRIPTION_BILLING.md) | Subscription & Billing | Fixed provider tiers based on registered resources, invoices, and billing rules |
| [19_MARKETPLACE_COMMERCIAL_MODEL.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/19_MARKETPLACE_COMMERCIAL_MODEL.md) | Marketplace Commercial Model | Dual-price mechanics (Customer Price vs Net SODAARS Price) and markup framework |
| [20_UI_UX_DESIGN_SYSTEM.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/20_UI_UX_DESIGN_SYSTEM.md) | UI/UX Design System | Enterprise SaaS aesthetics, Saffron/Amber brand palette (#F97316), anti-blue UI rules |
| [21_SCREEN_SPECIFICATIONS.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/21_SCREEN_SPECIFICATIONS.md) | Screen Specifications | Comprehensive UI screens, layout layouts, states, inputs, actions, and API maps |
| [22_SECURITY.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/22_SECURITY.md) | Security Specifications | Tenant isolation, authentication, data encryption, API security, and audit logging |
| [23_SEO.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/23_SEO.md) | SEO Architecture | Metadata, SSR architecture for Marketplace, sitemaps, structured schema, robots |
| [24_TESTING_STRATEGY.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/24_TESTING_STRATEGY.md) | Testing Strategy | Unit testing, integration testing, end-to-end regression, and validation protocols |
| [25_DEPLOYMENT.md](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/25_DEPLOYMENT.md) | Deployment & DevOps | Infrastructure orchestration, environment configurations, CI/CD, and DB migrations |

---

## 3. Strict Documentation Rules & Governance

1. **Source of Truth**: All subsequent development, code reviews, schemas, and API implementations must strictly adhere to these specifications.
2. **No Fictional Additions**: No arbitrary companies, SLAs, financial guarantees, partner logos, or fake market statistics are introduced.
3. **Explicit Unknowns**: Any technical or business detail not finalized in the product specification is strictly marked as `[TBD]` (To Be Determined) or `[FUTURE]`.
4. **Zero Code Execution Ahead of Approval**: No controllers, migrations, components, or screens are to be created prior to explicit validation of this documentation package.
