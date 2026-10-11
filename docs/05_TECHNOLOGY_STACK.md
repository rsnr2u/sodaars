# 05 Technology Stack Specification
**Project**: SODAARS  
**Document**: Approved & Fixed Technology Standards  
**Status**: Source of Truth  
**Version**: 1.0.0

---

## 1. Fixed Architectural Technology Stack

The technology stack for SODAARS is strictly fixed. No alternative frontend or backend frameworks may be introduced without formal written authorization.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SODAARS TECHNOLOGY MATRIX                       │
├─────────────────────┬──────────────────────────┬───────────────────────┤
│ Surface / Component │ Primary Framework        │ Styling & Toolchain   │
├─────────────────────┼──────────────────────────┼───────────────────────┤
│ Marketplace         │ Next.js (App Router)     │ Tailwind CSS          │
│ Provider Platform   │ React + Vite             │ Tailwind CSS          │
│ Admin Platform      │ React + Vite             │ Tailwind CSS          │
│ Central Backend     │ Laravel 11.x (PHP 8.2+)  │ Artisan, Composer     │
│ Persistence         │ MySQL 8.0+               │ InnoDB, UTF8mb4       │
│ API Protocol        │ RESTful JSON             │ OpenAPI / REST        │
└─────────────────────┴──────────────────────────┴───────────────────────┘
```

---

## 2. Detailed Component Specifications

### 2.1 Marketplace Surface
- **Framework**: Next.js (App Router architecture recommended for SEO, SSR, and dynamic route rendering).
- **Styling**: Tailwind CSS (configured with the SODAARS warm-palette design tokens; strictly no blue brand colors).
- **State & Data Fetching**: Native Fetch API / React Server Components with TanStack React Query for client-side search interactions.
- **Image Optimization**: `next/image` with remote patterns configured for media storage domains.

### 2.2 Provider Platform (Dual-Experience Architecture)
> [!IMPORTANT]
> The **Provider Public Website** and **Provider Panel** MUST reside within the **SAME React + Vite project/folder**.  
> DO NOT create `provider-public/` and `provider-panel/` as separate projects.

- **Framework**: React 18+ bundled via Vite.
- **Routing**: `react-router-dom` configuring two distinct route trees:
  - Public Marketing Web routes: `/`, `/solutions`, `/pricing`, `/resources`, `/marketplace`, `/company`, `/signin`, `/get-started`.
  - Authenticated Provider Panel routes: `/panel/dashboard`, `/panel/operations/*`, `/panel/customers/*`, `/panel/reports/*`, `/panel/organization/*`.
- **Styling**: Tailwind CSS with enterprise SaaS utility classes.
- **Iconography**: Lucide React.
- **State Management**: Context API / Zustand for authentication session and operational state.

### 2.3 Admin Platform
- **Framework**: React 18+ bundled via Vite.
- **Routing**: `react-router-dom` for internal operational routes (`/admin/*`).
- **Styling**: Tailwind CSS matching enterprise administrative density standards.
- **State Management**: TanStack Query + Context API.

### 2.4 Central API & Backend Core
- **Framework**: Laravel 11.x on PHP 8.2+.
- **Authentication**: Laravel Sanctum for API token issuance and verification.
- **Database ORM**: Eloquent ORM with strict typing, explicit foreign key constraints, and soft deletes.
- **Queue / Async Jobs**: Laravel Queue (Database or Redis driver) for email notifications and proof processing.
- **File Storage**: Flysystem abstraction (local disk for local dev; S3-compatible cloud storage for production).

### 2.5 Database & Storage
- **RDBMS**: MySQL 8.0+.
- **Collation**: `utf8mb4_unicode_ci`.
- **Engine**: InnoDB (mandatory for row-level locking and ACID transactions).

---

## 3. Strict Development Constraints

1. **No Framework Proliferation**: Do not inject Vue, Angular, Svelte, Express, NestJS, Django, or alternative micro-frameworks.
2. **CSS Standard**: Vanilla Tailwind CSS only. Do not install component libraries with heavy opinionated color palettes or conflicting design systems unless approved.
3. **No Digital Screen Engines in V1**: Do not install WebSockets or streaming video pipelines meant for programmatic digital LED screen control. V1 is static media only.
