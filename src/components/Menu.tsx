import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { copy, menu, type Category } from "../config";
import { basketCount, basketLines, basketTotal, formatPrice, type Basket } from "../lib/order";
import { scrollToSection } from "../lib/scroll";
import { ArrowIcon, CheckIcon, PlusIcon } from "./Icons";
import LeadHeading from "./LeadHeading";

const tabId = (c: Category) => `tab-${c.replace(/\s+/g, "-").toLowerCase()}`;

export default function Menu({ basket, onAdd }: { basket: Basket; onAdd: (id: string) => void }) {
  const categories = copy.menu.categories;
  const [active, setActive] = useState<Category>(categories[0]);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const tabRefs = useRef<Partial<Record<Category, HTMLButtonElement | null>>>({});
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const items = menu.filter((item) => item.category === active);
  const note = copy.menu.categoryNotes[active];
  const lines = basketLines(basket);
  const count = basketCount(lines);

  const add = (id: string) => {
    onAdd(id);
    setJustAdded(id);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setJustAdded(null), 1400);
  };

  // Arrow, Home and End keys move between tabs (WAI-ARIA tabs pattern).
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (e.key === "ArrowRight") next = index + 1;
    else if (e.key === "ArrowLeft") next = index - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = categories.length - 1;
    else return;
    e.preventDefault();
    const cat = categories[(next + categories.length) % categories.length];
    setActive(cat);
    tabRefs.current[cat]?.focus();
  };

  return (
    <section className="section section--menu" id="menu" aria-labelledby="menu-title" tabIndex={-1}>
      <div className="container container--narrow">
        <LeadHeading id="menu-title" text={copy.menu.heading} className="section__title" />
      </div>

      <div className="tabs-wrap">
        <div className="container container--narrow">
          <div className="tabs" role="tablist" aria-label="Menu categories">
            {categories.map((c, i) => (
              <button
                key={c}
                ref={(el) => {
                  tabRefs.current[c] = el;
                }}
                type="button"
                role="tab"
                id={tabId(c)}
                aria-selected={active === c}
                aria-controls="menu-panel"
                tabIndex={active === c ? 0 : -1}
                className="tab"
                onClick={() => setActive(c)}
                onKeyDown={(e) => onTabKey(e, i)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container container--narrow">
        <div id="menu-panel" role="tabpanel" aria-labelledby={tabId(active)}>
          {note && <p className="menu__note">{note}</p>}
          <ul className="menu__list">
            {items.map((item) => {
              const added = justAdded === item.id;
              return (
                <li key={item.id} className="menu__item">
                  <div className="menu__text">
                    <h3 className="menu__name">
                      {item.name}
                      {item.badge && <span className="badge">{item.badge}</span>}
                    </h3>
                    {item.description && <p className="menu__desc">{item.description}</p>}
                  </div>
                  <p className="price">{formatPrice(item.price)}</p>
                  <button
                    type="button"
                    className={`icon-btn ${added ? "icon-btn--done" : ""}`}
                    onClick={() => add(item.id)}
                    aria-label={`Add ${item.name} to basket`}
                  >
                    {added ? <CheckIcon /> : <PlusIcon />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {count > 0 && (
          <a
            href="#preorder"
            className="menu__basket"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("preorder");
            }}
          >
            <span>
              {copy.menu.basketSummary} {count} · {formatPrice(basketTotal(lines))}
            </span>
            <span className="menu__basket-cta">
              {copy.menu.goToPreorder} <ArrowIcon size={18} />
            </span>
          </a>
        )}

        <p className="fineprint">{copy.menu.priceNote}</p>
      </div>
    </section>
  );
}
