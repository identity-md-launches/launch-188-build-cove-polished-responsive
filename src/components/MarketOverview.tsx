import { MarketTable } from "./MarketTable";

export function MarketOverview() {
  return (
    <section className="card dashboard__markets" aria-labelledby="markets-title">
      <div className="card__head">
        <h2 className="card__title" id="markets-title">
          Markets
        </h2>
        <span className="card__hint">Illustrative annualized rates</span>
      </div>
      <MarketTable />
      <p className="card__hint" style={{ marginBlockStart: "var(--space-4)" }}>
        Only ETH collateral and USDC borrowing are interactive. WBTC is shown for reference and cannot be used
        in this demo. <a href="#/markets">See market details</a>.
      </p>
    </section>
  );
}
