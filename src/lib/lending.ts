/**
 * Pure lending math for the Cove demo.
 *
 * All amounts are integer micro-units (see units.ts). Prices are whole USD per
 * token; ratios are basis points. Nothing here touches the network or a wallet:
 * it is a deterministic simulation with illustrative parameters.
 */

// Explicit .ts extensions let Node's test runner import this module directly.
import { SCALE } from "./units.ts";

/** Illustrative parameters. These are demo constants, not market data. */
export const PARAMS = {
  /** Illustrative ETH price in USD. */
  ethPriceUsd: 3000,
  /** Maximum loan-to-value for borrowing and withdrawing, in basis points. */
  maxLtvBps: 7000,
  /** Liquidation threshold used by the health factor, in basis points. */
  liquidationThresholdBps: 8000,
} as const;

export interface Position {
  /** ETH held in the demo wallet (micro-ETH). */
  walletEth: number;
  /** USDC held in the demo wallet (micro-USDC). */
  walletUsdc: number;
  /** ETH supplied as collateral (micro-ETH). */
  collateralEth: number;
  /** USDC borrowed (micro-USDC). */
  debtUsdc: number;
}

export const INITIAL_POSITION: Position = {
  walletEth: 2 * SCALE,
  walletUsdc: 1000 * SCALE,
  collateralEth: 0,
  debtUsdc: 0,
};

export type ActionKind = "supply" | "borrow" | "repay" | "withdraw";

export interface Metrics {
  /** Collateral value in micro-USD. */
  collateralUsd: number;
  /** Debt value in micro-USD (USDC is treated as exactly 1 USD). */
  debtUsd: number;
  /** Current LTV in basis points, or null with no collateral and no debt. */
  ltvBps: number | null;
  /** Health factor scaled by 100 (2.40 -> 240), or null when there is no debt. */
  healthFactorX100: number | null;
  /** Remaining USDC that can be borrowed under the maximum LTV (micro-USDC). */
  availableToBorrowUsdc: number;
  /** ETH that can be withdrawn without exceeding the maximum LTV (micro-ETH). */
  withdrawableEth: number;
}

export function ethToUsd(microEth: number, priceUsd = PARAMS.ethPriceUsd): number {
  return microEth * priceUsd;
}

/** Compute the derived figures for a position. */
export function computeMetrics(p: Position): Metrics {
  const collateralUsd = ethToUsd(p.collateralEth);
  const debtUsd = p.debtUsdc;

  const ltvBps = collateralUsd > 0 ? Math.round((debtUsd * 10_000) / collateralUsd) : null;

  const healthFactorX100 =
    debtUsd > 0 ? Math.round((collateralUsd * PARAMS.liquidationThresholdBps) / (debtUsd * 100)) : null;

  const borrowCapacityUsd = Math.floor((collateralUsd * PARAMS.maxLtvBps) / 10_000);
  const availableToBorrowUsdc = Math.max(0, borrowCapacityUsd - debtUsd);

  // Collateral that must stay locked so debt <= maxLtv * collateral.
  const requiredCollateralEth =
    debtUsd > 0 ? Math.ceil((debtUsd * 10_000) / (PARAMS.maxLtvBps * PARAMS.ethPriceUsd)) : 0;
  const withdrawableEth = Math.max(0, p.collateralEth - requiredCollateralEth);

  return { collateralUsd, debtUsd, ltvBps, healthFactorX100, availableToBorrowUsdc, withdrawableEth };
}

export type ValidationError = {
  code:
    | "insufficient-wallet"
    | "exceeds-available-borrow"
    | "exceeds-debt"
    | "exceeds-withdrawable"
    | "no-collateral"
    | "no-debt";
  /** Maximum amount that would have been accepted, in micro-units. */
  limit: number;
};

export type Validation = { ok: true } | { ok: false; error: ValidationError };

/** Check a positive amount against wallet balances and collateral limits. */
export function validateAction(kind: ActionKind, amount: number, p: Position): Validation {
  const m = computeMetrics(p);
  switch (kind) {
    case "supply":
      if (amount > p.walletEth) return fail("insufficient-wallet", p.walletEth);
      return { ok: true };
    case "borrow":
      if (p.collateralEth === 0) return fail("no-collateral", 0);
      if (amount > m.availableToBorrowUsdc) return fail("exceeds-available-borrow", m.availableToBorrowUsdc);
      return { ok: true };
    case "repay": {
      if (p.debtUsdc === 0) return fail("no-debt", 0);
      const limit = Math.min(p.debtUsdc, p.walletUsdc);
      if (amount > p.walletUsdc) return fail("insufficient-wallet", limit);
      if (amount > p.debtUsdc) return fail("exceeds-debt", limit);
      return { ok: true };
    }
    case "withdraw":
      if (p.collateralEth === 0) return fail("no-collateral", 0);
      if (amount > m.withdrawableEth) return fail("exceeds-withdrawable", m.withdrawableEth);
      return { ok: true };
  }
}

function fail(code: ValidationError["code"], limit: number): Validation {
  return { ok: false, error: { code, limit } };
}

/** The largest amount the action accepts right now (micro-units). */
export function maxAmount(kind: ActionKind, p: Position): number {
  const m = computeMetrics(p);
  switch (kind) {
    case "supply":
      return p.walletEth;
    case "borrow":
      return m.availableToBorrowUsdc;
    case "repay":
      return Math.min(p.debtUsdc, p.walletUsdc);
    case "withdraw":
      return m.withdrawableEth;
  }
}

/**
 * Return the position after applying an action. Callers validate first; this
 * function still refuses to produce a negative balance.
 */
export function applyAction(kind: ActionKind, amount: number, p: Position): Position {
  if (!Number.isSafeInteger(amount) || amount <= 0) return p;
  const v = validateAction(kind, amount, p);
  if (!v.ok) return p;
  switch (kind) {
    case "supply":
      return { ...p, walletEth: p.walletEth - amount, collateralEth: p.collateralEth + amount };
    case "borrow":
      return { ...p, walletUsdc: p.walletUsdc + amount, debtUsdc: p.debtUsdc + amount };
    case "repay":
      return { ...p, walletUsdc: p.walletUsdc - amount, debtUsdc: p.debtUsdc - amount };
    case "withdraw":
      return { ...p, walletEth: p.walletEth + amount, collateralEth: p.collateralEth - amount };
  }
}

/** Projected position for a preview, ignoring validation so the preview can warn. */
export function projectAction(kind: ActionKind, amount: number, p: Position): Position {
  if (!Number.isSafeInteger(amount) || amount <= 0) return p;
  switch (kind) {
    case "supply":
      return { ...p, walletEth: p.walletEth - amount, collateralEth: p.collateralEth + amount };
    case "borrow":
      return { ...p, walletUsdc: p.walletUsdc + amount, debtUsdc: p.debtUsdc + amount };
    case "repay":
      return { ...p, walletUsdc: p.walletUsdc - amount, debtUsdc: p.debtUsdc - amount };
    case "withdraw":
      return { ...p, walletEth: p.walletEth + amount, collateralEth: p.collateralEth - amount };
  }
}

/** Health bands used for the redundant text cue beside the health figure. */
export type HealthBand = "none" | "safe" | "watch" | "risk";

export function healthBand(healthFactorX100: number | null): HealthBand {
  if (healthFactorX100 === null) return "none";
  if (healthFactorX100 >= 150) return "safe";
  if (healthFactorX100 >= 115) return "watch";
  return "risk";
}
