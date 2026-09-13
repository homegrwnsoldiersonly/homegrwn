import type { Metadata } from "next";
import { Container, CTAStrip, Eyebrow, FAQ, Heading, Section } from "@/components/ui";
import { PricingModel } from "@/components/ads-driver";

export const metadata: Metadata = {
  title: "Pricing",
  alternates: { canonical: "/pricing" },
  description:
    "Ads Driver pricing model: a flat monthly fee per account, never a percent of ad spend, no contract, cancel any time. Figures are announced at early access.",
};

const PRICING_FAQ = [
  {
    q: "Why not a percent of spend?",
    a: "Because a fee tied to spend pays us more when you spend more, whether or not it earned you anything. The product optimizes to booked jobs and signed cases; the fee has to be indifferent to spend or the incentive is broken on day one.",
  },
  {
    q: "When will the number be on this page?",
    a: "When early-access accounts have run long enough for us to know what the flat fee should be. Applicants hear it first. Nothing is published as a placeholder that could be mistaken for a price.",
  },
  {
    q: "Is there a contract or a minimum term?",
    a: "No. Month to month. Cancel any time. The audit history and every change-set you approved stay yours.",
  },
  {
    q: "Does the fee include my ad spend?",
    a: "No, and it never touches it. Spend is paid to Google from your own billing. Ads Driver reads the account on manager-link; it does not hold your payment method.",
  },
];

export default function PricingPage() {
  return (
    <>
      <Section variant="grain" padding="lg" as="div" className="bg-ink-950">
        <Container size="lg">
          <Eyebrow flag>Pricing</Eyebrow>
          <Heading as="h1" size="display-lg" className="mt-5 max-w-3xl">
            Flat monthly. Never a percent of spend.
          </Heading>
          <p className="mt-6 max-w-2xl text-md text-white/70">
            The model is settled. The number is not — and it won&apos;t appear
            here until it is real. No contract, cancel any time, and your ad
            spend stays on your own billing.
          </p>
        </Container>
      </Section>

      <Section variant="dark" className="bg-ink-950">
        <Container size="xl">
          <PricingModel />
        </Container>
      </Section>

      <Section variant="dark" className="bg-charcoal-900">
        <Container size="md">
          <Eyebrow>Pricing questions</Eyebrow>
          <Heading as="h2" size="display-sm" className="mt-4">
            The short version.
          </Heading>
          <FAQ items={PRICING_FAQ} className="mt-6" />
        </Container>
      </Section>

      <CTAStrip
        eyebrow="Early access"
        heading="Hear the number before it goes public."
        body="Apply now. Early-access accounts get the fee first, in writing, before anything is charged."
        primary={{ label: "Apply for early access", href: "/apply" }}
        secondary={{ label: "How it works", href: "/how-it-works" }}
      />
    </>
  );
}
