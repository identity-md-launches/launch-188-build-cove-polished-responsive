import { ROUTES, type Route } from "../hooks/useHashRoute";
import { BrandMark } from "./Icons";

interface HeaderProps {
  route: Route;
  onResetRequest: (trigger: HTMLButtonElement) => void;
}

export function Header({ route, onResetRequest }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <div className="site-header__brand-row">
          <a className="brand" href="#/" aria-label="Cove, dashboard">
            <BrandMark className="brand__mark" />
            <span className="brand__name">Cove</span>
          </a>
          <span className="badge">Simulation</span>
        </div>
        <nav className="site-nav" aria-label="Primary">
          <ul className="site-nav__list">
            {ROUTES.map((r) => (
              <li key={r.id}>
                <a className="site-nav__link" href={r.hash} aria-current={route === r.id ? "page" : undefined}>
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className="btn btn--secondary btn--sm site-header__reset"
          onClick={(e) => onResetRequest(e.currentTarget)}
        >
          Reset demo
        </button>
      </div>
    </header>
  );
}
