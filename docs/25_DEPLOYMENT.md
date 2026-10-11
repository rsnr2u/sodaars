# 25 Deployment & DevOps Specification
**Project**: SODAARS  
**Document**: Infrastructure Topology, CI/CD Pipelines & Environment Architecture  
**Status**: Source of Truth  
**Version**: 1.0.0

---

## 1. Hosting Architecture & Service Topology

The decoupled SODAARS ecosystem deploys across specialized application runtimes:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DEPLOYMENT TOPOLOGY                             │
├─────────────────────┬──────────────────────┬───────────────────────────┤
│ Component           │ Runtime / Host       │ Deployment Target         │
├─────────────────────┼──────────────────────┼───────────────────────────┤
│ Marketplace         │ Node.js 20+ LTS      │ Next.js SSR / Standalone  │
│ Provider Platform   │ Static HTML/JS/CSS   │ Nginx / Cloud Storage CDN │
│ Admin Platform      │ Static HTML/JS/CSS   │ Nginx / Restricted Access │
│ Central Backend API │ PHP 8.2+ FPM / Nginx │ Laravel Core Runtime      │
│ Database Core       │ MySQL 8.0+           │ Managed MySQL Instance    │
│ Media Asset Storage │ S3-Compatible Storage│ Object Storage Bucket     │
└─────────────────────┴──────────────────────┴───────────────────────────┘
```

---

## 2. Environment Configuration Standards

Every service maintains an explicit `.env.example` defining runtime requirements:

### 2.1 Backend API (`backend/.env`)
```ini
APP_NAME=SODAARS_API
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=false
APP_URL=https://api.sodaars.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sodaars_core
DB_USERNAME=sodaars_app
DB_PASSWORD=...

SANCTUM_STATEFUL_DOMAINS=provider.sodaars.com,admin.sodaars.com,sodaars.com
SESSION_DOMAIN=.sodaars.com

FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_DEFAULT_REGION=ap-south-1
AWS_BUCKET=sodaars-media-assets
```

### 2.2 Client Surfaces Configuration
- **Marketplace (`marketplace/.env`)**:
  ```ini
  NEXT_PUBLIC_API_BASE_URL=https://api.sodaars.com/api/v1/marketplace
  NEXT_PUBLIC_SITE_URL=https://sodaars.com
  ```
- **Provider Platform (`provider/.env`)**:
  ```ini
  VITE_API_BASE_URL=https://api.sodaars.com/api/v1/provider
  VITE_MARKETPLACE_URL=https://sodaars.com
  ```
- **Admin Platform (`admin/.env`)**:
  ```ini
  VITE_API_BASE_URL=https://api.sodaars.com/api/v1/admin
  ```

---

## 3. Database Migration & Deployment Safety Rules

> [!CAUTION]
> **ZERO TOLERANCE FOR DESTRUCTIVE PRODUCTION COMMANDS**:
> - Never execute `php artisan migrate:fresh` or `php artisan db:wipe` in production or staging.
> - All schema alterations must be additive and forward-compatible.
> - Prior to running migrations in production, trigger an automated snapshot of the MySQL database.

### Standard Production Deployment Sequence:
```bash
# 1. Backend Core Update
cd /var/www/sodaars/backend
git pull origin main
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 2. Provider SPA Build & Deploy
cd /var/www/sodaars/provider
npm ci
npm run build
# Sync dist/ to Nginx /var/www/provider.sodaars.com

# 3. Admin SPA Build & Deploy
cd /var/www/sodaars/admin
npm ci
npm run build
# Sync dist/ to Nginx /var/www/admin.sodaars.com

# 4. Marketplace Next.js Build & Restart
cd /var/www/sodaars/marketplace
npm ci
npm run build
pm2 reload sodaars-marketplace
```
