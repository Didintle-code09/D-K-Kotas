import { useEffect, type CSSProperties } from "react";
import { prefersReducedMotion } from "./scroll";

/**
 * Fades `[data-reveal]` elements up as they scroll into view.
 * Content is only hidden once this runs (html.reveal-ready), so nothing disappears without JS
 * and nothing is hidden at all for people who prefer reduced motion.
 * Re-runs when `key` changes (the route) to pick up the new page's elements.
 */
export function useReveal(key: string) {
  useEffect(() => {
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("reveal-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll("[data-reveal]:not([data-revealed])").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);
}

/** Inline style for staggering revealed items. */
export const revealDelay = (index: number, step = 90) => ({ "--reveal-delay": `${index * step}ms` }) as CSSProperties;
