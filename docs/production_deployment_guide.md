# SODAARS Production Deployment & Architecture Blueprint

This document specifies the target production deployment architecture for the **SODAARS (Outdoor Advertising Resource SaaS)** platform.

---

## 1. Domain & Network Architecture

The SODAARS platform consists of four distinct application surfaces operating in harmony:

```text
                                Internet (Users & Providers)
                                             │
                                             ▼
                             Cloudflare / Edge CDN / WAF
                                             │
                        ┌────────────────────┴────────────────────┐
                        │                                         │
                        ▼                                         ▼
            Nginx Reverse Proxy / Load Balancer (Port 80/443 SSL)
                        │
       ┌────────────────┼────────────────┬────────────────────────┐
       │                │                │                        │
       ▼                ▼                ▼                        ▼
Public Directory  Provider SaaS   Platform Admin             Laravel API
  sodaars.com    app.sodaars.com admin.sodaars.com         api.sodaars.com
   (Next.js)      (Vite SPA)       (Vite SPA)                (PHP-FPM)
  Node :3000     Static Files     Static Files               FastCGI :9000
       │                                                          │
       └───────────────────────────────┬──────────────────────────┘
                                       │
                                       ▼
                             MySQL 8.0 Database
                            Redis Cache & Queues
```

| Domain | Target Surface | Runtime / Server | Port / Delivery |
| :--- | :--- | :--- | :--- |
| **`sodaars.com`** | Public Discovery Directory | Next.js 16.3.5 (SSR / ISR) | Node.js PM2 process (`:3000`) |
| **`app.sodaars.com`** | Provider SaaS Portal | Vite + React 19 SPA | Nginx static bundle (`dist/`) |
| **`admin.sodaars.com`** | Platform Admin Portal | Vite + React 19 SPA | Nginx static bundle (`dist/`) |
| **`api.sodaars.com`** | Laravel API Backend | PHP 8.2+ PHP-FPM | FastCGI unix socket / `:9000` |

---

## 2. Production Environment Variables Reference

### Backend API (`backend/api/.env.production`)
```ini
APP_NAME=SODAARS_API
APP_ENV=production
APP_KEY=base64:GENERATE_VIA_PHP_ARTISAN_KEY_GENERATE
APP_DEBUG=false
APP_URL=https://api.sodaars.com

LOG_CHANNEL=daily
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sodaars_production
DB_USERNAME=sodaars_user
DB_PASSWORD=STRONG_PRODUCTION_DB_PASSWORD

BROADCAST_CONNECTION=log
CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
SESSION_LIFETIME=120
SESSION_ENCRYPT=true
SESSION_PATH=/
SESSION_DOMAIN=.sodaars.com
SESSION_SECURE_COOKIE=true

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

FRONTEND_URL=https://app.sodaars.com
ADMIN_URL=https://admin.sodaars.com
DIRECTORY_URL=https://sodaars.com
SANCTUM_STATEFUL_DOMAINS=app.sodaars.com,admin.sodaars.com,sodaars.com

FILESYSTEM_DISK=public
# S3 / Object Storage Configuration (When AWS S3 or Cloudflare R2 is utilized)
# AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY
# AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_KEY
# AWS_DEFAULT_REGION=ap-south-1
# AWS_BUCKET=sodaars-production-media
# AWS_URL=https://cdn.sodaars.com
```

### Provider SaaS (`frontend/provider/.env.production`)
```ini
VITE_APP_NAME="SODAARS Provider Portal"
VITE_API_BASE_URL=https://api.sodaars.com/api/v1
VITE_DIRECTORY_URL=https://sodaars.com
```

### Public Directory (`website/directory/.env.production`)
```ini
NEXT_PUBLIC_APP_NAME="SODAARS Public Directory"
NEXT_PUBLIC_API_BASE_URL=https://api.sodaars.com/api/v1
NEXT_PUBLIC_PROVIDER_PORTAL_URL=https://app.sodaars.com
```

### Platform Admin Portal (`frontend/admin/.env.production`)
```ini
VITE_APP_NAME="SODAARS Platform Admin Portal"
VITE_API_BASE_URL=https://api.sodaars.com/api/v1
VITE_DIRECTORY_URL=https://sodaars.com
```

---

## 3. Nginx Server Block Configurations

### A. API Backend (`api.sodaars.com`)
```nginx
server {
    listen 443 ssl http2;
    server_name api.sodaars.com;

    root /var/www/sodaars/backend/api/public;
    index index.php;

    ssl_certificate /etc/letsencrypt/live/api.sodaars.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.sodaars.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    client_max_body_size 25M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### B. Public Directory (`sodaars.com`)
```nginx
server {
    listen 443 ssl http2;
    server_name sodaars.com www.sodaars.com;

    ssl_certificate /etc/letsencrypt/live/sodaars.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sodaars.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### C. Provider SaaS Portal (`app.sodaars.com`)
```nginx
server {
    listen 443 ssl http2;
    server_name app.sodaars.com;

    root /var/www/sodaars/frontend/provider/dist;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/app.sodaars.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.sodaars.com/privkey.pem;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static asset caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

### D. Platform Admin Portal (`admin.sodaars.com`)
```nginx
server {
    listen 443 ssl http2;
    server_name admin.sodaars.com;

    root /var/www/sodaars/frontend/admin/dist;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/admin.sodaars.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.sodaars.com/privkey.pem;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static asset caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

---

## 4. Supervisor Background Workers Configuration

Create `/etc/supervisor/conf.d/sodaars-workers.conf`:

```ini
[program:sodaars-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/sodaars/backend/api/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/log/supervisor/sodaars-worker.log
stopwaitsecs=3600

[program:sodaars-directory]
command=npm start
directory=/var/www/sodaars/website/directory
autostart=true
autorestart=true
user=www-data
environment=NODE_ENV="production",PORT="3000"
redirect_stderr=true
stdout_logfile=/var/log/supervisor/sodaars-directory.log
```

---

## 5. Automated Build & Deploy Script (`deploy.sh`)

```bash
#!/bin/bash
set -e

echo "=== SODAARS PRODUCTION DEPLOYMENT START ==="

# 1. Update Backend
cd /var/www/sodaars/backend/api
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link

# 2. Build Provider SaaS Portal
cd /var/www/sodaars/frontend/provider
npm ci
npm run build

# 3. Build Platform Admin Portal
cd /var/www/sodaars/frontend/admin
npm ci
npm run build

# 4. Build Public Directory
cd /var/www/sodaars/website/directory
npm ci
npm run build

# 5. Restart Daemons
sudo supervisorctl restart all
sudo systemctl reload nginx

echo "=== SODAARS PRODUCTION DEPLOYMENT SUCCESSFUL ==="
```
