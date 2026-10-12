import { useEffect, useRef } from "react";
import { copy } from "../config";

const t = copy.preorder;

/** Demo mode: shows the exact WhatsApp message in a chat bubble instead of opening WhatsApp. */
export default function OrderPreviewModal({ message, onClose }: { message: string | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (message && !dialog.open) dialog.showModal();
    if (!message && dialog.open) dialog.close();
  }, [message]);

  const time = new Intl.DateTimeFormat("en-ZA", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date());

  return (
    <dialog
      ref={ref}
      className="order-modal"
      aria-labelledby="order-modal-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()} // tap on the backdrop
    >
      <div className="order-modal__inner">
        <h2 id="order-modal-title" className="order-modal__title display">
          {t.demoTitle}
        </h2>
        <div className="chat">
          <div className="chat__bubble">
            <p className="chat__text">{message}</p>
            <span className="chat__meta" aria-hidden="true">
              {time}
              <svg width="16" height="11" viewBox="0 0 16 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 6l3 3 6-7.5M6.5 9l1 .5 6-7.5" />
              </svg>
            </span>
          </div>
        </div>
        <button type="button" className="btn btn--primary btn--block" onClick={onClose} autoFocus>
          {t.demoDone}
        </button>
      </div>
    </dialog>
  );
}
