import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { config, copy } from "../config";
import { prefersReducedMotion, SECTION_SCROLL_EVENT } from "../lib/scroll";
import SectionLink from "./SectionLink";
import Wordmark from "./Wordmark";

const TOP_THRESHOLD = 24; // px scrolled before the bar turns solid and compact
const HIDE_DELTA = 6; // ignore tiny scroll jitters

export default function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Scroll effects: solid + compact after the top, hide on scroll down, show on scroll up, progress line.
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    let lockUntil = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current?.style.setProperty("--progress", String(max > 0 ? Math.min(1, y / max) : 0));
      setAtTop(y < TOP_THRESHOLD);

      const delta = y - lastY;
      if (y < TOP_THRESHOLD) setHidden(false);
      else if (Math.abs(delta) > HIDE_DELTA) {
        const focusInside = headerRef.current?.contains(document.activeElement);
        const locked = performance.now() < lockUntil;
        if (delta > 0 && y > window.innerHeight * 0.5 && !locked && !focusInside) setHidden(true);
        else if (delta < 0) setHidden(false);
        lastY = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    // A nav click scrolls the page down; keep the bar on screen while that happens.
    const onSectionScroll = () => {
      lockUntil = performance.now() + 1200;
      setHidden(false);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener(SECTION_SCROLL_EVENT, onSectionScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener(SECTION_SCROLL_EVENT, onSectionScroll);
    };
  }, []);

  // Highlight the link for the section in the middle of the screen.
  useEffect(() => {
    setActive(null);
    if (!isHome || !("IntersectionObserver" in window)) return;
    const ids = copy.nav.links.map((l) => l.id);
    const inView = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? inView.add(e.target.id) : inView.delete(e.target.id)));
        setActive(ids.find((id) => inView.has(id)) ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  const isHidden = hidden && !open;

  // Let sticky elements (menu tabs) slide up into the space when the bar hides.
  useEffect(() => {
    document.documentElement.classList.toggle("nav-hidden", isHidden);
  }, [isHidden]);

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
    if (!open || e.key !== "Tab") return;
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

  const solid = !isHome || !atTop || open;
  const close = () => setOpen(false);
  const classes = ["nav", solid && "nav--solid", !atTop && "nav--compact", isHidden && "nav--hidden", open && "nav--open"]
    .filter(Boolean)
    .join(" ");

  return (
    <header ref={headerRef} className={classes} onKeyDown={trapFocus}>
      <a className="skip-link" href="#main">
        {copy.skipLink}
      </a>
      <div className="nav__bar">
        <Link
          to="/"
          className="nav__brand"
          aria-label={`${config.businessName} home`}
          onClick={() => isHome && window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })}
        >
          <Wordmark className="wordmark--left" />
        </Link>

        <nav className="nav__desktop" aria-label="Main">
          <ul>
            {copy.nav.links.map((l) => (
              <li key={l.id}>
                <SectionLink
                  to={l.id}
                  className={`nav__link ${active === l.id ? "is-active" : ""}`}
                  ariaCurrent={active === l.id ? "location" : undefined}
                >
                  {l.label}
                </SectionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav__actions">
          <SectionLink to="preorder" className="btn btn--primary btn--sm nav__cta">
            {copy.nav.cta}
          </SectionLink>
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
      </div>

      <div className="nav__progress" ref={progressRef} aria-hidden="true" />

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
          <SectionLink to="preorder" className="btn btn--primary btn--block nav__panel-cta" onNavigate={close}>
            {copy.nav.cta}
          </SectionLink>
        </nav>
      </div>
    </header>
  );
}
