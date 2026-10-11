# 14 Availability Engine Specification
**Project**: SODAARS  
**Core Solution 2**: Availability Engine  
**Official Description**: *Real-time slot & hold manager*  
**Status**: Source of Truth  
**Version**: 1.0.0

---

## 1. Engine Mission & Foundational Rules

The **Availability Engine** is the authoritative scheduling system that determines whether a specific physical advertising resource can be displayed, booked, or held across any date range.

### 1.1 Mandatory Core Rules
1. **Resource-Level Granularity**: Availability is calculated strictly at the **Advertising Resource** level (the physical display face), never at the Location level.
2. **Unified Data Core**: The Availability Engine relies on the single source of truth in `availability_schedules`. Marketplace searches, Provider panel schedules, and Admin booking coordinators query the exact same underlying table.
3. **Decoupled from Marketplace Participation**:
   - `marketplace_participation = true` allows an asset to appear in catalog searches.
   - It does **not** grant automatic availability. If the resource is booked or blocked on the queried dates, the engine reports it as unavailable.

---

## 2. Six Deterministic Resource Availability States

At any given date or interval, an advertising resource occupies exactly one operational availability state:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      RESOURCE AVAILABILITY STATES                      │
├───────────────────┬────────────────────────────────────────────────────┤
│ State             │ Meaning & Operational Impact                       │
├───────────────────┼────────────────────────────────────────────────────┤
│ 1. Available      │ Unreserved display window open for immediate       │
│                   │ direct booking or marketplace inquiry.             │
├───────────────────┼────────────────────────────────────────────────────┤
│ 2. Booked         │ Confirmed contractual reservation. Active or       │
│                   │ confirmed booking exists. Strictly unbookable.     │
├───────────────────┼────────────────────────────────────────────────────┤
│ 3. Hold           │ Provisional reservation created during             │
│                   │ `NEW` / `UNDER_REVIEW` / `PROVIDER_CONFIRMATION`   │
│                   │ stages. Prevents overlapping requests temporarily. │
├───────────────────┼────────────────────────────────────────────────────┤
│ 4. Provider Block │ Discretionary freeze placed by Provider management │
│                   │ (e.g., internal reservation, offline client).      │
├───────────────────┼────────────────────────────────────────────────────┤
│ 5. Admin Block    │ Mandatory platform freeze placed by SODAARS Admin  │
│                   │ (e.g., legal dispute, safety issue, fee default).  │
├───────────────────┼────────────────────────────────────────────────────┤
│ 6. Maintenance    │ Physical structure unavailable due to maintenance, │
│                   │ repainting, structural reinforcement, or storms.   │
└───────────────────┴────────────────────────────────────────────────────┘
```

---

## 3. Precedence & Conflict Resolution Hierarchy

When evaluating overlapping scheduling entries, the Availability Engine enforces the following strict precedence order:

$$\text{Admin Block} > \text{Maintenance} > \text{Booked} > \text{Provider Block} > \text{Hold} > \text{Available}$$

1. **Admin Block Dominance**: An `Admin Block` overrides and prevents all other actions. No provider or customer can reserve an asset while under an Admin Block.
2. **Maintenance Dominance**: Structural repairs prevent booking creation. If an existing booking overlaps an emergency maintenance window, an operational alert is dispatched to Provider operations.
3. **Pessimistic Hold Expiration**: A `Hold` expires automatically if the booking does not advance to confirmation within the configured expiration threshold `[TBD: Standard Hold Window]`.

---

## 4. Date Range Intersection Math

To determine if an asset is available for a requested window $[Q_{\text{start}}, Q_{\text{end}}]$, the engine runs the canonical date overlap query:

```sql
SELECT COUNT(*) AS conflict_count
FROM availability_schedules
WHERE resource_id = :resource_id
  AND start_date <= :query_end_date
  AND end_date >= :query_start_date
  AND status IN ('booked', 'hold', 'provider_block', 'admin_block', 'maintenance');
```

- If `conflict_count == 0`: The resource is **`Available`**.
- If `conflict_count > 0`: The resource is **`Unavailable`**, returning the blocking state and date range to the requester.
