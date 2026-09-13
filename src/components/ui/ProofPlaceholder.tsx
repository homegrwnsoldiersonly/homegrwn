import { cn } from "@/lib/cn";
import { CheckerFlag } from "./CheckerFlag";
import { Eyebrow } from "./Eyebrow";
import { Heading } from "./Heading";

export interface ProofPlaceholderProps {
  title?: string;
  body?: string;
  /** Badge text. Always reads as a placeholder — never as availability. */
  label?: string;
  /** dark (default) · light */
  tone?: "dark" | "light";
  /** Single-line variant for tight spots (e.g. beside a CTA). */
  compact?: boolean;
  className?: string;
}

/**
 * Claims gate (docs/content/claims.md): no numbers, client counts,
 * testimonials, or client logos ship until VERIFIED. This block stands in for
 * every proof section and is visibly labelled as a placeholder — it must never
 * look like plausible data.
 */
export function ProofPlaceholder({
  title = "Case studies publishing as accounts go live.",
  body = "We only publish results we can back with account data. No invented percentages, no stock-name testimonials. This section fills in as the first HOMEGRWN accounts report.",
  label = "Placeholder — no verified claims yet",
  tone = "dark",
  compact = false,
  className,
}: ProofPlaceholderProps) {
  const isDark = tone === "dark";
  const badge = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        isDark
          ? "border-white/15 text-white/70"
          : "border-charcoal-900/20 text-charcoal-700",
      )}
    >
      <span
        aria-hidden
        className="inline-block size-1.5 rounded-full bg-lime-500"
      />
      {label}
    </span>
  );

  if (compact) {
    return (
      <div
        role="note"
        className={cn(
          "flex flex-wrap items-center gap-3 text-sm",
          isDark ? "text-white/70" : "text-charcoal-700",
          className,
        )}
      >
        {badge}
        <span>{title}</span>
      </div>
    );
  }

  return (
    <div
      role="note"
      className={cn(
        "rounded-2xl border border-dashed p-6 sm:p-8",
        isDark
          ? "border-white/20 bg-white/[0.03] text-white"
          : "border-charcoal-900/25 bg-white/60 text-charcoal-900",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Eyebrow tone={isDark ? "lime" : "dark"} flag>
          Proof
        </Eyebrow>
        {badge}
      </div>
      <Heading as="h3" size="display-sm" className="mt-4">
        {title}
      </Heading>
      <p
        className={cn(
          "mt-3 max-w-prose text-md",
          isDark ? "text-white/70" : "text-charcoal-700",
        )}
      >
        {body}
      </p>
      <CheckerFlag
        size={14}
        cols={12}
        rows={2}
        className={cn("mt-6", !isDark && "text-charcoal-900")}
      />
    </div>
  );
}
