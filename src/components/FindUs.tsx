import { config, copy, hours } from "../config";
import { isOpenNow, useShopTime } from "../lib/hours";
import { ExternalIcon, PinIcon } from "./Icons";
import LeadHeading from "./LeadHeading";

const t = copy.findUs;

export default function FindUs() {
  const now = useShopTime();
  const open = isOpenNow(now);

  return (
    <section className="section" id="find-us" aria-labelledby="find-us-title" tabIndex={-1}>
      <div className="container container--narrow">
        <LeadHeading id="find-us-title" text={t.heading} className="section__title" />

        <div className="find">
          <div className="find__address">
            <h3 className="eyebrow">{t.addressLabel}</h3>
            <address className="find__address-text">
              <PinIcon size={22} />
              <span>{config.address}</span>
            </address>
            <a href={config.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn--secondary">
              {t.directions}
              <ExternalIcon size={16} />
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </div>

          <div className="card find__hours">
            <div className="find__hours-head">
              <h3 className="eyebrow">{t.hoursLabel}</h3>
              <span className={`pill ${open ? "pill--open" : "pill--closed"}`}>{open ? t.openNow : t.closed}</span>
            </div>
            <table className="hours">
              <caption className="sr-only">{t.hoursLabel}</caption>
              <tbody>
                {hours.map((d, i) => {
                  const isToday = i === now.dayIndex;
                  return (
                    <tr key={d.day} className={isToday ? "hours__today" : undefined} aria-current={isToday ? "date" : undefined}>
                      <th scope="row">
                        {copy.dayNames[d.day]}
                        {isToday && <span className="hours__tag">{t.today}</span>}
                      </th>
                      <td>{d.open && d.close ? `${d.open} – ${d.close}` : t.closedDay}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
