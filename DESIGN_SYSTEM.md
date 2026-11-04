# Design System

## Product direction

A practical inventory workspace that helps operational staff scan stock levels and act quickly. Keep navigation clear, make stock status explicit, and use consistent card, table, and form patterns. Decoration should stay secondary to item data.

## Color palette

| Role | Token | Value | Use |
|---|---|---|---|
| Primary | Evergreen | `#6656E8` | Main actions, selected navigation, focus accents |
| Primary hover | Deep violet | `#5142CE` | Hover and pressed primary actions |
| Navigation | Ink navy | `#171D2B` | Sidebar background |
| Page canvas | Cool gray | `#F5F6FA` | Main application background |
| Surface | White | `#FFFFFF` | Cards, panels, forms |
| Main text | Charcoal | `#202532` | Headings and primary labels |
| Secondary text | Slate | `#667085` | Descriptions, supporting copy |
| Border | Light gray | `#EAECF1` | Card and panel borders |
| Success | Green | `#24A36B` | Saved states and in-stock feedback |
| Warning | Amber | `#EDAA42` | Low-stock treatment |
| Danger | Red | `#E65C5C` | Out-of-stock and invalid states |

Stock states include text labels as well as color. Keep status colors limited to badges, summaries, and relevant feedback.

## Typography

Use Inter with Segoe UI and Arial fallbacks.

| Role | Size | Use |
|---|---:|---|
| Page heading | 27 px | Main view title |
| Section heading | 18 px | Cards and form sections |
| Metric | 32 px | Dashboard values; 22–25 px on small screens |
| Body | 14 px | General content and control labels |
| Supporting text | 11–14 px | Metadata, helper text, and status labels |

Use weight and spacing to establish hierarchy; avoid unnecessary all-caps text outside compact navigation labels.

## Spacing and layout

Use 8 px as the base spacing step, with common values of 8, 10, 14, 16, 20, 25, and 35 px. Desktop navigation is 250 px wide and reduces to 210 px at the tablet breakpoint. Use 12 px card radii, light borders, and restrained shadows. Keep numeric inventory values easy to compare and maintain consistent row alignment.

## Components

- **Buttons:** violet primary action, text/outline secondary actions, visible focus, and disabled states.
- **Navigation:** dark sidebar with a persistent active state; on phones it becomes a compact horizontal navigation row.
- **Metric cards:** label, value, and a short explanation, arranged in a five-card desktop row and two columns on narrower screens.
- **Inventory table:** searchable and sortable columns, category and status filters, row actions, and a no-results message. On mobile, preserve the table as a horizontally scrollable region.
- **Status labels:** separate treatments for In Stock, Low Stock, and Out of Stock; each includes readable text.
- **Forms:** persistent labels, required markers, inline field errors, and clear cancel/save actions.
- **Dialogs and feedback:** confirm stock adjustments, show success notifications, and provide a retry action after a simulated workspace load failure.
- **Loading:** neutral animated skeletons indicate the expected page structure. Motion respects `prefers-reduced-motion`.

## Responsive breakpoints

| Width | Adaptation |
|---:|---|
| Above 1000 px | Full sidebar, five summary cards, two dashboard panels |
| 601–1000 px | Narrower sidebar, two-column summary cards, stacked dashboard panels |
| 381–600 px | Compact top-to-bottom navigation, two-column metrics, one-column content |
| 380 px and below | Tightened page gutters and metric spacing for small phones |
