import { config, copy } from "../config";
import { scrollToSection } from "../lib/scroll";
import LeadHeading from "./LeadHeading";
import Photo from "./Photo";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Photo src={config.heroImage} alt={copy.heroImageAlt} eager className="hero__photo">
        <LeadHeading as="h1" id="hero-title" text={copy.hero.headline} className="hero__title" />
        <p className="hero__subline">{config.subline}</p>
        <div className="hero__actions">
          <a
            href="#preorder"
            className="btn btn--primary"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("preorder");
            }}
          >
            {copy.hero.primary}
          </a>
          <a
            href="#menu"
            className="btn btn--secondary"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("menu");
            }}
          >
            {copy.hero.secondary}
          </a>
        </div>
      </Photo>
    </section>
  );
}
