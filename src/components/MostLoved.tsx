import { config, copy, menu } from "../config";
import { formatPrice } from "../lib/order";
import { PlusIcon } from "./Icons";
import LeadHeading from "./LeadHeading";

export default function MostLoved({ onAdd }: { onAdd: (id: string) => void }) {
  const featured = menu.filter((item) => item.featured);

  return (
    <section className="section" id="most-loved" aria-labelledby="most-loved-title" tabIndex={-1}>
      <div className="container container--narrow">
        <p className="eyebrow">{config.ratingLabel}</p>
        <LeadHeading id="most-loved-title" text={copy.mostLoved.heading} className="section__title" />
        <ul className="loved">
          {featured.map((item) => (
            <li key={item.id} className="loved__row">
              <div className="loved__text">
                <h3 className="loved__name">{item.name}</h3>
                {item.description && <p className="loved__desc">{item.description}</p>}
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
    </section>
  );
}
