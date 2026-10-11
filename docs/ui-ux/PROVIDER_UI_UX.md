# SODAARS Provider UI/UX Design System Specification
**Project**: SODAARS  
**Document**: Provider Platform UI/UX Design System  
**Status**: Source of Truth  
**Visual Reference**: Google Stitch Project (`https://stitch.withgoogle.com/projects/9803487048175431578`)  
**Version**: 1.0.0

---

## 1. System Philosophy & Aesthetic Directives

The **SODAARS Provider Platform** is an enterprise-grade desktop-first operational software platform engineered for outdoor media owners. It reflects the visual discipline, restraint, and clarity of leading B2B SaaS interfaces (e.g., HubSpot-caliber operational density) while maintaining an authentic, distinct visual identity tailored to physical media inventory operations.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      CORE UI/UX DESIGN DIRECTIVES                      │
├───────────────────┬────────────────────────────────────────────────────┤
│ 1. Zero Blue Rule │ STRICT BAN on blue, navy, indigo, or cyan as brand │
│                   │ or UI elements. Saffron/Orange is the brand color. │
├───────────────────┼────────────────────────────────────────────────────┤
│ 2. Top Nav Only   │ STRICTLY NO SIDEBAR. Top header + top navigation   │
│                   │ organizes the entire application experience.       │
├───────────────────┼────────────────────────────────────────────────────┤
│ 3. Restraint      │ Orange is applied selectively to primary actions   │
│                   │ and focus states. The canvas remains warm neutral. │
├───────────────────┼────────────────────────────────────────────────────┤
│ 4. Modest Shapes  │ No giant pill buttons, no heavily rounded cards    │
│                   │ (max 8px radius), no decorative gradient washes.   │
├───────────────────┼────────────────────────────────────────────────────┤
│ 5. Operational    │ Data tables, Gantt timelines, slide-over drawers,  │
│    Density        │ and compact forms support rapid daily execution.   │
└───────────────────┴────────────────────────────────────────────────────┘
```

---

## 2. Layout Structure (Desktop-First Enterprise Architecture)

All Provider Panel screens adhere strictly to the following 4-tier vertical hierarchy:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. TOP HEADER: [SODAARS Brand Mark]          [Global Search]          [🔔]  [❓ Help]  [👤 User Profile]│
├────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. TOP NAVIGATION: Dashboard  Advertising Resources  Availability  Bookings  Customers  Campaigns ...│
├────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 3. PAGE HEADER:                                                                                    │
│    Home / Operations / Advertising Resources                                                       │
│    Advertising Resources                              [Export CSV]  [+ Register Resource (Orange)] │
│    Manage physical inventory assets, dimensions, and marketplace participation.                    │
├────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 4. MAIN CONTENT CANVAS:                                                                            │
│    ┌──────────────────────────────────────────────────────────────────────────────────────────┐    │
│    │ Filter & Search Bar: [Search resource name...] [Type ▾] [Status ▾] [City ▾]               │    │
│    ├──────────────────────────────────────────────────────────────────────────────────────────┤    │
│    │ High-Density Data Table / Calendar Timeline / Metric Grid                                │    │
│    └──────────────────────────────────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

> [!CAUTION]
> **ABSOLUTE PROHIBITION ON SIDEBARS**:
> Desktop, laptop, and tablet layouts must never introduce a vertical sidebar navigation. All primary modules reside in the horizontal Top Navigation.

---

## 3. Color Token System (Strictly Non-Blue)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   SODAARS COLOR TOKENS                                           │
├──────────────────────────┬──────────────┬────────────────────────────────────────────────────────┤
│ Token Name               │ Hex Value    │ Tailwind Utility Classes                               │
├──────────────────────────┼──────────────┼────────────────────────────────────────────────────────┤
│ Primary Brand Accent     │ `#F97316`    │ `bg-orange-600` / `hover:bg-orange-700` / `text-orange-600` |
│ Secondary Brand Accent   │ `#F59E0B`    │ `bg-amber-500` / `text-amber-600`                      │
│ Neutral Dark (Text/Icons)│ `#171717`    │ `text-neutral-900` / `bg-neutral-900`                  │
│ Neutral Charcoal         │ `#0D0D0D`    │ `bg-neutral-950`                                       │
│ Neutral Body Text        │ `#525252`    │ `text-neutral-600`                                     │
│ Neutral Muted / Subtext  │ `#737373`    │ `text-neutral-500`                                     │
│ Border Light             │ `#E5E5E5`    │ `border-neutral-200`                                   │
│ Border Subtle            │ `#F5F5F4`    │ `border-neutral-100`                                   │
│ Canvas Background        │ `#FAFAF9`    │ `bg-stone-50` / `bg-neutral-50`                        │
│ Card Surface             │ `#FFFFFF`    │ `bg-white`                                             │
│ Supporting Warm Neutral  │ `#F5F5F4`    │ `bg-stone-100` / `bg-neutral-100`                      │
│ Supporting Peach Tint    │ `#FFF7ED`    │ `bg-orange-50`                                         │
└──────────────────────────┴──────────────┴────────────────────────────────────────────────────────┘
```

### 3.1 Semantic Functional Status Badges
Semantic colors are reserved for data states and never used for decorative brand styling:
- **Available / Confirmed / Active / Completed**: Emerald  
  `bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10`
- **Hold / Under Review / Pending**: Amber  
  `bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10`
- **Provider Block / High Priority Notice**: Orange  
  `bg-orange-50 text-orange-700 border-orange-200 ring-orange-500/10`
- **Admin Block / Declined / Overdue / Error**: Red / Rose  
  `bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/10`
- **Maintenance / Inactive / Decommissioned**: Stone / Neutral Gray  
  `bg-stone-100 text-stone-700 border-stone-200`

---

## 4. Typography Scale & Hierarchy

- **Font Family**: Modern clean sans-serif (`font-sans`: Inter / Roboto / system-ui).
- **Scale Tokens**:
  - `Display / Hero H1`: $28\text{px}$ / $1.75\text{rem}$, `font-bold tracking-tight text-neutral-900`.
  - `Page Header H1`: $22\text{px}$ / $1.375\text{rem}$, `font-semibold tracking-tight text-neutral-900`.
  - `Section Header H2`: $16\text{px}$ / $1.0\text{rem}$, `font-semibold text-neutral-900`.
  - `Card Title H3`: $14\text{px}$ / $0.875\text{rem}$, `font-medium text-neutral-900`.
  - `Eyebrow Label`: $11\text{px}$ / $0.6875\text{rem}$, `font-semibold uppercase tracking-wider text-neutral-500`.
  - `Body Text`: $14\text{px}$ / $0.875\text{rem}$, `font-normal text-neutral-600 leading-relaxed`.
  - `Body Small`: $13\text{px}$ / $0.8125\text{rem}$, `font-normal text-neutral-500`.
  - `Monospace Figures`: $12\text{px}$ / $0.75\text{rem}$, `font-mono text-neutral-700` (used for asset dimensions, booking codes, coordinates, and prices).

---

## 5. Component Style Specifications

### 5.1 Buttons
- **Primary Button**:
  - Style: Saffron/orange fill (`bg-orange-600 hover:bg-orange-700 active:bg-orange-800`), white text, compact professional height ($36\text{px}$ / `h-9 px-3.5`), modest corner radius ($6\text{px}$ / `rounded-md`), subtle shadow (`shadow-xs`), text $13\text{px}$ / `text-sm font-medium`.
- **Secondary Button**:
  - Style: Crisp white background (`bg-white hover:bg-neutral-50`), dark text (`text-neutral-800`), thin border (`border border-neutral-200 shadow-xs`), compact height ($36\text{px}$ / `h-9 px-3.5`), moderate radius (`rounded-md`).
- **Destructive Button**:
  - Style: Red/rose fill (`bg-rose-600 hover:bg-rose-700`), white text, `rounded-md`, compact height.
- **Text Action**:
  - Style: `inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700`.
  - Format: `Learn more →` or `View history →`.
- **Prohibitions**:
  - ❌ No giant pill buttons (`rounded-full`).
  - ❌ No tall $50\text{px}+$ oversized buttons.
  - ❌ No decorative multi-stop gradient buttons.

### 5.2 Cards
- **Specification**: White background (`bg-white`), thin border (`border border-neutral-200`), subtle elevation (`shadow-xs` or `shadow-sm`), modest corner radius ($8\text{px}$ / `rounded-lg`), internal padding $20\text{px}$ to $24\text{px}$ (`p-5` or `p-6`).
- **Prohibitions**:
  - ❌ No heavy drop shadows (`shadow-2xl`).
  - ❌ No glassmorphism or backdrop-blur tricks.
  - ❌ No oversized rounded corners (`rounded-3xl`).

### 5.3 High-Density Operational Tables
- **Container**: White card container with `border border-neutral-200 rounded-lg overflow-hidden`.
- **Header**: Light warm neutral header (`bg-neutral-50/75`), thin bottom border (`border-b border-neutral-200`), uppercase compact titles ($11\text{px}$ / `text-xs font-medium text-neutral-500 uppercase tracking-wider`).
- **Rows**: Crisp dividers (`divide-y divide-neutral-200`), hover highlighting (`hover:bg-neutral-50/50`), cell padding `py-3 px-4 text-sm text-neutral-700`.
- **Alignment**: Text left-aligned; quantities, square footage, dates, and amounts (₹) right-aligned with `font-mono`.
- **Actions Cell**: Pinned right cell with 3-dot dropdown menu trigger or inline compact secondary action button.

### 5.4 Form Controls & Inputs
- **Labels**: $13\text{px}$ / `text-sm font-medium text-neutral-800 mb-1.5 block`.
- **Inputs & Selects**: Crisp white background, thin border (`border border-neutral-300`), compact height ($36\text{px}$ / `h-9 px-3`), modest radius (`rounded-md`), text $14\text{px}$, focus state: `focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none`.
- **Helper Text**: $12\text{px}$ / `text-xs text-neutral-500 mt-1`.
- **Validation Errors**: Red border (`border-rose-400 focus:border-rose-500 focus:ring-rose-500`), error text $12\text{px}$ / `text-xs text-rose-600 mt-1`.

### 5.5 Drawers / Slide-Overs
- **Purpose**: Inspecting resource specifications, editing inventory details, review of booking ledgers.
- **Specification**: Right-anchored slide-over panel, width $480\text{px}$ to $640\text{px}$, white surface, backdrop overlay (`bg-neutral-900/40`), sticky header with close icon (`✕`) and title, scrollable body, sticky footer with action buttons.

### 5.6 Modals
- **Purpose**: High-friction decisions (decline booking, cancel campaign, member invitation, confirm payment).
- **Specification**: Centered overlay, max-width $480\text{px}$ to $540\text{px}$, white card with $8\text{px}$ radius, thin border, clear title, concise descriptive copy, paired Primary & Secondary buttons right-aligned.

---

## 6. System State UX Specifications

### 6.1 Empty States
- **Mandatory Anatomy**:
  1. Subtle neutral illustration or icon inside warm neutral circle (`w-12 h-12 bg-neutral-100 rounded-full`).
  2. Clear Heading ($16\text{px}$ / `font-semibold text-neutral-900`).
  3. Explanatory Subtitle ($13\text{px}$ / `text-neutral-500 max-w-sm text-center`).
  4. Single Primary CTA Button (e.g., "+ Register First Resource").

### 6.2 Loading States
- **Directives**:
  - No jarring layout shifts.
  - Tables display 5 skeleton rows with pulse animation (`bg-neutral-200/70 rounded h-4`).
  - Cards render skeleton metric boxes.
  - Buttons show compact inline spinner ($16\text{px}$) with dimmed text when submitting forms.

### 6.3 Error States
- **Inline Alert Banners**: Warm neutral/rose card (`bg-rose-50 border border-rose-200 text-rose-800 text-sm p-3.5 rounded-md flex items-center justify-between`). Includes explicit action trigger (`Retry`).
- **Network Failures**: Dedicated error card with descriptive guidance and status code.

### 6.4 Success Notifications (Toasts)
- **Specification**: Fixed top-right floating toast card ($320\text{px}$ width), white background, emerald accent border, auto-dismiss in 4 seconds.

---

## 7. Accessibility & Responsive Directives

1. **Contrast Standards**: All text satisfies WCAG AA contrast ratio ($\ge 4.5:1$ for normal text, $\ge 3:1$ for large text).
2. **Keyboard Navigability**: Interactive elements feature visible orange focus outlines (`ring-2 ring-orange-500 ring-offset-2`).
3. **Responsive Degradation**:
   - Desktop ($\ge 1280\text{px}$): Full high-density tables and multi-column forms.
   - Laptop / Tablet ($768\text{px}$ to $1279\text{px}$): Tables enable smooth horizontal scrolling container (`overflow-x-auto`); navigation collapses overflow items.
   - Mobile ($< 768\text{px}$): Top navigation collapses into a dedicated slide-out menu drawer; table rows convert into stacked resource cards.
