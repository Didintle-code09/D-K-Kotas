import { Fragment, useEffect, useRef, useState } from "react";
import { copy } from "../config";
import { prefersReducedMotion } from "../lib/scroll";
import { PauseIcon, PlayIcon, StarIcon } from "./Icons";

const t = copy.marquee;

function Row({ words, variant }: { words: readonly string[]; variant: "primary" | "secondary" }) {
  // Two identical sets side by side; the track slides by exactly one set, so the loop is seamless.
  const set = [...words, ...words];
  return (
    <div className={`marquee__row marquee__row--${variant}`}>
      <div className="marquee__track">
        {[0, 1].map((s) => (
          <div className="marquee__set" key={s}>
            {set.map((word, i) => (
              <Fragment key={i}>
                <span className="marquee__word">{word}</span>
                <StarIcon className="marquee__star" />
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Two rows of moving words in opposite directions; scrolling the page also nudges them apart. */
export default function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) return;
      const progress = (vh - rect.top) / (vh + rect.height); // 0 entering → 1 leaving
      el.style.setProperty("--shift", ((progress - 0.5) * 220).toFixed(1));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className={`marquee ${paused ? "marquee--paused" : ""}`}>
      <div aria-hidden="true">
        <Row words={t.primary} variant="primary" />
        <Row words={t.secondary} variant="secondary" />
      </div>
      <button
        type="button"
        className="marquee__toggle"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? t.play : t.pause}
        aria-pressed={paused}
      >
        {paused ? <PlayIcon size={18} /> : <PauseIcon size={18} />}
      </button>
    </div>
  );
}
