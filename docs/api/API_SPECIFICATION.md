# SODAARS - API Specification Guidelines

## Base URL
All API routes are versioned:
`http://localhost:8000/api/v1`

## Standard Response Format

### Success Response (HTTP 200/201)
```json
{
  "success": true,
  "message": "Resource retrieved successfully.",
  "data": {
    "id": 1,
    "name": "Starter Plan"
  }
}
```

### Validation Error Response (HTTP 422)
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

### Authentication Error (HTTP 401)
```json
{
  "success": false,
  "message": "Unauthenticated."
}
```

### Authorization Error (HTTP 403)
```json
{
  "success": false,
  "message": "Access to this organization is unauthorized."
}
```

### Rate Limit Exceeded Error (HTTP 429)
```json
{
  "success": false,
  "message": "Too many login attempts. Please try again in 1 minute."
}
```

---

## Authentication Endpoints (`/api/v1/auth/*`)

### 1. Platform Admin Login
- **Endpoint**: `POST /api/v1/auth/admin/login`
- **Rate Limit**: 5 attempts per minute per IP + email (`throttle:login`)
- **Headers**: `Accept: application/json`, `Content-Type: application/json`
- **Request Body**:
```json
{
  "email": "superadmin@sodaars.com",
  "password": "Password123!"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Administrator authenticated successfully.",
  "data": {
    "token": "1|sanctum_plain_text_token_...",
    "token_type": "Bearer",
    "user": {
      "id": 1,
      "uuid": "0f6390ea-f24b-4b13-8ae8-...",
      "name": "SODAARS Super Admin",
      "email": "superadmin@sodaars.com",
      "platform_role": "SUPER_ADMIN",
      "status": "ACTIVE"
    },
    "platform_role": "SUPER_ADMIN"
  }
}
```
- **Error (403 Forbidden)**: Returned if user is not a platform administrator (e.g., provider user attempting admin login) or account is suspended.

---

### 2. Provider Login
- **Endpoint**: `POST /api/v1/auth/provider/login`
- **Rate Limit**: 5 attempts per minute per IP + email (`throttle:login`)
- **Request Body**:
```json
{
  "email": "owner@primeads.com",
  "password": "ValidPassword123!",
  "organization_id": 1 // Optional: specify target org if user belongs to multiple
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Provider authenticated successfully.",
  "data": {
    "token": "2|sanctum_plain_text_token_...",
    "token_type": "Bearer",
    "user": {
      "id": 2,
      "uuid": "3a70cb65-d6ee-48c7-...",
      "name": "Rajesh Kumar",
      "email": "owner@primeads.com",
      "status": "ACTIVE"
    },
    "organization": {
      "id": 1,
      "uuid": "20be774e-b530-4e31-...",
      "name": "Prime Outdoor Ads",
      "slug": "prime-outdoor-ads",
      "status": "ACTIVE"
    },
    "provider_role": "PROVIDER_OWNER"
  }
}
```
- **Error (403 Forbidden)**: Returned if provider account or target organization is suspended/inactive.

---

### 3. Provider Self-Registration
- **Endpoint**: `POST /api/v1/auth/provider/register`
- **Rate Limit**: 5 attempts per minute per IP (`throttle:register`)
- **Request Body**:
```json
{
  "company_name": "Vertex Outdoor Advertising",
  "contact_name": "Kiran Varma",
  "email": "kiran@vertexads.com",
  "phone": "+919876543222",
  "password": "SecretPassword123!",
  "password_confirmation": "SecretPassword123!",
  "terms": true,
  "subscription_plan_id": 1 // Optional, defaults to Starter plan
}
```
- **Success Response (201 Created)**:
Atomically provisions Organization (`registration_source = 'SELF'`), Owner User, OrganizationUser (`role = 'PROVIDER_OWNER'`), and active Subscription.
```json
{
  "success": true,
  "message": "Provider registered successfully.",
  "data": {
    "token": "3|sanctum_plain_text_token_...",
    "token_type": "Bearer",
    "user": { ... },
    "organization": { ... },
    "provider_role": "PROVIDER_OWNER"
  }
}
```

---

### 4. Current Authenticated User (`/auth/me`)
- **Endpoint**: `GET /api/v1/auth/me`
- **Security**: Requires `Authorization: Bearer <token>`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Authenticated user profile retrieved successfully.",
  "data": {
    "user": {
      "id": 2,
      "uuid": "3a70cb65-d6ee-48c7-...",
      "name": "Arun Verma",
      "email": "arun@apex.com",
      "phone": "+919876543210",
      "status": "ACTIVE"
    },
    "platform_role": null,
    "is_platform_user": false,
    "memberships": [
      {
        "id": 1,
        "organization_id": 1,
        "role": "PROVIDER_OWNER",
        "status": "ACTIVE",
        "is_default": true
      }
    ],
    "current_organization": {
      "id": 1,
      "name": "Apex Outdoors",
      "slug": "apex-outdoors"
    },
    "provider_role": "PROVIDER_OWNER",
    "status": "ACTIVE",
    "email_verified": true
  }
}
```

---

### 5. Logout
- **Endpoint**: `POST /api/v1/auth/logout`
- **Security**: Requires `Authorization: Bearer <token>`
- **Action**: Revokes the specific Sanctum token used for the request.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Successfully logged out.",
  "data": null
}
```

---

### 6. Email Verification
- **Resend Notification**: `POST /api/v1/auth/email/verification-notification` (Requires `Authorization: Bearer <token>`)
- **Verify Link**: `GET /api/v1/auth/email/verify/{id}/{hash}` (Signed URL)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Email verified successfully.",
  "data": null
}
```

---

### 7. Password Reset Flow
1. **Request Reset Link**:
   - `POST /api/v1/auth/password/forgot`
   - **Rate Limit**: 3 attempts per minute per IP + email (`throttle:password-reset`)
   - **Request**: `{ "email": "user@example.com" }`
   - **Response**: `{ "success": true, "message": "Password reset link has been sent to your email." }`
2. **Execute Password Reset**:
   - `POST /api/v1/auth/password/reset`
   - **Rate Limit**: 3 attempts per minute (`throttle:password-reset`)
   - **Request**:
     ```json
     {
       "token": "reset_token_from_email",
       "email": "user@example.com",
       "password": "NewPassword123!",
       "password_confirmation": "NewPassword123!"
     }
     ```
   - **Response (200 OK)**: `{ "success": true, "message": "Password has been reset successfully." }`

---

## Staff Invitations & Acceptance Flow

### 1. Accept Staff Invitation
- **Endpoint**: `POST /api/v1/auth/invitations/accept`
- **Request Body**:
```json
{
  "token": "cryptographic_plain_token_from_email_link",
  "name": "Arun Staff", // Optional if existing user
  "phone": "+919876543210", // Optional
  "password": "SecurePassword123!" // Required for new users
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Invitation accepted successfully. You are now a member of Metro Hoardings Pvt Ltd.",
  "data": {
    "token": "4|sanctum_token_...",
    "token_type": "Bearer",
    "user": { ... },
    "organization": { ... },
    "provider_role": "PROVIDER_STAFF"
  }
}
```
- **Error Responses**:
  - `400 Bad Request`: Token expired, already accepted, or revoked.
  - `404 Not Found`: Invalid invitation token.
  - `409 Conflict`: User is already an active member of the target organization.

---

## Tenant Staff & Invitation Endpoints (`/api/v1/tenant/*`)

Requires header: `Authorization: Bearer <token>` and optional `X-Organization-Id`.

### 1. List Staff Invitations
- **Endpoint**: `GET /api/v1/tenant/invitations`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Staff invitations retrieved successfully.",
  "data": [
    {
      "id": 1,
      "uuid": "6fa87d3a-1a0e-450f-90e8-...",
      "organization_id": 1,
      "email": "candidate@example.com",
      "name": "Sunil Sharma",
      "phone": "+919876500000",
      "role": "PROVIDER_STAFF",
      "status": "PENDING",
      "expires_at": "2026-09-22T12:00:00.000000Z",
      "created_at": "2026-09-15T12:00:00.000000Z"
    }
  ]
}
```

### 2. Create and Send Staff Invitation
- **Endpoint**: `POST /api/v1/tenant/invitations`
- **Authorized Roles**: `PROVIDER_OWNER` (can invite Manager/Staff), `PROVIDER_MANAGER` (can invite Staff only).
- **Request Body**:
```json
{
  "name": "Sunil Sharma",
  "email": "candidate@example.com",
  "phone": "+919876500000",
  "role": "PROVIDER_STAFF" // "PROVIDER_MANAGER" or "PROVIDER_STAFF"
}
```
- **Success Response (201 Created)**: Returns invitation resource (token_hash is never exposed).

### 3. Revoke Staff Invitation
- **Endpoint**: `DELETE /api/v1/tenant/invitations/{uuid}`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER` (cannot revoke invitations above their authority).
- **Success Response (200 OK)**: `{ "success": true, "message": "Staff invitation revoked successfully." }`

### 4. Update Member Role
- **Endpoint**: `PUT /api/v1/tenant/users/{id}/role`
- **Authorized Roles**: `PROVIDER_OWNER` (can change Manager/Staff roles), `PROVIDER_MANAGER` (can manage Staff roles only).
- **Restrictions**: Cannot downgrade or remove the sole/last active `PROVIDER_OWNER`.
- **Request Body**:
```json
{
  "role": "PROVIDER_MANAGER"
}
```
- **Success Response (200 OK)**: Returns updated `OrganizationUserResource`.

### 5. Remove Organization Member
- **Endpoint**: `DELETE /api/v1/tenant/users/{id}`
- **Authorized Roles**: `PROVIDER_OWNER` (removes Manager/Staff), `PROVIDER_MANAGER` (removes Staff only).
- **Restrictions**: Cannot delete the last active `PROVIDER_OWNER`.
- **Success Response (200 OK)**: `{ "success": true, "message": "User removed from organization successfully." }`

### 6. Update Organization Settings & Branding
- **Endpoint**: `PUT /api/v1/tenant/organization/settings`
- **Authorized Roles**: `PROVIDER_OWNER`
- **Request Body**:
```json
{
  "name": "Metro Hoardings Pvt Ltd",
  "contact_person": "Rajesh Sharma",
  "website": "https://metrohoardings.com",
  "business_description": "Premier digital and static outdoor billboard provider.",
  "gstin": "29ABCDE1234F1Z5",
  "pan": "ABCDE1234F",
  "district": "Central Bangalore",
  "logo_url": "https://cdn.sodaars.com/logos/metro.png",
  "settings": {
    "branding": {
      "primary_color": "#0F172A",
      "secondary_color": "#38BDF8",
      "accent_color": "#F59E0B",
      "favicon_url": "https://cdn.sodaars.com/logos/favicon.ico"
    },
    "working_hours": {
      "monday": "09:00 - 18:00"
    },
    "social_links": {
      "linkedin": "https://linkedin.com/company/metro-hoardings"
    }
  }
}
```
- **Success Response (200 OK)**: Returns updated `OrganizationResource`.

---

## Admin Provider Lifecycle Endpoints (`/api/v1/admin/*`)

Requires header: `Authorization: Bearer <token>` with Platform Admin permissions.

### 1. Suspend Organization
- **Endpoint**: `POST /api/v1/admin/organizations/{uuid}/suspend`
- **Effect**: Updates organization status to `SUSPENDED`. Blocks all provider user logins and rejects all tenant requests with 403 Forbidden.
- **Success Response (200 OK)**: `{ "success": true, "message": "Organization suspended successfully.", "data": { ... } }`

### 2. Activate Organization
- **Endpoint**: `POST /api/v1/admin/organizations/{uuid}/activate`
- **Effect**: Updates organization status to `ACTIVE`. Allows provider users to authenticate and access tenant workspace again.
- **Success Response (200 OK)**: `{ "success": true, "message": "Organization activated successfully.", "data": { ... } }`

### 3. Verify Organization
- **Endpoint**: `POST /api/v1/admin/organizations/{uuid}/verify`
- **Request Body**:
```json
{
  "verification_status": "VERIFIED", // "PENDING", "VERIFIED", or "REJECTED"
  "notes": "Verified against GST portal."
}
```
- **Success Response (200 OK)**: Sets `verification_status` and `verified_at` timestamp.

---

## Location Management Endpoints (`/api/v1/tenant/locations`)

Requires header: `Authorization: Bearer <token>`. Tenant context is automatically resolved.

### 1. List Locations
- **Endpoint**: `GET /api/v1/tenant/locations`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`, `PROVIDER_STAFF` (`location.view`)
- **Query Parameters**:
  - `page` (int, default: 1)
  - `per_page` (int, default: 15, max: 100)
  - `search` (string, searches across name, code, city, area, locality, landmark)
  - `status` (string: `ACTIVE`, `INACTIVE`, `UNDER_REVIEW`)
  - `city` (string)
  - `district` (string)
  - `state` (string)
  - `sort_by` (string: `name`, `code`, `city`, `state`, `status`, `created_at`, default: `created_at`)
  - `sort_dir` (string: `asc` or `desc`, default: `desc`)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Locations retrieved successfully.",
  "data": {
    "items": [
      {
        "id": 1,
        "uuid": "7a356073-ea11-4770-b19b-c4918e9bb32d",
        "organization_id": 1,
        "name": "Koramangala Sony Signal Unipole",
        "code": "LOC-KOR-001",
        "address": "80 Feet Road, 4th Block, Koramangala",
        "area": "Koramangala",
        "locality": "4th Block",
        "city": "Bengaluru",
        "district": "Bengaluru Urban",
        "state": "Karnataka",
        "pincode": "560034",
        "country": "India",
        "landmark": "Near Sony World Junction",
        "latitude": 12.9352000,
        "longitude": 77.6245000,
        "description": "High-traffic intersection unipole with double-sided view.",
        "status": "ACTIVE",
        "notes": null,
        "created_by": {
          "id": 2,
          "name": "Arun Owner",
          "email": "owner@apex.com"
        },
        "media": [],
        "created_at": "2026-09-15T18:00:00.000000Z",
        "updated_at": "2026-09-15T18:00:00.000000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "per_page": 15,
      "current_page": 1,
      "last_page": 1
    }
  }
}
```

### 2. Create Location
- **Endpoint**: `POST /api/v1/tenant/locations`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER` (`location.create`)
- **Request Body**:
```json
{
  "name": "Indiranagar 100ft Road Billboard",
  "code": "LOC-IND-001", // Unique within organization
  "address": "100 Feet Rd, HAL 2nd Stage",
  "area": "Indiranagar",
  "locality": "HAL 2nd Stage",
  "city": "Bengaluru",
  "district": "Bengaluru Urban",
  "state": "Karnataka",
  "pincode": "560038",
  "country": "India",
  "landmark": "Opposite Toit Brewpub",
  "latitude": 12.9784000,
  "longitude": 77.6408000,
  "description": "Premium illuminated billboard targeting high-spending demographics.",
  "status": "ACTIVE",
  "notes": "Contract renewed annually."
}
```
- **Validation**:
  - `name`: required, max 255
  - `code`: required, max 100, unique within tenant
  - `city`: required, max 150
  - `state`: required, max 150
  - `latitude`: numeric, between -90 and 90
  - `longitude`: numeric, between -180 and 180
  - `status`: valid LocationStatus enum (`ACTIVE`, `INACTIVE`, `UNDER_REVIEW`)
- **Success Response (201 Created)**: Returns created `LocationResource`.

### 3. Get Location Details
- **Endpoint**: `GET /api/v1/tenant/locations/{uuid}`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`, `PROVIDER_STAFF` (`location.view`)
- **Success Response (200 OK)**: Returns complete `LocationResource` with `created_by` and `media`.

### 4. Update Location
- **Endpoint**: `PUT /api/v1/tenant/locations/{uuid}`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER` (`location.update`)
- **Request Body**: Accepts any mutable fields from the creation payload.
- **Success Response (200 OK)**: Returns updated `LocationResource`.

### 5. Soft-Delete Location
- **Endpoint**: `DELETE /api/v1/tenant/locations/{uuid}`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER` (`location.delete`)
- **Safeguard**: Cannot delete a Location if advertising resources are attached to it. Returns `422 Unprocessable Content`.
- **Success Response (200 OK)**: `{ "success": true, "message": "Location deleted successfully.", "data": null }`

---

## Provider Advertising Resources API (Stage 6)

Base URL: `/api/v1/tenant/advertising-resources`
Authentication: Bearer Token (`auth:sanctum`), Header: `X-Tenant-ID: {org_uuid}`

### 1. List Advertising Resources
- **Endpoint**: `GET /api/v1/tenant/advertising-resources`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`, `PROVIDER_STAFF` (`resource.view`)
- **Query Parameters**:
  - `search` (string): Searches across `name`, `code`, `direction`, `traffic_flow`, and hosted `location` name/city/code.
  - `location_uuid` (string): Filter by physical location UUID.
  - `location_id` (int): Filter by physical location ID.
  - `category` (string): `STATIC` or `DIGITAL`.
  - `resource_type` (string): `HOARDING`, `BILLBOARD`, `UNIPOLE`, `GANTRY`, `LED_SCREEN`, `DIGITAL_SCREEN`, etc.
  - `status` (string): `ACTIVE`, `INACTIVE`, `UNDER_MAINTENANCE`, `UNDER_REVIEW`.
  - `illumination_type` (string): `FRONT_LIT`, `BACK_LIT`, `NON_LIT`, `DIGITAL_LED`, `SOLAR_LIT`, `OTHER`.
  - `sort_by` (string): `name`, `code`, `base_price_monthly`, `created_at`, `status`, `face_number`.
  - `sort_order` (string): `asc` or `desc`.
  - `per_page` (int): 1-100 (default 15).
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Advertising resources retrieved successfully.",
  "data": {
    "items": [
      {
        "id": 1,
        "uuid": "4f1837b2-c7f4-436f-b258-39dc851d911b",
        "organization_id": 1,
        "location_id": 1,
        "name": "Mangalagiri South Face A",
        "code": "LOC-001-A",
        "resource_type": "UNIPOLE",
        "category": "STATIC",
        "face_number": 1,
        "face_label": "Face A",
        "direction": "Towards Vijayawada",
        "traffic_flow": "High speed arterial highway traffic",
        "width": 40.0,
        "height": 20.0,
        "dimension_unit": "FEET",
        "area": 800.0,
        "illumination_type": "FRONT_LIT",
        "operating_hours_from": null,
        "operating_hours_to": null,
        "resolution": null,
        "pixel_pitch": null,
        "slot_duration_seconds": null,
        "daily_impressions_estimate": null,
        "base_price_monthly": 85000.0,
        "currency": "INR",
        "status": "ACTIVE",
        "description": "Prominent high-visibility unipole on NH-16.",
        "installation_details": null,
        "notes": null,
        "location": {
          "id": 1,
          "uuid": "20be774e-b530-4e31-...",
          "name": "NH-16 Mangalagiri Junction",
          "code": "LOC-NH16-001",
          "city": "Vijayawada",
          "state": "Andhra Pradesh",
          "latitude": 16.4352,
          "longitude": 80.5621
        },
        "created_by": { "id": 1, "name": "Rajesh Kumar" },
        "media": [],
        "created_at": "2026-09-16T08:00:00.000000Z",
        "updated_at": "2026-09-16T08:00:00.000000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "per_page": 15,
      "current_page": 1,
      "last_page": 1
    }
  }
}
```

### 2. Create Advertising Resource
- **Endpoint**: `POST /api/v1/tenant/advertising-resources`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER` (`resource.create`)
- **Quota Enforced**: Handled by `ResourceQuotaService`. Blocked with `422` if organization has no active subscription or if active resource quota limit is reached.
- **Request Body**:
```json
{
  "location_uuid": "20be774e-b530-4e31-...",
  "name": "Mangalagiri South Face A",
  "code": "LOC-001-A",
  "resource_type": "UNIPOLE",
  "category": "STATIC",
  "face_number": 1,
  "face_label": "Face A",
  "direction": "Towards Vijayawada",
  "traffic_flow": "High speed arterial highway traffic",
  "width": 40.0,
  "height": 20.0,
  "dimension_unit": "FEET",
  "illumination_type": "FRONT_LIT",
  "base_price_monthly": 85000.00,
  "currency": "INR",
  "status": "ACTIVE",
  "description": "Prominent high-visibility unipole on NH-16."
}
```
- **Success Response (201 Created)**: Returns created `AdvertisingResourceResource`.
- **Quota Exceeded Error (422 Unprocessable Content)**:
```json
{
  "message": "Active resource quota reached for your subscription plan (limit: 50). Please upgrade your subscription to add more active resources.",
  "errors": {
    "quota": [
      "Active resource quota reached for your subscription plan (limit: 50). Please upgrade your subscription to add more active resources."
    ]
  }
}
```

### 3. Get Advertising Resource Details
- **Endpoint**: `GET /api/v1/tenant/advertising-resources/{uuid}`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`, `PROVIDER_STAFF` (`resource.view`)
- **Success Response (200 OK)**: Returns full `AdvertisingResourceResource` including location details and attached media.

### 4. Update Advertising Resource
- **Endpoint**: `PUT /api/v1/tenant/advertising-resources/{uuid}`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER` (`resource.update`)
- **Reactivation Quota Protected**: Transitioning a resource from `INACTIVE`/`UNDER_MAINTENANCE` to `ACTIVE` verifies quota. If full, returns `422 Unprocessable Content`.
- **Success Response (200 OK)**: Returns updated `AdvertisingResourceResource`.

### 5. Soft-Delete Advertising Resource
- **Endpoint**: `DELETE /api/v1/tenant/advertising-resources/{uuid}`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER` (`resource.delete`)
- **Success Response (200 OK)**: `{ "success": true, "message": "Advertising resource deleted successfully.", "data": null }`

---

## Availability & Calendar Management Engine API (Stage 7)

Base URL: `/api/v1/tenant`
Authentication: Bearer Token (`auth:sanctum`), Header: `X-Tenant-ID: {org_uuid}`

### 1. Check Availability
- **Endpoint**: `POST /api/v1/tenant/availability/check`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`, `PROVIDER_STAFF` (`availability.view`)
- **Request Body**:
```json
{
  "resource_uuid": "4f1837b2-c7f4-436f-b258-39dc851d911b",
  "start_date": "2026-10-01",
  "end_date": "2026-10-15",
  "slots_count": 1 // Required for digital (SOV capacity); default 1
}
```
- **Success Response (Static Available - 200 OK)**:
```json
{
  "success": true,
  "message": "Availability checked successfully.",
  "data": {
    "is_available": true,
    "resource_category": "STATIC",
    "total_slots": 1,
    "available_slots": 1,
    "requested_slots": 1,
    "conflicts": []
  }
}
```
- **Success Response (Static Conflicted - 200 OK)**:
```json
{
  "success": true,
  "message": "Availability checked successfully.",
  "data": {
    "is_available": false,
    "resource_category": "STATIC",
    "total_slots": 1,
    "available_slots": 0,
    "requested_slots": 1,
    "conflicts": [
      {
        "uuid": "7a83bc12-...",
        "title": "Diwali Brand Campaign",
        "block_type": "BOOKING",
        "status": "CONFIRMED",
        "start_date": "2026-10-01",
        "end_date": "2026-10-15"
      }
    ]
  }
}
```

### 2. Get Monthly Calendar Matrix
- **Endpoint**: `GET /api/v1/tenant/advertising-resources/{uuid}/calendar?year=2026&month=10`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`, `PROVIDER_STAFF` (`availability.view`)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Monthly calendar retrieved successfully.",
  "data": {
    "year": 2026,
    "month": 10,
    "resource": {
      "id": 1,
      "uuid": "4f1837b2-c7f4-436f-b258-39dc851d911b",
      "name": "NH-16 South Face A",
      "code": "UNI-NH16-A",
      "category": "STATIC",
      "total_slots": 1
    },
    "days": [
      {
        "date": "2026-10-01",
        "day": 1,
        "status": "BOOKING",
        "total_slots": 1,
        "booked_slots": 1,
        "available_slots": 0,
        "schedules": [
          {
            "uuid": "7a83bc12-...",
            "title": "Diwali Brand Campaign",
            "block_type": "BOOKING",
            "status": "CONFIRMED",
            "slots_count": 1,
            "hold_expires_at": null
          }
        ]
      },
      {
        "date": "2026-10-16",
        "day": 16,
        "status": "AVAILABLE",
        "total_slots": 1,
        "booked_slots": 0,
        "available_slots": 1,
        "schedules": []
      }
    ]
  }
}
```

### 3. List Schedules
- **Endpoint**: `GET /api/v1/tenant/resource-schedules`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`, `PROVIDER_STAFF` (`availability.view`)
- **Query Filters**: `resource_uuid`, `block_type`, `status`, `start_date`, `end_date`, `search`.

### 4. Create Schedule Block / Reservation
- **Endpoint**: `POST /api/v1/tenant/resource-schedules`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER` (`availability.update`)
- **Conflict Guard**: Performs fresh availability check. If unavailable, returns `422 Unprocessable Content`.
- **Request Body**:
```json
{
  "advertising_resource_uuid": "4f1837b2-c7f4-436f-b258-39dc851d911b",
  "title": "Quotation Hold for BigBrand",
  "block_type": "TENTATIVE_HOLD", // BOOKING, MAINTENANCE, CIVIC_HOLD, INTERNAL_BLOCK, TENTATIVE_HOLD
  "start_date": "2026-11-01",
  "end_date": "2026-11-15",
  "slots_count": 1,
  "hold_expires_at": "2026-10-04T12:00:00Z" // Optional: defaults to provider setting (72h), max 30 days
}
```
- **Success Response (201 Created)**: Returns created `ResourceScheduleResource`.

### 5. Hold Lifecycle Actions
- **Release Hold / Block**: `POST /api/v1/tenant/resource-schedules/{uuid}/release`
  - Cancels the hold (`status = CANCELLED`).
- **Extend Hold**: `POST /api/v1/tenant/resource-schedules/{uuid}/extend`
  - Body: `{ "hold_expires_at": "2026-10-10T12:00:00Z" }` (max 30 days from creation).
- **Confirm Hold into Booking**: `POST /api/v1/tenant/resource-schedules/{uuid}/confirm`
  - Safeguarded: Performs fresh availability check before conversion. Converts `TENTATIVE_HOLD` into `CONFIRMED` `BOOKING`.

---

## Customers Management API (Stage 8)

Base URL: `/api/v1/tenant/customers`
Authentication: Bearer Token (`auth:sanctum`), Header: `X-Tenant-ID: {org_uuid}`

### 1. List Customers
- **Endpoint**: `GET /api/v1/tenant/customers`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`, `PROVIDER_STAFF` (`customer.view`)
- **Query Parameters**:
  - `search` (string): Searches across `company_name`, `brand_name`, `contact_person`, `code`, `phone`, `email`.
  - `status` (string): `ACTIVE`, `INACTIVE`, `BLOCKED`.
  - `customer_type` (string): `DIRECT_ADVERTISER`, `AGENCY`, `BRAND`, `INDIVIDUAL`, `GOVERNMENT`.
  - `city` (string), `state` (string).
  - `sort_by` (string): `company_name`, `code`, `created_at`, `status` (default: `created_at`).
  - `sort_order` (string): `asc` or `desc` (default: `desc`).
  - `per_page` (int): 1-100 (default 15).
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Customers retrieved successfully.",
  "data": {
    "items": [
      {
        "id": 1,
        "uuid": "7a356073-ea11-4770-b19b-c4918e9bb32d",
        "organization_id": 1,
        "code": "CUST-0001",
        "customer_type": "DIRECT_ADVERTISER",
        "company_name": "Tata Motors Ltd",
        "brand_name": null,
        "contact_person": "Rajesh Sharma",
        "email": "rajesh.sharma@tatamotors.test",
        "phone": "+91 98765 43210",
        "alternate_phone": null,
        "website": null,
        "billing_address": null,
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": null,
        "country": "India",
        "gstin": null,
        "pan_number": null,
        "credit_period_days": 45,
        "status": "ACTIVE",
        "notes": null,
        "created_by": { "id": 1, "name": "Arun Owner" },
        "created_at": "2026-09-16T08:00:00.000000Z",
        "updated_at": "2026-09-16T08:00:00.000000Z"
      }
    ],
    "pagination": { "total": 1, "per_page": 15, "current_page": 1, "last_page": 1 }
  }
}
```

### 2. Create Customer
- **Endpoint**: `POST /api/v1/tenant/customers`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`, `PROVIDER_STAFF` (`customer.create`)
- **Request Body**:
```json
{
  "code": "CUST-0001", // Optional: auto-generated sequentially if omitted
  "customer_type": "DIRECT_ADVERTISER", // DIRECT_ADVERTISER, AGENCY, BRAND, INDIVIDUAL, GOVERNMENT
  "company_name": "Tata Motors Ltd",
  "brand_name": "Tata EV",
  "contact_person": "Rajesh Sharma",
  "email": "rajesh.sharma@tatamotors.test",
  "phone": "+91 98765 43210",
  "city": "Mumbai",
  "state": "Maharashtra",
  "credit_period_days": 45,
  "status": "ACTIVE"
}
```
- **Success Response (201 Created)**: Returns created `CustomerResource`.

### 3. Get Customer Details
- **Endpoint**: `GET /api/v1/tenant/customers/{uuid}`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`, `PROVIDER_STAFF` (`customer.view`)
- **Success Response (200 OK)**: Returns full `CustomerResource` with `enquiries_count`.

### 4. Update Customer
- **Endpoint**: `PUT /api/v1/tenant/customers/{uuid}`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`, `PROVIDER_STAFF` (`customer.update`)
- **Success Response (200 OK)**: Returns updated `CustomerResource`.

### 5. Soft-Delete Customer
- **Endpoint**: `DELETE /api/v1/tenant/customers/{uuid}`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER` (`customer.delete`)
- **Safeguard**: Blocked with `422 Unprocessable Content` if active enquiries exist.
- **Success Response (200 OK)**: `{ "success": true, "message": "Customer deleted successfully.", "data": null }`

---

## Enquiries Management API (Stage 8)

Base URL: `/api/v1/tenant/enquiries`
Authentication: Bearer Token (`auth:sanctum`), Header: `X-Tenant-ID: {org_uuid}`

### 1. List Enquiries
- **Endpoint**: `GET /api/v1/tenant/enquiries`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`, `PROVIDER_STAFF` (`enquiry.view`)
- **Query Parameters**:
  - `search` (string): Searches across `enquiry_number`, `campaign_title`, and customer `company_name`/`contact_person`.
  - `status` (string): `NEW`, `UNDER_REVIEW`, `QUOTED`, `NEGOTIATING`, `CONVERTED`, `LOST`, `CANCELLED`.
  - `priority` (string): `LOW`, `MEDIUM`, `HIGH`, `URGENT`.
  - `source` (string): `DIRECT_VISIT`, `PHONE`, `EMAIL`, `WEBSITE`, `AGENCY_RFQ`, `REFERRAL`, `OTHER`.
  - `customer_id` (int), `assigned_to_user_id` (int).
  - `start_date` (date), `end_date` (date).
  - `sort_by` (string), `sort_order` (string), `per_page` (int).

### 2. Create Enquiry
- **Endpoint**: `POST /api/v1/tenant/enquiries`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`, `PROVIDER_STAFF` (`enquiry.create`)
- **Safeguards**:
  - Customer cannot be `BLOCKED` (`422`).
  - Tenant integrity enforced: customer, resources, and locations must belong to the active tenant (`422`).
  - Item XOR rule enforced: each item must specify either `advertising_resource_id` OR `location_id` (`422`).
  - Does NOT create inventory holds by default.
- **Request Body**:
```json
{
  "customer_id": 1,
  "campaign_title": "Diwali Grand Fest 2026",
  "priority": "HIGH",
  "source": "DIRECT_VISIT",
  "start_date": "2026-11-01",
  "end_date": "2026-11-15",
  "estimated_budget": 300000.00,
  "items": [
    {
      "advertising_resource_id": 1,
      "proposed_rate": 140000.00,
      "notes": "Main road unipole"
    },
    {
      "location_id": 2,
      "notes": "Looking for any available bus shelter in this area"
    }
  ]
}
```
- **Success Response (201 Created)**: Returns created `EnquiryResource` with itemized relations.

### 3. Get Enquiry Details
- **Endpoint**: `GET /api/v1/tenant/enquiries/{uuid}`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`, `PROVIDER_STAFF` (`enquiry.view`)
- **Success Response (200 OK)**: Returns full `EnquiryResource` with customer, assigned staff, items, and active holds count.

### 4. Update Enquiry
- **Endpoint**: `PUT /api/v1/tenant/enquiries/{uuid}`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`, `PROVIDER_STAFF` (`enquiry.update`)
- **Success Response (200 OK)**: Returns updated `EnquiryResource`.

### 5. Soft-Delete Enquiry
- **Endpoint**: `DELETE /api/v1/tenant/enquiries/{uuid}`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER` (`enquiry.delete`)
- **Automatic Hold Release**: Auto-releases any active tentative holds referencing this enquiry with audit note `[AUTO-RELEASED: ENQUIRY_DELETED]`.

### 6. Transition Enquiry Status
- **Endpoint**: `POST /api/v1/tenant/enquiries/{uuid}/status`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`, `PROVIDER_STAFF` (`enquiry.update`)
- **State Machine Enforced**:
  - `NEW` → `UNDER_REVIEW`, `CANCELLED`
  - `UNDER_REVIEW` → `QUOTED`, `LOST`, `CANCELLED`
  - `QUOTED` → `NEGOTIATING`, `CONVERTED`, `LOST`, `CANCELLED`
  - `NEGOTIATING` → `QUOTED`, `CONVERTED`, `LOST`, `CANCELLED`
  - `LOST` → `UNDER_REVIEW` (reopened)
- **Automatic Hold Release**: When transitioned to `LOST` or `CANCELLED`, automatically releases all active `TENTATIVE_HOLD` schedules attached to this enquiry with audit note (`[AUTO-RELEASED: ENQUIRY_LOST]` or `[AUTO-RELEASED: ENQUIRY_CANCELLED]`). Never touches `CONFIRMED` bookings.
- **Request Body**:
```json
{
  "status": "LOST",
  "lost_reason": "Client selected competitor outdoor network"
}
```

### 7. Check Enquiry Availability
- **Endpoint**: `POST /api/v1/tenant/enquiries/{uuid}/check-availability`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`, `PROVIDER_STAFF` (`enquiry.view`)
- **Function**: Evaluates availability and conflict details for every resource face requested in the enquiry items using Stage 7's `AvailabilityService`.
- **Success Response (200 OK)**: Returns array of item availability states.

### 8. Place Hold for Enquiry Item
- **Endpoint**: `POST /api/v1/tenant/enquiries/{uuid}/items/{itemUuid}/hold`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER` (Staff forbidden with `403`)
- **Function**: Explicitly reserves inventory for an enquiry item face by creating a `TENTATIVE_HOLD` in `resource_schedules` with `reference_type = 'ENQUIRY'` and `reference_id = enquiry.id`.
- **Request Body**:
```json
{
  "hold_duration_hours": 48, // Default: 72 hours, max: 720 hours (30 days)
  "notes": "VIP client reservation"
}
```
- **Success Response (201 Created)**: Returns created `ResourceScheduleResource`.

---

## Stage 9: Media Asset Management Endpoints

### 1. Location Media Endpoints (`/api/v1/tenant/locations/{locationUuid}/media*`)

#### List Location Media
- **Endpoint**: `GET /api/v1/tenant/locations/{locationUuid}/media`
- **Query Parameters**: `media_type` (optional: `SITE_PHOTO`, `SURROUNDING_AREA`, `LANDMARK_VIEW`, `PLOT_MAP`, `OTHER`)
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`, `PROVIDER_STAFF` (`location.view` or `location.media.view`)
- **Ordering**: Primary image first, followed by `sort_order` ASC, `created_at` ASC.
- **Success Response (200 OK)**:
```json
{
  "data": [
    {
      "uuid": "7a35e751-2e6f-47dc-9f0e-b715694c92ab",
      "location_uuid": "c928420e-8fbf-4a39-8aa8-18e3c50974cf",
      "original_filename": "mg-road-junction.jpg",
      "media_type": "SITE_PHOTO",
      "mime_type": "image/jpeg",
      "file_size": 1245180,
      "width": 1920,
      "height": 1280,
      "alt_text": "High traffic view of MG Road junction",
      "caption": "Looking towards south intersection",
      "is_primary": true,
      "sort_order": 1,
      "file_url": "http://localhost:8000/storage/organizations/.../uuid.jpg",
      "thumbnail_url": "http://localhost:8000/storage/organizations/.../thumbnails/uuid_thumb.jpg",
      "created_at": "2026-09-16T11:45:00+05:30",
      "updated_at": "2026-09-16T11:45:00+05:30"
    }
  ]
}
```

#### Upload Location Photo
- **Endpoint**: `POST /api/v1/tenant/locations/{locationUuid}/media`
- **Content-Type**: `multipart/form-data`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`, `PROVIDER_STAFF` (`location.update` or `location.media.upload`)
- **Note**: `PROVIDER_STAFF` cannot set `is_primary = true`.
- **Form Fields**:
  - `file`: Required. Visual image file (JPG/JPEG, PNG, WebP). Max 15MB.
  - `media_type`: Optional string (`SITE_PHOTO`, `SURROUNDING_AREA`, `LANDMARK_VIEW`, `PLOT_MAP`, `OTHER`). Default: `SITE_PHOTO`.
  - `alt_text`: Optional string (max 255 chars).
  - `caption`: Optional string (max 500 chars).
  - `is_primary`: Optional boolean (Owner/Manager only). First uploaded photo defaults to `true`.
- **Success Response (201 Created)**: Returns created `LocationMediaResource`.

#### Update Location Media Metadata
- **Endpoint**: `PUT /api/v1/tenant/locations/{locationUuid}/media/{mediaUuid}`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`, `PROVIDER_STAFF`
- **Note**: `PROVIDER_STAFF` can update `alt_text`, `caption`, and `media_type`, but cannot modify `is_primary` or `sort_order` (returns `422`).
- **Request Body**:
```json
{
  "alt_text": "Updated arterial visibility description",
  "caption": "Night lighting inspection approved",
  "media_type": "SURROUNDING_AREA",
  "is_primary": true
}
```

#### Reorder Location Gallery
- **Endpoint**: `PUT /api/v1/tenant/locations/{locationUuid}/media/reorder`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER` (Staff returns `403`)
- **Request Body**:
```json
{
  "items": [
    { "uuid": "media-uuid-1", "sort_order": 1 },
    { "uuid": "media-uuid-2", "sort_order": 2 }
  ]
}
```

#### Delete Location Media (Soft Delete)
- **Endpoint**: `DELETE /api/v1/tenant/locations/{locationUuid}/media/{mediaUuid}`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER` (Staff returns `403`)
- **Function**: Soft deletes record. If deleted asset was primary, automatically promotes the next available photo in gallery order to `is_primary = true`.

---

### 2. Advertising Resource Media Endpoints (`/api/v1/tenant/advertising-resources/{resourceUuid}/media*`)

#### List Resource Media
- **Endpoint**: `GET /api/v1/tenant/advertising-resources/{resourceUuid}/media`
- **Query Parameters**: `media_type` (optional: `DAY_PHOTO`, `NIGHT_PHOTO`, `LONG_SHOT`, `CLOSE_UP`, `SCHEMATIC`, `OTHER`)
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`, `PROVIDER_STAFF` (`resource.view` or `resource.media.view`)

#### Upload Resource Photo
- **Endpoint**: `POST /api/v1/tenant/advertising-resources/{resourceUuid}/media`
- **Content-Type**: `multipart/form-data`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`, `PROVIDER_STAFF`
- **Form Fields**:
  - `file`: Required image file (JPG, PNG, WebP). Max 15MB.
  - `media_type`: Optional string (`DAY_PHOTO`, `NIGHT_PHOTO`, `LONG_SHOT`, `CLOSE_UP`, `SCHEMATIC`, `OTHER`). Default: `DAY_PHOTO`.
  - `alt_text`: Optional SEO alt text (max 255 chars).
  - `caption`: Optional caption (max 500 chars).
  - `is_primary`: Optional boolean (Owner/Manager only).
- **Success Response (201 Created)**: Returns created `AdvertisingResourceMediaResource`.

#### Update Resource Media Metadata
- **Endpoint**: `PUT /api/v1/tenant/advertising-resources/{resourceUuid}/media/{mediaUuid}`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`, `PROVIDER_STAFF` (Staff cannot alter primary/order)

#### Reorder Resource Gallery
- **Endpoint**: `PUT /api/v1/tenant/advertising-resources/{resourceUuid}/media/reorder`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`

#### Delete Resource Media (Soft Delete)
- **Endpoint**: `DELETE /api/v1/tenant/advertising-resources/{resourceUuid}/media/{mediaUuid}`
- **Authorized Roles**: `PROVIDER_OWNER`, `PROVIDER_MANAGER`



