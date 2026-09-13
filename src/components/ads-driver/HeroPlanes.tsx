import { cn } from "@/lib/cn";

/**
 * Hero art for the Ads Driver home — three translucent planes stacked in
 * CSS 3D (Mars × Perspective direction). No images.
 *
 * Layout: the planes sit in normal flow and each one overlaps the previous by
 * a fixed 12px — less than a plane's own bottom padding — so body text is
 * never covered by the next plane at any width (375px included). Depth comes
 * from the transforms (`rotate-x`, `-translate-z`, the inset steps), not from
 * absolute stacking, which is what made the old percentage offsets collide.
 *
 * Claims gate: everything printed on the planes is structural — real rule
 * ids from src/lib/knowledge/packs, gate labels, the current rung. No
 * performance numbers, no dollar figures. The whole thing is decorative and
 * aria-hidden; the copy beside it carries the meaning.
 */

const FINDINGS = [
  { id: "hs.missing-lsa", severity: "high", title: "No Local Services campaign" },
  {
    id: "base.conversion-integrity",
    severity: "high",
    title: "Bidding on unverified conversions",
  },
  {
    id: "hs.service-radius",
    severity: "medium",
    title: "Spend outside the profitable radius",
  },
] as const;

const SEVERITY: Record<(typeof FINDINGS)[number]["severity"], string> = {
  high: "border-lime-500/60 text-lime-500",
  medium: "border-white/25 text-white/70",
};

const PLANE =
  "relative rounded-xl p-4 transform-3d rotate-x-12 -rotate-y-6 will-change-transform";

export function HeroPlanes({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative mx-auto w-full max-w-[24rem] perspective-distant select-none",
        className,
      )}
    >
      {/* lime data-glow behind the stack */}
      <div className="absolute inset-x-8 top-1/4 -z-10 h-1/2 rounded-full bg-lime-500/15 blur-3xl" />

      <div className="relative flex flex-col transform-3d">
        {/* Back plane — Observe */}
        <div className={cn(PLANE, "glass mx-8 -translate-z-24 opacity-70")}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-eyebrow text-white/60">
              Observe
            </span>
            <span className="numerals text-xs text-white/50">read-only</span>
          </div>
          <ul className="mt-3 space-y-1.5 text-xs text-white/70">
            <li className="flex items-center gap-2">
              <span className="size-1.5 shrink-0 rounded-full bg-lime-500" />
              Scheduled pull · normalized snapshot
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 shrink-0 rounded-full bg-lime-500" />
              Audit through the niche pack
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 shrink-0 rounded-full bg-white/40" />
              Diff vs last run
            </li>
          </ul>
        </div>

        {/* Middle plane — Findings */}
        <div className={cn(PLANE, "glass mx-4 -mt-3 -translate-z-12")}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-eyebrow text-white/60">
              Findings
            </span>
            <span className="numerals text-xs text-white/50">ranked</span>
          </div>
          <ul className="mt-3 space-y-2">
            {FINDINGS.map((f) => (
              <li key={f.id} className="flex items-start gap-2">
                <span
                  className={cn(
                    "mt-0.5 shrink-0 rounded-md border px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide",
                    SEVERITY[f.severity],
                  )}
                >
                  {f.severity}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-medium text-white">
                    {f.title}
                  </span>
                  <span className="numerals block truncate text-[10px] text-white/45">
                    {f.id}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Front plane — Change-set awaiting approval */}
        <div
          className={cn(
            PLANE,
            "-mt-3 border border-lime-500/40 bg-charcoal-900/95 shadow-glow-lime",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-eyebrow text-lime-500">
              Change-set
            </span>
            <span className="numerals text-xs text-white/50">
              rung 2 · awaiting you
            </span>
          </div>
          <div className="mt-3 rounded-lg border border-white/10 bg-ink-950/60 p-3">
            <div className="numerals text-xs text-white/80">negatives.csv</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px]">
              <span className="rounded-md border border-lime-500/50 px-1.5 py-px text-lime-500">
                Tier 1 · exact · safe
              </span>
              <span className="rounded-md border border-white/20 px-1.5 py-px text-white/70">
                Tier 2 · phrase · review
              </span>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <span className="inline-flex h-8 flex-1 items-center justify-center rounded-lg bg-lime-500 text-xs font-semibold text-ink-950">
              Approve
            </span>
            <span className="inline-flex h-8 flex-1 items-center justify-center rounded-lg border border-white/20 text-xs font-semibold text-white/80">
              Reject → adjust pack
            </span>
          </div>
          <p className="mt-3 text-[10px] text-white/45">
            No API write path exists. You apply it — or you don&apos;t.
          </p>
        </div>
      </div>
    </div>
  );
}
