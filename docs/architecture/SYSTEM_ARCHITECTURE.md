# SODAARS - System Architecture

## Architecture Overview
SODAARS uses a decoupled, API-first architecture:

```
+-------------------------------------------------------------------------------+
|                                    CLIENTS                                    |
|                                                                               |
|  [Provider Portal]              [Admin Portal]          [Public Directory]    |
|  React + TS + Vite              React + TS + Vite       Next.js + TS          |
|  (Port: 5173)                   (Port: 5174)            (Port: 3000)          |
+-------------------------------------------------------------------------------+
                                         │
                                         ▼ REST APIs
+-------------------------------------------------------------------------------+
|                                BACKEND API                                    |
|                           (Laravel 12 / PHP 8.2+)                             |
|                                 (Port: 8000)                                  |
|                                                                               |
|  [Routes]       /api/v1/auth/*     /api/v1/public/*   /api/v1/admin/*         |
|                 /api/v1/tenant/*                                              |
|  [Middleware]   Sanctum Auth       PlatformRoleGate   IdentifyTenant          |
|  [ORM]          Eloquent with BelongsToTenant Global Scope                    |
+-------------------------------------------------------------------------------+
                                         │
                                         ▼
+-------------------------------------------------------------------------------+
|                                  DATA STORE                                   |
|                                                                               |
|  [MySQL 8+ / MariaDB 10.4]       Database: sodaars                            |
|  [Redis (Future Cache/Queues)]   Session & Cache Ready                        |
|  [Object Storage]                Local Disk (Dev) -> Cloudflare R2 / S3 (Prod)|
+-------------------------------------------------------------------------------+
```

## Authentication & Account Access (Stage 3)

### Dual-Entry Authentication Architecture
1. **Platform Admin Authentication (`/api/v1/auth/admin/login`)**:
   - Targets the platform management portal (`frontend/admin`).
   - Authenticates against the global `users` table where `users.platform_role` is populated (`SUPER_ADMIN`, `ADMIN`, `STAFF`).
   - Provider-only users (where `platform_role` is `NULL`) receive an immediate `403 Forbidden` response.
2. **Provider Authentication (`/api/v1/auth/provider/login`)**:
   - Targets the provider SaaS portal (`frontend/provider`).
   - Authenticates against `users` and resolves active organization memberships from `organization_users`.
   - Validates that both the user account and the resolved provider organization are in an `ACTIVE` status (rejects suspended or inactive organizations with `403 Forbidden`).
   - Emits a Sanctum bearer token scoped to the user's provider role (`PROVIDER_OWNER`, `PROVIDER_MANAGER`, `PROVIDER_STAFF`).
3. **Provider Public Self-Registration (`/api/v1/auth/provider/register`)**:
   - Atomically provisions an Organization (`registration_source = 'SELF'`), Owner User account, Owner Membership (`PROVIDER_OWNER`), and active Subscription tier within a single database transaction.
   - Emits a `Registered` event triggering asynchronous email verification.
4. **Token Revocation & Current Identity (`/api/v1/auth/logout`, `/api/v1/auth/me`)**:
   - `/auth/logout` deletes only the current access token in `personal_access_tokens`, leaving other device sessions intact.
   - `/auth/me` returns sanitized user details, current organization context, all available organization memberships, and email verification status.

## Multi-Tenant Isolation
- **Organization**: Primary tenant boundary.
- **Tenant Context**: Resolved via `TenantContext` service and enforced by `IdentifyTenant` middleware.
- **Global Scope**: `BelongsToTenant` trait automatically scopes all Eloquent queries with `WHERE organization_id = :tenant_id` and automatically attributes `organization_id` on model creation.
- **Tenant Context Verification**: If an authenticated user does not have an active membership in the target organization, a `403 Forbidden` response is returned. Client-supplied `organization_id` values in request bodies are ignored.

## Maps & Geospatial Data
- Standardized geographic fields: `latitude`, `longitude`, `address`, `city`, `district`, `state`, `pincode`, `country`.
- Phase 1 maps: Leaflet + OpenStreetMap.
- Decoupled schema enables seamless migration to Google Maps in the future without schema restructuring.

---

## Provider Organization Management, Staff Invitations & Permissions (Stage 4)

### 1. Provider Roles
- **`PROVIDER_OWNER`**: Highest authority within an outdoor advertising organization. Full control over business settings, staff hiring, promotions, role delegation, subscriptions, and financial records.
- **`PROVIDER_MANAGER`**: Operational manager. Authorized to invite and manage staff members, oversee advertising inventories, bookings, and customer enquiries. Restricted from modifying or creating Owner records or managing organization-level settings/subscriptions.
- **`PROVIDER_STAFF`**: Operational field/desk staff. Granted view permissions across day-to-day operations (locations, inventory availability, schedules, bookings). Restricted from user management, role alterations, or settings adjustments.

### 2. Centralized Permission Architecture
Instead of scattering ad-hoc role checks across controllers, SODAARS implements a centralized `PermissionService`:
- Defines granular permission nodes: `organization.*`, `staff.*`, `subscription.*`, `location.*`, `resource.*`, `availability.*`, `customer.*`, `enquiry.*`, `quotation.*`, `booking.*`, `campaign.*`, `invoice.*`, `payment.*`, `reports.*`.
- **Role Permission Matrix**:
  - `PROVIDER_OWNER`: Holds `*` (all provider permissions).
  - `PROVIDER_MANAGER`: Staff management (`staff.view`, `staff.invite`, `staff.update`, `staff.remove`), operational resources (`location.*`, `resource.*`, `availability.*`, `customer.*`, `enquiry.*`, `quotation.*`, `booking.*`, `campaign.*`), view-only on billing (`invoice.view`, `payment.view`, `reports.view`).
  - `PROVIDER_STAFF`: View-only access across operations (`organization.view`, `location.view`, `resource.view`, `availability.view`, `customer.view`, etc.).
- Evaluated cleanly via Laravel Policies (`OrganizationPolicy`, `OrganizationUserPolicy`, `OrganizationInvitationPolicy`).

### 3. Staff Invitation Workflow & Cryptographic Security
1. **Creation**: Owner or Manager sends an invite via `POST /api/v1/tenant/invitations`.
   - Generates a 64-character cryptographically secure token (`Str::random(64)`).
   - Stores only `hash('sha256', $plainToken)` in `organization_invitations.token_hash`. Plain tokens are **never** persisted to the database or logged.
   - Dispatches `StaffInvitationNotification` to the candidate's email address with a signed frontend link (`FRONTEND_PROVIDER_URL/invitations/accept?token=...`).
2. **Acceptance**: Candidate clicks link and submits `POST /api/v1/auth/invitations/accept`.
   - Verifies hash against pending invitations, checking expiration (7 days) and non-revocation.
   - Atomic DB transaction:
     - If email already belongs to a registered SODAARS user: reuses the user and binds membership to the organization. (If already an active member, returns `409 Conflict`).
     - If new user: provisions user account with hashed password and verified email status.
     - Creates active `organization_users` record with assigned provider role.
     - Transitions invitation status to `ACCEPTED` with `accepted_at` timestamp.
     - Issues Sanctum token scoped to the assigned provider role.
     - Rolls back on any error.
3. **Revocation**: Pending invitations can be cancelled anytime by authorized managers via `DELETE /api/v1/tenant/invitations/{uuid}`.

### 4. Admin Provider Lifecycle & Verification
- **Lifecycle States**: `ACTIVE`, `SUSPENDED`, `INACTIVE`.
- **Verification States**: `PENDING`, `VERIFIED`, `REJECTED` (with `verified_at` timestamp).
- **Enforcement**:
  - Suspending an organization (`POST /api/v1/admin/organizations/{uuid}/suspend`) immediately cuts off provider portal logins (`AuthService` check) and revokes runtime tenant API requests (`IdentifyTenant` middleware returning `403 Forbidden`).
  - Reactivating an organization (`POST /api/v1/admin/organizations/{uuid}/activate`) restores authentication and data access instantly for all active members.
- **Last Owner Invariant**:
  - Guarded within `OrganizationUserPolicy`: preventing accidental deletion or downgrade of the sole active `PROVIDER_OWNER` of any tenant organization.

---

## Location Management & Geographic Data Architecture (Stage 5)

### 1. Entity Hierarchy & Resource Boundary
SODAARS strictly maintains an entity separation between physical locations and advertising inventory units:

```
Organization (Tenant Boundary)
      │
      ▼
   Location (Physical Advertising Site / Landmark)
      │
      ▼
[Future Stage 6: Advertising Resources (Billboards, Unipoles, Bus Shelters, Digital Screens)]
```

- **Location is NOT an Advertising Resource**: A location represents the real-world site or civil property (e.g. *Koramangala Sony Signal Junction* or *Indiranagar 100ft Road Point*).
- An individual Location may host one or multiple Advertising Resources (e.g., *Face A North-Facing*, *Face B South-Facing*, *Digital Screen LED 1*).
- All Location assets are strictly isolated to the authenticated Organization via the `BelongsToTenant` trait and `TenantScope`.

### 2. Geographic Coordinate Representation
- Coordinates are stored as standard `DECIMAL(10, 7)` in `latitude` and `longitude` database columns.
- **Provider Agnostic**: The backend does not couple to any specific map provider (Google Maps, OpenStreetMap, Mapbox, or Leaflet).
- The API serves clean numerical coordinates (`12.9715987`, `77.5945627`). The frontend Provider application will later consume these coordinates to render tiles via Leaflet and OpenStreetMap.

### 3. Scoped Location Codes & Soft Deletion
- **Organization-Scoped Uniqueness**: Location codes (`LOC-001`, `LOC-002`) are unique strictly within an organization (`UNIQUE(organization_id, code)`). Two distinct advertising providers may each utilize `LOC-001`.
- **Soft Deletion (`SoftDeletes`)**: Deletion marks `deleted_at = now()`, preventing accidental data loss while allowing code re-allocation or historical audit trails. Normal tenant listings automatically exclude soft-deleted locations.

### 4. Location Media Architecture
- Prepared via the `location_media` table and `LocationMedia` model.
- Stores metadata: `file_url`, `file_name`, `mime_type`, `file_size`, `sort_order`.
- Storage abstraction is designed to be compatible with local development storage, Cloudflare R2, and Amazon S3. No binary file content is stored directly in MySQL.

---

## Advertising Resources & Inventory Architecture (Stage 6)

### 1. Entity Hierarchy & Bookable Unit Face Model
SODAARS adopts an unambiguous commercial inventory representation:

```
Organization (Tenant Boundary)
      │
      ▼
   Location (Physical Geographic Site)
      │
      ├── Resource: LOC-001-A (Face: A, Direction: Towards Airport, Static Unipole)
      └── Resource: LOC-001-B (Face: B, Direction: Towards City, Digital LED Screen)
```

- **One Advertising Resource = One Independently Bookable Advertising Face/Unit**:
  - Distinct faces of a multi-face site are distinct `AdvertisingResource` records.
  - Enables separate availability tracking, individual pricing, independent client bookings, and quotation line items.
  - Multi-face designation is structured through `face_number` (e.g. 1, 2) and `face_label` (e.g. 'Face A', 'Face B', 'North-Facing').

### 2. Dimensional Data Integrity & Dynamic Area
- Dimensions are stored as `width`, `height`, and `dimension_unit` (`FEET`, `METERS`, `INCHES`).
- `area` is **never** stored as an independently editable database column. It is dynamically computed as `width * height` in the model accessor (`getAreaAttribute`) and API resource output.
- Eliminates calculation discrepancies and data drift.

### 3. Resource Types & Categories
- Extensible PHP backed enum: `ResourceType` (`HOARDING`, `BILLBOARD`, `UNIPOLE`, `GANTRY`, `LED_SCREEN`, `DIGITAL_SCREEN`, `BUS_SHELTER`, `POLE_AD`, `WALL_MOUNT`, `ROOFTOP`, `BRIDGE_PANEL`, `OTHER`).
- Stored as `VARCHAR(50)` in MariaDB/MySQL rather than a restrictive database ENUM.
- High-level technical/commercial categorization: `category` (`STATIC` or `DIGITAL`).
- Digital attributes (`resolution`, `pixel_pitch`, `slot_duration_seconds`, `daily_impressions_estimate`) are nullable and populate when `category = 'DIGITAL'`.

### 4. Subscription Quota Architecture & Dedicated Service
Resource capacity is isolated in `App\Services\Subscription\ResourceQuotaService`:
```
AdvertisingResourceService
          │
          ▼
ResourceQuotaService
          │
          ├── checks hasActiveSubscription($organization) (Missing subscription blocks creation)
          ├── resolves getResourceLimit($organization) (Plan max_resources or Enterprise unlimited)
          └── counts getActiveResourceCount($organization) (Only status = 'ACTIVE' resources)
```
- **Active Resources Quota Only**: Resources marked `UNDER_MAINTENANCE`, `INACTIVE`, or `UNDER_REVIEW` do not consume active capacity.
- **Reactivation Guard**: Changing a resource from a non-active state (`INACTIVE`, `UNDER_MAINTENANCE`, `UNDER_REVIEW`) to `ACTIVE` is validated against current active capacity. If the quota is full, reactivation is blocked with `422 Unprocessable Content`.
- **Subscription Absence Safety**: An organization without an active subscription cannot create any resources.

### 5. Location Deletion Safeguard
- A Location with associated Advertising Resources cannot be destroyed.
- Attempting to delete a location with resources triggers an immediate `422 Unprocessable Content` response in `LocationService::deleteLocation`, ensuring non-destructive inventory protection and future booking audit safety.

---

## Availability & Calendar Management Architecture (Stage 7)

### 1. Architectural Philosophy & Separation of Concerns
Stage 7 establishes the commercial scheduling and availability calculation engine for SODAARS:
- **Core Question Answered**: *"When is this particular advertising resource available for commercial booking, and what are its active conflicts or remaining digital slots?"*
- **Unified Engine**: Both Static exclusive blocks and Digital shared loop slots are calculated via the unified `resource_schedules` table and orchestrated through `AvailabilityService`.
- **Decoupled Contracts**: Full commercial entities (Customers, Enquiries, Quotations, and Bookings) remain decoupled in later stages. Stage 7 maintains loosely coupled string references (`reference_type` and `reference_id`) without premature foreign key constraints.

### 2. Unified Schedule Schema & Block Types
All inventory blocks (commercial bookings, maintenance downtimes, civic holds, internal blocks, and tentative holds) reside in `resource_schedules`:
- **`ScheduleBlockType`**:
  - `BOOKING`: Confirmed commercial client booking.
  - `MAINTENANCE`: Physical structural repair or digital technical downtime.
  - `CIVIC_HOLD`: Government, municipal, or election mandate.
  - `INTERNAL_BLOCK`: Provider's internal self-promotion or non-commercial hold.
  - `TENTATIVE_HOLD`: Temporary client reservation prior to formal contract confirmation.
- **`ScheduleStatus`**:
  - `CONFIRMED`: Active, firm reservation.
  - `TENTATIVE`: Conditional block subject to expiration (`hold_expires_at`).
  - `CANCELLED`: Released or revoked reservation (does not consume inventory).

### 3. Conflict Detection & Capacity Calculation
Two distinct mathematical models are applied based on resource category:
1. **Static Advertising Resources (`category = 'STATIC'`)**:
   - **Exclusive 1D Interval Overlap**: Any confirmed or active tentative block consumes the entire resource face for the date range `[start_date, end_date]`.
   - **Conflict Condition**: An overlap occurs if and only if `existing.start_date <= requested.end_date AND existing.end_date >= requested.start_date`.
   - Contiguous boundaries are permitted: A block ending on Oct 10 allows a new block starting on Oct 11.
2. **Digital Advertising Resources (`category = 'DIGITAL'`)**:
   - **Share-of-Voice (SOV) / Loop Slot Model**: Screens accommodate multiple concurrent advertisers in a rotating loop (e.g. 10 or 12 slots per loop).
   - **Bottleneck Capacity Math**: For every individual date $d \in [\text{start\_date}, \text{end\_date}]$, the system computes:
     $$\text{committed\_slots}(d) = \sum \text{slots\_count} \quad \text{for all active overlapping blocks on } d$$
     $$\text{available\_slots}(d) = \text{total\_slots} - \text{committed\_slots}(d)$$
   - The overall availability for the requested span is determined by the **minimum daily remaining capacity** (the bottleneck date):
     $$\text{remaining\_slots} = \min_{d} (\text{available\_slots}(d))$$
   - A request is available if and only if $\text{remaining\_slots} \ge \text{requested\_slots}$.

### 4. Self-Expiring Tentative Holds & Guardrails
- **Self-Expiring State Invariant**: A hold is active if and only if `status = 'TENTATIVE'` AND `hold_expires_at > now()`. If `hold_expires_at <= now()`, the hold is treated as automatically expired by database queries (`scopeActiveInventory`), ensuring real-time inventory release without mandatory background cron dependencies.
- **Configurable Durations**: Defaults to 72 hours (or provider settings: `settings.default_hold_duration_hours`), with client override capped at 30 days maximum (`720` hours).
- **Hold Lifecycle**:
  - `POST /resource-schedules/{uuid}/release`: Marks status as `CANCELLED` and records `released_at = now()`.
  - `POST /resource-schedules/{uuid}/extend`: Extends `hold_expires_at` up to 720 hours from original creation or current time.
  - `POST /resource-schedules/{uuid}/confirm`: Converts hold to `CONFIRMED` `BOOKING`. Safeguarded with an immediate re-validation of inventory availability to prevent race conditions or intervening overbookings.
- **Schedule Update Safeguard**: Any modification to inventory-affecting fields (`advertising_resource_id`, `start_date`, `end_date`, `slots_count`, `block_type`, `status`) triggers a complete re-check of availability excluding the record itself, preventing accidental conflict introduction.

### 5. Monthly Calendar Matrix
The calendar endpoint (`GET /api/v1/tenant/advertising-resources/{uuid}/calendar?month=YYYY-MM`) delivers a daily array representation of the target month:
- For each day: `date`, `day_of_week`, `is_available`, `total_slots`, `committed_slots`, `available_slots`, and detailed `blocks` summaries.
- Provides immediate visualization feeds for the provider portal calendar grid without redundant client-side calculations.

---

## Customers & Enquiries Management Architecture (Stage 8)

> [!NOTE]
> **Architectural Reclassification (Product Scope Re-Freeze)**:
> Stage 8 is fully implemented, verified (38 tests passed), and stable in the backend. However, under the refrozen SODAARS business model, it is classified as **dormant / optional back-office commercial tooling**. It does NOT drive the active product roadmap, and SODAARS will not extend it into downstream commercial modules (Quotations, Bookings, Invoices, Payments). The core product focus is **Provider SaaS + Public Provider Discovery Directory**.

### 1. Demand-Side Operational Flow
Stage 8 captures client demand and commercial requests:
```text
Customer (Advertiser, Agency, Brand, Govt)
   ↓
Enquiry (Campaign Request, RFQ, Budget, Dates)
   ↓
Enquiry Items (Itemized demands: Resource OR Location)
   ↓
Availability Engine (Stage 7 - conflict & capacity checks)
   ↓
[Optional] Tentative Hold (reference_type = 'ENQUIRY', reference_id = enquiry.id)
```

### 2. Tenant Integrity & Security Safeguards
- **Strict Relationship Validation**: `customer_id`, `advertising_resource_id`, and `location_id` are strictly validated to belong to the authenticated organization. Any attempt to cross-link entities belonging to another tenant is blocked with a `422 Unprocessable Content` response.
- **Client Organization ID Invariant**: Request payloads can never supply or override `organization_id`; it is stamped strictly by the backend runtime from `TenantContext`.
- **Blocked Customer Guard**: Customers marked with `status = 'BLOCKED'` preserve historical data accessibility (enquiries, audits), but are blocked from creating new commercial enquiries.

### 3. Enquiry Items Exclusive XOR Rule
An enquiry item captures either:
1. **Specific Resource Face Demand**: When `advertising_resource_id` is set, `location_id` must be null.
2. **General Location / Corridor Demand**: When `location_id` is set, `advertising_resource_id` must be null.
Populating both or neither is strictly rejected (`422 Unprocessable Content`), preventing inventory ambiguity.

### 4. Controlled State Machine & Automatic Hold Release
- **State Machine Transitions**:
  - `NEW` → `UNDER_REVIEW`, `CANCELLED`
  - `UNDER_REVIEW` → `QUOTED`, `LOST`, `CANCELLED`
  - `QUOTED` → `NEGOTIATING`, `CONVERTED`, `LOST`, `CANCELLED`
  - `NEGOTIATING` → `QUOTED`, `CONVERTED`, `LOST`, `CANCELLED`
  - `LOST` → `UNDER_REVIEW` (reopened inquiry)
  - `CONVERTED` and `CANCELLED` are terminal states in Stage 8.
- **Audited Automatic Hold Release**:
  - Transitioning an enquiry to `LOST` or `CANCELLED` automatically releases all active `TENTATIVE_HOLD` schedules referencing this enquiry (`reference_type = 'ENQUIRY'`, `reference_id = $enquiry->id`).
  - The schedule record is updated to `status = 'CANCELLED'`, `released_at = now()`, and its audit note is appended with `[AUTO-RELEASED: ENQUIRY_LOST]` or `[AUTO-RELEASED: ENQUIRY_CANCELLED]`.
  - **Non-Destructive Invariant**: `CONFIRMED` commercial bookings are **never** automatically released by an enquiry transition.

### 5. Role & Permission Boundaries
- `PROVIDER_OWNER`: Full control (`*`).
- `PROVIDER_MANAGER`: Full operational management of Customers and Enquiries, including hold placement and deletion.
- `PROVIDER_STAFF`: Authorized for operational sales actions (`customer.create`, `customer.update`, `enquiry.create`, `enquiry.update`), but strictly forbidden from deleting records (`customer.delete`, `enquiry.delete`) or placing inventory holds (`schedule.create`, `schedule.hold.manage`).

