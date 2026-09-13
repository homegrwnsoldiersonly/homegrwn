import type { Metadata } from "next";
import { openGraphFor } from "@/lib/seo";
import { Container, Eyebrow, Heading, ProofPlaceholder, Section } from "@/components/ui";
import { Icon, StrategyCallForm } from "@/components/agency";
import { submitStrategyCall } from "./actions";

export const metadata: Metadata = {
  title: "Book a free growth plan",
  description:
    "A short strategy call about your market, your lead flow, and what you spend today. You leave with a written growth plan for your trade — whether or not you hire us.",
  alternates: { canonical: "/book" },
  openGraph: openGraphFor("agency", {
    title: "Book a free growth plan — HOMEGRWN",
    description:
      "A short strategy call. A written plan for your trade. No contracts, no pitch deck.",
    url: "/book",
    type: "website",
  }),
};

const ON_THE_CALL = [
  {
    icon: "MapPin",
    title: "Your market, mapped",
    body: "Who's bidding on your jobs, what they're running, and where the gaps are in your territory.",
  },
  {
    icon: "Gauge",
    title: "Your numbers, read honestly",
    body: "What you spend, what it produces, and what's leaking between the click and the booked job.",
  },
  {
    icon: "ClipboardList",
    title: "A written plan, yours to keep",
    body: "Which channels, which offers, what to build first. You can run it yourself or have us run it.",
  },
];

/**
 * Reads `?trade=<slug>` (every niche CTA links here with it) to preselect the
 * trade. Reading searchParams makes this route dynamic, which is fine for a
 * form page; the rest of the agency surface stays static.
 */
export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ trade?: string | string[] }>;
}) {
  const { trade } = await searchParams;
  const defaultTrade = Array.isArray(trade) ? trade[0] : trade;
  return (
    <>
      <Section variant="grain" padding="lg" as="div">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <Eyebrow flag>Free growth plan</Eyebrow>
              <Heading as="h1" size="display-lg" className="mt-5">
                Book a strategy call.
              </Heading>
              <p className="mt-6 max-w-xl text-md text-white/70">
                A short call with the person who would actually run your
                account. No pitch deck, no pressure, and you leave with a plan
                either way.
              </p>

              <ol className="mt-10 space-y-6">
                {ON_THE_CALL.map((item, i) => (
                  <li key={item.title} className="flex gap-4">
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-lime-500/30 bg-lime-500/10 text-lime-500">
                      <Icon name={item.icon} size={20} />
                    </span>
                    <div>
                      <p className="numerals text-xs text-white/40">0{i + 1}</p>
                      <Heading as="h2" size="subtitle" className="mt-0.5">
                        {item.title}
                      </Heading>
                      <p className="mt-1.5 text-sm text-white/70">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <ProofPlaceholder compact className="mt-10" title="Client results publish here once verified." />
            </div>

            <div className="lg:pt-2">
              <StrategyCallForm action={submitStrategyCall} defaultTrade={defaultTrade} />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
