export function AboutPage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-head__title">About this demo</h1>
          <p className="page-head__lede">
            Cove is a design and interaction demonstration of a crypto lending dashboard. Everything runs in
            your browser from fixed local data.
          </p>
        </div>
      </div>
      <section className="card">
        <div className="prose">
          <h2>What is simulated</h2>
          <p>
            You start with a demo wallet of 2 ETH and 1,000 USDC, no collateral and no debt. You can supply ETH
            as collateral, borrow USDC against it, repay USDC and withdraw ETH. Each action shows a review step
            and then updates the balances on this page.
          </p>
          <h2>What is not real</h2>
          <ul>
            <li>No wallet connection, private keys, signatures, token approvals or transactions.</li>
            <li>No network calls to any blockchain, price feed, analytics service or backend.</li>
            <li>Prices and rates are fixed, illustrative constants, not market data.</li>
            <li>Cove is not an audited, deployed or launched protocol and holds no deposits.</li>
            <li>Interest does not accrue. Reloading the page resets the demo.</li>
          </ul>
          <h2>Parameters and formulas</h2>
          <ul>
            <li>Illustrative ETH price: $3,000. USDC is valued at $1.</li>
            <li>Maximum loan-to-value (LTV) for borrowing and withdrawing: 70%.</li>
            <li>Liquidation threshold used by the health factor: 80%.</li>
            <li>LTV = debt in USD ÷ collateral in USD.</li>
            <li>Health factor = collateral in USD × 0.80 ÷ debt in USD. With no debt it is shown as “No debt”.</li>
            <li>Available to borrow = collateral in USD × 0.70 − debt.</li>
            <li>Withdrawable collateral keeps debt at or below 70% of the remaining collateral value.</li>
          </ul>
          <h2>Worked example</h2>
          <p>
            Supply 1 ETH, then borrow 1,000 USDC. Collateral is 1 ETH ($3,000), debt is 1,000 USDC, LTV is
            33.33% and the health factor is 2.40. The wallet holds 1 ETH and 2,000 USDC.
          </p>
          <p>
            <a href="#/">Return to the dashboard</a>
          </p>
        </div>
      </section>
    </>
  );
}
