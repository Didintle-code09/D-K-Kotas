import { Link } from "react-router-dom";
import { config, copy } from "../config";
import { groupedHours } from "../lib/hours";
import { InstagramIcon, TikTokIcon } from "./Icons";
import Wordmark from "./Wordmark";

export default function Footer() {
  const socials = [
    { href: config.instagramUrl, label: copy.footer.instagram, Icon: InstagramIcon },
    { href: config.tiktokUrl, label: copy.footer.tiktok, Icon: TikTokIcon },
  ].filter((s) => s.href);

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Wordmark className="wordmark--left" />
          <address className="footer__address">{config.address}</address>
          {socials.length > 0 && (
            <ul className="footer__socials">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} ${copy.newTab}`}>
                    <Icon size={22} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        {!config.demoMode && (
          <div>
            <h2 className="eyebrow">{copy.footer.whatsappLabel}</h2>
            <p className="footer__text">{config.whatsappDisplay}</p>
          </div>
        )}
        <div>
          <h2 className="eyebrow">{copy.footer.hoursLabel}</h2>
          <dl className="footer__hours">
            {groupedHours().map((g) => (
              <div key={g.label}>
                <dt>{g.label}</dt>
                <dd>{g.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="container footer__bottom">
        <p className="footer__legal">
          <span>
            © {new Date().getFullYear()} {config.businessName}
          </span>
          <span aria-hidden="true">·</span>
          <Link to="/terms">{copy.footer.terms}</Link>
          <span aria-hidden="true">·</span>
          <Link to="/privacy">{copy.footer.privacy}</Link>
        </p>
        <p className="footer__credit">
          {copy.footer.creditPrefix}
          <a href={config.creditUrl} target="_blank" rel="noopener">
            {config.creditName}
            <span className="sr-only"> {copy.newTab}</span>
          </a>
        </p>
      </div>
    </footer>
  );
}
