import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FindUs from "../components/FindUs";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import Hero from "../components/Hero";
import Menu from "../components/Menu";
import MostLoved from "../components/MostLoved";
import OrderBanner from "../components/OrderBanner";
import PreOrder from "../components/PreOrder";
import type { Basket } from "../lib/order";
import { scrollToSection } from "../lib/scroll";

const HOME_TITLE = document.title;

export default function Home({
  basket,
  add,
  setQty,
}: {
  basket: Basket;
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = HOME_TITLE;
  }, []);

  // Arriving from another page (state) or a direct link (/#menu): scroll to that section.
  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo ?? location.hash.slice(1);
    if (!target) return;
    const id = requestAnimationFrame(() => scrollToSection(target));
    if (location.state) navigate(location.pathname + location.hash, { replace: true, state: null });
    return () => cancelAnimationFrame(id);
  }, [location, navigate]);

  return (
    <>
      <Hero />
      <MostLoved
        onAdd={(id) => {
          add(id);
          scrollToSection("preorder");
        }}
      />
      <Menu basket={basket} onAdd={add} />
      <OrderBanner />
      <PreOrder basket={basket} setQty={setQty} />
      <FindUs />
      <FloatingWhatsApp />
    </>
  );
}
