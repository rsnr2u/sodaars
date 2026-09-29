# SODAARS
**Streamline Outdoor Digital Advertising Resource System**

SODAARS is an enterprise multi-tenant Outdoor Advertising Resource Management SaaS engineered for Outdoor Advertising Providers (media owners, billboard operators, and digital screen networks).

---

## 1. Project Overview & Architecture

SODAARS is architected as an API-first monorepo consisting of 4 decoupled applications:

```
SODAARS/
│
├── backend/
│   └── api/                  # Laravel 12+ API Backend (PHP 8.2+, MySQL 8+, Sanctum)
│
├── frontend/
│   ├── provider/             # Provider SaaS Application (React + TypeScript + Vite)
│   └── admin/                # Platform Administration Application (React + TypeScript + Vite)
│
├── website/
│   └── directory/            # Public Provider Discovery Directory (Next.js + TypeScript)
│
├── docs/                     # Comprehensive Architecture & Requirements Documentation
│   ├── requirements/
│   ├── architecture/
│   ├── database/
│   ├── api/
│   └── ui-ux/
│
├── database/
│   └── sql/                  # Reference SQL schemas, seed exports, and architectural scripts
│
├── scripts/                  # Development automation scripts (dev-backend, dev-provider, etc.)
├── .gitignore                # Global gitignore covering all sub-applications
└── README.md
```

---

## 2. Technology Stack & Ports

| Application | Technology | Directory | Default Port |
| :--- | :--- | :--- | :--- |
| **Backend API** | Laravel 12, PHP 8.2+, Sanctum, MySQL | `backend/api` | `http://localhost:8000` |
| **Provider Portal** | React 19, TypeScript, Vite, Leaflet, Recharts | `frontend/provider` | `http://localhost:5173` |
| **Admin Portal** | React 19, TypeScript, Vite, Recharts | `frontend/admin` | `http://localhost:5174` |
| **Public Directory** | Next.js 15 (App Router), React, TypeScript | `website/directory` | `http://localhost:3000` |

---

## 3. Local Development Setup

### Prerequisites
- **PHP**: 8.2+ with `pdo_mysql`, `zip`, `intl`, `curl`, `openssl`
- **MySQL / MariaDB**: 8.0+ / 10.4+ (Default port `3306`)
- **Composer**: 2.x
- **Node.js**: v20+ / v24+ with `npm`

### Database Setup
1. Ensure your local MySQL server is running.
2. Create the database:
   ```sql
   CREATE DATABASE sodaars CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

### 1. Backend Setup (`backend/api`)
```bash
cd backend/api

# Install Composer dependencies (if not already installed)
composer install

# Environment setup
cp .env.example .env

# Generate application encryption key
php artisan key:generate

# Configure your DB settings in .env:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=sodaars
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations
php artisan migrate

# Start Laravel development server
php artisan serve --port=8000
```

### 2. Provider Portal Setup (`frontend/provider`)
```bash
cd frontend/provider

# Install dependencies
npm install

# Start development server
npm run dev -- --port 5173
```
Accessible at: `http://localhost:5173` (configured to communicate with `http://localhost:8000/api/v1`).

### 3. Admin Portal Setup (`frontend/admin`)
```bash
cd frontend/admin

# Install dependencies
npm install

# Start development server
npm run dev -- --port 5174
```
Accessible at: `http://localhost:5174` (configured to communicate with `http://localhost:8000/api/v1`).

### 4. Public Directory Setup (`website/directory`)
```bash
cd website/directory

# Install dependencies
npm install

# Start Next.js development server
npm run dev -- -p 3000
```
Accessible at: `http://localhost:3000`.

---

## 4. Convenience Runner Scripts

Inside the `scripts/` folder, quick-start scripts are provided:
- `scripts/dev-backend.bat`: Launches Laravel API on `http://localhost:8000`
- `scripts/dev-provider.bat`: Launches Provider Portal on `http://localhost:5173`
- `scripts/dev-admin.bat`: Launches Admin Portal on `http://localhost:5174`
- `scripts/dev-directory.bat`: Launches Public Directory on `http://localhost:3000`

---

## 5. Architectural Guarantees & Multi-Tenancy

1. **Strict Tenant Isolation**: Multi-tenancy is enforced on the database level via `organization_id`. The client-supplied `organization_id` in request payloads is never trusted; the tenant context is derived dynamically from authenticated user memberships.
2. **Database-Driven Plans**: Subscription tiers (Starter: ₹2,499, Growth: ₹5,999, Professional: ₹9,999, Enterprise: Custom) are stored in the database (`subscription_plans`), not hard-coded in controllers.
3. **No Marketplace in Phase 1**: The marketplace application is deferred to Phase 2; Phase 1 focuses exclusively on the Provider SaaS, Platform Admin, and Public Provider Directory.
4. **Decoupled Geospatial Layer**: Coordinates and location information use standard geographic primitives compatible with Leaflet / OpenStreetMap in Phase 1 and Google Maps in the future.
