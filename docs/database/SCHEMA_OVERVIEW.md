# SODAARS - Database Schema & Multi-Tenant Design

## Database Configuration
- Engine: InnoDB
- Collation: `utf8mb4_unicode_ci`
- Timezone: UTC

## Core Foundation Entities (Stage 2)

### 1. `subscription_plans`
Stores database-driven subscription tiers.
- `id` (BIGINT PK)
- `name` (VARCHAR: Starter, Growth, Professional, Enterprise)
- `slug` (VARCHAR UNIQUE)
- `description` (TEXT)
- `min_resources` (INT UNSIGNED)
- `max_resources` (INT UNSIGNED NULLABLE: NULL for unlimited)
- `monthly_price` (DECIMAL 12,2)
- `annual_price` (DECIMAL 12,2 NULLABLE)
- `currency` (VARCHAR 3, DEFAULT 'INR')
- `features` (JSON)
- `status` (ENUM: ACTIVE, INACTIVE, ARCHIVED)
- `sort_order` (SMALLINT)
- Timestamps & SoftDeletes

### 2. `organizations`
Tenant entities.
- `id` (BIGINT PK)
- `uuid` (CHAR 36 UNIQUE)
- `name` (VARCHAR)
- `slug` (VARCHAR UNIQUE)
- `email`, `phone`, `address`, `city`, `state`, `pincode`, `country`
- `registration_source` (ENUM: ADMIN, STAFF, SELF)
- `status` (ENUM: ACTIVE, SUSPENDED, PENDING_VERIFICATION, INACTIVE)
- `created_by_user_id` (BIGINT FK -> users.id)
- `settings` (JSON)
- Timestamps & SoftDeletes

### 3. `users`
Accounts across platform and organizations.
- `id` (BIGINT PK)
- `uuid` (CHAR 36 UNIQUE)
- `name`, `email` (UNIQUE), `phone`, `password`
- `platform_role` (ENUM: SUPER_ADMIN, ADMIN, STAFF, NULL)
- `status` (ENUM: ACTIVE, SUSPENDED, INACTIVE)
- `email_verified_at`
- Timestamps & SoftDeletes

### 4. `organization_users`
Pivot table defining user roles within specific tenant organizations.
- `id` (BIGINT PK)
- `organization_id` (BIGINT FK -> organizations.id ON DELETE CASCADE)
- `user_id` (BIGINT FK -> users.id ON DELETE CASCADE)
- `role` (ENUM: PROVIDER_OWNER, PROVIDER_MANAGER, PROVIDER_STAFF)
- `status` (ENUM: ACTIVE, INVITED, SUSPENDED)
- `is_default` (BOOLEAN)
- `joined_at` (TIMESTAMP)
- UNIQUE (organization_id, user_id)

### 5. `subscriptions`
Tenant subscription records.
- `id` (BIGINT PK)
- `organization_id` (BIGINT FK -> organizations.id ON DELETE CASCADE)
- `subscription_plan_id` (BIGINT FK -> subscription_plans.id ON DELETE RESTRICT)
- `status` (ENUM: ACTIVE, TRIAL, PAST_DUE, CANCELLED, EXPIRED)
- `billing_cycle` (ENUM: MONTHLY, ANNUAL)
- `resource_limit` (INT UNSIGNED)
- `price` (DECIMAL 12,2)
- `currency` (VARCHAR 3)
- `starts_at`, `ends_at`, `trial_ends_at`, `cancelled_at`
- Timestamps & SoftDeletes

## Staff & Provider Domain (Stage 4)

### 6. `organization_invitations`
Staff invitations workflow.
- `id` (BIGINT PK)
- `uuid` (CHAR 36 UNIQUE)
- `organization_id` (BIGINT FK -> organizations.id ON DELETE CASCADE)
- `invited_by_user_id` (BIGINT FK -> users.id ON DELETE CASCADE)
- `email` (VARCHAR 255)
- `name` (VARCHAR 255)
- `phone` (VARCHAR 50 NULLABLE)
- `role` (VARCHAR 50)
- `token_hash` (VARCHAR 64 UNIQUE, SHA-256)
- `status` (ENUM: PENDING, ACCEPTED, EXPIRED, REVOKED)
- `expires_at`, `accepted_at`, `revoked_at`
- Timestamps

## Location & Geographic Data Architecture (Stage 5)

### 7. `locations`
Physical/geographic outdoor advertising sites.
- `id` (BIGINT PK)
- `uuid` (CHAR 36 UNIQUE)
- `organization_id` (BIGINT FK -> organizations.id ON DELETE CASCADE)
- `name` (VARCHAR 255)
- `code` (VARCHAR 100)
- `address` (TEXT NULLABLE)
- `area` (VARCHAR 150 NULLABLE)
- `locality` (VARCHAR 150 NULLABLE)
- `city` (VARCHAR 150 INDEX)
- `district` (VARCHAR 150 NULLABLE INDEX)
- `state` (VARCHAR 150 INDEX)
- `pincode` (VARCHAR 20 NULLABLE)
- `country` (VARCHAR 100 DEFAULT 'India')
- `landmark` (VARCHAR 255 NULLABLE)
- `latitude` (DECIMAL 10,7 NULLABLE INDEX)
- `longitude` (DECIMAL 10,7 NULLABLE INDEX)
- `description` (TEXT NULLABLE)
- `status` (ENUM: ACTIVE, INACTIVE, UNDER_REVIEW, DEFAULT 'ACTIVE')
- `notes` (TEXT NULLABLE)
- `created_by_user_id` (BIGINT FK -> users.id NULLABLE ON DELETE SET NULL)
- Timestamps & SoftDeletes
- Constraints & Indexes:
  - `UNIQUE (organization_id, code)` — Scoped code uniqueness per organization
  - `INDEX (organization_id, status)`
  - `INDEX (organization_id, city)`

### 8. `location_media`
Media assets attached to a location.
- `id` (BIGINT PK)
- `uuid` (CHAR 36 UNIQUE)
- `organization_id` (BIGINT FK -> organizations.id ON DELETE CASCADE)
- `location_id` (BIGINT FK -> locations.id ON DELETE CASCADE)
- `file_url` (VARCHAR 500)
- `file_name` (VARCHAR 255 NULLABLE)
- `mime_type` (VARCHAR 100 NULLABLE)
- `file_size` (BIGINT UNSIGNED NULLABLE)
- `sort_order` (INT UNSIGNED DEFAULT 0)
- Timestamps

## Advertising Resources & Inventory Architecture (Stage 6)

### 9. `advertising_resources`
Independently bookable commercial advertising faces or units hosted at a physical `Location`.
- `id` (BIGINT PK)
- `uuid` (CHAR 36 UNIQUE)
- `organization_id` (BIGINT FK -> organizations.id ON DELETE CASCADE)
- `location_id` (BIGINT FK -> locations.id ON DELETE CASCADE)
- `name` (VARCHAR 255)
- `code` (VARCHAR 100) — Scoped unique per tenant
- `resource_type` (VARCHAR 50 INDEX) — PHP backed enum (`HOARDING`, `BILLBOARD`, `UNIPOLE`, `GANTRY`, `LED_SCREEN`, `DIGITAL_SCREEN`, `BUS_SHELTER`, `POLE_AD`, `WALL_MOUNT`, `ROOFTOP`, `BRIDGE_PANEL`, `OTHER`)
- `category` (VARCHAR 20 INDEX) — `STATIC`, `DIGITAL`
- `face_number` (SMALLINT UNSIGNED DEFAULT 1) — Multi-face ordering (e.g. 1, 2)
- `face_label` (VARCHAR 50 NULLABLE) — Multi-face designation (e.g. 'Face A', 'Face B', 'North-Facing')
- `direction` (VARCHAR 100 NULLABLE) — Traffic direction (e.g. 'Towards Airport')
- `traffic_flow` (VARCHAR 150 NULLABLE) — Roadway description (e.g. 'Arterial 6-lane bypass')
- `width` (DECIMAL 8,2) — Physical face width
- `height` (DECIMAL 8,2) — Physical face height
- `dimension_unit` (VARCHAR 20 DEFAULT 'FEET') — `FEET`, `METERS`, `INCHES`
- *(Note: `area` is never stored in DB; dynamically computed as `width * height` in model accessor and API responses)*
- `illumination_type` (VARCHAR 50 INDEX DEFAULT 'NON_LIT') — `FRONT_LIT`, `BACK_LIT`, `NON_LIT`, `DIGITAL_LED`, `SOLAR_LIT`, `OTHER`
- `operating_hours_from` (TIME NULLABLE) — Operating start time (e.g. '06:00')
- `operating_hours_to` (TIME NULLABLE) — Operating end time (e.g. '23:00')
- `resolution` (VARCHAR 50 NULLABLE) — Screen pixel dimensions (e.g. '1920x1080')
- `pixel_pitch` (VARCHAR 20 NULLABLE) — LED pitch (e.g. 'P6')
- `slot_duration_seconds` (INT UNSIGNED NULLABLE) — Digital slot duration (e.g. 10)
- `total_slots` (SMALLINT UNSIGNED NULLABLE DEFAULT 10) — Loop slot capacity for digital resources (SOV)
- `daily_impressions_estimate` (BIGINT UNSIGNED NULLABLE) — Estimated vehicular/foot traffic impressions
- `base_price_monthly` (DECIMAL 12,2 NULLABLE) — Provider rate-card / starting reference rate
- `currency` (VARCHAR 3 DEFAULT 'INR')
- `status` (VARCHAR 50 INDEX DEFAULT 'ACTIVE') — `ACTIVE`, `INACTIVE`, `UNDER_MAINTENANCE`, `UNDER_REVIEW`
- `description` (TEXT NULLABLE)
- `installation_details` (TEXT NULLABLE)
- `notes` (TEXT NULLABLE)
- `created_by_user_id` (BIGINT FK -> users.id NULLABLE ON DELETE SET NULL)
- Timestamps & SoftDeletes
- Constraints & Indexes:
  - `UNIQUE (organization_id, code)` — Scoped code uniqueness per organization
  - `INDEX (organization_id, status)`
  - `INDEX (organization_id, location_id)`
  - `INDEX (location_id, status)`

### 10. `advertising_resource_media`
Media assets and photo documentation attached to an advertising resource face.
- `id` (BIGINT PK)
- `uuid` (CHAR 36 UNIQUE)
- `organization_id` (BIGINT FK -> organizations.id ON DELETE CASCADE)
- `advertising_resource_id` (BIGINT FK -> advertising_resources.id ON DELETE CASCADE)
- `file_url` (VARCHAR 2048)
- `file_name` (VARCHAR 255 NULLABLE)
- `mime_type` (VARCHAR 100 NULLABLE)
- `file_size` (BIGINT UNSIGNED NULLABLE)
- `sort_order` (SMALLINT UNSIGNED DEFAULT 0)
- `media_type` (VARCHAR 50 DEFAULT 'DAY_PHOTO') — `DAY_PHOTO`, `NIGHT_PHOTO`, `LONG_SHOT`, `CLOSE_UP`, `SCHEMATIC`, `OTHER`
- Timestamps
- Indexes:
  - `INDEX (advertising_resource_id, sort_order)`
  - `INDEX (organization_id, advertising_resource_id)`

## Availability & Calendar Management Architecture (Stage 7)

### 11. `resource_schedules`
Unified scheduling entity representing bookings, maintenance downtimes, civic holds, and tentative sales holds.
- `id` (BIGINT PK)
- `uuid` (CHAR 36 UNIQUE)
- `organization_id` (BIGINT FK -> organizations.id ON DELETE CASCADE)
- `advertising_resource_id` (BIGINT FK -> advertising_resources.id ON DELETE CASCADE)
- `title` (VARCHAR 255 NULLABLE) — Descriptive label (e.g. "Structural Maintenance", "Client Negotiation", "Diwali Campaign")
- `block_type` (VARCHAR 30 INDEX) — `BOOKING`, `MAINTENANCE`, `CIVIC_HOLD`, `INTERNAL_BLOCK`, `TENTATIVE_HOLD`
- `status` (VARCHAR 20 INDEX DEFAULT 'CONFIRMED') — `CONFIRMED`, `TENTATIVE`, `CANCELLED`
- `start_date` (DATE) — Inclusive start date
- `end_date` (DATE) — Inclusive end date
- `slots_count` (SMALLINT UNSIGNED DEFAULT 1) — 1 for static, N for digital loop slots
- `hold_expires_at` (TIMESTAMP NULLABLE INDEX) — Expiration timestamp for `TENTATIVE_HOLD`
- `released_at` (TIMESTAMP NULLABLE) — Timestamp when a schedule or hold was cancelled/released
- `reference_type` (VARCHAR 100 NULLABLE) — Polymorphic link (`ENQUIRY`, `Quotation`, `Booking`, `Campaign`)
- `reference_id` (BIGINT UNSIGNED NULLABLE)
- `notes` (TEXT NULLABLE)
- `created_by_user_id` (BIGINT FK -> users.id NULLABLE ON DELETE SET NULL)
- Timestamps & SoftDeletes
- Constraints & Indexes:
  - `INDEX (organization_id, start_date, end_date)`
  - `INDEX (advertising_resource_id, start_date, end_date)`
  - `INDEX (advertising_resource_id, status)`
  - `INDEX (advertising_resource_id, block_type)`

---

## Customers & Enquiries Management Architecture (Stage 8)

### 12. `customers`
Tenant-scoped client portfolio representing advertisers, media agencies, brands, and institutional clients.
- `id` (BIGINT PK)
- `uuid` (CHAR 36 UNIQUE)
- `organization_id` (BIGINT FK -> organizations.id ON DELETE CASCADE)
- `code` (VARCHAR 50) — Unique per organization (e.g. `CUST-0001`)
- `customer_type` (VARCHAR 30) — `DIRECT_ADVERTISER`, `AGENCY`, `BRAND`, `INDIVIDUAL`, `GOVERNMENT`
- `company_name` (VARCHAR 255 NULLABLE)
- `brand_name` (VARCHAR 255 NULLABLE)
- `contact_person` (VARCHAR 255)
- `email` (VARCHAR 255 NULLABLE)
- `phone` (VARCHAR 50)
- `alternate_phone` (VARCHAR 50 NULLABLE)
- `website` (VARCHAR 255 NULLABLE)
- `billing_address` (TEXT NULLABLE)
- `city` (VARCHAR 100 NULLABLE)
- `state` (VARCHAR 100 NULLABLE)
- `pincode` (VARCHAR 20 NULLABLE)
- `country` (VARCHAR 100 DEFAULT 'India')
- `gstin` (VARCHAR 20 NULLABLE) — Tax ID / GSTIN
- `pan_number` (VARCHAR 20 NULLABLE)
- `credit_period_days` (SMALLINT UNSIGNED DEFAULT 30)
- `status` (VARCHAR 30 DEFAULT 'ACTIVE') — `ACTIVE`, `INACTIVE`, `BLOCKED`
- `notes` (TEXT NULLABLE)
- `created_by_user_id` (BIGINT FK -> users.id NULLABLE ON DELETE SET NULL)
- Timestamps & SoftDeletes
- Constraints & Indexes:
  - `UNIQUE (organization_id, code)`
  - `INDEX (organization_id, status)`
  - `INDEX (organization_id, customer_type)`

### 13. `enquiries`
Commercial campaign requests and RFQs logged by sales staff or incoming client channels.
- `id` (BIGINT PK)
- `uuid` (CHAR 36 UNIQUE)
- `organization_id` (BIGINT FK -> organizations.id ON DELETE CASCADE)
- `enquiry_number` (VARCHAR 50) — Unique per organization (e.g. `ENQ-2026-0001`)
- `customer_id` (BIGINT FK -> customers.id ON DELETE RESTRICT)
- `campaign_title` (VARCHAR 255)
- `status` (VARCHAR 30 DEFAULT 'NEW') — `NEW`, `UNDER_REVIEW`, `QUOTED`, `NEGOTIATING`, `CONVERTED`, `LOST`, `CANCELLED`
- `priority` (VARCHAR 20 DEFAULT 'MEDIUM') — `LOW`, `MEDIUM`, `HIGH`, `URGENT`
- `source` (VARCHAR 30 DEFAULT 'DIRECT_VISIT') — `DIRECT_VISIT`, `PHONE`, `EMAIL`, `WEBSITE`, `AGENCY_RFQ`, `REFERRAL`, `OTHER`
- `start_date` (DATE NULLABLE)
- `end_date` (DATE NULLABLE)
- `estimated_budget` (DECIMAL 14,2 NULLABLE)
- `currency` (VARCHAR 3 DEFAULT 'INR')
- `assigned_to_user_id` (BIGINT FK -> users.id NULLABLE ON DELETE SET NULL)
- `lost_reason` (VARCHAR 255 NULLABLE)
- `requirements` (TEXT NULLABLE)
- `internal_notes` (TEXT NULLABLE)
- `created_by_user_id` (BIGINT FK -> users.id NULLABLE ON DELETE SET NULL)
- Timestamps & SoftDeletes
- Constraints & Indexes:
  - `UNIQUE (organization_id, enquiry_number)`
  - `INDEX (organization_id, status)`
  - `INDEX (organization_id, customer_id)`
  - `INDEX (organization_id, assigned_to_user_id)`

### 14. `enquiry_items`
Itemized inventory requirements requested under an enquiry, enforcing strict XOR between a specific advertising resource face or a general geographic location.
- `id` (BIGINT PK)
- `uuid` (CHAR 36 UNIQUE)
- `enquiry_id` (BIGINT FK -> enquiries.id ON DELETE CASCADE)
- `advertising_resource_id` (BIGINT FK -> advertising_resources.id NULLABLE ON DELETE SET NULL)
- `location_id` (BIGINT FK -> locations.id NULLABLE ON DELETE SET NULL)
- `start_date` (DATE NULLABLE)
- `end_date` (DATE NULLABLE)
- `slots_count` (SMALLINT UNSIGNED DEFAULT 1)
- `proposed_rate` (DECIMAL 12,2 NULLABLE)
- `notes` (TEXT NULLABLE)
- Timestamps
- Constraints & Indexes:
  - `INDEX (enquiry_id)`
  - `INDEX (advertising_resource_id)`
  - `INDEX (location_id)`
  - Business XOR Rule: Exactly one of `advertising_resource_id` or `location_id` must be populated.

---

### 15. `location_media`
Photographic assets, site maps, and context media attached to outdoor physical locations.
- `id` (BIGINT PK)
- `uuid` (CHAR 36 UNIQUE)
- `organization_id` (BIGINT FK -> organizations.id ON DELETE CASCADE)
- `location_id` (BIGINT FK -> locations.id ON DELETE CASCADE)
- `file_url` (VARCHAR 500) — Public/CDN URL
- `file_name` (VARCHAR 255) — Sanitized UUID filename on disk
- `original_filename` (VARCHAR 255 NULLABLE) — Original uploaded file name
- `mime_type` (VARCHAR 100 NULLABLE) — Inspected magic-bytes MIME
- `file_size` (BIGINT UNSIGNED NULLABLE) — File size in bytes
- `storage_disk` (VARCHAR 50 DEFAULT 'public') — Disk identifier ('public', 's3', 'r2')
- `storage_path` (VARCHAR 1024 NULLABLE) — Relative path of optimized display image
- `original_path` (VARCHAR 1024 NULLABLE) — Relative path of safe original file
- `thumbnail_path` (VARCHAR 1024 NULLABLE) — Relative path of 600x400 thumbnail
- `width` (INT UNSIGNED NULLABLE) — Optimized image pixel width
- `height` (INT UNSIGNED NULLABLE) — Optimized image pixel height
- `alt_text` (VARCHAR 255 NULLABLE) — SEO and accessibility alt text
- `caption` (VARCHAR 500 NULLABLE) — Editorial caption
- `is_primary` (BOOLEAN DEFAULT FALSE) — Single primary cover photo flag
- `sort_order` (INT UNSIGNED DEFAULT 0) — Gallery ordering index
- `media_type` (VARCHAR 50 DEFAULT 'SITE_PHOTO') — `SITE_PHOTO`, `SURROUNDING_AREA`, `LANDMARK_VIEW`, `PLOT_MAP`, `OTHER`
- Timestamps & SoftDeletes (`deleted_at`)
- Constraints & Indexes:
  - `INDEX (location_id, sort_order)`
  - `INDEX (location_id, is_primary)`
  - `INDEX (organization_id, location_id)`
  - `INDEX (organization_id, deleted_at)`

---

### 16. `advertising_resource_media`
High-resolution photographs, night illumination shots, and schematics for individual bookable advertising faces.
- `id` (BIGINT PK)
- `uuid` (CHAR 36 UNIQUE)
- `organization_id` (BIGINT FK -> organizations.id ON DELETE CASCADE)
- `advertising_resource_id` (BIGINT FK -> advertising_resources.id ON DELETE CASCADE)
- `file_url` (VARCHAR 2048) — Public/CDN URL
- `file_name` (VARCHAR 255) — Sanitized UUID filename on disk
- `original_filename` (VARCHAR 255 NULLABLE) — Original uploaded file name
- `mime_type` (VARCHAR 100 NULLABLE) — Inspected magic-bytes MIME
- `file_size` (BIGINT UNSIGNED NULLABLE) — File size in bytes
- `storage_disk` (VARCHAR 50 DEFAULT 'public') — Disk identifier ('public', 's3', 'r2')
- `storage_path` (VARCHAR 1024 NULLABLE) — Relative path of optimized display image
- `original_path` (VARCHAR 1024 NULLABLE) — Relative path of safe original file
- `thumbnail_path` (VARCHAR 1024 NULLABLE) — Relative path of 600x400 thumbnail
- `width` (INT UNSIGNED NULLABLE) — Optimized image pixel width
- `height` (INT UNSIGNED NULLABLE) — Optimized image pixel height
- `alt_text` (VARCHAR 255 NULLABLE) — SEO and accessibility alt text
- `caption` (VARCHAR 500 NULLABLE) — Editorial caption
- `is_primary` (BOOLEAN DEFAULT FALSE) — Single primary cover photo flag
- `sort_order` (SMALLINT UNSIGNED DEFAULT 0) — Gallery ordering index
- `media_type` (VARCHAR 50 DEFAULT 'DAY_PHOTO') — `DAY_PHOTO`, `NIGHT_PHOTO`, `LONG_SHOT`, `CLOSE_UP`, `SCHEMATIC`, `OTHER`
- Timestamps & SoftDeletes (`deleted_at`)
- Constraints & Indexes:
  - `INDEX (advertising_resource_id, sort_order)`
  - `INDEX (advertising_resource_id, is_primary)`
  - `INDEX (organization_id, advertising_resource_id)`
  - `INDEX (organization_id, deleted_at)`




