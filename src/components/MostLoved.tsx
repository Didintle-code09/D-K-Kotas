import { config, copy, menu } from "../config";
import { displayDescription, formatPrice } from "../lib/order";
import { revealDelay } from "../lib/reveal";
import { PlusIcon } from "./Icons";
import LeadHeading from "./LeadHeading";

export default function MostLoved({ onAdd }: { onAdd: (id: string) => void }) {
  const featured = menu.filter((item) => item.featured);
  // One big photo of the top item (the one with a badge) beside the list.
  const star = featured.find((item) => item.badge && item.image) ?? featured.find((item) => item.image);

  return (
    <section className="section" id="most-loved" aria-labelledby="most-loved-title" tabIndex={-1}>
      <div className="container">
        <div className={`loved-layout ${star ? "loved-layout--photo" : ""}`}>
          {star?.image && (
            <figure className="loved__feature" data-reveal="">
              <span className="thumb loved__feature-img">
                <img src={star.image} alt={[star.name, displayDescription(star.description)].filter(Boolean).join(": ")} loading="lazy" decoding="async" />
              </span>
              <figcaption>
                <em>{star.name}</em>
                {star.badge && ` · ${star.badge}`}
              </figcaption>
            </figure>
          )}

          <div className="loved__list">
            <p className="eyebrow" data-reveal="">
              {config.ratingLabel}
            </p>
            <LeadHeading id="most-loved-title" text={copy.mostLoved.heading} className="section__title" reveal />
            <ul className="loved">
              {featured.map((item, i) => (
                <li key={item.id} className="loved__row" data-reveal="" style={revealDelay(i)}>
                  <div className="loved__text">
                    <h3 className="loved__name">{item.name}</h3>
                    {displayDescription(item.description) && <p className="loved__desc">{displayDescription(item.description)}</p>}
                  </div>
                  <p className="price loved__price">{formatPrice(item.price)}</p>
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm loved__add"
                    onClick={() => onAdd(item.id)}
                    aria-label={`${copy.mostLoved.add} ${item.name} to your pre-order`}
                  >
                    <PlusIcon size={16} />
                    {copy.mostLoved.add}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
