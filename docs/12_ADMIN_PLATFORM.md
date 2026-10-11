# 12 Admin Platform Specification
**Project**: SODAARS  
**Document**: Internal Administrative Control Tower  
**Status**: Source of Truth  
**Version**: 1.0.0

---

## 1. Administrative Platform Purpose

The **Admin Platform** is a secure, standalone internal application built with **React**, **Vite**, and **Tailwind CSS**. It serves as the operations and governance tower for the SODAARS internal team.

> [!CAUTION]
> - **DO NOT MIX ADMIN NAVIGATION WITH PROVIDER NAVIGATION**: The Admin platform has a completely independent layout, security scope, and navigation structure.
> - **DO NOT ASSUME ADMIN HAS THE SAME PERMISSIONS AS PROVIDER**: Admin personnel do not act as tenant users; they act as network auditors, marketplace curators, and dispute mediators.
> - Detailed visual screens for Admin will be designed separately based on these structural requirements.

---

## 2. Conceptual Operational Areas

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ADMIN FUNCTIONAL DOMAINS                        │
├───────────────────┬────────────────────────────────────────────────────┤
│ Domain            │ Primary Scope & Governance Tasks                   │
├───────────────────┼────────────────────────────────────────────────────┤
│ 1. Dashboard      │ Network-wide KPIs: active providers, gross GMV,    │
│                   │ pending approvals, marketplace inquiries.          │
│ 2. Providers      │ Provider onboarding, KYC verification, GSTIN check,│
│                   │ subscription compliance, and account status.       │
│ 3. Resources      │ Global asset registry, verification, quality audit,│
│                   │ and placement of mandatory Admin Blocks.           │
│ 4. Marketplace    │ Curation of public marketplace listings, featured  │
│                   │ inventory, and Marketplace Agreement approvals.    │
│ 5. Bookings       │ Oversight of all marketplace, admin, and provider  │
│                   │ pipeline transactions, dispute interventions.      │
│ 6. Customers      │ Cross-network buyer directory (agencies, brands),  │
│                   │ credit evaluations, and inquiry histories.         │
│ 7. Campaigns      │ Audit desk for mounting photo proof verification   │
│                   │ before provider payout release.                    │
│ 8. Reports        │ Financial reconciliations, GMV, provider net sums, │
│                   │ platform gross margin, and occupancy metrics.      │
│ 9. Operations     │ System health, background job queues, storage      │
│                   │ capacity, and error logs.                          │
│ 10. Settings      │ Configurable marketplace markup defaults, platform │
│                   │ tax parameters, and system maintenance toggles.    │
└───────────────────┴────────────────────────────────────────────────────┘
```

---

## 3. Critical Administrative Workflows

### 3.1 Provider Vetting & Onboarding
1. Provider registers via the Public Website (`/get-started`).
2. SODAARS Admin reviews legal registration, phone, and GSTIN validity.
3. Admin approves account, transitioning the tenant from `pending` to `active`.

### 3.2 Marketplace Agreement & Markup Configuration
1. Provider submits an agreement request to opt resources into the Marketplace.
2. SODAARS Admin reviews proposed net SODAARS prices.
3. Admin countersigns the agreement and configures the **agreed marketplace markup** (either at provider level or customized per resource).
4. System unlocks the `marketplace_participation` toggle for the provider's assets.

### 3.3 Administrative Resource Blocks (`Admin Block`)
If a municipal dispute, structural safety hazard, or payment issue arises:
1. Admin places an `Admin Block` on the target resource.
2. The block immediately freezes the resource across both the Provider Panel and public Marketplace.
3. Neither the provider nor marketplace buyers can create bookings over an Admin Block until platform compliance clears the issue.

### 3.4 Campaign Mounting Audit & Settlement Release
1. Provider field crew uploads photo proofs upon vinyl mounting completion.
2. Admin inspection desk manually audits the timestamped photography (day view, night illuminated view).
3. Upon approval, Admin marks the campaign as `Proof Verified`, triggering settlement release to the provider based on the contracted net SODAARS Price.
