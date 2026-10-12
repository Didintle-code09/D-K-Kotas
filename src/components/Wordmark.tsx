import { config, copy } from "../config";

export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`}>
      <span className="wordmark__name">{config.businessName}</span>
      <span className="wordmark__sub">{copy.wordmarkSub}</span>
    </span>
  );
}
