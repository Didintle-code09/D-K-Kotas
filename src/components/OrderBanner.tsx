import { config, copy } from "../config";
import { revealDelay } from "../lib/reveal";
import { scrollToSection } from "../lib/scroll";
import LeadHeading from "./LeadHeading";
import Photo from "./Photo";

export default function OrderBanner() {
  return (
    <section className="banner" aria-labelledby="banner-title">
      <Photo images={config.bannerImages} alt={copy.bannerImagesAlt} className="photo--banner">
        <LeadHeading id="banner-title" text={copy.banner.heading} className="banner__title" reveal />
        <p className="banner__subline" data-reveal="" style={revealDelay(1, 120)}>{copy.banner.subline}</p>
        <a
          href="#preorder"
          className="btn btn--primary"
          data-reveal=""
          style={revealDelay(2, 120)}
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
