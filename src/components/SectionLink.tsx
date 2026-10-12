import type { MouseEvent, ReactNode } from "react";
import { useGoToSection } from "../lib/scroll";

/** A link to a home-page section that works from any route. */
export default function SectionLink({
  to,
  className,
  children,
  onNavigate,
}: {
  to: string;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
}) {
  const go = useGoToSection();
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate?.();
    go(to);
  };
  return (
    <a href={`/#${to}`} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
