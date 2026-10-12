import { config, copy } from "../config";
import { scrollToSection } from "../lib/scroll";
import LeadHeading from "./LeadHeading";
import Photo from "./Photo";

export default function OrderBanner() {
  return (
    <section className="banner" aria-labelledby="banner-title">
      <Photo src={config.bannerImage} alt={copy.bannerImageAlt}>
        <LeadHeading id="banner-title" text={copy.banner.heading} className="banner__title" />
        <p className="banner__subline">{copy.banner.subline}</p>
        <a
          href="#preorder"
          className="btn btn--primary"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("preorder");
          }}
        >
          {copy.banner.cta}
        </a>
      </Photo>
    </section>
  );
}
