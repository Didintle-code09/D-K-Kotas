import { useCallback, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { copy, menu, privacy, terms } from "./config";
import type { Basket } from "./lib/order";
import { useReveal } from "./lib/reveal";
import Home from "./pages/Home";
import LegalPage from "./pages/LegalPage";
import NotFound from "./pages/NotFound";

/** New pages start at the top unless they were asked to scroll to a section. */
function ScrollToTop() {
  const { pathname, state, hash } = useLocation();
  useEffect(() => {
    if (!state && !hash) window.scrollTo(0, 0);
  }, [pathname]); // only on route change
  return null;
}

export default function App() {
  // The basket lives here (in memory only) so it survives a visit to /terms or /privacy.
  const [basket, setBasket] = useState<Basket>({});
  const [announcement, setAnnouncement] = useState("");
  const { pathname } = useLocation();
  useReveal(pathname);

  const setQty = useCallback((id: string, qty: number) => {
    setBasket((b) => {
      const next = { ...b };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }, []);

  const add = useCallback((id: string) => {
    setBasket((b) => ({ ...b, [id]: (b[id] ?? 0) + 1 }));
    const item = menu.find((m) => m.id === id);
    if (item) setAnnouncement(`${item.name} ${copy.addedAnnouncement}`);
  }, []);

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home basket={basket} add={add} setQty={setQty} />} />
          <Route path="/terms" element={<LegalPage doc={terms} />} />
          <Route path="/privacy" element={<LegalPage doc={privacy} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </>
  );
}
