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
import { Icon, VideoPoster } from "@/components/agency";

/**
 * Septic Google Ads case study. Claims gate: docs/content/claims.md lists
 * "lower cost per lead" as CLAIMS_TO_VERIFY — the before/after numbers were
 * never captured from the video. So this page describes the WORK and the
 * METRICS TRACKED, and renders <ProofPlaceholder/> where results would go.
 * No numbers, no percentages, no client name. The legacy video thumbnail
 * (public/brand/legacy/case-study-septic-google-ads-thumb.png) prints
 * "LOWER COST PER LEAD" in display type, so it is not rendered — on the page
 * or as the OG image — until that claim is VERIFIED.
 */

export const metadata: Metadata = {
  title: "Septic Google Ads case study",
  description:
    "How a septic company's Google Ads account was rebuilt around booked pumping, inspection, and install jobs — structure, tracking, landing pages, and follow-up.",
  alternates: { canonical: "/case-studies/septic-google-ads" },
  openGraph: openGraphFor("agency", {
    title: "Septic: rebuilding Google Ads around booked jobs — HOMEGRWN",
    description:
      "A video walk-through of restructuring a septic search account so spend follows jobs, not clicks.",
    url: "/case-studies/septic-google-ads",
    type: "article",
  }),
};

// TODO(nathan): drop the YouTube video id in here and the poster becomes the
// embed: https://www.youtube-nocookie.com/embed/<VIDEO_ID>
const YOUTUBE_EMBED_URL: string | undefined = undefined;

const SITUATION = [
  "Search spend spread across broad keywords that pulled in DIY questions, product shoppers, and out-of-area calls alongside real jobs.",
  "One generic landing page for every service, so a homeowner searching for an emergency pump-out landed on a page about installations.",
  "Conversions counted form fills and clicks-to-call, but nobody knew which of those turned into a scheduled job.",
];

const WORK = [
  {
    icon: "Megaphone",
    title: "Restructured the account by job type",
    body: "Pumping, inspections, repairs, and installs each got their own campaign, budget, and negatives — so spend could be judged per job, not per account.",
  },
  {
    icon: "LayoutTemplate",
    title: "One landing page per service",
    body: "Each ad group sends to a page that matches the search: the emergency page asks for the call; the install page asks for the site visit.",
  },
  {
    icon: "PhoneCall",
    title: "Call tracking with outcomes",
    body: "Every call recorded and tagged — booked, quote, not a fit, spam — and fed back to Google as the conversion that matters.",
  },
  {
    icon: "Bot",
    title: "Follow-up on every missed lead",
    body: "Missed calls get a text back right away; form fills get a reply and a booking link, so the office isn't the bottleneck.",
  },
];

const METRICS = [
  "Cost per booked job, by service",
  "Share of calls that were real jobs vs. junk",
  "Wasted spend cut by negatives and geo",
  "Speed to first response on missed leads",
];

export default function SepticGoogleAdsStudy() {
  return (
    <>
      <Section variant="grain" padding="lg" as="div">
        <Container>
          <nav aria-label="Breadcrumb" className="text-sm text-white/50">
            <Link href="/case-studies" className="hover:text-lime-500">
              Case studies
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span className="text-white/80">Septic · Google Ads</span>
          </nav>
          <div className="mt-6 max-w-3xl">
            <Eyebrow flag>Case study · Septic · Google Ads</Eyebrow>
            <Heading as="h1" size="display-lg" className="mt-5">
              Rebuilding a septic Google Ads account around booked jobs.
            </Heading>
            <p className="mt-6 text-md text-white/70">
              A walk-through of what changed in the account, on the landing
              pages, and in the follow-up — and which numbers we watch to know
              it&apos;s working.
            </p>
          </div>

          <VideoPoster
            className="mt-10"
            embedUrl={YOUTUBE_EMBED_URL}
            eyebrow="Case study · Septic · Google Ads"
            title="Rebuilding a septic Google Ads account around booked jobs"
          />
        </Container>
      </Section>

      <Section variant="dark">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
            <div>
              <Eyebrow flag>The situation</Eyebrow>
              <Heading as="h2" size="display-sm" className="mt-4">
                Spend was buying clicks, not jobs.
              </Heading>
            </div>
            <ul className="space-y-4">
              {SITUATION.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-base text-white/80"
                >
                  <Icon name="X" size={16} className="mt-1 shrink-0 text-white/40" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section variant="grain">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow flag>What we did</Eyebrow>
            <Heading as="h2" className="mt-4">
              Four changes, in the order they happened.
            </Heading>
          </div>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2">
            {WORK.map((w, i) => (
              <li key={w.title}>
                <Card padding="md" className="h-full">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-10 items-center justify-center rounded-xl border border-lime-500/30 bg-lime-500/10 text-lime-500">
                      <Icon name={w.icon} size={20} />
                    </span>
                    <span className="numerals text-xs text-white/40">0{i + 1}</span>
                  </div>
                  <Heading as="h3" size="subtitle" className="mt-5">
                    {w.title}
                  </Heading>
                  <p className="mt-2 text-sm text-white/70">{w.body}</p>
                </Card>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section variant="light">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
            <div>
              <Eyebrow tone="dark" flag>
                What we measure
              </Eyebrow>
              <Heading as="h2" size="display-sm" className="mt-4">
                The numbers that decide whether it stays on.
              </Heading>
              <p className="mt-4 text-md text-charcoal-700">
                These are the figures the account is judged on every week. The
                verified before-and-after publishes below once it clears the
                claims register.
              </p>
            </div>
            <div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {METRICS.map((m) => (
                  <li
                    key={m}
                    className="flex items-start gap-3 rounded-2xl border border-grey-200 bg-white p-4 text-sm font-medium text-charcoal-900"
                  >
                    <Icon name="BarChart3" size={16} className="mt-0.5 shrink-0 text-charcoal-700" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
              <ProofPlaceholder
                tone="light"
                className="mt-6"
                title="Results publish once verified."
                body="The before/after from this account is pending verification against the platform data (docs/content/claims.md). It ships here with the source attached, or it doesn't ship."
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="dark" padding="sm">
        <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/60">
            Run a septic company? The same build is scoped to your territory on
            the strategy call.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="secondary">
              <Link href="/niches/septic">Septic playbook</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/case-studies">All case studies</Link>
            </Button>
          </div>
        </Container>
      </Section>

      <CTAStrip
        heading="You handle the tanks. We handle the tech."
        body="Let's build a system that runs while you're out in the field."
        primary={{ label: "Book a free growth plan", href: "/book" }}
        tone="lime"
      />
    </>
  );
}
