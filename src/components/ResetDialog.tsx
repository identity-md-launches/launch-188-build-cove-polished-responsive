import { useEffect, useRef } from "react";

interface Props {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * Native <dialog> opened with showModal(): the browser supplies the focus trap,
 * inert background and Escape handling. Focus returns to the trigger through
 * the caller (see App.tsx), which remembers the button that opened it.
 */
export function ResetDialog({ open, onConfirm, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      cancelRef.current?.focus();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="reset-title"
      aria-describedby="reset-body"
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <h2 className="dialog__title" id="reset-title">
        Reset the demo?
      </h2>
      <p className="dialog__body" id="reset-body">
        This returns the demo wallet to 2 ETH and 1,000 USDC, clears the position and removes the activity
        list. Nothing outside this page is affected.
      </p>
      <div className="dialog__actions">
        <button ref={cancelRef} type="button" className="btn btn--secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="btn btn--danger" onClick={onConfirm}>
          Reset demo
        </button>
      </div>
    </dialog>
  );
}
