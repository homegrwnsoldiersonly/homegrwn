import { cn } from "@/lib/cn";
import { CURRENT_RUNG } from "./ladder";

/**
 * Generic AI ad tool / traditional agency / Ads Driver.
 * Every Ads Driver cell states what is built today, not what is planned.
 * The other two columns describe the category in general ("typically"),
 * never a named competitor. Wide table scrolls inside its own container
 * so the page never scrolls sideways at 375px.
 */

interface Row {
  aspect: string;
  generic: string;
  agency: string;
  driver: string;
}

const ROWS: Row[] = [
  {
    aspect: "Optimizes to",
    generic:
      "Whatever the platform can count — form fills, any call, 'conversions'.",
    agency: "Whatever the monthly report tracks. Usually leads.",
    driver:
      "Booked jobs and signed cases, imported as offline conversions. Form fills are demoted to observe.",
  },
  {
    aspect: "Where the judgment comes from",
    generic: "One model for every SMB. Tuned for the median advertiser.",
    agency: "The account manager you happen to get.",
    driver:
      "Versioned niche packs for trades and PI law. Every benchmark and rule is a file a human reviewed.",
  },
  {
    aspect: "Who can touch your spend",
    generic: "The tool, often by default.",
    agency: "The agency, under the contract.",
    driver: `You. There is no API write path today (rung ${CURRENT_RUNG}). Later rungs add gates, not autonomy.`,
  },
  {
    aspect: "Explainability",
    generic: "A dashboard. The 'why' is inside the model.",
    agency: "A monthly call.",
    driver:
      "Every finding carries evidence, a recommendation, and the niche rationale. Disagree line by line.",
  },
  {
    aspect: "How often it looks",
    generic: "Continuously, on the platform's signals.",
    agency: "When someone has time.",
    driver:
      "On a schedule, read-only. Diffed against the last run. Silent when nothing changed.",
  },
  {
    aspect: "What it changes",
    generic: "Bids, budgets, targeting — often silently.",
    agency: "Whatever the plan says this month.",
    driver:
      "Concrete change-sets you apply: negatives CSV in two risk tiers today. Broader classes as rungs ship.",
  },
  {
    aspect: "Pricing",
    generic: "Often a percent of spend or usage tiers.",
    agency: "Percent of spend or a retainer, usually on a contract.",
    driver:
      "Flat monthly. Never a percent of spend. No contract. Figures announced at early access.",
  },
  {
    aspect: "Where it is today",
    generic: "Shipped, general-purpose.",
    agency: "Established.",
    driver: `Early access. Rungs 0–${CURRENT_RUNG} built; rungs ${CURRENT_RUNG + 1}–5 designed.`,
  },
];

const HEAD = ["", "Generic AI ad tool", "Traditional agency", "Ads Driver"];

export function ComparisonTable({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-xl border border-white/10 bg-charcoal-900/60",
        className,
      )}
    >
      <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-white/10">
            {HEAD.map((h, i) => (
              <th
                key={h || "aspect"}
                scope="col"
                className={cn(
                  "px-4 py-3 align-bottom text-xs font-semibold uppercase tracking-eyebrow",
                  i === 3
                    ? "bg-lime-500/10 text-lime-500"
                    : "text-white/55",
                  i === 0 && "w-[11rem]",
                )}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.aspect} className="border-b border-white/10 last:border-b-0">
              <th
                scope="row"
                className="px-4 py-4 align-top text-sm font-semibold text-white"
              >
                {row.aspect}
              </th>
              <td className="px-4 py-4 align-top text-white/60">{row.generic}</td>
              <td className="px-4 py-4 align-top text-white/60">{row.agency}</td>
              <td className="bg-lime-500/5 px-4 py-4 align-top text-white">
                {row.driver}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
