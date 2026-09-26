import { useEffect, useRef, useState } from "react";
import { Header } from "./components/Header";
import { DemoNotice } from "./components/DemoNotice";
import { PositionSummary } from "./components/PositionSummary";
import { MarketOverview } from "./components/MarketOverview";
import { ActionPanel } from "./components/ActionPanel";
import { ResetDialog } from "./components/ResetDialog";
import { MarketsPage } from "./pages/MarketsPage";
import { AboutPage } from "./pages/AboutPage";
import { useHashRoute } from "./hooks/useHashRoute";
import { useDemo } from "./state/useDemo";

export default function App() {
  const route = useHashRoute();
  const { state, apply, reset } = useDemo();
  const [status, setStatus] = useState("");
  const [resetOpen, setResetOpen] = useState(false);
  const resetTrigger = useRef<HTMLButtonElement | null>(null);

  // Move focus to the main landmark on route change so keyboard and
  // screen-reader users land on the new page content.
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    mainRef.current?.focus();
    window.scrollTo({ top: 0 });
  }, [route]);

  function closeReset() {
    setResetOpen(false);
    resetTrigger.current?.focus();
  }

  function confirmReset() {
    reset();
    setStatus("Demo reset. Wallet holds 2.00 ETH and 1,000.00 USDC with no collateral or debt.");
    closeReset();
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header
        route={route}
        onResetRequest={(btn) => {
          resetTrigger.current = btn;
          setResetOpen(true);
        }}
      />
      <main id="main" className="main" ref={mainRef} tabIndex={-1}>
        <div className="container">
          {route === "dashboard" && (
            <>
              <h1 className="visually-hidden">Cove lending dashboard</h1>
              <DemoNotice />
              <div className="dashboard">
                <PositionSummary position={state.position} activity={state.activity} />
                <ActionPanel key={state.epoch} position={state.position} onApply={apply} onAnnounce={setStatus} />
                <MarketOverview />
              </div>
            </>
          )}
          {route === "markets" && <MarketsPage />}
          {route === "about" && <AboutPage />}
        </div>
      </main>
      <footer className="site-footer">
        <div className="container">
          <p>
            Cove is a design demonstration. Prices and rates are illustrative and fixed. It is not an audited or
            launched protocol, holds no deposits and offers no financial service.
          </p>
          <p>Built with Vite, React and TypeScript. All data is local to this page.</p>
        </div>
      </footer>
      {/* Stable polite live region for action results. */}
      <div className="visually-hidden" role="status" aria-live="polite">
        {status}
      </div>
      <ResetDialog open={resetOpen} onConfirm={confirmReset} onClose={closeReset} />
    </>
  );
}
