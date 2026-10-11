# Google Stitch UI/UX Primary Reference
**Project**: SODAARS (Streamline Outdoor Digital Advertising Resource System)  
**Surface**: Provider Experience (Public Website & Operational Panel)  
**Status**: Authoritative UI/UX Visual Reference  
**Version**: 1.0.0

---

## 1. Primary Reference Specification

The definitive visual reference and interface benchmark for the SODAARS Provider experience is the **Google Stitch Provider UI/UX Project**:

```
https://stitch.withgoogle.com/projects/9803487048175431578
```

> [!IMPORTANT]
> **MANDATORY VISUAL BENCHMARK**:
> All Provider UI screens, components, layouts, typography, spacing, navigation presentations, and interaction patterns must strictly align with this Google Stitch project.
>
> - **DO NOT** redesign the product independently.
> - **DO NOT** introduce an alternative visual direction.
> - **DO NOT** invent ad-hoc layout systems or divergent navigation structures.

---

## 2. Established Visual Principles

The Google Stitch reference embodies a **disciplined, high-density enterprise SaaS visual language** inspired by the sophistication of modern B2B platforms (such as HubSpot-grade enterprise interfaces), adapted specifically for the operational demands of physical outdoor media owners.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   STITCH DESIGN PRINCIPLES AT A GLANCE                 │
├─────────────────────┬──────────────────────────────────────────────────┤
│ Visual Discipline   │ Clean, modern, editorial, professional, modest.  │
├─────────────────────┼──────────────────────────────────────────────────┤
│ Information Density │ High-density operational data tables and cards;  │
│                     │ zero gratuitous ornamentation or empty padding.  │
├─────────────────────┼──────────────────────────────────────────────────┤
│ Hierarchy & Layout  │ Fixed Top Navigation Header ↓ Page Header with   │
│                     │ Breadcrumbs & Actions ↓ Data Content Container.  │
├─────────────────────┼──────────────────────────────────────────────────┤
│ Surface & Borders   │ Crisp white cards, thin 1px neutral borders,     │
│                     │ subtle 1–2px elevation, modest corner radii.     │
├─────────────────────┼──────────────────────────────────────────────────┤
│ Brand Restraint     │ Warm neutral canvas with selective Saffron/Orange│
│                     │ accents. STRICTLY ZERO BLUE BRAND/UI ELEMENTS.   │
└─────────────────────┴──────────────────────────────────────────────────┘
```

### 2.1 Enterprise Brand Boundaries
While drawing inspiration from enterprise SaaS benchmarks:
- ❌ **DO NOT** copy HubSpot branding, logos, or trademarks.
- ❌ **DO NOT** use HubSpot copywriting, content, or product terminology.
- ❌ **DO NOT** reproduce proprietary layout gimmicks.
- ✅ SODAARS must remain its own distinct, purpose-built outdoor advertising operating system.

---

## 3. Element-Level Reference Standards

### 3.1 Layout & Spatial System
- **Desktop-First Grid**: Optimized for operational desktop screens ($1280\text{px}$ to $1920\text{px}$), degrading gracefully to laptops and tablets.
- **Header & Navigation Layout**:
  1. **Top Header**: Corporate identity brand mark, global search, notifications bell, help icon, user profile menu.
  2. **Top Navigation Bar**: Horizontal primary module links with active state border indicators. **Strictly NO SIDEBAR**.
  3. **Page Header**: Section title (H1), breadcrumb trail, metadata counters, and primary action buttons.
  4. **Main Content Canvas**: Filter bars, operational data tables, Gantt availability timelines, or segmented cards.
- **Spacing Rhythm**: Governed by an 8pt base grid (`p-2`, `p-4`, `p-6`, `p-8`).

### 3.2 Typography & Editorial Discipline
- **Primary Typeface**: Modern geometric sans-serif (Inter / Roboto).
- **Scale & Weight**:
  - `H1`: $24\text{px}$ / $1.5\text{rem}$, `font-semibold`, tracking tight.
  - `H2`: $18\text{px}$ / $1.125\text{rem}$, `font-semibold`.
  - `H3`: $15\text{px}$ / $0.9375\text{rem}$, `font-medium`.
  - `Eyebrow Labels`: $11\text{px}$ / $0.6875\text{rem}$, `uppercase`, `tracking-wider`, `font-semibold`, muted neutral color.
  - `Body`: $14\text{px}$ / $0.875\text{rem}$, `text-neutral-600`, line height $1.5$.
  - `Tabular Figures`: `font-mono` or `tabular-nums` for dimensions, currency amounts (₹), dates, and coordinates.

### 3.3 Strict Anti-Blue Palette
The Google Stitch project establishes a warm, authoritative palette:
- **Brand Primary Accent**: Saffron / Orange (`#F97316` / `orange-500` / `orange-600`) applied selectively for primary CTA buttons, active tab indicators, and key focus outlines.
- **Brand Secondary**: Warm Amber (`#F59E0B`).
- **Neutrals**: Dark charcoal `#171717`, surface `#262626`, borders `#E5E5E5`, warm canvas background `#FAFAF9`.
- **Absolute Prohibition**: **ZERO BLUE**. No blue buttons, blue gradient headers, blue badges, or navy operational chrome.

### 3.4 Component Presentations
- **Buttons**:
  - *Primary*: Saffron/Orange background, white text, compact height ($36\text{px}$ / `h-9`), modest radius ($6\text{px}$ / `rounded-md`), subtle shadow.
  - *Secondary*: Crisp white background, dark text, thin border (`border-neutral-200`), hover warm neutral (`hover:bg-neutral-50`).
  - *Text Action*: `Learn more →` or `View details →` with trailing arrow.
  - *Prohibitions*: No giant pill buttons, no heavy gradients, no over-rounded controls.
- **Cards**:
  - Clean white surface, razor-thin border (`border-neutral-200`), subtle shadow (`shadow-xs` / `shadow-sm`), modest corner radius (`rounded-lg` $8\text{px}$), generous internal padding (`p-5` or `p-6`).
  - Prohibitions: No heavy drop shadows, no glassmorphism / frosted glass, no decorative icons without purpose.
- **Operational Data Tables**:
  - High-density rows, crisp horizontal dividers, sortable column headers with subtle indicators, sticky headers, monospaced numeric cells, inline status badges, right-aligned action menus.
- **Drawers & Slide-Overs**:
  - Right-side slide-over panels ($480\text{px}$ to $640\text{px}$ wide) for inspecting resource details or editing attributes without losing context of the primary list.

---

## 4. Development & Implementation Invariants

Every engineer, agent, or designer working on SODAARS Provider screens must verify implementations against this Google Stitch reference project before merging code.

1. **Verify Stitch Match**: Cross-reference layout, padding, font weights, and button treatments with `https://stitch.withgoogle.com/projects/9803487048175431578`.
2. **Consult UI/UX Specs**: Follow [`docs/ui-ux/PROVIDER_UI_UX.md`](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/ui-ux/PROVIDER_UI_UX.md) for concrete tokens and component rules.
3. **Check Screen Inventory**: Follow [`docs/ui-ux/PROVIDER_SCREENS.md`](file:///c:/xampp/htdocs/DIGITALKSIND/sodaars/docs/ui-ux/PROVIDER_SCREENS.md) for data fields, actions, and states.
4. **Enforce Business Boundaries**: Never alter commercial rules, navigation names, or inventory definitions based solely on generic UI libraries.
