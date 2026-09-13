import Link from "next/link";
import { Button, Card, Eyebrow } from "@/components/ui";
import { cn } from "@/lib/cn";
import { CURRENT_RUNG } from "./ladder";

/**
 * Pricing MODEL only. No dollar figures may render here until Nathan sets
 * them (docs/content/claims.md). The price card is a visible
 * "announced at early access" state, never a plausible-looking number.
 */

const PRINCIPLES = [
  {
    title: "Flat monthly",
    body: "One number per account per month. It does not move when your spend does.",
  },
  {
    title: "Never a percent of spend",
    body: "A fee tied to spend is a reason to want your spend higher. We refuse that incentive outright.",
  },
  {
    title: "No contract. Cancel any time.",
    body: "Month to month. Stop when it stops earning its place. Your account and its history stay yours.",
  },
];

const INCLUDED = [
  "A niche pack matched to your trade or practice area",
  "Manager-link onboarding on read-only scope — no passwords, ever",
  "Scheduled audits with diff alerts: only what's new, worse, or resolved",
  "Ranked findings with evidence, recommendation, and niche rationale",
  "Change-sets you approve and apply — negatives CSV in two risk tiers today",
  "Offline conversion import plan for booked jobs / signed cases (dry-run, human apply)",
  "A human at HOMEGRWN who owns the outcome and calibrates your benchmarks",
];

export function PricingModel({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-[1fr_1.15fr]", className)}>
      <div className="grid gap-4 content-start">
        {PRINCIPLES.map((p, i) => (
          <Card
            key={p.title}
            radius="xl"
            className="border-white/10 bg-charcoal-900/70"
          >
            <div className="flex items-start gap-4">
              <span className="numerals text-2xl font-black leading-none text-lime-500">
                0{i + 1}
              </span>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-white">{p.title}</h3>
                <p className="mt-1.5 text-sm text-white/65">{p.body}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card
        radius="xl"
        padding="lg"
        className="relative overflow-hidden border-lime-500/40 bg-charcoal-900 shadow-glow-lime"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Eyebrow flag>Per account · per month</Eyebrow>
          <span className="rounded-full border border-white/15 px-2.5 py-1 text-xs font-medium text-white/70">
            Early access
          </span>
        </div>

        <div
          role="note"
          className="mt-6 rounded-lg border border-dashed border-lime-500/50 bg-lime-500/5 p-5"
        >
          <div className="numerals text-xs uppercase tracking-eyebrow text-lime-500">
            Monthly fee
          </div>
          <p className="mt-2 text-2xl font-extrabold tracking-display text-white">
            Pricing announced at early access.
          </p>
          <p className="mt-2 text-sm text-white/65">
            No figure ships until it is real. Applicants hear the number first,
            before it goes on this page.
          </p>
        </div>

        <div className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-eyebrow text-white/55">
            What the flat fee covers today (rungs 0–{CURRENT_RUNG})
          </div>
          <ul className="mt-3 space-y-2">
            {INCLUDED.map((it) => (
              <li key={it} className="flex gap-2.5 text-sm text-white/80">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-lime-500" />
                {it}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 rounded-lg border border-white/10 bg-ink-950/50 p-4 text-sm text-white/65">
          <span className="font-semibold text-white">Not included, on purpose:</span>{" "}
          your ad spend. That is paid to Google, by you, from your own billing.
          We never touch it and never take a cut of it.
        </div>

        <Button asChild size="lg" block className="mt-6">
          <Link href="/apply">Apply for early access</Link>
        </Button>
      </Card>
    </div>
  );
}
