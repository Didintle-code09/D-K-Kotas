import type { CSSProperties, ReactNode } from "react";

const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; // 1×1 transparent

/**
 * Full-bleed photo area with the dark wash and content centred on top.
 * Several images are laid out as a mosaic (see .photo__mosaic in styles.css); the first
 * carries the alt text and the rest are decorative.
 */
export default function Photo({
  images,
  alt,
  eager = false,
  className = "",
  children,
}: {
  images: readonly string[];
  alt: string;
  eager?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`photo ${className}`}>
      <div className="photo__mosaic" data-count={images.length}>
        {images.map((src, i) => (
          <img
            key={`${src}-${i}`}
            className="photo__img"
            src={src}
            alt={i === 0 ? alt : ""}
            loading={eager && i < 4 ? "eager" : "lazy"}
            decoding="async"
            style={{ "--i": i } as CSSProperties}
            // A missing photo shows the warm background instead of a broken-image icon and alt text.
            onError={(e) => {
              e.currentTarget.alt = "";
              e.currentTarget.src = BLANK;
            }}
            {...(eager && i === 0 ? { fetchpriority: "high" } : {})}
          />
        ))}
      </div>
      <div className="photo__content">{children}</div>
    </div>
  );
}
