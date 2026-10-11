# 22 Security Specification
**Project**: SODAARS  
**Document**: Data Protection, Tenant Isolation & Application Security Standards  
**Status**: Source of Truth  
**Version**: 1.0.0

---

## 1. Multi-Tenant Data Isolation

SODAARS enforces strict logical multi-tenancy. Every media asset owner operates in an isolated tenant boundary defined by their unique `organization_id`.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TENANT ISOLATION MODEL                          │
│                                                                        │
│   HTTP Request ──► [Tenant Middleware] ──► [Tenant Global Scope]       │
│                           │                           │                │
│                           ▼                           ▼                │
│                 Validates User Org ID       WHERE organization_id = :id│
└────────────────────────────────────────────────────────────────────────┘
```

1. **Eloquent Global Scopes**: Every tenant-owned model (`AdvertisingResource`, `Customer`, `Booking`, `Campaign`, `AvailabilitySchedule`) implements an automatic tenant scope appending `WHERE organization_id = Auth::user()->organization_id`.
2. **Controller-Level Assertion**: All modification mutations explicitly assert ownership:
   ```php
   abort_if($resource->organization_id !== $user->organization_id, 403, 'Unauthorized tenant access.');
   ```
3. **Cross-Tenant Leakage Prevention**: Customer CRM lists, client phone numbers, private contract rates, and operational notes can never be read across provider boundaries.

---

## 2. Authentication & Token Management

1. **Token Architecture**: Authenticated sessions in the Provider Panel and Admin Platform use **Laravel Sanctum** personal access tokens.
2. **Header Specification**: `Authorization: Bearer <sanctum_token>`.
3. **Token Expiration**: Access tokens expire after 24 hours of inactivity `[TBD: Session Lifetime]`.
4. **Credential Storage**: Passwords hashed using standard `Bcrypt` with a work factor $\ge 12$ or `Argon2id`.
5. **Account Lockout**: 5 consecutive failed login attempts trigger a 15-minute temporary lockout to mitigate brute-force attacks.

---

## 3. API Hardening & Traffic Governance

- **CORS Policies**: Restricted strictly to authorized origins:
  - Marketplace Next.js frontend domain
  - Provider React+Vite frontend domain
  - Admin React+Vite internal domain
- **Rate Limiting (Throttle Middleware)**:
  - Public Marketplace Search: 60 requests / minute / IP
  - Booking Request Submissions: 5 requests / hour / IP (Spam mitigation)
  - Provider & Admin Endpoints: 120 requests / minute / User Token
- **Mass Assignment Protection**: All Laravel Eloquent models enforce `$fillable` white-listing. System fields like `organization_id`, `status`, and `approved_by` are barred from direct request binding.

---

## 4. Media Upload Security

Media uploads (Resource hero photography and Campaign Mounting Proofs) are governed by strict controls:
1. **MIME-Type Whitelisting**: Restricted exclusively to `image/jpeg`, `image/png`, and `image/webp`. Executable files, SVGs, and archives are rejected.
2. **File Size Limits**: Max 10MB per image upload.
3. **Storage Sanitization**: Files are renamed with cryptographically random UUIDs (`e.g., /media/proofs/4f8b2c...jpg`) upon upload to prevent path traversal and metadata leaks.

---

## 5. Audit Logging Architecture

Every state-changing event across Bookings, Availability Blocks, Agreements, and Mounting Proofs is recorded in the immutable `audit_logs` table:
```json
{
  "user_id": 42,
  "organization_id": 3,
  "event": "booking.status_change",
  "auditable_type": "App\\Models\\Booking",
  "auditable_id": 1049,
  "old_values": { "status": "UNDER_REVIEW" },
  "new_values": { "status": "PROVIDER_CONFIRMATION" },
  "ip_address": "203.0.113.195",
  "timestamp": "2026-10-01T19:35:00Z"
}
```
Records are write-only and can never be modified or deleted via API endpoints.
