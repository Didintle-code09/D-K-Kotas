import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Scroll to a section on the current page and move focus to it for keyboard and screen-reader users. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  el.focus({ preventScroll: true });
}

/** Go to a home-page section from any route. */
export function useGoToSection() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return useCallback(
    (id: string) => {
      if (pathname === "/") scrollToSection(id);
      else navigate("/", { state: { scrollTo: id } });
    },
    [navigate, pathname],
  );
}
