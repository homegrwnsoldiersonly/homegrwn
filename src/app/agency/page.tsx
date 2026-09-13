import type { Metadata } from "next";
import Link from "next/link";
import {
  Button,
  CheckerFlag,
  Container,
  CTAStrip,
  Eyebrow,
  FAQ,
  Heading,
  ProofPlaceholder,
  Section,
} from "@/components/ui";
import {
  BenefitsGrid,
  ComparisonTable,
  FAQ_ITEMS,
  HowItWorks,
  Icon,
  NicheSelector,
  ToolsSection,
} from "@/components/agency";
import { JsonLd } from "@/components/seo";
import { agencyJsonLd, openGraphFor } from "@/lib/seo";

/**
 * HOMEGRWN agency home — Forest direction (docs/brand.md). Preserves and
 * beats the legacy Framer page (docs/content/legacy-homegrwnagency-copy.md):
 * hero → niche selector → benefits → how it works → tools → comparison →
 * proof (claims-gated placeholder) → FAQ → closing CTA. Nav + footer come
 * from src/app/agency/layout.tsx.
 */

export const metadata: Metadata = {
  title: { absolute: "HOMEGRWN — Growth Partners for home services and legal" },
  description:
    "Ads, landing pages, tracking, and automated follow-up — built and run for septic, HVAC, roofing, plumbing, solar, electrical, and personal-injury firms. You handle the work. We handle the tech. No contracts.",
  alternates: { canonical: "/" },
  // Through openGraphFor: Next merges openGraph shallowly per segment, so a
  // bare object here would drop the layout-level /agency/opengraph-image.
  openGraph: openGraphFor("agency", {
    title: "HOMEGRWN — You handle the work. We handle the tech.",
    description:
      "Growth engineers for home services and legal. Ads, pages, tracking, and automated follow-up run as one system. No contracts, no commitments.",
    url: "/",
    type: "website",
  }),
};

const HERO_POINTS = [
  "Missed-call text-back and auto-replies, so leads get an answer in minutes",
  "Google, Meta, and Business Profile ads run as one system",
  "Landing pages and tracking built for booked jobs, not clicks",
];

export default function AgencyHome() {
  return (
    <>
      <JsonLd data={agencyJsonLd()} />

      {/* Hero */}
      <Section variant="grain" padding="lg" as="div" className="overflow-hidden">
        <Container className="relative">
          <div className="max-w-4xl">
            <Eyebrow flag>Growth Partners · Home services &amp; legal</Eyebrow>
            <Heading as="h1" size="display-xl" className="mt-5">
              You handle the work.
              <br />
              <span className="text-lime-500">We handle the tech.</span>
            </Heading>
            <p className="mt-6 max-w-2xl text-md text-white/70">
              Ads, landing pages, tracking, and automated follow-up — built and run
              for trades and law firms by growth engineers, not account
              managers. No contracts. No commitments. Earn your trust through
              results.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/book">Book a free growth plan</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="#niches">Pick your trade</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-white/50">
              No long-term commitment. Cancel anytime.
            </p>
          </div>

          <ul className="mt-12 grid gap-3 sm:grid-cols-3">
            {HERO_POINTS.map((p) => (
              <li
                key={p}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/80"
              >
                <Icon name="Check" size={16} className="mt-0.5 shrink-0 text-lime-500" />
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <CheckerFlag size={18} cols={14} rows={3} className="mt-14" />
        </Container>
      </Section>

      {/* Niche selector — NEW vs legacy */}
      <NicheSelector id="niches" />

      {/* Benefits grid */}
      <BenefitsGrid />

      {/* How it works — 3 steps, no contracts */}
      <HowItWorks />

      {/* Tools */}
      <ToolsSection />

      {/* Growth engineers vs regular agency */}
      <ComparisonTable />

      {/* Proof — claims gate: placeholder only until docs/content/claims.md verifies */}
      <Section variant="dark" id="proof">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start lg:gap-14">
            <div>
              <Eyebrow flag>Results</Eyebrow>
              <Heading as="h2" className="mt-4">
                Numbers you can check, or nothing.
              </Heading>
              <p className="mt-4 text-md text-white/70">
                Every stat on this site will link to the account data behind it.
                Until the first HOMEGRWN accounts report, this space stays
                honest — and empty.
              </p>
              <div className="mt-6">
                <Button asChild variant="secondary">
                  <Link href="/case-studies">See the case studies</Link>
                </Button>
              </div>
            </div>
            <ProofPlaceholder />
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section variant="light" id="faq">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
            <div>
              <Eyebrow tone="dark" flag>
                Questions
              </Eyebrow>
              <Heading as="h2" className="mt-4">
                Straight answers.
              </Heading>
              <p className="mt-4 text-md text-charcoal-700">
                Anything else — ask on the call. You&apos;ll get the same
                answer either way.
              </p>
            </div>
            <FAQ items={FAQ_ITEMS} tone="light" />
          </div>
        </Container>
      </Section>

      {/* Closing CTA */}
      <CTAStrip
        eyebrow="Ready when you are"
        heading="You handle the work. We handle the tech."
        body="Let's build a system that runs while you're out in the field."
        primary={{ label: "Book a free growth plan", href: "/book" }}
        secondary={{ label: "See the free training", href: "/free-training" }}
        tone="lime"
      />
    </>
  );
}
