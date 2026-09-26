# Cove — crypto lending dashboard (simulation)

Cove is a polished, responsive demo of a crypto lending dashboard: supply ETH as collateral, borrow USDC against it, repay and withdraw. **Everything is simulated.** Prices and rates are fixed, illustrative constants; there is no wallet connection, no signing, no network call, no contract and no real financial service. Cove is not an audited or launched protocol.

- Stack: Vite 6, React 19, TypeScript 5. No other runtime dependencies.
- Routing: hash routes (`#/`, `#/markets`, `#/about`), so the static export works from any subpath or gateway with no server rewrites.
- Assets: `vite.config.ts` sets `base: "./"`; every URL in `dist/index.html` is relative.
- Design system: see [DESIGN.md](./DESIGN.md).

## Demo parameters

| Parameter | Value |
| --- | --- |
| Demo wallet at start | 2 ETH, 1,000 USDC, no collateral, no debt |
| Illustrative ETH price | $3,000 (USDC = $1) |
| Maximum loan-to-value (borrow and withdraw) | 70% |
| Liquidation threshold (health factor) | 80% |
| Health factor | collateral USD × 0.80 ÷ debt USD; shown as “No debt” when debt is zero |
| Interest | does not accrue; rates are display-only annualized figures |

All balances are stored as integer micro-units and formatted with string arithmetic (`src/lib/units.ts`), so figures never show floating-point artifacts.

## Install and preview

```bash
npm install          # installs Vite, React, TypeScript (network needed once)
npm run dev          # Vite dev server with hot reload
```

To preview the committed static export without rebuilding, serve `dist/` with any static file server, for example:

```bash
npx serve dist       # or: python3 -m http.server --directory dist 8080
```

Open the printed URL. The app also works from a subpath such as `http://host/anything/dist/`.

## Rebuild, typecheck, test

```bash
npm run typecheck    # tsc --noEmit for src/ and for vite.config.ts
npm run build        # production build into dist/ (committed)
npm test             # node --test test/scratch/*.test.ts (pure lending math; scratch tests, not shipped)
```

`dist/` is committed on purpose: the publisher serves the committed export and does not rebuild. After any source change, run `npm run build` and commit the new `dist/` contents.

## Publish

The export is fully static. Any of these work:

- **GitHub Pages / any static host:** upload the contents of `dist/` (index.html at the root). Relative asset paths mean no base-path configuration is needed.
- **IPFS:** add the `dist/` directory (for example `ipfs add -r dist` or a pinning service’s folder upload) and open the folder CID through a gateway. Hash routing and relative URLs keep it working at `/ipfs/<cid>/`.
- **GitHub source delivery:** push this repository as-is; the lockfile, source and `dist/` are all included, `node_modules/` is ignored.

Publishing was not performed from this workspace: no GitHub credentials, `gh` CLI or IPFS tooling were available in the environment.

## Verification record (what actually ran)

- `npm run typecheck` — exit 0.
- `npm test` — 7 tests passed (parsing/formatting, the primary acceptance scenario, LTV limits on borrow and withdraw, repay limits, full round trip, invalid amounts).
- `npm run build` — exit 0; `dist/index.html` plus one JS and one CSS asset with `./assets/...` URLs.
- Browser inspection of the built `dist/` at 1280×800, 960×800, 700×400, 390×844 and 320×568 with the assigned Playwright browser tool: primary scenario (supply 1 ETH, borrow 1,000 USDC → 1 ETH / $3,000 collateral, 1,000 USDC debt, 33.33% LTV, health factor 2.40, wallet 1 ETH and 2,000 USDC), invalid and over-limit inputs with recovery messages, repay and withdraw updates, reset dialog with focus return, keyboard flow, console and resource checks. Details, findings and limitations are in `artifacts/validation.md`.

## Project layout

```
index.html                 Vite entry
vite.config.ts             base "./", React plugin
src/main.tsx               mounts <App/> and loads the stylesheets
src/App.tsx                layout, hash routing, live region, reset dialog wiring
src/hooks/useHashRoute.ts  hash router
src/state/useDemo.ts       in-memory demo state (position, activity, reset)
src/lib/units.ts           fixed-point parsing/formatting
src/lib/lending.ts         lending math: metrics, validation, apply/project
src/lib/format.ts          display formatting helpers
src/lib/markets.ts         illustrative reference markets
src/components/*           Header, DemoNotice, PositionSummary, ActionPanel, MarketTable, MarketOverview, ResetDialog, Icons
src/pages/*                MarketsPage, AboutPage
src/styles/tokens.css      design tokens (colors, type, spacing, radius, motion)
src/styles/base.css        resets, element defaults, focus ring
src/styles/components.css  component and layout styles
public/favicon.svg         brand mark
dist/                      committed production export
```

## License and attribution

Application code in this repository is provided as a demo. Design review followed the pinned Better Interface guide (Jakub Krehel, MIT) and its documentation method adapted from Impeccable (Paul Bakaus, Apache-2.0).
