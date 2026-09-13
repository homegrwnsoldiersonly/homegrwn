import type { Metadata } from "next";
import { listNiches } from "@/content/niches";
import {
  CheckerFlag,
  Container,
  CTAStrip,
  Eyebrow,
  Heading,
  ProofPlaceholder,
  Section,
} from "@/components/ui";
import { NicheCard } from "@/components/niche";

/**
 * /niches — index of every home-services trade page. Static.
 */

export const metadata: Metadata = {
  title: "Home Services Marketing by Trade",
  description:
    "Google Ads and Local Services Ads run trade by trade: septic, HVAC, roofing, plumbing, solar, and electrical. Each playbook is built the way that trade actually works.",
  alternates: { canonical: "/niches" },
};

export default function NichesIndexPage() {
  const niches = listNiches();
  return (
    <>
      <Section variant="grain" padding="lg" as="div">
        <Container>
          <Eyebrow flag>Home services</Eyebrow>
          <Heading as="h1" size="display-lg" className="mt-5 max-w-4xl">
            One playbook per trade.
            <br />
            <span className="text-lime-500">Not one account for all of them.</span>
          </Heading>
          <p className="mt-6 max-w-2xl text-md text-white/70">
            A septic emergency, a summer AC surge, and a hail storm are
            different businesses with different phones, different seasons, and
            different service areas. Pick your trade and see how we run it.
          </p>
          <CheckerFlag size={18} cols={14} rows={3} className="mt-14" />
        </Container>
      </Section>

      <Section variant="dark" id="trades">
        <Container>
          <Eyebrow>Trades</Eyebrow>
          <Heading as="h2" id="trades-heading" className="mt-4">
            Pick your trade.
          </Heading>
          <ul className="mt-10 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {niches.map((n) => (
              <NicheCard key={n.slug} niche={n} variant="full" headingLevel="h3" />
            ))}
          </ul>
        </Container>
      </Section>

      <Section variant="dark" padding="sm">
        <Container>
          <ProofPlaceholder />
        </Container>
      </Section>

      <CTAStrip
        eyebrow="Growth Partners"
        heading="You handle the work. We handle the tech."
        body="No contracts. No commitments. Earn your trust through results."
        primary={{ label: "Book a strategy call", href: "/book" }}
        secondary={{ label: "See the free training", href: "/free-training" }}
      />
    </>
  );
}
