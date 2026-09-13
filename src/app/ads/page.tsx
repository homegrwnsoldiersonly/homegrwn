import type { Metadata } from "next";
import Link from "next/link";
import {
  Button,
  Card,
  CheckerFlag,
  Container,
  CTAStrip,
  Eyebrow,
  Heading,
  ProofPlaceholder,
  Section,
} from "@/components/ui";
import {
  AutonomyLadder,
  ComparisonTable,
  CURRENT_RUNG,
  HeroPlanes,
  NichePacks,
  OptimizesTo,
} from "@/components/ads-driver";

export const metadata: Metadata = {
  title: {
    absolute: "Ads Driver by HOMEGRWN — Google Ads judgment for trades and law firms",
  },
  alternates: { canonical: "/" },
  description:
    "Ads Driver audits your Google Ads account through encoded trade and PI-law judgment, ranks what's wrong with evidence, and drafts the fix. Nothing touches your spend until you approve it.",
};

const PROBLEM_CARDS = [
  {
    title: "Scheduled. Read-only.",
    body: `A cron pulls a normalized snapshot of the whole account on read-only scope. It cannot write. Rung 1 on the ladder — built.`,
  },
  {
    title: "Diffed, not dumped.",
    body: "Every run is persisted and compared to the last. Only new, worsened, or resolved findings surface. Nothing changed? You hear nothing.",
  },
  {
    title: "Ranked, with the receipts.",
    body: "Each finding carries evidence, a recommendation, and the niche rationale. You can disagree with it line by line — and that disagreement becomes pack data.",
  },
];

const FACT_CHIPS = [
  "Trades + PI law only",
  "Manager-link, never passwords",
  `Rungs 0–${CURRENT_RUNG} built · ${CURRENT_RUNG + 1}–5 designed`,
  "Flat fee, never % of spend",
];

export default function AdsDriverHome() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <Section
        variant="grain"
        padding="lg"
        as="div"
        className="overflow-hidden bg-ink-950"
      >
        <Container size="xl" className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <Eyebrow flag>Ads Driver by HOMEGRWN</Eyebrow>
            <Heading as="h1" size="display-xl" className="mt-5 max-w-3xl">
              Judgment you can read.
              <br />
              <span className="text-lime-500">Execution you approve.</span>
            </Heading>
            <p className="mt-6 max-w-2xl text-md text-white/70">
              Ads Driver runs your Google Ads account through judgment written
              for trades and personal-injury firms — LSA first, call tracking,
              service radius, signed-case value, intake hours. It ranks what&apos;s
              wrong, shows its evidence, and drafts the fix. Nothing touches your
              spend until you say so.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/apply">Apply for early access</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/how-it-works">See the loop</Link>
              </Button>
            </div>
            <ul className="mt-10 flex flex-wrap gap-2">
              {FACT_CHIPS.map((c) => (
                <li
                  key={c}
                  className="rounded-md border border-white/15 px-2.5 py-1 text-xs font-medium text-white/70"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <HeroPlanes className="lg:justify-self-end" />
        </Container>
      </Section>

      {/* ── The auction moves 24/7 — HOMEGRWN's frame ────────────────── */}
      <Section variant="dark" className="bg-charcoal-900">
        <Container size="xl">
          <div className="max-w-3xl">
            <Eyebrow>The problem</Eyebrow>
            <Heading as="h2" size="display-md" className="mt-4">
              The auction moves every hour. Most accounts get looked at when
              someone has time.
            </Heading>
            <p className="mt-5 text-md text-white/70">
              The usual answer is to hand a black box the keys and let it
              &ldquo;optimize.&rdquo; It will — toward whatever it can count.
              HOMEGRWN&apos;s answer is different: read the whole account on a
              schedule, run it through judgment written for your trade, diff it
              against yesterday, and keep the pen in a human hand.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {PROBLEM_CARDS.map((c, i) => (
              <Card key={c.title} radius="xl" className="border-white/10 bg-ink-950/60">
                <span className="numerals text-2xl font-black leading-none text-lime-500">
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold tracking-tight">{c.title}</h3>
                <p className="mt-2 text-sm text-white/65">{c.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── What it optimizes to ─────────────────────────────────────── */}
      <Section variant="dark" className="bg-ink-950">
        <Container size="xl">
          <div className="max-w-3xl">
            <Eyebrow>What it optimizes to</Eyebrow>
            <Heading as="h2" size="display-md" className="mt-4">
              Booked jobs. Signed cases. Not form fills.
            </Heading>
            <p className="mt-5 text-md text-white/70">
              In PI, a click can cost more than a month of a plumber&apos;s
              budget, a form fill is close to worthless, and a signed case is
              worth the whole quarter. The platform sees the form fill. Ads
              Driver is built to close that gap — per vertical.
            </p>
          </div>
          <OptimizesTo className="mt-10" />
        </Container>
      </Section>

      {/* ── Autonomy ladder ─────────────────────────────────────────── */}
      <Section variant="dark" className="bg-charcoal-900">
        <Container size="xl" className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>The autonomy ladder</Eyebrow>
            <Heading as="h2" size="display-md" className="mt-4">
              Every write is human-gated until it&apos;s earned.
            </Heading>
            <p className="mt-5 text-md text-white/70">
              Six rungs. Each one adds a gate before it adds a capability.
              Where we are is printed on the ladder, not implied by the copy.
            </p>
            <p className="mt-4 text-sm text-white/55">
              Source: <span className="numerals">docs/control-architecture.md</span>{" "}
              — the same file the engineers work from.
            </p>
            <CheckerFlag size={16} cols={12} rows={3} className="mt-8" />
          </div>
          <AutonomyLadder />
        </Container>
      </Section>

      {/* ── Niche packs ─────────────────────────────────────────────── */}
      <Section variant="dark" className="bg-ink-950">
        <Container size="xl">
          <div className="max-w-3xl">
            <Eyebrow>Niche packs</Eyebrow>
            <Heading as="h2" size="display-md" className="mt-4">
              The judgment is a file. You can read it.
            </Heading>
            <p className="mt-5 text-md text-white/70">
              A pack is benchmarks, a value model for the outcome the platform
              can&apos;t see, junk-term signals, pure rules, and guardrails.
              Sub-niches inherit and override with data, not code. Everything
              below is read from the engine&apos;s own registry.
            </p>
          </div>
          <NichePacks className="mt-10" />
        </Container>
      </Section>

      {/* ── Comparison ───────────────────────────────────────────────── */}
      <Section variant="dark" className="bg-charcoal-900">
        <Container size="xl">
          <div className="max-w-3xl">
            <Eyebrow>Side by side</Eyebrow>
            <Heading as="h2" size="display-md" className="mt-4">
              A black box that touches your spend, or judgment you approve.
            </Heading>
            <p className="mt-5 text-md text-white/70">
              Honest cells. The Ads Driver column says what is built today, not
              what is on the roadmap.
            </p>
          </div>
          <ComparisonTable className="mt-10" />
        </Container>
      </Section>

      {/* ── Proof (claims-gated) ─────────────────────────────────────── */}
      <Section variant="dark" className="bg-ink-950">
        <Container size="lg">
          <ProofPlaceholder
            title="Account results publish as early-access accounts report."
            body="Ads Driver is in early access. We publish outcomes only from real accounts with offline-imported booked jobs or signed cases — never platform proxies, never invented percentages. Until then this block stays visibly empty."
          />
        </Container>
      </Section>

      <CTAStrip
        eyebrow="Early access"
        heading="Get your account audited before you decide anything."
        body="Apply, manager-link on read-only scope, and read the first findings. No passwords, no card, no contract."
        primary={{ label: "Apply for early access", href: "/apply" }}
        secondary={{ label: "Read the FAQ", href: "/faq" }}
      />
    </>
  );
}
