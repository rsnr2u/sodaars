# 01 Product Vision
**Project**: SODAARS (Streamline Outdoor Digital Advertising Resource System)  
**Status**: Source of Truth / Baseline Specification  
**Version**: 1.0.0 (V1 Static Edition)

---

## 1. Executive Summary

**SODAARS** (*Streamline Outdoor Digital Advertising Resource System*) is an enterprise operational and commercial operating system designed for the outdoor advertising ecosystem. It bridges media asset owners (*Providers*), media buyers (*Direct Clients & Marketplace Customers*), and platform operators (*SODAARS Admin*) onto a unified real-time infrastructure.

The outdoor advertising industry is plagued by fragmented inventory registers, manual phone/email availability checks, opaque pricing, disjointed proof-of-performance workflows, and cumbersome booking reconciliations. SODAARS provides an authoritative platform for managing static physical outdoor advertising inventory, managing availability schedules, executing bookings, managing customer accounts, validating mounting proofs, and facilitating marketplace inventory discovery.

---

## 2. Core Architectural Philosophy

SODAARS operates under the architectural principle of **Three Surfaces, One Unified Core Engine**:

```
                              ┌────────────────────────┐
                              │     SODAARS CORE       │
                              │ Laravel REST API + DB  │
                              └───────────┬────────────┘
                                          │
        ┌─────────────────────────────────┼────────────────────────────────┐
        │                                 │                                │
        ▼                                 ▼                                ▼
┌─────────────────┐             ┌─────────────────────┐          ┌───────────────────┐
│   MARKETPLACE   │             │  PROVIDER PLATFORM  │          │  ADMIN PLATFORM   │
│ Next.js + Tailw.│             │  React+Vite+Tailw.  │          │ React+Vite+Tailw. │
│ Discover/Book   │             │ Public Web + Panel  │          │ Governance/Mgmt   │
└─────────────────┘             └─────────────────────┘          └───────────────────┘
```

1. **Marketplace (Public Discovery & Request)**: A discovery channel for brands, agencies, and businesses to explore verified static outdoor media inventory and initiate booking requests.
2. **Provider Platform (Public Presence + Operational Panel)**: A dual-experience web application delivering a public corporate face alongside a robust operational topbar-navigated panel for media asset owners to manage inventory, availability, contracts, and field execution.
3. **Admin Platform (Governance & Marketplace Operations)**: A specialized internal control tower for SODAARS operational teams to manage provider relationships, verify assets, coordinate marketplace deals, and oversee system compliance.

---

## 3. Product Scope: V1 vs. Future Roadmap

### 3.1 V1 Scope: Static Outdoor Advertising
V1 exclusively powers **physical, static outdoor advertising assets**. All data models, workflows, calculations, and visual representations are optimized around physical media displays:

- **Hoardings / Traditional Billboards**
- **Unipoles**
- **Gantries / Flyover Cantilevers**
- **Bus Shelters (BQS - Bus Queue Shelters)**
- **Pole Ads / Street Pole Panels**
- **Wall Mounts / Wall Wraps**
- **Rooftop Billboards**
- **Bridge Panels / Foot Overbridge (FOB) Displays**
- **Other Static Physical Advertising Assets**

### 3.2 Explicit Exclusions from V1 [FUTURE]
The following categories are strictly excluded from V1 and designated as `[FUTURE]` expansion modules:
- ❌ Digital LED Screens / Video Billboards
- ❌ Dynamic Digital Signage
- ❌ Programmatic DOOH (pDOOH) Ad-Exchanges & SSP/DSP Integrations
- ❌ Automated real-time CMS playlist delivery / loop-based spot scheduling

---

## 4. The 5 Core Provider Solutions

The platform standardizes on five official, unchangeable solutions designed to solve critical operational bottlenecks:

| # | Solution Name | Official Description | Core Value Proposition |
|---|---|---|---|
| **1** | **Resource Management** | *Hoardings, unipoles & gantries* | Comprehensive digital registry of physical media assets, exact specifications, illuminations, dimensions, and visual media proof. |
| **2** | **Availability Engine** | *Real-time slot & hold manager* | Resource-level scheduling grid tracking Available, Booked, Hold, Provider Block, Admin Block, and Maintenance states. |
| **3** | **Booking Pipeline** | *Direct contracts & client renewals* | Multi-source lifecycle tracker managing negotiations, approvals, contract confirmations, and renewal schedules. |
| **4** | **Customer CRM** | *Agencies and direct enterprise buyers* | Dedicated client repository linking accounts, contacts, and contract histories directly to booked assets. |
| **5** | **Campaign Execution** | *Mounting photo proof & audit trails* | Physical field operational workflow covering printing, mounting, time-stamped photo proofs, and client sign-offs. |

---

## 5. Strategic Operating Principles

### 5.1 Provider Sovereignty & Independence
- **Marketplace is an Addition, Not a Replacement**: SODAARS does not monopolize or confiscate provider clients. Providers use SODAARS to manage their own direct enterprise accounts, agencies, and long-term contracts.
- **Resource-Level Control**: Providers decide exactly which resources participate in the Marketplace and which remain private.
- **Independence of Participation & Availability**: A resource may participate in the Marketplace while being marked as Booked or Blocked for a specific date window.

### 5.2 Honest & Transparent Commercial Boundaries
- **No False Guarantees**: SODAARS makes **zero** guarantees regarding booking volumes, lead generation quantities, revenue figures, or demand levels.
- **Clear Net Pricing**: Providers set their base net SODAARS price. Platform margins are structured via explicit, agreed markup configurations rather than hidden deductions.
- **Total Asset Accounting**: Provider subscription tiers are anchored to total registered resources (active + inactive combined), providing clear operational predictability.
