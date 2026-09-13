import type { Metadata } from "next";
import { openGraphFor } from "@/lib/seo";
import Link from "next/link";
import {
  Button,
  CheckerFlag,
  Container,
  CTAStrip,
  Eyebrow,
  Heading,
  Section,
} from "@/components/ui";
import {
  AttorneyAdvertisingNote,
  LegalIcon,
  LegalRelated,
} from "@/components/legal";
import { getLegalParent, listLegalContent } from "@/content/legal";

/**
 * /legal — index for the legal vertical. Public URL /legal; the proxy
 * rewrites it here. Static.
 */

export const metadata: Metadata = {
  title: "Google Ads for Law Firms — tracked to signed cases",
  description:
    "HOMEGRWN runs Google Ads for personal-injury, car-accident, truck-accident, and mass-tort practices, optimized to signed cases instead of form-fills. You handle the cases. We handle the tech.",
  alternates: { canonical: "/legal" },
  openGraph: openGraphFor("agency", {
    siteName: "HOMEGRWN",
    type: "website",
    url: "/legal",
    title: "Google Ads for Law Firms — HOMEGRWN",
    description:
      "Signed-case tracking, jurisdiction-locked targeting, intake-aware scheduling, and PMax on a leash — run for PI firms by operators.",
  }),
};

const PRINCIPLES = [
  {
    icon: "Database",
    title: "Signed cases are the conversion.",
    body: "A form-fill is a lead, not revenue. We wire retainers back into the ad account so bidding chases cases, not clicks.",
  },
  {
    icon: "MapPin",
    title: "Only where you can serve.",
    body: "Jurisdiction-locked targeting for local firms. National reach only where a documented co-counsel model makes the case signable.",
  },
  {
    icon: "PhoneCall",
    title: "No spend into empty intake.",
    body: "Cases sign with whoever answers first. Ads run when a human can pick up within minutes — and never scale into hours nobody covers.",
  },
  {
    icon: "Ban",
    title: "Junk excluded before launch.",
    body: "Wrong practice areas, job-seekers, DIY and free-lawyer intent, and other firms' claimants are negatives from day one.",
  },
] as const;

export default function LegalIndexPage() {
  const parent = getLegalParent();
  const all = listLegalContent();

  return (
    <>
      <Section variant="grain" padding="lg" as="div">
        <Container>
          <Eyebrow flag>Legal vertical</Eyebrow>
          <Heading as="h1" size="display-lg" className="mt-5 max-w-4xl text-balance">
            Google Ads for law firms, judged on signed cases.
          </Heading>
          <p className="mt-6 max-w-2xl text-md text-white/70">
            PI clicks are expensive, and the ad platform cannot tell a signed
            retainer from a curious browser. We run the account on the outcome
            your firm actually bills, with the discipline each practice&apos;s
            economics demand.
          </p>
          <p className="mt-6 text-lg font-semibold text-white">
            {parent.youHandleLine}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={parent.cta.href}>{parent.cta.label}</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href={`/legal/${parent.slug}`}>Start with personal injury</Link>
            </Button>
          </div>
          <CheckerFlag size={18} cols={14} rows={3} className="mt-14" />
        </Container>
      </Section>

      <Section variant="dark" id="principles">
        <Container>
          <Eyebrow tone="muted">How we run legal accounts</Eyebrow>
          <Heading as="h2" size="display-md" className="mt-4 max-w-3xl text-balance">
            Four rules that don&apos;t change from practice to practice.
          </Heading>
          <ul className="mt-10 grid gap-x-10 border-t border-white/10 sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <li key={p.title} className="flex gap-4 border-b border-white/10 py-6">
                <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/15 text-lime-500">
                  <LegalIcon name={p.icon} size={18} />
                </span>
                <div>
                  <Heading as="h3" size="subtitle">
                    {p.title}
                  </Heading>
                  <p className="mt-2 text-base text-white/70">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <AttorneyAdvertisingNote className="mt-8 max-w-3xl" />
        </Container>
      </Section>

      <LegalRelated
        eyebrow="Practices we run"
        heading="One program. Four sets of economics."
        items={all}
      />

      <CTAStrip
        eyebrow="Next step"
        heading="Bring your intake numbers. We bring the plan."
        body="You handle the cases. We handle the tech. No contracts. No commitments. We earn your trust through results you can audit in your own account."
        primary={parent.cta}
        secondary={{ label: "See the free training", href: "/free-training" }}
      />
    </>
  );
}
