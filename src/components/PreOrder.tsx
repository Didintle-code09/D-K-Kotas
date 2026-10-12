import { useEffect, useId, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { config, copy } from "../config";
import { dayLabel, pickupPlan, useShopTime } from "../lib/hours";
import { basketLines, basketTotal, formatPrice, orderMessage, whatsappLink, type Basket } from "../lib/order";
import { scrollToSection } from "../lib/scroll";
import { ExternalIcon, MinusIcon, PlusIcon, WhatsAppIcon } from "./Icons";
import LeadHeading from "./LeadHeading";
import OrderPreviewModal from "./OrderPreviewModal";

const ASAP = "ASAP";
const t = copy.preorder;

export default function PreOrder({ basket, setQty }: { basket: Basket; setQty: (id: string, qty: number) => void }) {
  const [name, setName] = useState("");
  const [pickup, setPickup] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // demo mode only
  const ids = useId();

  const now = useShopTime();
  const plan = pickupPlan(now);
  const lines = basketLines(basket);
  const total = basketTotal(lines);

  // Drop a chosen slot once it is no longer offered (time moved on).
  useEffect(() => {
    if (pickup && pickup !== ASAP && !plan.slots.includes(pickup)) setPickup(null);
  }, [pickup, plan.slots]);

  // Any change after sending means the WhatsApp message is out of date.
  useEffect(() => setSentUrl(null), [basket, name, pickup, note]);

  const missing = [
    lines.length === 0 && t.missing.basket,
    !name.trim() && t.missing.name,
    !pickup && t.missing.time,
    !consent && t.missing.consent,
  ].filter(Boolean) as string[];
  const ready = missing.length === 0;

  const pickupText = () => {
    if (pickup === ASAP) return plan.openNow ? ASAP : t.message.asapWhenOpen;
    return plan.dayOffset === 0 ? pickup! : `${dayLabel(plan.dayOffset, plan.dayName)} ${pickup}`;
  };

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    const message = orderMessage({ name: name.trim(), pickup: pickupText(), lines, note: note.trim() });
    if (config.demoMode) {
      setPreview(message);
      return;
    }
    const url = whatsappLink(message);
    window.open(url, "_blank", "noopener");
    setSentUrl(url);
  };

  return (
    <section className="section section--preorder" id="preorder" aria-labelledby="preorder-title" tabIndex={-1}>
      <div className="container container--narrow">
        <LeadHeading id="preorder-title" text={t.heading} className="section__title" reveal />
        <p className="section__intro" data-reveal="">{t.intro}</p>

        <form className="preorder" onSubmit={send} noValidate data-reveal="">
          {/* Basket */}
          <fieldset className="card basket">
            <legend className="field__label">{t.basketLabel}</legend>
            {lines.length === 0 ? (
              <p className="basket__empty">{t.emptyBasket}</p>
            ) : (
              <ul className="basket__list" aria-live="polite">
                {lines.map(({ item, qty, total: lineTotal }) => (
                  <li key={item.id} className="basket__row">
                    <span className="basket__name">{item.name}</span>
                    <div className="stepper" role="group" aria-label={`${item.name} quantity`}>
                      <button
                        type="button"
                        className="stepper__btn"
                        onClick={() => setQty(item.id, qty - 1)}
                        aria-label={qty === 1 ? `Remove ${item.name}` : `One less ${item.name}`}
                      >
                        <MinusIcon size={18} />
                      </button>
                      <span className="stepper__qty" aria-live="polite">
                        {qty}
                      </span>
                      <button
                        type="button"
                        className="stepper__btn"
                        onClick={() => setQty(item.id, qty + 1)}
                        aria-label={`One more ${item.name}`}
                      >
                        <PlusIcon size={18} />
                      </button>
                    </div>
                    <span className="price basket__total">{formatPrice(lineTotal)}</span>
                  </li>
                ))}
              </ul>
            )}
            <a
              href="#menu"
              className="text-link basket__more"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("menu");
              }}
            >
              {t.addMore}
            </a>
          </fieldset>

          {/* Name */}
          <div className="field">
            <label className="field__label" htmlFor={`${ids}-name`}>
              {t.nameLabel}
            </label>
            <input
              id={`${ids}-name`}
              className="input"
              type="text"
              autoComplete="given-name"
              required
              aria-required="true"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Pickup time */}
          <fieldset className="field">
            <legend className="field__label">
              {t.timeLabel}
              {plan.dayOffset > 0 || !plan.openNow ? (
                <span className="field__hint"> · {dayLabel(plan.dayOffset, plan.dayName)}</span>
              ) : null}
            </legend>
            {!plan.openNow && <p className="notice">{t.closedNote}</p>}
            <div className="slots">
              {[ASAP, ...plan.slots].map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className="slot"
                  aria-pressed={pickup === slot}
                  onClick={() => setPickup(slot)}
                >
                  {slot === ASAP ? t.asap : slot}
                </button>
              ))}
            </div>
            {plan.slots.length === 0 && plan.openNow === false && <p className="fineprint">{t.noSlots}</p>}
          </fieldset>

          {/* Note */}
          <div className="field">
            <label className="field__label" htmlFor={`${ids}-note`}>
              {t.noteLabel} <span className="field__hint">{t.optional}</span>
            </label>
            <textarea
              id={`${ids}-note`}
              className="input input--area"
              rows={3}
              placeholder={t.notePlaceholder}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Total */}
          <div className="total" aria-live="polite">
            <span className="field__label">{t.totalLabel}</span>
            <span className="total__amount">{formatPrice(total)}</span>
            <span className="total__note">{t.payNote}</span>
          </div>

          {/* Consent */}
          <label className="consent">
            <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>
              {t.consentBefore}
              <Link to="/terms">{t.consentTerms}</Link>
              {t.consentMiddle}
              <Link to="/privacy">{t.consentPrivacy}</Link>
              {t.consentAfter}
            </span>
          </label>

          <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={!ready} aria-describedby={`${ids}-missing`}>
            <WhatsAppIcon />
            {t.send}
          </button>

          <p id={`${ids}-missing`} className="fineprint preorder__missing" aria-live="polite">
            {!ready && `${t.missingPrefix} ${missing.join(", ")}.`}
          </p>

          {sentUrl && (
            <div className="sent" role="status">
              <p>{t.sent}</p>
              <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="text-link">
                {t.reopen}
              </a>
            </div>
          )}

          <p className="preorder__delivery">
            {t.deliveryPrefix}
            <a href={config.uberEatsUrl} target="_blank" rel="noopener noreferrer" className="text-link">
              <strong>{t.deliveryLink}</strong>
              <ExternalIcon size={14} />
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </p>
        </form>
      </div>
      {config.demoMode && <OrderPreviewModal message={preview} onClose={() => setPreview(null)} />}
    </section>
  );
}
