# 24 Testing Strategy Specification
**Project**: SODAARS  
**Document**: Quality Assurance, Verification Protocols & Automated Test Suites  
**Status**: Source of Truth  
**Version**: 1.0.0

---

## 1. Testing Pyramid & Verification Hierarchy

Quality engineering in SODAARS is structured across four rigorous verification layers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SODAARS TESTING PYRAMID                         │
├─────────────────────┬──────────────────────────┬───────────────────────┤
│ Layer               │ Toolchain                │ Primary Target        │
├─────────────────────┼──────────────────────────┼───────────────────────┤
│ 1. Unit Tests       │ PHPUnit / Pest / Vitest  │ Math, Engines, Quotas │
│ 2. Feature / API    │ Laravel HTTP Tests       │ REST Endpoints & RBAC │
│ 3. Multi-Tenant     │ Eloquent Tenant Assertions Tenant Query Scoping  │
│ 4. End-to-End (E2E) │ Playwright               │ Multi-Surface Flows   │
└─────────────────────┴──────────────────────────┴───────────────────────┘
```

---

## 2. Core Business Logic Unit Tests

Automated unit tests must assert the mathematical and operational invariants of the system:

### 2.1 Subscription Quota Rule Validation
- **Assertion**: Total registered resources includes active + inactive combined.
- **Test Case**: Seed 45 active resources and 25 inactive resources for an organization. Assert `subscription_tier == 'tier_51_to_100'` and monthly fee is exactly `₹8,999`. Assert that attempting to register resource #101 prompts enterprise escalation.

### 2.2 Availability Overlap Math Validation
- **Assertion**: Exact date boundary intersections trigger holds or conflicts.
- **Test Case**: Book an asset for `2026-11-01` to `2026-11-15`. Query availability for `2026-11-15` to `2026-11-30`. Assert conflict detected on boundary date `2026-11-15`.

### 2.3 Configurable Markup Calculation Validation
- **Assertion**: Markup is dynamically computed from contract settings without hardcoding 30%.
- **Test Case**: Provider SODAARS Net Price = `₹80,000`. Agreement markup = `25%`. Customer concession = `₹4,000`. Assert listed price = `₹1,00,000`, buyer invoiced = `₹96,000`, provider settlement = `₹80,000`, gross margin = `₹16,000`.

---

## 3. Integration & Multi-Tenant Security Tests

### 3.1 Tenant Isolation Invariant
- **Scenario**: Provider 1 (`organization_id = 1`) attempts to read or mutate a Customer CRM record or Booking belonging to Provider 2 (`organization_id = 2`).
- **Expected Outcome**: HTTP `403 Forbidden` or `404 Not Found` (via global tenant scope); zero data exposure.

### 3.2 Concurrency & Double-Booking Lock Test
- **Scenario**: Two parallel concurrent HTTP requests attempt to reserve the same resource for overlapping date windows.
- **Expected Outcome**: Exactly one request succeeds with `200 OK` (transitioning to `Hold`); the second request fails with `422 Unprocessable Entity` (`RESOURCE_ALREADY_RESERVED`).

---

## 4. End-to-End Workflow Verification

A comprehensive Playwright suite executes the multi-surface journey:
1. **Marketplace Discovery**: Guest browses `/resources`, applies city filter, selects Unipole, submits booking inquiry.
2. **Provider Panel Receipt**: Provider logs into `/panel/operations/bookings`, observes inquiry in `UNDER_REVIEW`, inspects dates in `Availability`, and clicks `Confirm`.
3. **Buyer Clearance**: Invoiced amount paid; booking transitions to `CONFIRMED`.
4. **Campaign Mounting**: Provider navigates to `/panel/operations/campaigns`, uploads mounting photo proof with timestamp.
5. **Admin Audit**: SODAARS Admin reviews proof in Admin desk, marks as `Proof Verified`, clearing provider net settlement.
