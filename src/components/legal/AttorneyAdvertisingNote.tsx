import { cn } from "@/lib/cn";

export interface AttorneyAdvertisingNoteProps {
  tone?: "dark" | "light";
  className?: string;
}

/**
 * Legal-advertising compliance note. Rendered wherever a legal page speaks
 * about results: no outcome guarantees, no comparative "best" claims, no
 * invented case values. Copy is deliberately plain and small.
 */
export function AttorneyAdvertisingNote({
  tone = "dark",
  className,
}: AttorneyAdvertisingNoteProps) {
  return (
    <p
      role="note"
      className={cn(
        "text-xs leading-relaxed",
        tone === "dark" ? "text-white/55" : "text-charcoal-700",
        className,
      )}
    >
      <span className="font-semibold uppercase tracking-eyebrow">
        Attorney advertising note.
      </span>{" "}
      Nothing on this page is a promise of case outcomes, signed-case volume,
      or fees. Any results HOMEGRWN publishes come from account data with the
      firm&apos;s permission, and every ad we run for a law firm is built to
      that firm&apos;s bar rules on lawyer advertising — including how the
      firm chooses to be described and what it may say about prior results.
    </p>
  );
}
