import { useEffect, useState } from "react";
import { copy } from "../config";
import { whatsappLink } from "../lib/order";
import { WhatsAppIcon } from "./Icons";

/** Mobile-only chat button; hides while the pre-order section is on screen so it never covers the send button. */
export default function FloatingWhatsApp() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById("preorder");
    if (!target || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting));
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={whatsappLink(copy.floatingWhatsApp.message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`fab ${hidden ? "fab--hidden" : ""}`}
      aria-label={`${copy.floatingWhatsApp.label} ${copy.newTab}`}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
    >
      <WhatsAppIcon size={26} />
    </a>
  );
}
