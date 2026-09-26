import { MarketTable } from "../components/MarketTable";

export function MarketsPage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-head__title">Markets</h1>
          <p className="page-head__lede">
            Three reference markets with fixed, illustrative prices and annualized rates. Supply APY is what a
            supplier would earn; borrow APR is what a borrower would pay. Neither accrues in this demo.
          </p>
        </div>
      </div>
      <section className="card" aria-labelledby="markets-page-title">
        <div className="card__head">
          <h2 className="card__title" id="markets-page-title">
            Reference markets
          </h2>
          <span className="card__hint">Illustrative · not live quotes</span>
        </div>
        <div className="card__section">
          <MarketTable extended />
        </div>
        <div className="card__section">
          <h3 className="card__section-title">How to read this table</h3>
          <ul className="prose" style={{ gap: "var(--space-2)" }}>
            <li>
              <strong>ETH</strong> is the only collateral you can supply and withdraw here. Its 70% maximum
              loan-to-value caps borrowing and withdrawals.
            </li>
            <li>
              <strong>USDC</strong> is the only asset you can borrow and repay. It is valued at exactly one US
              dollar.
            </li>
            <li>
              <strong>WBTC</strong> is view-only. It is listed to show how a second collateral market would
              appear and cannot be used in any action.
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
