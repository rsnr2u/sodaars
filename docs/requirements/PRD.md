# SODAARS - Product Requirements Document (PRD)

## Product Name
**SODAARS** – Streamline Outdoor Digital Advertising Resource System

## 1. Executive Summary
SODAARS is an Outdoor Advertising Resource Management SaaS engineered for Outdoor Advertising Providers (media owners, billboard operators, and digital screen networks).

SODAARS provides software for outdoor media owners to operate their physical infrastructure, track inventory availability, manage media assets, and showcase their business and inventory through the SODAARS Public Directory.

SODAARS is NOT an OOH marketplace. SODAARS does not own, broker, purchase, sell, or process payments for advertising inventory. The media provider remains the sole commercial operator of their physical assets.

## 2. Product Phasing & Scope Boundaries
- **Core SaaS & Directory (Current Active Scope)**:
  - **Provider SaaS Portal**: Operational back-office system for providers to manage physical locations, bookable advertising resource units (hoardings, unipoles, gantries, digital screens), loop slot capacities, calendar schedules, downtime maintenance, photos/media galleries, staff, business profile, and directory visibility controls.
  - **Public Provider Directory**: Discovery and showcase platform enabling advertisers and agencies to discover verified outdoor media providers, explore their inventory faces, view photo galleries and location specs, and contact the provider directly for business inquiries.
  - **Platform Admin Portal**: Multi-tenant provider lifecycle, platform staff oversight, subscription tiers, and platform governance.
  - **Dormant / Optional Tooling (Stage 8)**: Customer portfolio and Enquiry RFQ tracking exist in the backend as optional back-office operational tools. They are intentionally decoupled and do not extend into downstream transactions.
- **Explicitly Excluded / Future Scope**:
  - NO online hoarding purchasing or e-commerce checkout.
  - NO online quotation acceptance or commercial booking contracts.
  - NO online payments, invoicing, or marketplace commissions.
  - NO marketplace cart or unified advertiser buyer accounts.
  - *All commercial transactions remain offline and direct between the advertiser and the provider.*

## 3. Subscription Model
Provider subscriptions are primarily gated by **Advertising Resources** managed:
1. **Starter**: ₹2,499/month | Up to 50 Advertising Resources
2. **Growth**: ₹5,999/month | 51 to 150 Advertising Resources
3. **Professional**: ₹9,999/month | 151 to 250 Advertising Resources
4. **Enterprise**: Custom pricing | 251+ Advertising Resources
*Note: Pricing and limits are dynamic and database-driven via `subscription_plans`.*

## 4. Key Security & Multi-Tenancy Principles
- **Organization = Tenant**.
- Multi-tenancy strictly enforced at backend/database level.
- Client payloads can **never** override or spoof `organization_id`.
- Tenant context is resolved dynamically from authenticated user membership.
