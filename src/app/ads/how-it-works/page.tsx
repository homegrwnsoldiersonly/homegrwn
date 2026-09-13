import type { Metadata } from "next";
import {
  Card,
  Container,
  CTAStrip,
  Eyebrow,
  Heading,
  Section,
} from "@/components/ui";
import { LoopDiagram } from "@/components/ads-driver";

export const metadata: Metadata = {
  title: "How it works",
  alternates: { canonical: "/how-it-works" },
  description:
    "Observe, propose, approve, verify. How Ads Driver audits a Google Ads account through a niche pack, drafts change-sets, gates every write behind a human, and verifies against booked jobs and signed cases.",
};

const CHECKS: Array<{ layer: string; checks: string; checkedBy: string }> = [
  {
    layer: "Niche packs (judgment)",
    checks: "Accounts, via benchmarks and rules",
    checkedBy: "Git review of every data change; well-formedness tests; a clean-account canary that must audit clean",
  },
  {
    layer: "Rule engine",
    checks: "Account state vs pack judgment",
    checkedBy: "Test suite incl. control-account fixtures; determinism (same input → same report); a crashing rule can't sink an audit",
  },
  {
    layer: "Ingestion mapper",
    checks: "Raw API data → honest normalization",
    checkedBy: "Unit tests per landmine (micros, enums, taxonomy); documented approximations",
  },
  {
    layer: "Conversion import",
    checks: "That bidding chases real value",
    checkedBy: "Dry-run plan preview; human apply gate; order-id dedupe; partial failures surfaced",
  },
  {
    layer: "Change-sets",
    checks: "That proposals are concrete and risk-tiered",
    checkedBy: "A human applies them; Tier-2 over-block cautions; no auto-write path exists",
  },
  {
    layer: "Diff engine",
    checks: "Drift, regressions, whether fixes landed",
    checkedBy: "Its own test suite; the 'actionable' logic is reviewed like code",
  },
  {
    layer: "Human operator",
    checks: "Everything above — final approval",
    checkedBy: "The diff engine re-audits the results of their approvals; outcome data scores their calls",
  },
  {
    layer: "Future LLM agents",
    checks: "Fuzzy classification, drafting",
    checkedBy: "Bounded by the deterministic engine; verifier/auditor agents; policy gates; kill switch",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Section variant="grain" padding="lg" as="div" className="bg-ink-950">
        <Container size="lg">
          <Eyebrow flag>How it works</Eyebrow>
          <Heading as="h1" size="display-lg" className="mt-5 max-w-3xl">
            Observe. Propose. Approve. Verify.
          </Heading>
          <p className="mt-6 max-w-2xl text-md text-white/70">
            One loop, two clocks. The fast clock asks whether the account
            changed. The slow clock asks whether signed cases and booked jobs
            actually got cheaper. A change is only verified when the slow clock
            says so — that is what stops the system from gaming its own metrics.
          </p>
        </Container>
      </Section>

      <Section variant="dark" className="bg-ink-950">
        <Container size="lg">
          <LoopDiagram />
        </Container>
      </Section>

      <Section variant="dark" className="bg-charcoal-900">
        <Container size="xl">
          <Eyebrow>Two feedback frequencies</Eyebrow>
          <Heading as="h2" size="display-md" className="mt-4 max-w-3xl">
            A finding disappearing is not the same as the economics moving.
          </Heading>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Card radius="xl" className="border-white/10 bg-ink-950/60">
              <div className="flex items-baseline gap-3">
                <span className="numerals text-3xl font-black leading-none text-lime-500">
                  fast
                </span>
                <span className="text-xs font-semibold uppercase tracking-eyebrow text-white/55">
                  every scheduled run
                </span>
              </div>
              <p className="mt-4 text-sm text-white/70">
                Did the account change? The diff engine compares this run to
                the last and surfaces only what is new, worse, or resolved.
                Silence is a valid output.
              </p>
            </Card>
            <Card radius="xl" className="border-lime-500/40 bg-charcoal-900 shadow-glow-lime">
              <div className="flex items-baseline gap-3">
                <span className="numerals text-3xl font-black leading-none text-lime-500">
                  slow
                </span>
                <span className="text-xs font-semibold uppercase tracking-eyebrow text-white/55">
                  as outcomes land
                </span>
              </div>
              <p className="mt-4 text-sm text-white/70">
                Did signed cases or booked jobs get cheaper? Read from the
                offline import, never from platform metrics. This is the number
                that recalibrates the pack.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      <Section variant="dark" className="bg-ink-950">
        <Container size="xl">
          <Eyebrow>Checks and balances</Eyebrow>
          <Heading as="h2" size="display-md" className="mt-4 max-w-3xl">
            Every layer is checked by something that isn&apos;t itself.
          </Heading>
          <p className="mt-5 max-w-2xl text-md text-white/70">
            Judgment is versioned, execution is gated, verification is
            independent, and ground truth is business outcomes.
          </p>
          <div className="mt-10 overflow-x-auto rounded-xl border border-white/10 bg-charcoal-900/60">
            <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {["Layer", "What it checks", "What checks it"].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-4 py-3 text-xs font-semibold uppercase tracking-eyebrow text-white/55"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CHECKS.map((row) => (
                  <tr key={row.layer} className="border-b border-white/10 last:border-b-0">
                    <th scope="row" className="px-4 py-4 align-top font-semibold text-white">
                      {row.layer}
                    </th>
                    <td className="px-4 py-4 align-top text-white/65">{row.checks}</td>
                    <td className="px-4 py-4 align-top text-white/80">{row.checkedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      <CTAStrip
        eyebrow="Early access"
        heading="See the first findings on your own account."
        body="Manager-link on read-only scope. Read the audit. Then decide."
        primary={{ label: "Apply for early access", href: "/apply" }}
        secondary={{ label: "Pricing model", href: "/pricing" }}
      />
    </>
  );
}
