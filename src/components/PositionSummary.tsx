import { PARAMS, computeMetrics, healthBand, type HealthBand, type Position } from "../lib/lending";
import { PAST, fmtEth, fmtHealth, fmtToken, fmtUsd, fmtUsdc, ltvLabel } from "../lib/format";
import { formatUnits } from "../lib/units";
import type { ActivityEntry } from "../state/useDemo";

interface Props {
  position: Position;
  activity: ActivityEntry[];
}

const BAND_LABEL: Record<HealthBand, string> = {
  none: "No debt",
  safe: "Healthy",
  watch: "Watch",
  risk: "At risk",
};

const BAND_CLASS: Record<HealthBand, string> = {
  none: "badge--neutral",
  safe: "badge--success",
  watch: "badge--warning",
  risk: "badge--danger",
};

/** A stat value split into a non-breaking number and a smaller unit. */
function Value({ units, unit, max }: { units: number; unit: string; max: number }) {
  return (
    <span className="stat__value">
      <span className="stat__number">{formatUnits(units, { min: 2, max })}</span>
      <span className="stat__unit">{unit}</span>
    </span>
  );
}

export function PositionSummary({ position, activity }: Props) {
  const m = computeMetrics(position);
  const band = healthBand(m.healthFactorX100);
  const ltvPct = m.ltvBps === null ? 0 : m.ltvBps / 100;
  const maxPct = PARAMS.maxLtvBps / 100;
  const liqPct = PARAMS.liquidationThresholdBps / 100;
  const fillClass =
    ltvPct >= liqPct ? "ltv-bar__fill--danger" : ltvPct >= maxPct ? "ltv-bar__fill--warning" : "";

  return (
    <section className="card dashboard__position" aria-labelledby="position-title">
      <div className="card__head">
        <h2 className="card__title" id="position-title">
          Position
        </h2>
        <span className="card__hint">ETH collateral · USDC debt</span>
      </div>

      <div className="card__section">
        <div className="stat-grid">
          <div className="stat">
            <span className="stat__label">Collateral</span>
            <Value units={position.collateralEth} unit="ETH" max={6} />
            <span className="stat__sub">{fmtUsd(m.collateralUsd)}</span>
          </div>
          <div className="stat">
            <span className="stat__label">Debt</span>
            <Value units={position.debtUsdc} unit="USDC" max={2} />
            <span className="stat__sub">{fmtUsd(m.debtUsd)}</span>
          </div>
          <div className="stat">
            <span className="stat__label">Loan-to-value</span>
            <span className="stat__value">
              <span className="stat__number">{ltvLabel(m)}</span>
            </span>
            <span className="stat__sub">Max {maxPct.toFixed(0)}%</span>
          </div>
          <div className="stat">
            <span className="stat__label">Health factor</span>
            <span className="stat__value">
              <span className="stat__number">{fmtHealth(m.healthFactorX100)}</span>
            </span>
            {band === "none" ? (
              <span className="stat__sub">Liquidation at {liqPct.toFixed(0)}%</span>
            ) : (
              <span className={`badge stat__badge ${BAND_CLASS[band]}`}>{BAND_LABEL[band]}</span>
            )}
          </div>
        </div>

        <div className="ltv-bar">
          <div
            className="ltv-bar__track"
            role="img"
            aria-label={`Loan-to-value ${ltvLabel(m)} of a ${maxPct.toFixed(0)}% maximum. Liquidation at ${liqPct.toFixed(0)}%.`}
          >
            <div className={`ltv-bar__fill ${fillClass}`} style={{ width: `${Math.min(100, ltvPct)}%` }} />
            <div className="ltv-bar__mark" style={{ insetInlineStart: `${maxPct}%` }} />
            <div className="ltv-bar__mark" style={{ insetInlineStart: `${liqPct}%` }} />
          </div>
          <div className="ltv-bar__legend" aria-hidden="true">
            <span>0%</span>
            <span>Max borrow {maxPct.toFixed(0)}%</span>
            <span>Liquidation {liqPct.toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <div className="card__section">
        <h3 className="card__section-title">Wallet and limits</h3>
        <dl className="kv">
          <dt>Wallet ETH</dt>
          <dd>
            {fmtEth(position.walletEth)}{" "}
            <span className="delta__from">({fmtUsd(position.walletEth * PARAMS.ethPriceUsd)})</span>
          </dd>
          <dt>Wallet USDC</dt>
          <dd>{fmtUsdc(position.walletUsdc)}</dd>
          <dt>Available to borrow</dt>
          <dd>{fmtUsdc(m.availableToBorrowUsdc)}</dd>
          <dt>Withdrawable collateral</dt>
          <dd>{fmtEth(m.withdrawableEth)}</dd>
        </dl>
      </div>

      <div className="card__section">
        <h3 className="card__section-title">Activity</h3>
        {activity.length === 0 ? (
          <p className="empty">No simulated actions yet. Use the panel to supply ETH, then borrow USDC.</p>
        ) : (
          <ol className="activity" aria-label="Simulated actions, newest first">
            {activity.map((a) => (
              <li key={a.id} className="activity__item">
                <span className="activity__what">{PAST[a.kind]} · simulated</span>
                <span className="activity__amount">{fmtToken(a.kind, a.amount)}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
