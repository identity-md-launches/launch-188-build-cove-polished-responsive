import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import {
  PARAMS,
  computeMetrics,
  maxAmount,
  projectAction,
  validateAction,
  type ActionKind,
  type Position,
  type ValidationError,
} from "../lib/lending";
import { parseAmount, unitsToInputString, type ParseResult } from "../lib/units";
import { PAST, TOKEN_FOR, VERB, fmtEth, fmtHealth, fmtToken, fmtUsd, fmtUsdc, ltvLabel } from "../lib/format";
import { AlertIcon, CheckIcon } from "./Icons";

const KINDS: ActionKind[] = ["supply", "borrow", "repay", "withdraw"];

const DESCRIPTION: Record<ActionKind, string> = {
  supply: "Move ETH from the demo wallet into collateral.",
  borrow: "Borrow USDC against your ETH collateral, up to 70% loan-to-value.",
  repay: "Pay down USDC debt from the demo wallet.",
  withdraw: "Move ETH collateral back to the demo wallet while staying under 70% loan-to-value.",
};

type Step = { name: "form" } | { name: "review"; amount: number } | { name: "done"; amount: number };

interface Props {
  position: Position;
  onApply: (kind: ActionKind, amount: number) => void;
  onAnnounce: (message: string) => void;
}

export function ActionPanel({ position, onApply, onAnnounce }: Props) {
  const [kind, setKind] = useState<ActionKind>("supply");
  const [raw, setRaw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>({ name: "form" });

  const baseId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  const token = TOKEN_FOR[kind];
  const limit = maxAmount(kind, position);
  const parsed = parseAmount(raw);
  const projected = parsed.ok ? projectAction(kind, parsed.units, position) : position;
  const projectedMetrics = computeMetrics(projected);
  const currentMetrics = computeMetrics(position);
  const projectedValidation = parsed.ok ? validateAction(kind, parsed.units, position) : null;

  // Focus the step heading when moving to review/done, and the input when
  // returning to the form after a completed action.
  useEffect(() => {
    if (step.name !== "form") stepHeadingRef.current?.focus();
  }, [step]);

  function selectKind(next: ActionKind) {
    setKind(next);
    setRaw("");
    setError(null);
    setStep({ name: "form" });
  }

  function onTabKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    let target: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") target = (index + 1) % KINDS.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") target = (index - 1 + KINDS.length) % KINDS.length;
    if (e.key === "Home") target = 0;
    if (e.key === "End") target = KINDS.length - 1;
    if (target === null) return;
    e.preventDefault();
    const next = KINDS[target];
    if (next) {
      selectKind(next);
      tabRefs.current[target]?.focus();
    }
  }

  function describeParseError(p: ParseResult): string {
    if (p.ok) return "";
    switch (p.reason) {
      case "empty":
        return `Enter an amount of ${token} to ${kind}.`;
      case "not-a-number":
        return "Enter a number using digits and at most one decimal point, for example 0.5.";
      case "not-positive":
        return "Enter an amount greater than zero.";
      case "too-precise":
        return `Use at most 6 decimal places for ${token}.`;
    }
  }

  function describeValidationError(err: ValidationError): string {
    const lim = fmtToken(kind, err.limit);
    switch (err.code) {
      case "insufficient-wallet":
        return `The demo wallet holds ${lim}. Enter that amount or less.`;
      case "exceeds-available-borrow":
        return `Borrowing that much would exceed the 70% maximum loan-to-value. You can borrow up to ${lim}.`;
      case "exceeds-debt":
        return `Debt is ${fmtUsdc(position.debtUsdc)}. Enter that amount or less.`;
      case "exceeds-withdrawable":
        return `Withdrawing that much would push loan-to-value above 70%. You can withdraw up to ${lim}, or repay USDC first.`;
      case "no-collateral":
        return kind === "borrow"
          ? "Supply ETH as collateral before borrowing."
          : "There is no collateral to withdraw. Supply ETH first.";
      case "no-debt":
        return "There is no debt to repay.";
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!parsed.ok) {
      setError(describeParseError(parsed));
      inputRef.current?.focus();
      return;
    }
    const v = validateAction(kind, parsed.units, position);
    if (!v.ok) {
      setError(describeValidationError(v.error));
      inputRef.current?.focus();
      return;
    }
    setError(null);
    setStep({ name: "review", amount: parsed.units });
  }

  function confirm(amount: number) {
    onApply(kind, amount);
    const after = computeMetrics(projectAction(kind, amount, position));
    onAnnounce(
      `${PAST[kind]} ${fmtToken(kind, amount)} (simulated). Loan-to-value ${ltvLabel(after)}, health factor ${fmtHealth(after.healthFactorX100)}.`,
    );
    setStep({ name: "done", amount });
  }

  function finish() {
    setRaw("");
    setError(null);
    setStep({ name: "form" });
    // Wait for the form to render before moving focus back to the input.
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  const inputId = `${baseId}-amount`;
  const helpId = `${baseId}-help`;
  const errorId = `${baseId}-error`;
  const panelId = `${baseId}-panel`;

  return (
    <section className="card dashboard__actions" aria-labelledby="actions-title">
      <div className="card__head">
        <h2 className="card__title" id="actions-title">
          Manage position
        </h2>
        <span className="card__hint">Simulated · nothing is sent</span>
      </div>

      <div className="tabs" role="tablist" aria-label="Action">
        {KINDS.map((k, i) => (
          <button
            key={k}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${k}`}
            className="tab"
            aria-selected={kind === k}
            aria-controls={panelId}
            tabIndex={kind === k ? 0 : -1}
            onClick={() => selectKind(k)}
            onKeyDown={(e) => onTabKeyDown(e, i)}
          >
            {VERB[k]}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={panelId} aria-labelledby={`${baseId}-tab-${kind}`}>
        {step.name === "form" && (
          <form className="form" onSubmit={onSubmit} noValidate>
            <p className="field__help">{DESCRIPTION[kind]}</p>

            <div className="field">
              <div className="field__label-row">
                <label className="field__label" htmlFor={inputId}>
                  Amount ({token})
                </label>
                <span className="field__meta" id={helpId}>
                  {limitLabel(kind)}: {fmtToken(kind, limit)}
                </span>
              </div>
              <div className={`amount${error ? " amount--invalid" : ""}`}>
                <input
                  ref={inputRef}
                  id={inputId}
                  name="amount"
                  className="amount__input"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="0.00"
                  value={raw}
                  onChange={(e) => {
                    setRaw(e.target.value);
                    if (error) setError(null);
                  }}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${errorId} ${helpId}` : helpId}
                />
                <span className="amount__unit" aria-hidden="true">
                  {token}
                </span>
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  onClick={() => {
                    setRaw(unitsToInputString(limit));
                    setError(null);
                    inputRef.current?.focus();
                  }}
                  disabled={limit === 0}
                  aria-label={`Use maximum, ${fmtToken(kind, limit)}`}
                >
                  Max
                </button>
              </div>
              {error && (
                <p className="field__error" id={errorId}>
                  <AlertIcon />
                  <span>{error}</span>
                </p>
              )}
            </div>

            <div className="preview">
              <h3 className="preview__title">{parsed.ok ? "After this action" : "Current position"}</h3>
              <dl className="kv kv--compact">
                <dt>Collateral</dt>
                <dd>
                  <Delta from={fmtEth(position.collateralEth)} to={fmtEth(projected.collateralEth)} changed={parsed.ok} />
                </dd>
                <dt>Debt</dt>
                <dd>
                  <Delta from={fmtUsdc(position.debtUsdc)} to={fmtUsdc(projected.debtUsdc)} changed={parsed.ok} />
                </dd>
                <dt>Loan-to-value</dt>
                <dd>
                  <Delta
                    from={ltvLabel(currentMetrics)}
                    to={ltvLabel(projectedMetrics)}
                    changed={parsed.ok}
                    danger={projectedValidation !== null && !projectedValidation.ok}
                  />
                </dd>
                <dt>Health factor</dt>
                <dd>
                  <Delta
                    from={fmtHealth(currentMetrics.healthFactorX100)}
                    to={fmtHealth(projectedMetrics.healthFactorX100)}
                    changed={parsed.ok}
                    danger={projectedValidation !== null && !projectedValidation.ok}
                  />
                </dd>
              </dl>
            </div>

            <button type="submit" className="btn btn--primary btn--block">
              Review {kind}
            </button>
          </form>
        )}

        {step.name === "review" && (
          <div className="step">
            <div>
              <h3 className="step__title" tabIndex={-1} ref={stepHeadingRef}>
                Review {kind}
              </h3>
              <p className="step__lede">Check the projected position, then confirm. This is a simulated action.</p>
            </div>
            <dl className="kv">
              <dt>Amount</dt>
              <dd>{fmtToken(kind, step.amount)}</dd>
              <dt>Collateral after</dt>
              <dd>
                {fmtEth(projected.collateralEth)} <span className="delta__from">({fmtUsd(projectedMetrics.collateralUsd)})</span>
              </dd>
              <dt>Debt after</dt>
              <dd>{fmtUsdc(projected.debtUsdc)}</dd>
              <dt>Loan-to-value after</dt>
              <dd>{ltvLabel(projectedMetrics)}</dd>
              <dt>Health factor after</dt>
              <dd>{fmtHealth(projectedMetrics.healthFactorX100)}</dd>
            </dl>
            <p className="callout">
              Illustrative ETH price {fmtUsd(PARAMS.ethPriceUsd * 1_000_000)}. Maximum loan-to-value{" "}
              {PARAMS.maxLtvBps / 100}%, liquidation threshold {PARAMS.liquidationThresholdBps / 100}%. No
              interest accrues in this demo.
            </p>
            <div className="btn-row">
              <button type="button" className="btn btn--secondary" onClick={() => setStep({ name: "form" })}>
                Back
              </button>
              <button type="button" className="btn btn--primary" onClick={() => confirm(step.amount)}>
                Confirm {kind}
              </button>
            </div>
          </div>
        )}

        {step.name === "done" && (
          <div className="step">
            <div className="result">
              <CheckIcon className="result__icon" />
              <div>
                <h3 className="step__title result__title" tabIndex={-1} ref={stepHeadingRef}>
                  {VERB[kind]} complete (simulated)
                </h3>
                <p>
                  {PAST[kind]} {fmtToken(kind, step.amount)}. Balances on this page were updated locally. No
                  transaction was sent.
                </p>
              </div>
            </div>
            <dl className="kv">
              <dt>Collateral</dt>
              <dd>{fmtEth(position.collateralEth)}</dd>
              <dt>Debt</dt>
              <dd>{fmtUsdc(position.debtUsdc)}</dd>
              <dt>Loan-to-value</dt>
              <dd>{ltvLabel(currentMetrics)}</dd>
              <dt>Health factor</dt>
              <dd>{fmtHealth(currentMetrics.healthFactorX100)}</dd>
            </dl>
            <button type="button" className="btn btn--primary btn--block" onClick={finish}>
              Done
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function limitLabel(kind: ActionKind): string {
  switch (kind) {
    case "supply":
      return "Wallet";
    case "borrow":
      return "Available";
    case "repay":
      return "Repayable";
    case "withdraw":
      return "Withdrawable";
  }
}

function Delta({ from, to, changed, danger = false }: { from: string; to: string; changed: boolean; danger?: boolean }) {
  if (!changed || from === to) return <>{from}</>;
  return (
    <span className="delta">
      <span className="delta__from">{from}</span>
      <span className={`delta__to${danger ? " delta__to--danger" : ""}`}>
        <span className="delta__arrow" aria-hidden="true">
          →
        </span>
        <span className="visually-hidden">to</span>
        {to}
        {danger && <span className="visually-hidden"> (over limit)</span>}
      </span>
    </span>
  );
}
