# 03 Business Requirements Specification
**Project**: SODAARS  
**Document**: Commercial Rules & Business Logic  
**Status**: Source of Truth  
**Version**: 1.0.0

---

## 1. Provider Subscription Model

SODAARS operates a software-as-a-service (SaaS) subscription model for outdoor media providers, granting access to the Provider Panel, the 5 Core Solutions, and internal operational tooling.

### 1.1 Subscription Pricing Structure
Provider subscriptions are governed strictly by the **total count of registered advertising resources**:

| Tier Designation | Total Registered Resources Range | Monthly Subscription Fee |
|---|---|---|
| **Tier 1** | **1 – 50 Registered Resources** | **₹4,999 / month** |
| **Tier 2** | **51 – 100 Registered Resources** | **₹8,999 / month** |
| **Tier 3+** | **> 100 Registered Resources** | `[TBD: Enterprise Tier Terms to be defined]` |

### 1.2 Resource Counting Rule (Active vs. Inactive)
> [!IMPORTANT]
> **Subscription tier calculation is based strictly on TOTAL REGISTERED RESOURCES**, regardless of whether an asset is currently active, paused, under maintenance, or vacant.

**Formal Verification Example**:
- Provider registers `70 total resources` in the system.
- `45 resources` are currently `Active` and deployed in the field.
- `25 resources` are marked `Inactive` or under seasonal maintenance.
- **Resulting Subscription Classification**: **Tier 2 (51–100 resources) at ₹8,999/month**.

### 1.3 Strict Subscription Prohibitions
To preserve commercial integrity, the platform strictly forbids inventing:
- ❌ Setup or onboarding fees
- ❌ Per-booking or transaction percentage fees on provider direct bookings
- ❌ Arbitrary free trial periods (unless formally scheduled via business agreement)
- ❌ Unapproved paid operational add-ons or module surcharges

---

## 2. Marketplace Commercial Architecture

The SODAARS Marketplace operates as a supplemental customer discovery channel. Participation is completely voluntary and decoupled from the provider's SaaS subscription.

### 2.1 Decoupling Principles
1. **Subscription Independence**: A provider's subscription grants full use of the operational engine. Marketplace participation is an optional commercial channel governed by a separate **Marketplace Agreement**.
2. **Resource-Level Granularity**: Providers choose asset-by-asset which resources participate in the Marketplace. Non-participating assets remain strictly private to the provider's direct operations.
3. **Availability Independence**: Participating in the Marketplace does not mean the asset is always vacant. It simply permits the asset to be displayed and requested when calendar slots are open.

### 2.2 Dual-Price Mechanism
For every resource opted into the Marketplace, the provider submits two discrete price points:
1. **Regular Customer Price**: The provider's standard street card rate / retail price.
2. **SODAARS Price (Provider Net Settlement Price)**: The net amount the provider agrees to receive upon completion of a fulfilled marketplace booking.

### 2.3 Pricing Calculation & Markup Framework
The public Marketplace price is derived by applying a **contractually agreed markup** onto the provider's net SODAARS price:

$$\text{Marketplace Price} = \text{SODAARS Price} + \text{Agreed Markup}$$

> [!CAUTION]
> **Do NOT hard-code 30% or any fixed percentage.**  
> The 30% figure cited in initial discussions was solely an illustrative example. The platform must support configurable, agreement-driven markups defined either per-provider or per-resource in the Marketplace Agreement.

#### Numerical Commercial Model Walkthrough (Illustrative Only):
```
Provider Regular Customer Price:            ₹1,00,000
Provider SODAARS Net Price:                   ₹75,000
Agreed Marketplace Markup (e.g., 30%):        ₹22,500
─────────────────────────────────────────────────────
Initial Listed Marketplace Price:             ₹97,500
Customer Commercial Adjustment (Discount):    - ₹5,000
─────────────────────────────────────────────────────
Final Buyer Invoiced Amount:                  ₹92,500
Provider Settlement Amount (SODAARS Price):   ₹75,000
─────────────────────────────────────────────────────
SODAARS Gross Margin (pre-tax/finance):       ₹17,500
```

### 2.4 Financial Settlement Governance
- **Settlement Anchor**: The provider is guaranteed settlement based strictly on their contracted **SODAARS Price** (net price) upon verified completion of campaign mounting proof.
- **Risk Attribution**: Customer adjustments or platform-level promotional discounts reduce SODAARS' gross margin; they do **not** decrease the agreed net settlement due to the provider.

---

## 3. Disclaimers & Operational Expectations

To eliminate legal and commercial ambiguity:
1. **No Guaranteed Volume**: SODAARS makes no representation or warranty regarding booking counts, lead generation, revenue targets, or demand volumes.
2. **No Automated Approvals**: Marketplace inquiries do not constitute binding contracts until provider confirmation and payment clearing occur.
3. **Static Media Operational Realities**: Printing, vinyl quality, municipal permits, and structural integrity remain the contractual responsibility of the asset owner / provider unless specified otherwise by separate service agreements `[TBD]`.
