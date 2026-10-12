import type { LeadHeading as LeadHeadingCopy } from "../config";

type Level = "h1" | "h2" | "h3";

/** Fraunces heading with an italic lead word, e.g. "*Most* loved". */
export default function LeadHeading({
  as: Tag = "h2",
  text,
  className = "",
  id,
  reveal = false,
}: {
  as?: Level;
  text: LeadHeadingCopy;
  className?: string;
  id?: string;
  reveal?: boolean;
}) {
  return (
    <Tag className={`display ${className}`} id={id} data-reveal={reveal ? "" : undefined}>
      <em>{text.lead}</em>
      {text.rest}
    </Tag>
  );
}
