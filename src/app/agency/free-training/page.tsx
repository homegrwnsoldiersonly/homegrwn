/**
 * /free-training — the agency's lead magnet: the playbook HOMEGRWN runs,
 * written down as six modules. Honest preview state: no module is recorded
 * yet, so nothing here pretends to be downloadable; the primary CTA is the
 * strategy call (/book), where the walkthrough happens today. Descended from
 * the orange homegrwn-eta.vercel.app build, repositioned to match the rest of
 * the surface (the agency runs this system for a fee; the DIY option stays
 * honest — "run it yourself or have us run it" — without the anti-agency line).
 *
 * Claims gate (docs/content/claims.md): no user counts, ratings, or outcome
 * guarantees. Module copy describes mechanisms, not results.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { openGraphFor } from "@/lib/seo";
import {
  Button,
  Card,
  Container,
  CTAStrip,
  Eyebrow,
  Heading,
  ProofPlaceholder,
  Section,
} from "@/components/ui";
import { Icon, type IconName } from "@/components/agency";

export const metadata: Metadata = {
  title: "Free training — the playbook we run, written down",
  alternates: { canonical: "/free-training" },
  description:
    "The HOMEGRWN playbook for home-services and legal businesses, module by module: market, site, local search, social, reviews, follow-up. Run it yourself or have us run it.",
  openGraph: openGraphFor("agency", {
    title: "HOMEGRWN — The playbook we run, written down.",
    description:
      "Free training for home-services and legal businesses. Run it yourself or have us run it.",
    url: "/free-training",
    type: "website",
  }),
};

interface TrainingModule {
  letter: string;
  icon: IconName;
  title: string;
  description: string;
}

const MODULES: TrainingModule[] = [
  {
    letter: "A",
    icon: "Target",
    title: "Know your market",
    description:
      "Work out who your best customers are and where they're already searching for you.",
  },
  {
    letter: "B",
    icon: "LayoutTemplate",
    title: "Build your foundation",
    description:
      "Set up a site that turns visitors into booked jobs: one page per service, one clear way to call.",
  },
  {
    letter: "C",
    icon: "MapPin",
    title: "Own local search",
    description:
      "Rank your Business Profile for the searches that book jobs.",
  },
  {
    letter: "D",
    icon: "Megaphone",
    title: "Social that sells",
    description:
      "Turn the jobs you already do into posts that send calls. No dancing required.",
  },
  {
    letter: "E",
    icon: "Star",
    title: "Reviews and reputation",
    description: "Ask for the review after every job, automatically.",
  },
  {
    letter: "F",
    icon: "Repeat",
    title: "Follow-up systems",
    description:
      "Text back every missed call so the lead gets an answer before the next truck does.",
  },
];

const PREVIEW_NOTE = "Modules publish here as they're recorded. None are live yet.";

export default function FreeTrainingPage() {
  return (
    <>
      {/* Hero — left-aligned like every other agency page */}
      <Section variant="grain" padding="lg" as="div">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow flag>Free training · Home services &amp; legal</Eyebrow>
            <Heading as="h1" size="display-xl" className="mt-5">
              The playbook we run,
              <br />
              <span className="text-lime-500">written down.</span>
            </Heading>
            <p className="mt-6 max-w-2xl text-md text-white/70">
              Six modules covering how we build a lead system for septic, HVAC,
              roofing, plumbing, solar, electrical, and personal-injury firms
              &mdash; market, site, local search, social, reviews, follow-up.
              Run it yourself, or have us run it. Either way you see the same
              playbook.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/book">Get the training on the call</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="#training">See the six modules</Link>
              </Button>
            </div>
            <ProofPlaceholder
              compact
              label="Preview"
              title={PREVIEW_NOTE}
              className="mt-6"
            />
          </div>
        </Container>
      </Section>

      {/* Modules — honest preview, not a live download */}
      <Section variant="dark" id="training" padding="lg">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow flag>Six modules</Eyebrow>
            <Heading as="h2" size="display-md" className="mt-4">
              Everything in the system, in the order we build it.
            </Heading>
            <p className="mt-4 text-md text-white/70">
              Each module is one piece of the machine. Skip none of them; the
              order matters.
            </p>
          </div>
          <ProofPlaceholder
            compact
            label="Preview"
            title={PREVIEW_NOTE}
            className="mt-6"
          />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((mod) => (
              <li key={mod.letter} className="flex">
                <Card padding="md" className="w-full">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl border border-lime-500/30 bg-lime-500/10 text-lime-500">
                    <Icon name={mod.icon} size={22} />
                  </span>
                  <div className="mt-5">
                    <Eyebrow tone="muted" as="span">
                      Module {mod.letter}
                    </Eyebrow>
                  </div>
                  <Heading as="h3" size="subtitle" className="mt-2">
                    {mod.title}
                  </Heading>
                  <p className="mt-2 text-sm text-white/70">{mod.description}</p>
                </Card>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Button asChild variant="secondary">
              <Link href="/book">Walk through it on a call</Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Closing CTA — claims-safe line shared with the rest of the surface */}
      <CTAStrip
        heading="You handle the work. We handle the tech."
        body="No contracts. No commitments. Earn your trust through results."
        primary={{ label: "Book a free growth plan", href: "/book" }}
        secondary={{ label: "See the six modules", href: "#training" }}
        tone="lime"
      />
    </>
  );
}
