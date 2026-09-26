import { formatUnits } from "./units.ts";
import type { ActionKind, Metrics } from "./lending.ts";

export const TOKEN_FOR: Record<ActionKind, "ETH" | "USDC"> = {
  supply: "ETH",
  borrow: "USDC",
  repay: "USDC",
  withdraw: "ETH",
};

export const VERB: Record<ActionKind, string> = {
  supply: "Supply",
  borrow: "Borrow",
  repay: "Repay",
  withdraw: "Withdraw",
};

export const PAST: Record<ActionKind, string> = {
  supply: "Supplied",
  borrow: "Borrowed",
  repay: "Repaid",
  withdraw: "Withdrew",
};

/**
 * ETH with at least 2 and up to 6 fraction digits. Limits such as the
 * withdrawable amount are shown exactly, so an error message never names a
 * rounded figure the user has apparently not exceeded.
 */
export function fmtEth(units: number): string {
  return `${formatUnits(units, { min: 2, max: 6 })} ETH`;
}

/** USDC with exactly 2 fraction digits. */
export function fmtUsdc(units: number): string {
  return `${formatUnits(units, { min: 2, max: 2 })} USDC`;
}

/** A token amount in the unit of the given action. */
export function fmtToken(kind: ActionKind, units: number): string {
  return TOKEN_FOR[kind] === "ETH" ? fmtEth(units) : fmtUsdc(units);
}

/** USD from micro-USD, two decimals, with a currency prefix. */
export function fmtUsd(units: number): string {
  return `$${formatUnits(units, { min: 2, max: 2 })}`;
}

/** Whole-dollar USD price. */
export function fmtPrice(usd: number): string {
  return `$${usd.toLocaleString("en-US")}`;
}

export function fmtLtv(bps: number | null): string {
  return bps === null ? "0.00%" : `${(bps / 100).toFixed(2)}%`;
}

/**
 * LTV for display. Debt with no collateral has no finite ratio, so it is
 * labelled instead of shown as a misleading 0.00%.
 */
export function ltvLabel(m: Pick<Metrics, "ltvBps" | "collateralUsd" | "debtUsd">): string {
  if (m.collateralUsd === 0 && m.debtUsd > 0) return "No collateral";
  return fmtLtv(m.ltvBps);
}

export function fmtHealth(x100: number | null): string {
  return x100 === null ? "No debt" : (x100 / 100).toFixed(2);
}
