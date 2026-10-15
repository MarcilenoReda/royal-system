---
name: Musleh Repair Operations
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#006242'
  on-tertiary: '#ffffff'
  tertiary-container: '#007d55'
  on-tertiary-container: '#bdffdb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: '0'
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: '0'
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: '0'
  headline-sm:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: '0'
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: '0'
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: '0'
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: '0'
  label-lg:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: '0'
  label-md:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: '0'
  label-sm:
    fontFamily: IBM Plex Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-lg: 1.5rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system is engineered for busy electronics and device repair workshops that require speed, bulletproof operational clarity, and ergonomic right-to-left (RTL) workflows. Technicians, front-desk staff, and workshop managers operate in high-turnaround environments where hardware intake, diagnostics, spare parts allocation, and customer handoffs must occur without cognitive friction.

The aesthetic blends utilitarian enterprise reliability with crisp, modern SaaS precision. It leverages an assertive light workspace paired with a grounding dark slate navigation rail, emphasizing durability, structural competence, and mechanical order. Surfaces are pure, contrast is deliberate, and visual noise is eliminated in favor of scan-efficient data tables, clear status markers, and tactile rapid-entry inputs designed for both desktop counters and workshop tablet stations.

## Colors

The color architecture is built around functional status classification and high legibility across ticketing lifecycles.

- **Primary (`#2563EB`):** Vibrant cobalt blue designating intentional action, active ticket focus, primary CTA execution, and active stages (مستلم - Received / قيد الإصلاح - Under Repair).
- **Secondary (`#0F172A` / `#1E293B`):** Deep workshop slate utilized for the commanding RTL sidebar navigation, persistent utility bars, and high-hierarchy text.
- **Tertiary (`#10B981` / `#059669`):** Resilient emerald designating success and completion milestones (جاهز للتسليم - Ready for Pickup / تم التسليم - Delivered).
- **Amber Status (`#F59E0B` / `#D97706`):** Dedicated state token for pending customer confirmations, parts procurement, and triage holds (في الانتظار - Waiting / Pending Approval).
- **Destructive Status (`#EF4444` / `#DC2626`):** Critical flags, unrepairable states, and cancellations (مرفوض - Rejected / ملغي - Cancelled).
- **Neutral Canvas:** Base surfaces utilize a cool off-white (`#F8FAFC` to `#F1F5F9`), while interactive cards and panels deploy pure white (`#FFFFFF`) framed with disciplined slate borders (`#E2E8F0`).

## Typography

The type system relies on IBM Plex Sans across all Arabic and Latin strings, providing structured, geometric glyphs with open counters and balanced vertical proportions. This guarantees that complex Arabic technical terminology, device model numbers, and serial codes sit harmoniously on the same visual baseline.

Arabic typography requires generous line-height to accommodate ascenders, descenders, and tashkeel marks without clipping. Numbers default to clean, tabular lining figures to ensure repair prices (SAR/AED/EGP), inventory tallies, and ticket IDs align strictly within RTL tabular grids.

## Layout & Spacing

The layout operates on a standard 8px baseline rhythm across an asymmetrical dashboard shell. 

- **Navigation Spine:** A persistent right-docked vertical rail (width: `260px` desktop, collapsing to `72px` icon rail on tablet) houses core operational sections (استقبال الأجهزة - Intake, التذاكر - Tickets, قطع الغيار - Spare Parts, الفواتير - Invoices).
- **Workbench Canvas:** Content flows leftward into a fluid grid container (`max-width: 1600px`). Forms and intake dialogs follow an optimized dual-column arrangement (`space-lg` gap) allowing fast tabbing between customer details and hardware symptoms.
- **Breakpoints:**
  - **Mobile (< 768px):** Single column reflow, docked bottom workflow bar for rapid barcode scanning and quick ticket creation, outer margin set to `margin-mobile` (16px).
  - **Tablet (768px - 1024px):** Compact collapsible sidebar, 2-column card layout for active workbench items, `gutter` set to 20px.
  - **Desktop (> 1024px):** Full-width master-detail views, side-by-side device diagnostic checklists, and multi-column tabular queues with `gutter-lg` (24px).

## Elevation & Depth

Visual hierarchy uses crisp boundaries over deep perspective to maintain technical utility:

- **Surface Tiers:** Backgrounds live at `#F8FAFC`. Operational work surfaces (ticket cards, detail sheets) sit on level-1 white (`#FFFFFF`) outlined with crisp `1px` borders (`#E2E8F0`).
- **Ambient Elevation (Level 1 - Resting Cards):** `0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.03)`.
- **Raised Elevation (Level 2 - Hovered Rows & Floating Panels):** `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Overlay Elevation (Level 3 - Diagnostic Modals & Quick Drawers):** `0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.05)` coupled with a slate backdrop veil (`#0F172A` at 40% opacity).

## Shapes

The design system establishes a uniform corner geometry via roundedness level 2:
- Standard interactive elements (input fields, action buttons, table cell selections) feature `0.5rem` (`8px`) border radius.
- Enclosures and structural containers (repair cards, intake sections, inventory metrics) feature `rounded-lg` at `1rem` (`16px`).
- Floating tooltips and status badges use pill radiuses (`9999px`) to create clear visual separation from rectangular data fields.

## Components

### Buttons
- **Primary:** Solid `#2563EB` fill with white text, font weight 600, radius `8px`, subtle hover transition to `#1D4ED8`. Active state depresses 1px.
- **Secondary:** White background with `#E2E8F0` border, `#0F172A` text, hover to `#F8FAFC` and border `#CBD5E1`.
- **Destructive:** Soft rose tinted surface (`#FEF2F2`) with bold `#DC2626` text, shifting to solid `#DC2626` fill with white text on confirmation prompts.
- **Icon Alignment:** Action icons in buttons are placed to the right of the Arabic label with an 8px offset (`margin-left: 8px; margin-right: 0`).

### Status Badges & Chips
- Status indicators are pill-shaped (`rounded-full`), padded `4px 12px`, with bold `label-sm` typography:
  - **مستلم / قيد الإصلاح (Blue):** `#EFF6FF` background, `#1D4ED8` text, `#BFDBFE` border.
  - **في الانتظار (Amber):** `#FFFBEB` background, `#B45309` text, `#FDE68A` border.
  - **جاهز للتسليم / تم التسليم (Green):** `#ECFDF5` background, `#047857` text, `#A7F3D0` border.
  - **مرفوض / ملغي (Red):** `#FEF2F2` background, `#B91C1C` text, `#FECACA` border.

### Input Fields & Rapid Intake
- Inputs are high-contrast with `40px` height (or `48px` for barcode/IMEI lookup), white background, `#CBD5E1` border, and sharp `#0F172A` text.
- Focus ring: `2px` solid `#2563EB` with a `2px` offset.
- Floating helper chips and keyboard shortcuts are anchored to the left of the input (opposite the Arabic text alignment).

### Data Tables (RTL Queue)
- Header row: `#F8FAFC` surface, `#475569` uppercase/small-bold labels, bottom border `#E2E8F0`.
- Data rows: `#FFFFFF` surface, hover state tint `#F1F5F9`. First column (Ticket ID) pinned to the right with monospace bold font.
- Numeric columns (costs, phone numbers, warranty days remaining) feature strict right-to-left alignment with monospace numerals.

### Device Cards
- Structural white cards framed with `#E2E8F0`. Header houses customer name, ticket ID, and status badge. Body segment lists device model (e.g., iPhone 13 Pro Max), reported failure, assigned technician, and a linear progress tracker indicating workflow milestones.