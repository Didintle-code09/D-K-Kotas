import { useEffect, useRef } from "react";
import { config, copy } from "../config";
import { prefersReducedMotion, scrollToSection } from "../lib/scroll";
import LeadHeading from "./LeadHeading";
import Photo from "./Photo";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Parallax: the photo drifts down and the text lifts and fades as the hero scrolls away.
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = Math.min(1, Math.max(0, window.scrollY / el.offsetHeight));
      el.style.setProperty("--hero-progress", progress.toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section ref={ref} className="hero" aria-labelledby="hero-title">
      <Photo images={config.heroImages} alt={copy.heroImagesAlt} eager className="hero__photo photo--hero">
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
      <span className="hero__cue" aria-hidden="true">
        {copy.hero.scrollCue}
        <span className="hero__cue-line" />
      </span>
    </section>
  );
}
