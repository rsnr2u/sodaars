# 07 User Roles & Permissions Specification
**Project**: SODAARS  
**Document**: RBAC Model & Tenant Security Scoping  
**Status**: Source of Truth  
**Version**: 1.0.0

---

## 1. Persona Taxonomy

SODAARS enforces Role-Based Access Control (RBAC) across three distinct organizational domains:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SODAARS RBAC TAXONOMY                           │
├─────────────────────┬──────────────────────────┬───────────────────────┤
│ Domain              │ Role Identifier          │ Primary Scope         │
├─────────────────────┼──────────────────────────┼───────────────────────┤
│ Marketplace         │ `buyer_guest`            │ Unauthenticated       │
│                     │ `buyer_registered`       │ Media Buyer Account   │
├─────────────────────┼──────────────────────────┼───────────────────────┤
│ Provider            │ `provider_owner`         │ Full Tenant Authority │
│ (Scoped to Tenant)  │ `provider_manager`       │ Operations & Field Ops│
│                     │ `provider_viewer`        │ Read-Only Internal    │
├─────────────────────┼──────────────────────────┼───────────────────────┤
│ Platform Admin      │ `admin_super`            │ Full System Control   │
│                     │ `admin_operations`       │ Network Ops & Reviews │
│                     │ `admin_support`          │ Read-Only & Inquiries │
└─────────────────────┴──────────────────────────┴───────────────────────┘
```

---

## 2. Multi-Tenant Isolation Architecture

For all authenticated Provider roles, access is constrained by the `organization_id` anchor. Every database transaction and Eloquent query must enforce:

```php
// Enforced via Global Scope / Tenant Middleware
$query->where('organization_id', Auth::user()->organization_id);
```

Platform Admins do not possess an `organization_id` and evaluate global platform tables. All administrative interventions (e.g., placing an Admin Block or adjusting markup) require mandatory audit logging.

---

## 3. Comprehensive Permission Matrix

| Module & Functional Capability | Guest Buyer | Registered Buyer | Provider Viewer | Provider Manager | Provider Owner | Admin Ops | Admin Super |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Marketplace** | | | | | | | |
| Browse & Search Public Catalog | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Customer / SODAARS Pricing | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Submit Booking Request | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Own Buyer Booking Status | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Provider Operations** | | | | | | | |
| View Advertising Resources | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ [Global]| ✅ [Global]|
| Create / Edit Resources | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| Toggle Marketplace Participation | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| View Availability Calendar | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ [Global]| ✅ [Global]|
| Place / Clear Provider Block | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Place / Clear Admin Block | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Manage Bookings (Accept/Decline) | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ [Assist]| ✅ |
| Upload Campaign Photo Proofs | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Approve Campaign Proofs | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ [Audit] | ✅ |
| **Provider Customers & Reports**| | | | | | | |
| View Customer CRM Records | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ [Global]|
| Create / Edit Direct Customers | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Access Financial & Booking Reports| ❌ | ❌ | ❌ | ❌ | ✅ | ✅ [Global]| ✅ [Global]|
| **Provider Organization** | | | | | | | |
| Manage Team Roster & Invites | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Manage Subscription & Invoices | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Sign / Review Marketplace Agmt | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ [Approve]| ✅ |
| Edit Organization Profile / GSTIN| ❌ | ❌ | ❌ | ❌ | ✅ | ✅ [Verify]| ✅ |
| **Platform Administration** | | | | | | | |
| Onboard / Verify New Providers | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Configure Global Markup Rules | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Override System Booking States | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
