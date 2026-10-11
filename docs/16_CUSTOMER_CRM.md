# 16 Customer CRM Specification
**Project**: SODAARS  
**Core Solution 4**: Customer CRM  
**Official Description**: *Agencies and direct enterprise buyers*  
**Status**: Source of Truth  
**Version**: 1.0.0

---

## 1. Solution Mission & Identity

**Customer CRM** is the dedicated relationship and account management solution in the Provider Panel. It empowers outdoor media owners to organize their business clients, track booking histories, oversee renewals, and maintain strict custody over their direct client relationships.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CUSTOMER ENTITY PIPELINE                        │
│                                                                        │
│   CUSTOMER ─────────► BOOKING ─────────► RESOURCE ─────────► CAMPAIGN  │
│  (Agency/Brand)    (Contract Terms)    (Display Asset)    (Mounting)   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Customer Classifications & Origination Sources

### 2.1 Four Core Customer Types
The CRM structures all client accounts into four standardized categories:
1. **Advertising Agencies**: Media planning and buying agencies booking on behalf of multiple client brands.
2. **Direct Enterprise Buyers**: National or multi-regional corporations contracting directly with the asset owner.
3. **Local Businesses**: Regional retail outlets, educational institutions, real estate promoters, and local merchants.
4. **Brands / Corporate Clients**: Direct consumer and B2B brand marketing divisions.

### 2.2 Origination Sources
- **`provider_direct`**: Direct relationships owned, negotiated, and registered by the provider's internal sales team. These accounts remain strictly confidential to the provider.
- **`marketplace`**: Buyers who initiated their first booking through the public SODAARS Marketplace. Once assigned and confirmed, the provider can manage future contract interactions seamlessly.

---

## 3. Customer Profile Specifications

The CRM profile aggregates the operational history of each client:

| Field Group | Attributes | Description |
|---|---|---|
| **Identity & Contact** | `company_name`, `contact_person`, `phone`, `email` | Primary business communication channels. |
| **Commercial Profile** | `customer_type`, `gstin`, `billing_address` | Tax credentials, legal invoicing details. |
| **Operational Linkages** | `active_bookings`, `past_bookings`, `campaigns` | Relational links to active displays, completed contracts, and mounting records. |
| **Status & Health** | `status` (`active`, `dormant`, `blacklisted`) | Account standing and creditworthiness. |

---

## 4. Customers Mega Menu Modules

Under the **Customers** topbar mega menu, providers access two specialized views:

### 4.1 Customer CRM (`/panel/customers/crm`)
- Directory table of all accounts with quick search by company name, contact, or GSTIN.
- High-level metric badges: Total Contract Value, Active Bookings, and Outstanding Receivables `[TBD: Ledger Sync]`.
- Customer Drawer: Slide-out view displaying contact details, active assets, and contract history without leaving the page.

### 4.2 Customer Activity (`/panel/customers/activity`)
- Unified chronological audit log tracking:
  - New booking requests received
  - Rate proposals and contracts confirmed
  - Mounting proof approvals submitted
  - Upcoming display expiration and contract renewal alerts
