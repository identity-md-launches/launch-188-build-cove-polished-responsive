/**
 * Fixed-point helpers.
 *
 * Every balance in the demo is stored as an integer count of 1e-6 units
 * ("micro" ETH, "micro" USDC, "micro" USD). Integer arithmetic keeps the
 * displayed figures free of floating-point artifacts such as 0.30000000000000004.
 * All magnitudes in this demo stay far below Number.MAX_SAFE_INTEGER.
 */

export const DECIMALS = 6;
export const SCALE = 1_000_000;

/** Result of parsing a user-entered decimal string. */
export type ParseResult =
  | { ok: true; units: number }
  | { ok: false; reason: "empty" | "not-a-number" | "not-positive" | "too-precise" };

/**
 * Parse a decimal string typed by the user into integer micro-units.
 * Accepts digits with an optional single decimal point and up to 6 fraction
 * digits. Rejects anything else so a typo never becomes a silent rounding.
 */
export function parseAmount(raw: string): ParseResult {
  const text = raw.trim().replace(/,/g, "");
  if (text === "") return { ok: false, reason: "empty" };
  if (!/^\d*\.?\d*$/.test(text) || text === ".") return { ok: false, reason: "not-a-number" };
  const [whole = "", fraction = ""] = text.split(".");
  if (fraction.length > DECIMALS) return { ok: false, reason: "too-precise" };
  const wholeUnits = whole === "" ? 0 : Number.parseInt(whole, 10) * SCALE;
  const fractionUnits = fraction === "" ? 0 : Number.parseInt(fraction.padEnd(DECIMALS, "0"), 10);
  const units = wholeUnits + fractionUnits;
  if (!Number.isFinite(units) || !Number.isSafeInteger(units)) return { ok: false, reason: "not-a-number" };
  if (units <= 0) return { ok: false, reason: "not-positive" };
  return { ok: true, units };
}

export interface FormatOptions {
  /** Minimum fraction digits to show. */
  min?: number;
  /** Maximum fraction digits to show; trailing zeros beyond `min` are trimmed. */
  max?: number;
}

/** Insert thousands separators into a string of digits. */
function group(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Format integer micro-units as a human-readable decimal string, using only
 * string operations so the output is exact. Rounds half-up at `max` digits.
 */
export function formatUnits(units: number, { min = 2, max = 2 }: FormatOptions = {}): string {
  const negative = units < 0;
  let value = Math.abs(Math.round(units));
  if (max < DECIMALS) {
    const drop = 10 ** (DECIMALS - max);
    value = Math.round(value / drop) * drop;
  }
  const text = value.toString().padStart(DECIMALS + 1, "0");
  const whole = text.slice(0, text.length - DECIMALS);
  let fraction = text.slice(text.length - DECIMALS, text.length - DECIMALS + max);
  while (fraction.length > min && fraction.endsWith("0")) fraction = fraction.slice(0, -1);
  const body = fraction.length > 0 ? `${group(whole)}.${fraction}` : group(whole);
  return negative ? `−${body}` : body;
}

/** Convert integer micro-units to a plain decimal string for an input value. */
export function unitsToInputString(units: number): string {
  return formatUnits(units, { min: 0, max: DECIMALS }).replace(/,/g, "");
}

/** Format a ratio given in basis points (1/10,000) as a percentage string. */
export function formatBps(bps: number, digits = 2): string {
  return `${(bps / 100).toFixed(digits)}%`;
}
