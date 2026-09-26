import { MARKETS } from "../lib/markets";
import { formatBps } from "../lib/units";
import { fmtPrice } from "../lib/format";

interface Props {
  /** Show the extra columns used on the Markets page. */
  extended?: boolean;
}

/**
 * Semantic table on wide screens; below 40rem the CSS stacks each row and
 * prints `data-label` in front of every cell (see components.css).
 */
export function MarketTable({ extended = false }: Props) {
  return (
    <div className="table-wrap">
      <table className="table">
        <caption className="visually-hidden">
          Illustrative markets. Rates are annualized and fixed for this demo; supply APY and borrow APR are
          not live quotes.
        </caption>
        <thead>
          <tr>
            <th scope="col">Asset</th>
            <th scope="col" className="num">
              Price
            </th>
            <th scope="col" className="num">
              Supply APY
            </th>
            <th scope="col" className="num">
              Borrow APR
            </th>
            {extended && (
              <th scope="col" className="num">
                Max LTV
              </th>
            )}
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {MARKETS.map((mk) => (
            <tr key={mk.symbol}>
              <th scope="row">
                <span className="asset">
                  <span className={`coin coin--${mk.symbol.toLowerCase()}`} aria-hidden="true">
                    {mk.symbol.slice(0, 1)}
                  </span>
                  <span>
                    {mk.symbol} <small>{mk.name}</small>
                  </span>
                </span>
              </th>
              <td className="num" data-label="Price">
                {fmtPrice(mk.priceUsd)}
              </td>
              <td className="num" data-label="Supply APY">
                {formatBps(mk.supplyApyBps)}
              </td>
              <td className="num" data-label="Borrow APR">
                {formatBps(mk.borrowAprBps)}
              </td>
              {extended && (
                <td className="num" data-label="Max LTV">
                  {mk.maxLtvBps === null ? "—" : formatBps(mk.maxLtvBps, 0)}
                </td>
              )}
              <td data-label="Status">
                {mk.interactive ? (
                  <span className="badge">{mk.role}</span>
                ) : (
                  <span className="badge badge--neutral">View only</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
