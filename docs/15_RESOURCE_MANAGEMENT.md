# 15 Resource Management Specification
**Project**: SODAARS  
**Core Solution 1**: Resource Management  
**Official Description**: *Hoardings, unipoles & gantries*  
**Status**: Source of Truth  
**Version**: 1.0.0

---

## 1. Solution Identity & Conceptual Distinction

**Resource Management** is the primary operational module within SODAARS for cataloging, pricing, maintaining, and specifying physical outdoor advertising structures.

### 1.1 Location vs. Advertising Resource
A core architectural tenet of SODAARS is the clear, unambiguous separation between a **Location** and an **Advertising Resource**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LOCATION (PHYSICAL SITE)                        │
│ Example: "Benz Circle Junction, Vijayawada"                            │
│ Metadata: Geo-Coordinates, City, Landmark, Municipal Zone              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Hosts 1-to-Many
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│ RESOURCE A       │       │ RESOURCE B       │       │ RESOURCE C       │
│ Unipole - North  │       │ Unipole - South  │       │ Billboard - West │
│ 40x20 ft, Front  │       │ 40x20 ft, Back   │       │ 30x15 ft, Non-Lit│
└──────────────────┘       └──────────────────┘       └──────────────────┘
```

> [!CAUTION]
> **Locations are supporting data for resources**.  
> **DO NOT MAKE LOCATIONS A PRIMARY PROVIDER PANEL NAVIGATION ITEM**. Locations are created, selected, or modified inline as supporting site anchors when managing Advertising Resources.

---

## 2. Resource Data Specification

Every static advertising asset in SODAARS is defined by the following canonical attributes:

| Attribute | Type | Description & Permitted Values |
|---|---|---|
| **Resource Name** | String | Specific display face identifier (e.g., "Unipole A - Facing MG Road"). |
| **Resource Type** | Enum | Strictly static assets: `hoarding`, `billboard`, `unipole`, `gantry`, `bus_shelter`, `pole_ad`, `wall_mount`, `rooftop`, `bridge_panel`, `other_static`. |
| **Location** | Relation | Supporting link to physical site record (contains Lat/Long, Address, City). |
| **Dimensions** | Numeric ($W \times H$) | Width in feet, Height in feet, and auto-computed Square Footage ($Area = W \times H$). |
| **Orientation** | Enum | Compass orientation: `north`, `south`, `east`, `west`, `northeast`, `northwest`, `southeast`, `southwest`. |
| **Illumination** | Enum | Lighting technology: `front_lit`, `back_lit`, `non_lit`, `ambient`. |
| **Visibility / Facing** | String | Directional traffic perspective (e.g., "Facing traffic towards Railway Station"). |
| **Customer Price** | Currency (₹) | Standard street/retail rate card for direct client quoting. |
| **SODAARS Price** | Currency (₹) | Provider net settlement price for Marketplace transactions. |
| **Marketplace Participation** | Boolean | Explicit toggle opting the asset into the public Marketplace. |
| **Status** | Enum | Asset state: `active`, `inactive`, `maintenance`, `decommissioned`. |
| **Media Proof** | File URLs | Mandatory daytime photograph, night illuminated photograph, and approach distance perspective. |
| **Description** | Text | Free-form operational notes, municipal clearance IDs, and site nuances. |

---

## 3. Subscription Quota Calculation Rule

> [!IMPORTANT]
> **Total Registered Resources = Active + Inactive Assets Combined**.

The Resource Management service continuously audits the total count of registered assets per provider:
```
Total Registered Count = COUNT(advertising_resources WHERE organization_id = :id AND status != 'decommissioned')
```

- When `Total Registered Count <= 50`: **Tier 1 (₹4,999/mo)**.
- When `51 <= Total Registered Count <= 100`: **Tier 2 (₹8,999/mo)**.
- If an asset is deactivated or seasonally paused (`status = inactive`), it **remains counted** against the subscription tier until permanently deleted/decommissioned.

---

## 4. Static Outdoor Assets Only (V1 Scope Enforcement)

The Resource Management system strictly enforces physical media validations. Input forms and database enums reject any attempt to configure:
- Digital refresh rates / display pixel pitch
- Video codec specifications
- Programmatic spot duration loops
- Dynamic LED content feeds
*(All digital screen capabilities are reserved for `[FUTURE]` iterations).*
