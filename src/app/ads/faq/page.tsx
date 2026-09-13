import type { Metadata } from "next";
import { Container, CTAStrip, Eyebrow, FAQ, Heading, Section } from "@/components/ui";
import { CURRENT_RUNG } from "@/components/ads-driver";

export const metadata: Metadata = {
  title: "FAQ",
  alternates: { canonical: "/faq" },
  description:
    "Do I still get a human? Can it spend my money without me? What accounts can it manage? Which niches? Straight answers on how Ads Driver by HOMEGRWN actually works today.",
};

const ITEMS = [
  {
    q: "Do I still get a human?",
    a: "Yes, and not as a fallback. A human at HOMEGRWN approves every change-set today, calibrates your pack's benchmarks from real outcomes, and owns the result. The engine ranks and drafts; a person decides. That posture is written into the control architecture, not just the marketing.",
  },
  {
    q: "Can it spend my money without me?",
    a: `No. Today there is no API write path at all (rung ${CURRENT_RUNG} of the ladder): Ads Driver reads on a read-only scope and hands you change-sets to apply yourself. Rung 3 adds an approval queue where one click per change-set triggers a deterministic executor. Rung 4 — pre-approved change classes running on their own — only exists behind written policy, per-change spend caps, and a kill switch, and only if you turn it on.`,
  },
  {
    q: "What accounts can it manage, and how do you get access?",
    a: "Google Ads accounts, through a manager-account (MCC) link that you accept from inside your own Google Ads. We never ask for a password and never hold your billing. The first link is read-only scope; anything beyond that is a separate, explicit step you take later.",
  },
  {
    q: "Which niches?",
    a: "Home services — plumbing, electrical, septic, solar and the other call-driven trades — with dedicated sub-packs for HVAC and roofing. Personal-injury law, with dedicated sub-packs for car accident, truck accident, and mass tort. If your business isn't one of these, apply anyway and say so; we will tell you honestly whether a pack is coming.",
  },
  {
    q: "What does it actually optimize to?",
    a: "The outcome the platform can't see. For trades that is a booked job, dispatched and completed, weighted by job value. For PI it is a signed case — retainer executed, in-jurisdiction, correct practice area. Those outcomes come in through an offline conversion import with a dry-run preview and a human apply step, and form fills get demoted to observe-only.",
  },
  {
    q: "What does it actually change in my account today?",
    a: "Nothing by itself. It produces findings — each with evidence, a recommendation, and the niche rationale — and concrete change-sets. Today that is a negative-keyword CSV split into two tiers: safe exact-match terms, and phrases that could over-block and need your judgment. You apply it in Google Ads Editor. Broader change classes ship as later rungs land.",
  },
  {
    q: "Is this 'AI'?",
    a: "Mostly not, on purpose. The spine is a deterministic rule engine: same account, same report, every time, with a test suite and a clean-account canary. LLM agents are rung 5 on the ladder — planned, not shipped — and when they arrive they propose inside guardrails as a proposer / verifier / auditor trio. Their output enters as data through the same gates as everything else. No agent holds the spend pen.",
  },
  {
    q: "How is pricing structured?",
    a: "A flat monthly fee per account. Never a percent of spend, because that would pay us more for making you spend more. No contract; cancel any time. The figure is announced at early access — applicants hear it first, and nothing is published as a placeholder that could be read as a price.",
  },
];

export default function FaqPage() {
  return (
    <>
      <Section variant="grain" padding="lg" as="div" className="bg-ink-950">
        <Container size="lg">
          <Eyebrow flag>FAQ</Eyebrow>
          <Heading as="h1" size="display-lg" className="mt-5 max-w-3xl">
            Straight answers.
          </Heading>
          <p className="mt-6 max-w-2xl text-md text-white/70">
            What is built, what is planned, and who holds the pen. If an answer
            here ever disagrees with the ladder on the home page, the ladder
            wins and the answer is wrong.
          </p>
        </Container>
      </Section>

      <Section variant="dark" className="bg-ink-950">
        <Container size="md">
          <FAQ items={ITEMS} />
        </Container>
      </Section>

      <CTAStrip
        eyebrow="Still a question?"
        heading="Ask it on the application."
        body="There is a free-text field for exactly that. A human reads every one."
        primary={{ label: "Apply for early access", href: "/apply" }}
        secondary={{ label: "How it works", href: "/how-it-works" }}
      />
    </>
  );
}
