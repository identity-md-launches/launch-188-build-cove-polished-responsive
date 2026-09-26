/**
 * Illustrative reference markets. Values are fixed demo constants and are not
 * quotes from any protocol. Only the ETH/USDC pair is interactive.
 */

export interface Market {
  symbol: "ETH" | "USDC" | "WBTC";
  name: string;
  /** Illustrative price in USD. */
  priceUsd: number;
  /** Illustrative annualized supply APY in basis points. */
  supplyApyBps: number;
  /** Illustrative annualized borrow APR in basis points. */
  borrowAprBps: number;
  /** Maximum LTV as collateral, basis points; null when not usable as collateral. */
  maxLtvBps: number | null;
  /** Whether the demo lets you act on this market. */
  interactive: boolean;
  role: "Collateral" | "Borrowable" | "Reference";
}

export const MARKETS: readonly Market[] = [
  {
    symbol: "ETH",
    name: "Ether",
    priceUsd: 3000,
    supplyApyBps: 210,
    borrowAprBps: 320,
    maxLtvBps: 7000,
    interactive: true,
    role: "Collateral",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    priceUsd: 1,
    supplyApyBps: 440,
    borrowAprBps: 610,
    maxLtvBps: null,
    interactive: true,
    role: "Borrowable",
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    priceUsd: 62000,
    supplyApyBps: 40,
    borrowAprBps: 190,
    maxLtvBps: 6500,
    interactive: false,
    role: "Reference",
  },
];
