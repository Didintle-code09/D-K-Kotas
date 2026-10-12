import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { config, copy } from "../config";
import { prefersReducedMotion } from "../lib/scroll";
import SectionLink from "./SectionLink";
import Wordmark from "./Wordmark";

export default function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll, focus the first link and listen for Esc while the mobile panel is open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  // Keep Tab focus inside the header (toggle + panel) while the panel is open.
  const trapFocus = (e: KeyboardEvent<HTMLElement>) => {
    if (!open || e.key !== "Tab" || !headerRef.current) return;
    const focusables = [toggleRef.current, ...Array.from(panelRef.current?.querySelectorAll<HTMLElement>("a, button") ?? [])].filter(
      Boolean,
    ) as HTMLElement[];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const solid = !isHome || scrolled || open;
  const close = () => setOpen(false);

  return (
    <header ref={headerRef} className={`nav ${solid ? "nav--solid" : ""} ${open ? "nav--open" : ""}`} onKeyDown={trapFocus}>
      <a className="skip-link" href="#main">
        {copy.skipLink}
      </a>
      <div className="nav__bar">
        <div className="nav__spacer" aria-hidden="true" />
        <Link to="/" className="nav__brand" aria-label={`${config.businessName} home`} onClick={() => isHome && window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })}>
          <Wordmark />
        </Link>
        <nav className="nav__desktop" aria-label="Main">
          <ul>
            {copy.nav.links.map((l) => (
              <li key={l.id}>
                <SectionLink to={l.id} className="nav__link">
                  {l.label}
                </SectionLink>
              </li>
            ))}
          </ul>
          <SectionLink to="preorder" className="btn btn--primary btn--sm">
            {copy.nav.cta}
          </SectionLink>
        </nav>
        <button
          ref={toggleRef}
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? copy.nav.closeMenu : copy.nav.openMenu}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>

      <div id="mobile-menu" ref={panelRef} className="nav__panel" hidden={!open}>
        <nav aria-label="Mobile">
          <ul>
            {copy.nav.links.map((l) => (
              <li key={l.id}>
                <SectionLink to={l.id} className="nav__panel-link" onNavigate={close}>
                  {l.label}
                </SectionLink>
              </li>
            ))}
          </ul>
          <SectionLink to="preorder" className="btn btn--primary btn--block" onNavigate={close}>
            {copy.nav.cta}
          </SectionLink>
        </nav>
      </div>
    </header>
  );
}
