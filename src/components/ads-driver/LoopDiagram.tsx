import { cn } from "@/lib/cn";

/**
 * The account optimization loop from docs/control-architecture.md §2 as a
 * stepped diagram: 01 Observe → 02 Propose → 03 Approve → 04 Verify → back
 * to 01. Big mono numerals, a rail between steps, honest status per step.
 */

interface Step {
  n: string;
  name: string;
  status: string;
  live: boolean;
  lede: string;
  items: string[];
}

const STEPS: Step[] = [
  {
    n: "01",
    name: "Observe",
    status: "Built",
    live: true,
    lede: "A scheduled, read-only pull. The account cannot be changed from here.",
    items: [
      "Raw API rows → a normalized snapshot. Micros, enums, and taxonomy mapped by a pure, unit-tested mapper. Approximations documented, never silent.",
      "The rule engine audits the snapshot through your niche pack. Same input, same report, every time.",
      "Every run is persisted. The diff engine compares it to the last one: anything new, worse, or resolved?",
      "Nothing changed? Silent. No operator noise.",
    ],
  },
  {
    n: "02",
    name: "Propose",
    status: "Built",
    live: true,
    lede: "Findings you can argue with. Change-sets you can apply.",
    items: [
      "Each finding carries evidence, a recommendation, and the niche rationale — why this matters for a roofer or a PI firm specifically.",
      "Findings become concrete change-sets. Today that is a negatives CSV.",
      "Two risk tiers: safe exact-match terms, and phrases that could over-block and need your eyes.",
    ],
  },
  {
    n: "03",
    name: "Approve",
    status: "Human today · policy-gated later",
    live: true,
    lede: "You hold the pen. That is the design, not a limitation.",
    items: [
      "Review in the cockpit or CLI.",
      "Approve → you apply it in Google Ads Editor today. At rung 3, one click sends it to a deterministic API executor with an audit log.",
      "Reject → the feedback goes into pack data: benchmarks, junk signals, rules. Reviewed in git like code.",
    ],
  },
  {
    n: "04",
    name: "Verify",
    status: "The loop closes",
    live: true,
    lede: "A change isn't verified when the finding disappears. It's verified when the economics move.",
    items: [
      "Fast loop: the next scheduled run — does the diff show the finding RESOLVED? If not, it's back on the list.",
      "Slow loop: did signed cases or booked jobs actually get cheaper? Read from the offline import, not from platform metrics.",
      "Benchmark calibration: pack data updated via git. Yesterday's approval gets re-audited tomorrow.",
    ],
  },
];

export function LoopDiagram({ className }: { className?: string }) {
  return (
    <ol className={cn("relative", className)}>
      {STEPS.map((s, i) => {
        const last = i === STEPS.length - 1;
        return (
          <li
            key={s.n}
            className="relative grid grid-cols-[3.5rem_1fr] gap-x-4 sm:grid-cols-[7rem_1fr] sm:gap-x-8"
          >
            <div className="flex flex-col items-center">
              <span className="numerals text-3xl font-black leading-none text-lime-500 sm:text-5xl">
                {s.n}
              </span>
              <span
                aria-hidden
                className={cn(
                  "mt-3 w-px flex-1",
                  last ? "border-l border-dashed border-lime-500/50" : "bg-lime-500/50",
                )}
              />
            </div>

            <div className={cn("pb-12", last && "pb-0")}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h3 className="text-xl font-bold tracking-tight text-white">{s.name}</h3>
                <span
                  className={cn(
                    "rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
                    s.live
                      ? "border-lime-500/60 bg-lime-500/10 text-lime-500"
                      : "border-dashed border-white/25 text-white/55",
                  )}
                >
                  {s.status}
                </span>
              </div>
              <p className="mt-2 text-md text-white/80">{s.lede}</p>
              <ul className="mt-4 space-y-2.5">
                {s.items.map((it) => (
                  <li key={it} className="flex gap-3 text-sm text-white/65">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-lime-500" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
      <li className="mt-6 grid grid-cols-[3.5rem_1fr] gap-x-4 sm:grid-cols-[7rem_1fr] sm:gap-x-8">
        <div className="flex justify-center">
          <span className="numerals text-3xl font-black leading-none text-white/30 sm:text-5xl">
            ↺
          </span>
        </div>
        <p className="self-center text-sm text-white/55">
          Back to 01. The calibrated pack audits the account on the next run.
        </p>
      </li>
    </ol>
  );
}
