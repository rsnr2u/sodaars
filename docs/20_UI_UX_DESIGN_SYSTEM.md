# 20 UI/UX Design System Specification
**Project**: SODAARS  
**Document**: Visual Language, Tokens, Component Hierarchy & Aesthetic Rules  
**Status**: Source of Truth  
**Version**: 1.0.0

---

## 1. Visual Design Philosophy

SODAARS employs a **premium enterprise SaaS visual language** characterized by editorial typography, generous whitespace, razor-thin borders, subtle elevation, modest corner radii, and high-density operational data layouts.

> [!CAUTION]
> ### STRICT ANTI-BLUE DESIGN MANDATE
> **DO NOT USE BLUE AS A BRAND OR UI COLOR**.  
> The system strictly forbids:
> - ❌ Blue buttons, badges, or accent links
> - ❌ Blue card backgrounds or gradients
> - ❌ Navy or indigo UI surfaces
> - ❌ Glassmorphism / blurred glassy backdrops
> - ❌ Giant pill-shaped buttons
> - ❌ Excessively rounded card borders (`rounded-3xl` or higher)

Orange is our primary brand signature and must be applied **selectively and purposefully** for key actions, brand marks, and high-priority focus states—never overused.

---

## 2. Core Color Palette & Design Tokens

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SODAARS DESIGN TOKENS                           │
├───────────────────┬──────────────┬─────────────────────────────────────┤
│ Token Role        │ Hex Value    │ Tailwind Utility Class Equiv.       │
├───────────────────┼──────────────┼─────────────────────────────────────┤
│ Brand Primary     │ `#F97316`    │ `bg-orange-500` / `text-orange-500` │
│ Brand Secondary   │ `#F59E0B`    │ `bg-amber-500` / `text-amber-500`   │
│ Neutral Dark      │ `#171717`    │ `bg-neutral-900` / `text-neutral-900│
│ Surface Dark      │ `#262626`    │ `bg-neutral-800`                    │
│ Neutral Muted     │ `#737373`    │ `text-neutral-500`                  │
│ Neutral Border    │ `#E5E5E5`    │ `border-neutral-200`                │
│ Warm Neutral Bg   │ `#FAFAF9`    │ `bg-stone-50` / `bg-neutral-50`     │
│ Surface White     │ `#FFFFFF`    │ `bg-white`                          │
└───────────────────┴──────────────┴─────────────────────────────────────┘
```

### 2.1 Operational Status Indicators (Strictly Non-Blue)
- **Active / Available / Confirmed**: Emerald (`bg-emerald-50 text-emerald-700 border-emerald-200`)
- **Hold / Under Review / Pending**: Amber (`bg-amber-50 text-amber-700 border-amber-200`)
- **Blocked / Declined / Overdue**: Rose (`bg-rose-50 text-rose-700 border-rose-200`)
- **Maintenance / Inactive / Decommissioned**: Stone / Neutral (`bg-stone-100 text-stone-700 border-stone-200`)

---

## 3. Typography & Form Factors

- **Primary Font Family**: Clean, modern geometric grotesque (Inter or Roboto via Google Fonts).
- **Scale**:
  - Headings: `font-semibold tracking-tight text-neutral-900`
  - Body Text: `text-sm text-neutral-600 leading-normal`
  - Monospace Data / IDs / Coordinates: `font-mono text-xs text-neutral-500`
- **Borders & Radii**:
  - Modest Radius: Standard `rounded-md` ($6\text{px}$) or `rounded-lg` ($8\text{px}$). No pill shapes.
  - Borders: Thin `border border-neutral-200` with crisp dividers.
- **Buttons**:
  - Primary: `bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-3.5 py-2 rounded-md shadow-sm transition-colors`
  - Secondary: `bg-white hover:bg-neutral-50 text-neutral-800 text-sm font-medium px-3.5 py-2 rounded-md border border-neutral-200 shadow-sm`
  - Destructive: `bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium px-3.5 py-2 rounded-md shadow-sm`

---

## 4. Experience-Specific Layout Paradigms

### 4.1 Provider Public Website & Marketplace
- Editorial headline typography, spacious section padding (`py-20` to `py-28`), generous whitespace.
- Warm neutral canvas (`bg-stone-50`) paired with crisp white card containers (`bg-white border border-neutral-200 shadow-sm`).
- High-resolution outdoor media photography rendered with clean aspect-ratio boxes.

### 4.2 Provider Panel & Admin Platform
- **High-Density Operational Shell**: Designed for daily desktop workflows, rapid data scanning, and batch operations.
- **Strictly Topbar Navigation**: Full-width topbar with Mega Menus. **Zero desktop sidebar**.
- **Data Tables**: Striped or bordered rows, compact pagination, sortable columns, and instant filter bars.
- **Empty States**: Explicit empty illustrations/icons with descriptive guidance and primary action triggers.
- **Drawer / Slide-Over**: Detail views and creation forms open in right-side slide-over panels to preserve parent table context.
