import { useEffect, type ReactNode } from "react";
import { config, copy, type LegalDoc, type LegalSection } from "../config";

function SectionBody({ section }: { section: LegalSection }) {
  const { body, link } = section;
  if (!link || !body.includes(link.text)) return <p>{body}</p>;
  const [before, after] = body.split(link.text);
  const anchor: ReactNode = (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-link">
      {link.text}
      <span className="sr-only"> {copy.newTab}</span>
    </a>
  );
  return (
    <p>
      {before}
      {anchor}
      {after}
    </p>
  );
}

export default function LegalPage({ doc }: { doc: LegalDoc }) {
  useEffect(() => {
    document.title = doc.pageTitle;
  }, [doc.pageTitle]);

  return (
    <article className="legal container container--narrow">
      <h1 className="legal__title">{doc.heading}</h1>
      <p className="legal__updated">
        <em>
          {copy.lastUpdated} {config.legalLastUpdated}
        </em>
      </p>
      {doc.sections.map((s) => (
        <section key={s.title} className="legal__section" data-reveal="">
          <h2>{s.title}</h2>
          <SectionBody section={s} />
        </section>
      ))}
    </article>
  );
}
