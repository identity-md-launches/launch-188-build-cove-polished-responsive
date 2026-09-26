# Cove design system

This document describes the design as implemented in the final source of the Cove lending simulation. Every value below is taken from `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/components.css` and the components under `src/components/`. It exists so that another page can be added that belongs to the same product.

## Overview

Cove is a lending dashboard for a crypto-literate person managing one position: ETH collateral against USDC debt. The visual character is a quiet, light financial tool: a near-white cool-gray page, white cards, a single deep-teal accent used for the one primary action per view and for “current” states, and semibold tabular figures that carry the hierarchy. Decoration is limited to a brand mark and one progress bar; the information and its order do the work.

System-wide rules:

- **One primary action per view** gets the filled accent; every peer action is outlined or quiet.
- **Figures lead.** Values are semibold, tabular, and larger than their labels; labels are 13px secondary text above them.
- **Group with space, then with a hairline.** Card sections are separated by a 1px divider only after a 24px gap; inside a section, 8px to 16px spacing does the grouping.
- **Simulation is always visible.** The header badge, the notice, the panel hint and the footer restate that nothing is real. New pages keep at least the header badge and footer.

Page-specific arrangements (not rules): the two-column dashboard grid, the sticky action panel and the LTV bar belong to the dashboard page.

## Colors

Declared in `src/styles/tokens.css` in `oklch()`. Two tiers: primitives named by hue (never used in components) and semantic tokens named by role (the only tier components use). Light theme only; there is no dark theme and none should be added by mechanically inverting these values.

### Primitives

| Token | Value | Consumed by |
| --- | --- | --- |
| `--gray-0` | `oklch(1 0 0)` | surface, text on accent |
| `--gray-50` | `oklch(0.982 0.003 230)` | page background |
| `--gray-100` | `oklch(0.962 0.004 230)` | subtle/inset/hover backgrounds |
| `--gray-200` | `oklch(0.92 0.006 230)` | dividers |
| `--gray-300` | `oklch(0.86 0.009 230)` | strong dividers |
| `--gray-400` | `oklch(0.655 0.015 230)` | control borders (measured 3.15:1 on white) |
| `--gray-500` | `oklch(0.535 0.018 230)` | tertiary text, placeholder (measured 5.16:1 on white) |
| `--gray-600` | `oklch(0.49 0.02 230)` | secondary text (measured 6.21:1 on white) |
| `--gray-800` | `oklch(0.3 0.02 230)` | generic coin glyph fill |
| `--gray-900` | `oklch(0.22 0.02 230)` | body text |
| `--gray-950` | `oklch(0.17 0.02 230)` | headings, key figures |
| `--teal-50` | `oklch(0.972 0.018 200)` | accent-soft background |
| `--teal-100` | `oklch(0.935 0.04 200)` | text selection |
| `--teal-200` | `oklch(0.87 0.07 200)` | accent border |
| `--teal-600` | `oklch(0.52 0.1 200)` | focus ring (measured 5.19:1 on white, 4.66:1 on inset) |
| `--teal-700` | `oklch(0.45 0.09 200)` | accent solid fill, ETH glyph (white text measured 6.94:1) |
| `--teal-800` | `oklch(0.39 0.08 200)` | accent text, links, solid hover |
| `--teal-900` | `oklch(0.32 0.065 200)` | solid active |
| `--green-50` / `--green-700` | `oklch(0.965 0.03 150)` / `oklch(0.45 0.12 150)` | success badge and result (measured 6.42:1) |
| `--amber-50` / `--amber-700` | `oklch(0.968 0.04 80)` / `oklch(0.5 0.12 70)` | warning badge, LTV bar over max |
| `--red-50` / `--red-200` / `--red-700` | `oklch(0.965 0.02 25)` / `oklch(0.86 0.07 25)` / `oklch(0.5 0.18 25)` | errors, danger badge, destructive confirm |

### Semantic roles

| Role | Token | Points at |
| --- | --- | --- |
| Page background | `--color-bg-page` | gray-50 |
| Card / control surface | `--color-bg-surface` | gray-0 |
| Subtle, inset, hover | `--color-bg-subtle`, `--color-bg-inset`, `--color-bg-hover` | gray-100 |
| Accent soft (notice, current nav, badge) | `--color-bg-accent-soft` | teal-50 |
| Accent solid (+ hover, active) | `--color-bg-accent-solid`, `-hover`, `-active` | teal-700 / 800 / 900 |
| Dialog backdrop | `--color-bg-backdrop` | `oklch(0.17 0.02 230 / 0.45)` |
| Text: primary / heading / secondary / tertiary / placeholder | `--color-text-primary`, `-heading`, `-secondary`, `-tertiary`, `-placeholder` | gray-900 / 950 / 600 / 500 / 500 |
| Text on accent, accent text, links | `--color-text-on-accent`, `--color-text-accent`, `--color-text-link` | gray-0, teal-800, teal-800 |
| Dividers | `--color-border`, `--color-border-strong` | gray-200, gray-300 |
| Input and outlined-button boundary | `--color-border-control` | gray-400 |
| Accent border, danger border | `--color-border-accent`, `--color-border-danger` | teal-200, red-200 |
| Focus ring | `--color-focus-ring` | teal-600 |
| Status text/background | `--color-status-{success,warning,danger}-{text,bg}` | green/amber/red 700 and 50 |

Meaning is fixed per hue: teal = interactive or current; green = healthy/complete; amber = watch; red = error, at-risk or destructive. Status is never carried by color alone: every badge has text, every error has an icon and text, and the LTV bar has a text legend and an accessible name.

Contrast figures above were measured in Chromium on the rendered export with a WCAG 2 luminance calculation (see `artifacts/validation.md`). All measured text pairs are at or above 4.5:1; measured control borders and the focus ring are at or above 3:1.

## Typography

- Family: `--font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`. No web font is bundled; the system face renders. `--font-mono` is declared but not consumed by any component.
- Root: `font-size: 100%`, `line-height: 1.5`, antialiased smoothing on `html` (`src/styles/base.css`).
- Scale (`tokens.css`): `--text-xs` 12px (badges, table captions), `--text-sm` 13px (labels, helper, table body, footer), `--text-base` 15px (body, controls, key/value rows), `--text-md` 17px (card titles, dialog title, review step title), `--text-lg` 22px (page titles, stat values), `--text-xl` 28px (declared; not used on the current pages).
- Headings: weight 600, `line-height: 1.15`, `letter-spacing: -0.01em`, `text-wrap: balance`. Levels descend: page `h1` 22px → card `h2` 17px → section `h3` 13px uppercase secondary with `+0.04em` tracking. The dashboard’s `h1` is visually hidden; cards are `h2`.
- Body paragraphs use `text-wrap: pretty`; long-form text is capped at `68ch` (`.prose`) or `60ch` (`.page-head__lede`).
- Numbers: every changing value uses `font-variant-numeric: tabular-nums` (`.stat__value`, `.kv dd`, `.table .num`, `.activity__amount`, `.amount__input`, `.field__meta`). Stat values split into `.stat__number` (22px, 600, `white-space: nowrap`) and `.stat__unit` (13px, 500, secondary, non-breaking). Table numbers align to the trailing edge.
- Inputs: `.amount__input` is 20px semibold on all viewports, above the 16px iOS zoom threshold.
- Links: underline from font metrics with a `0.12em` offset (`base.css`).
- Weight floor: nothing under 400; 500 for nav links, tab labels, table headers and key/value values; 600 for buttons, labels, badges and headings; 650 for the brand.

## Layout

- Container: `.container` is `max-width: 1120px`, centered, with `--container-pad` of 16px (≥40rem: 24px).
- Spacing scale: `--space-1` 4px, `-2` 8px, `-3` 12px, `-4` 16px, `-5` 20px, `-6` 24px, `-8` 32px, `-10` 40px, `-12` 48px. Cards pad 20px (≥40rem: 24px). Card head to content: 16px. Sections: 24px gap plus a hairline. Form groups: 20px between fields, 8px inside a field.
- Header: sticky, 56px minimum (`--header-height`), white with a bottom hairline. Brand row, primary nav (`<nav aria-label="Primary">`), reset action. Below 48rem the reset action joins the brand row and the nav wraps under it (`.site-header__inner` ordering rules in `components.css`).
- Dashboard grid (`.dashboard`): single column on narrow screens in the order position → actions → markets, which is also the DOM order. From 60rem it becomes `minmax(0,1fr) 360px` (`--panel-width`) with the action panel spanning both rows and sticking below the header (`top: header height + 16px`).
- Stats (`.stat-grid`): `repeat(auto-fit, minmax(8.5rem, 1fr))` with a 16px/12px gap, so four columns at 1280, three at 960, two at 390 and one at 320. Values never break mid-number.
- Key/value lists (`.kv`): `grid-template-columns: auto 1fr`; terms lead, values trail and are right-aligned. `.kv--compact` drops to 13px.
- Market table (`.table`): a real `<table>` with `min-width: 34rem` inside a horizontally scrolling `.table-wrap` that bleeds into the card padding. Below 40rem the same markup stacks: the header row is visually hidden and each cell prints its `data-label` before the value.
- Logical properties throughout (`padding-inline`, `margin-inline-start`, `inset-inline-start`, `text-align: end`); the layout is prepared for RTL, though RTL was not rendered in review.
- Observed in the browser: 1280, 960, 700, 390 and 320px widths with no horizontal overflow. Widths above 1280 and browser-native zoom were not checked.

## Elevation & depth

Flat surfaces with one soft card shadow; borders are reserved for structure and control boundaries.

- `--shadow-card`: `0 1px 2px oklch(0.17 0.02 230 / 0.05), 0 0 0 1px oklch(0.17 0.02 230 / 0.06)` on `.card` (the 1px ring replaces a border).
- `--shadow-dialog`: `0 24px 48px -12px oklch(0.17 0.02 230 / 0.35), 0 0 0 1px oklch(0.17 0.02 230 / 0.08)` on `.dialog`, over the `--color-bg-backdrop` scrim.
- Active tab: `0 1px 2px oklch(0.17 0.02 230 / 0.12)` lifts the selected segment from the inset track.
- Hairlines (`--color-border`) divide card sections, table rows and the header/footer from the page.
- Sticky header and sticky action panel sit above content (`z-index: 20` for the header); the skip link is at 100.

## Shapes

Radius tokens: `--radius-xs` 4px, `-sm` 6px, `-md` 8px, `-lg` 12px, `-xl` 16px, `--radius-pill` 999px.

- Cards, dialog: 16px. Notice, amount field, preview box, result box, callout, tab track: 12px. Buttons: 8px; small buttons: 6px. Badges and the LTV bar: pill.
- Nesting is concentric where elements touch: the tab track is 12px with 3px padding and its tabs are `calc(12px - 3px)`.
- Coin glyphs are 22px circles; the brand mark is a 28px rounded square (SVG, `rx="8"` at 32 units).

## Components

All components are React function components with plain CSS classes; none is a packaged library export. Reuse them by importing from `src/components/`.

### Header (`src/components/Header.tsx`)
Brand link (`.brand`, 40px tall hit area, `aria-label="Cove, dashboard"`), the `Simulation` badge, primary nav with `aria-current="page"` on the active route, and the `Reset demo` outlined small button. Route highlighting is driven by `useHashRoute`.

### Buttons (`.btn` in `components.css`)
Base: 40px min height, 8px radius, 600 weight, `scale: 0.96` on `:active` (disabled under reduced motion). Variants: `.btn--primary` (accent solid, white text), `.btn--secondary` (white, control border), `.btn--ghost`, `.btn--danger` (red solid, used only for the destructive confirm). Modifiers: `.btn--sm` (32px), `.btn--block`. `.btn-row` lays peers side by side and wraps. Focus uses the global `:focus-visible` ring.

### Badge (`.badge`)
Uppercase 12px pill with `0.04em` tracking. Default is accent-soft (used for `Simulation` and interactive market roles). `--neutral` for view-only, `--success` / `--warning` / `--danger` for health bands. Text is always present.

### Card (`.card`, `.card__head`, `.card__title`, `.card__hint`, `.card__section`, `.card__section-title`)
Section wrappers add the 24px gap plus hairline between consecutive sections. Card titles are `h2`; section titles are `h3`.

### Stat (`.stat`, `.stat__label`, `.stat__value` > `.stat__number` + `.stat__unit`, `.stat__sub`, `.stat__badge`)
Label above value above sub-line. Used in `PositionSummary` for collateral, debt, LTV and health factor.

### LTV bar (`.ltv-bar` in `PositionSummary.tsx`)
`role="img"` track with an accessible name that states the LTV, the maximum and the liquidation threshold; fill turns amber at or above 70% and red at or above 80%; two marker ticks; a text legend beneath.

### Key/value list (`.kv`, `.kv--compact`, `.delta`)
`<dl>` with terms leading and values trailing. `Delta` (in `ActionPanel.tsx`) renders `from → to` with a visually hidden “to” and a hidden “(over limit)” note when the projection breaks a limit; the target value turns `--color-status-danger-text`.

### Amount field (`.field`, `.amount`, `.amount__input`, `.amount__unit`, `.field__meta`, `.field__help`, `.field__error`)
Visible `<label for>`; `type="text" inputmode="decimal" autocomplete="off"`; the limit is shown on the label row and referenced through `aria-describedby`; a `Max` button (`aria-label="Use maximum, …"`) fills the exact limit. On submit the field gets `aria-invalid="true"`, the error paragraph (icon + text) is added to `aria-describedby`, and focus returns to the input. The wrapper draws the focus ring through `:focus-within`; the invalid wrapper uses the danger border.

### Tabs (`.tabs`, `.tab` in `ActionPanel.tsx`)
`role="tablist"` with four `role="tab"` buttons using roving tabindex: arrow keys, Home and End move selection and focus; Tab leaves the group. The panel is `role="tabpanel"` labelled by the active tab. Switching tabs clears the form.

### Action panel steps (`.step`, `.preview`, `.result`, `.callout`)
Three states: form (with live “After this action” preview), review (`Review <action>` heading receives focus; `Back` / `Confirm <action>`), done (`<Action> complete (simulated)` heading receives focus; `Done` returns focus to the input). Each completed action also updates the polite `role="status"` live region in `App.tsx`.

### Reset dialog (`src/components/ResetDialog.tsx`)
Native `<dialog>` opened with `showModal()`, labelled by its title and described by its body, `overscroll-behavior: contain`. Focus lands on `Cancel`; Escape or `Cancel` closes; `Reset demo` (danger) confirms. The opener returns focus to the header button.

### Market table (`src/components/MarketTable.tsx`)
Caption (visually hidden), `scope="col"` headers, `scope="row"` asset cells with a coin glyph, `.num` cells right-aligned, status badge. `extended` adds the Max LTV column on the Markets page. Stacks below 40rem.

### Notice (`src/components/DemoNotice.tsx`)
`role="note"` accent-soft box with an info icon; the simulation disclosure used at the top of the dashboard.

### Icons (`src/components/Icons.tsx`)
Inline SVG, `currentColor`, 1.75px–2px strokes to match semibold neighbours, `aria-hidden`. Info, alert, check and the brand mark.

## Do's and Don'ts

- **Do** start a new page inside `<main>` → `.container` → `.page-head` (h1 + lede) → one or more `.card`s. Section a card with `.card__section` rather than ad-hoc margins.
- **Do** put one `.btn--primary` per view; make everything else `.btn--secondary` or `.btn--ghost`. Use `.btn--danger` only inside a confirmation for a destructive action.
- **Do** use semantic tokens (`--color-text-secondary`, `--color-border-control`) in components; never reference a `--gray-*` or `--teal-*` primitive directly, and never introduce hex or rgb values beside the oklch tokens.
- **Do** render every changing number with tabular figures and format it through `src/lib/format.ts` from integer micro-units; never format with floating-point arithmetic.
- **Do** keep the simulation disclosures (header badge, footer, panel hint) on any new page; new copy should say “simulated” for completed actions.
- **Do** keep errors next to the field, phrased as an instruction with the exact limit, and move focus to the field.
- **Don't** add a dark theme, a second accent hue, a web font, motion beyond the 120–180ms color/scale transitions, or dialogs for non-destructive steps.
- **Don't** use green, amber or red for anything other than health/success, watch and error/danger respectively; don't use teal on non-interactive text.
- **Don't** rely on the table’s horizontal scroll on narrow screens: reuse the stacking pattern (`data-label` on cells) for any new table.
- **Don't** remove `:focus-visible` outlines or replace them with a colour that has not been measured against every surface it can cross.

### Recipe: adding a matching page

1. Add a route id, hash and label to `ROUTES` in `src/hooks/useHashRoute.ts` and extend `parse()`; add the branch in `App.tsx` next to `MarketsPage` / `AboutPage`.
2. Create `src/pages/<Name>Page.tsx` returning a `.page-head` (an `h1.page-head__title` and a `p.page-head__lede`) followed by a `section.card` with `.card__head` (`h2.card__title` + `.card__hint`) and `.card__section` blocks.
3. For figures use `.stat-grid` > `.stat`; for label/value rows use `dl.kv`; for tabular data reuse `MarketTable` or copy its `<table class="table">` structure including `data-label` attributes.
4. Actions: a form with `.field`, the `.amount` wrapper and `.btn.btn--primary.btn--block`; validate on submit, set `aria-invalid` and `aria-describedby`, and announce results through the existing `role="status"` region by lifting a message to `App.tsx`.
5. Keep copy in sentence case, verb-first buttons, and label every rate as illustrative. Rebuild with `npm run build` and commit `dist/`.
