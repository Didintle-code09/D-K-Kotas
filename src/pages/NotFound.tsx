import { useEffect } from "react";
import { Link } from "react-router-dom";
import { copy } from "../config";
import LeadHeading from "../components/LeadHeading";

export default function NotFound() {
  useEffect(() => {
    document.title = copy.notFound.title;
  }, []);

  return (
    <div className="legal container container--narrow">
      <LeadHeading as="h1" text={copy.notFound.heading} className="section__title" />
      <p className="section__intro">{copy.notFound.body}</p>
      <Link to="/" className="btn btn--primary">
        {copy.notFound.back}
      </Link>
    </div>
  );
}
