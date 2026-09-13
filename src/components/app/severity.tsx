import type { Severity } from "@/lib/knowledge/types";
import { cn } from "@/lib/cn";

/**
 * Severity palette inside the brand rules: lime is reserved for accent /
 * positive; severity uses the restrained red for critical + high and
 * neutral white steps for medium + low. Never a second saturated hue.
 */
export const SEVERITY_STYLES: Record<
  Severity,
  { label: string; badge: string; bar: string; border: string; dot: string }
> = {
  critical: {
    label: "Critical",
    badge: "bg-red-500/15 text-red-300 ring-red-500/40",
    bar: "bg-red-500",
    border: "border-red-500/40",
    dot: "bg-red-500",
  },
  high: {
    label: "High",
    badge: "bg-red-400/10 text-red-300 ring-red-400/30",
    bar: "bg-red-400/70",
    border: "border-red-400/30",
    dot: "bg-red-400/70",
  },
  medium: {
    label: "Medium",
    badge: "bg-white/10 text-white/80 ring-white/15",
    bar: "bg-white/45",
    border: "border-white/15",
    dot: "bg-white/45",
  },
  low: {
    label: "Low",
    badge: "bg-white/5 text-white/55 ring-white/10",
    bar: "bg-white/20",
    border: "border-white/10",
    dot: "bg-white/20",
  },
};

export const SEVERITIES: readonly Severity[] = ["critical", "high", "medium", "low"];

export function SeverityBadge({
  severity,
  className,
}: {
  severity: Severity;
  className?: string;
}) {
  const s = SEVERITY_STYLES[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1",
        s.badge,
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

/**
 * Stacked severity distribution: one bar, four segments, mono legend. CSS
 * only — no chart library for four numbers.
 */
export function SeverityBar({
  counts,
  className,
}: {
  counts: Record<Severity, number>;
  className?: string;
}) {
  const total = SEVERITIES.reduce((s, k) => s + counts[k], 0);
  return (
    <div className={className}>
      <div
        role="img"
        aria-label={SEVERITIES.map((s) => `${counts[s]} ${s}`).join(", ")}
        className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/5"
      >
        {total > 0 &&
          SEVERITIES.map((s) =>
            counts[s] > 0 ? (
              <span
                key={s}
                className={cn("h-full", SEVERITY_STYLES[s].bar)}
                style={{ width: `${(counts[s] / total) * 100}%` }}
              />
            ) : null,
          )}
      </div>
      {/* flex-wrap, not a 4-col grid: in a narrow panel the grid let one item's
          count sit flush against the next item's dot. */}
      <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {SEVERITIES.map((s) => (
          <div key={s} className="flex items-center gap-2">
            <span aria-hidden className={cn("size-2 shrink-0 rounded-full", SEVERITY_STYLES[s].dot)} />
            <dt className="text-xs uppercase tracking-eyebrow text-white/55">
              {SEVERITY_STYLES[s].label}
            </dt>
            <dd className="numerals text-sm font-semibold">{counts[s]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
