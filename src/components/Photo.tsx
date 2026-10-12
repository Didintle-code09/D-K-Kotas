import type { ReactNode } from "react";

/** Full-bleed photo with the dark wash and content centred on top. */
export default function Photo({
  src,
  alt,
  eager = false,
  className = "",
  children,
}: {
  src: string;
  alt: string;
  eager?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`photo ${className}`}>
      <img
        className="photo__img"
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        {...(eager ? { fetchpriority: "high" } : {})}
      />
      <div className="photo__content">{children}</div>
    </div>
  );
}
