import type { Metadata } from "next";
import { openGraphFor } from "@/lib/seo";
import Link from "next/link";
import {
  Button,
  Container,
  CTAStrip,
  Eyebrow,
  Heading,
  ProofPlaceholder,
  Section,
} from "@/components/ui";
import { CaseStudyCard } from "@/components/agency";

export const metadata: Metadata = {
  title: "Case studies",
  description:
    "How HOMEGRWN runs ads, pages, tracking, and follow-up for home-services and legal businesses — published with account data, or not at all.",
  alternates: { canonical: "/case-studies" },
  openGraph: openGraphFor("agency", {
    title: "Case studies — HOMEGRWN",
    description:
      "Real accounts, real numbers — published as they're verified.",
    url: "/case-studies",
    type: "website",
  }),
};

const CASE_STUDIES = [
  {
    slug: "septic-google-ads",
    href: "/case-studies/septic-google-ads",
    title: "Septic: rebuilding Google Ads around booked jobs",
    summary:
      "How a septic company's search account was restructured so spend followed pumping, inspection, and install calls — not clicks.",
    tags: ["Septic", "Google Ads"],
    // No `thumb`: the legacy artwork carries "LOWER COST PER LEAD", which is
    // CLAIMS_TO_VERIFY in docs/content/claims.md. Restore it once VERIFIED.
  },
] as const;

export default function CaseStudiesPage() {
  return (
    <>
      <Section variant="grain" padding="lg" as="div">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow flag>Case studies</Eyebrow>
            <Heading as="h1" size="display-lg" className="mt-5">
              What we ran, and what happened.
            </Heading>
            <p className="mt-6 text-md text-white/70">
              Every study here is written from the account, not the sales
              deck. Numbers appear only once they&apos;re verified against
              platform data — until then you get the work, not the hype.
            </p>
          </div>
        </Container>
      </Section>

      <Section variant="dark">
        <Container>
          <ul className="grid gap-6 md:grid-cols-2">
            {CASE_STUDIES.map((s) => (
              <li key={s.slug} className="flex">
                <CaseStudyCard
                  href={s.href}
                  title={s.title}
                  summary={s.summary}
                  tags={[...s.tags]}
                  kind="video"
                />
              </li>
            ))}
            <li className="flex">
              <ProofPlaceholder
                className="w-full"
                title="More studies publishing as accounts go live."
                body="Each account that goes live gets a study here once its numbers are verified against platform data."
              />
            </li>
          </ul>

          <div className="mt-10">
            <Button asChild variant="secondary">
              <Link href="/book">Want to be the next one? Book a call</Link>
            </Button>
          </div>
        </Container>
      </Section>

      <CTAStrip
        heading="You handle the work. We handle the tech."
        body="Let's build a system that runs while you're out in the field."
        primary={{ label: "Book a free growth plan", href: "/book" }}
        tone="lime"
      />
    </>
  );
}
