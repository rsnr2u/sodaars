# 09 API Architecture Specification
**Project**: SODAARS  
**Document**: RESTful Web Services & Endpoint Specifications  
**Status**: Source of Truth  
**Version**: 1.0.0

---

## 1. REST Architectural Standards

The SODAARS backend exposes a strictly structured RESTful JSON API via Laravel 11.x. All requests and responses must communicate using standard JSON payloads (`Content-Type: application/json`, `Accept: application/json`).

### 1.1 Response Envelopes

#### Success Envelope (`200 OK`, `201 Created`):
```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2026-10-01T19:30:00Z",
    "version": "v1",
    "pagination": {
      "total": 120,
      "count": 15,
      "per_page": 15,
      "current_page": 1,
      "total_pages": 8
    }
  }
}
```

#### Error Envelope (`400`, `401`, `403`, `404`, `422`, `500`):
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_ALREADY_RESERVED",
    "message": "The selected advertising resource is already booked for the specified dates.",
    "details": {
      "conflicts": [
        { "start_date": "2026-11-01", "end_date": "2026-11-15", "status": "booked" }
      ]
    }
  }
}
```

---

## 2. API Namespace Partitioning

API endpoints are partitioned into three dedicated controller namespaces reflecting the three product surfaces:

```
/api/v1/marketplace/     # Public catalog, filters, availability inquiry, booking request
/api/v1/provider/        # Tenant-scoped operational endpoints (Topbar & Mega Menus)
/api/v1/admin/           # Platform oversight, verification, global markups, governance
```

---

## 3. Marketplace Endpoint Catalog (`/api/v1/marketplace`)

| Method | Endpoint | Auth | Purpose |
|---|---|:---:|---|
| `GET` | `/resources` | Public | Faceted search catalog (query: `city`, `type`, `dimensions`, `min_price`, `max_price`, `start_date`, `end_date`). |
| `GET` | `/resources/{slug}` | Public | Full public detail view for an individual static advertising asset. |
| `GET` | `/resources/{id}/availability` | Public | Calendar schedule showing available vs booked/held/blocked dates. |
| `POST` | `/booking-requests` | Public / Buyer | Submit an initial booking inquiry (transitions to `NEW` / `UNDER REVIEW`). |
| `GET` | `/booking-requests/{code}` | Buyer Token | Track the current lifecycle state of a submitted inquiry. |

---

## 4. Provider Platform Endpoint Catalog (`/api/v1/provider`)

All requests require HTTP Bearer Token (`provider_owner`, `provider_manager`, or `provider_viewer`). Tenant scoping is automatically injected.

### 4.1 Operations Endpoints
| Method | Endpoint | Permission | Purpose |
|---|---|---|---|
| `GET` | `/operations/resources` | Viewer+ | Paginated list of provider-owned static resources. |
| `POST` | `/operations/resources` | Manager+ | Create a new static advertising asset (attaches Location). |
| `PUT` | `/operations/resources/{id}` | Manager+ | Update resource specs, prices, or marketplace participation. |
| `GET` | `/operations/availability` | Viewer+ | Multi-resource calendar grid and timeline data. |
| `POST` | `/operations/availability/blocks` | Manager+ | Apply manual `provider_block` or `maintenance` schedule. |
| `DELETE`| `/operations/availability/blocks/{id}`| Manager+ | Lift a provider block. |
| `GET` | `/operations/bookings` | Viewer+ | Multi-source pipeline list (Marketplace, Provider, Admin). |
| `GET` | `/operations/bookings/{id}` | Viewer+ | Detailed booking ledger and financial calculation. |
| `POST` | `/operations/bookings/{id}/confirm` | Manager+ | Advance booking from `UNDER_REVIEW` to `PROVIDER_CONFIRMATION`. |
| `POST` | `/operations/bookings/{id}/decline` | Manager+ | Decline booking with operational reason. |
| `GET` | `/operations/campaigns` | Viewer+ | Field execution roster and mounting milestones. |
| `POST` | `/operations/campaigns/{id}/proofs`| Manager+ | Upload timestamped mounting photo proof. |

### 4.2 Customers Endpoints
| Method | Endpoint | Permission | Purpose |
|---|---|---|---|
| `GET` | `/customers` | Viewer+ | Provider CRM customer list with aggregate booking counts. |
| `POST` | `/customers` | Manager+ | Register direct agency, enterprise, or local business client. |
| `GET` | `/customers/{id}/activity` | Viewer+ | Chronological timeline of inquiries, contracts, and campaigns. |

### 4.3 Reports Endpoints
| Method | Endpoint | Permission | Purpose |
|---|---|---|---|
| `GET` | `/reports/operational` | Owner | Maintenance frequencies and field turnaround metrics. |
| `GET` | `/reports/resources` | Owner | Asset occupancy rates, dead inventory, and revenue per sqft. |
| `GET` | `/reports/bookings` | Owner | Direct vs marketplace split, conversion, and pipeline value. |
| `GET` | `/reports/campaigns` | Owner | Mounting compliance and proof turnaround statistics. |

### 4.4 Organization Endpoints
| Method | Endpoint | Permission | Purpose |
|---|---|---|---|
| `GET` | `/organization/profile` | Viewer+ | Legal corporate identity, GSTIN, and addresses. |
| `PUT` | `/organization/profile` | Owner | Update profile details. |
| `GET` | `/organization/team` | Owner | Roster of staff members, roles, and status. |
| `POST` | `/organization/team/invite` | Owner | Dispatch invitation token to new team member. |
| `GET` | `/organization/subscription` | Owner | Registered resource tally, current tier (1-50 vs 51-100), invoice history. |
| `GET` | `/organization/marketplace` | Owner | Summary of resources participating in Marketplace. |
| `GET` | `/organization/marketplace-agreement`| Owner | Review signed terms, net price formulas, and counter-approvals. |

---

## 5. Admin Platform Endpoint Catalog (`/api/v1/admin`)

Requires Platform Administrator tokens (`admin_super`, `admin_operations`). Operates globally across all tenants.

| Method | Endpoint | Permission | Purpose |
|---|---|---|---|
| `GET` | `/admin/providers` | Admin Ops | Global list of onboarding and active providers. |
| `POST` | `/admin/providers/{id}/verify` | Admin Ops | Verify KYC, GSTIN, and activate provider account. |
| `GET` | `/admin/resources` | Admin Ops | Global directory of static assets across all providers. |
| `POST` | `/admin/resources/{id}/admin-block`| Admin Ops | Place mandatory administrative freeze on an asset. |
| `GET` | `/admin/marketplace/agreements` | Admin Ops | Review pending marketplace participation agreements. |
| `PUT` | `/admin/marketplace/agreements/{id}`| Admin Super | Approve agreement and configure provider-specific markup rate. |
| `GET` | `/admin/bookings` | Admin Ops | Network-wide booking pipeline, dispute interventions, and overrides. |
| `GET` | `/admin/campaigns/proofs/audit` | Admin Ops | Quality audit desk for reviewing uploaded mounting photos. |
| `GET` | `/admin/settings/markups` | Admin Super | Configure global baseline marketplace markup policies. |
