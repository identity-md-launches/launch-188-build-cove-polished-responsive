import { InfoIcon } from "./Icons";

export function DemoNotice() {
  return (
    <div className="notice" role="note">
      <InfoIcon className="notice__icon" />
      <p>
        <strong>This is a simulation.</strong> Prices and rates are fixed, illustrative values. No wallet is
        connected, nothing is signed and no transaction is sent. Cove is not an audited or launched protocol.
      </p>
    </div>
  );
}
