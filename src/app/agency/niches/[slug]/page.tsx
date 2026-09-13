import type { Metadata } from "next";
import { openGraphFor } from "@/lib/seo";
import { notFound } from "next/navigation";
import { getNiche, listNiches, relatedNiches } from "@/content/niches";
import {
  Container,
  CTAStrip,
  Eyebrow,
  FAQ,
  Heading,
  ProofPlaceholder,
  Section,
} from "@/components/ui";
import {
  NicheHero,
  NicheOffer,
  NichePains,
  NicheRelated,
  NicheSteps,
} from "@/components/niche";

/**
 * /niches/[slug] — one template, data-driven from src/content/niches.
 * Public URL is /niches/septic; the proxy rewrites it here (see
 * docs/site-architecture.md). Static: every slug is prerendered.
 *
 * Claims gate: the only proof block is <ProofPlaceholder/> until
 * docs/content/claims.md marks claims VERIFIED.
 */

type Params = { slug: string };
type Props = { params: Promise<Params> };

export function generateStaticParams(): Params[] {
  return listNiches().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const niche = getNiche(slug);
  if (!niche) return {};
  return {
    title: niche.seo.title,
    description: niche.seo.description,
    alternates: { canonical: `/niches/${niche.slug}` },
    openGraph: openGraphFor("agency", {
      title: niche.seo.title,
      description: niche.seo.description,
      url: `/niches/${niche.slug}`,
    }),
  };
}

export default async function NichePage({ params }: Props) {
  const { slug } = await params;
  const niche = getNiche(slug);
  if (!niche) notFound();

  return (
    <>
      <NicheHero niche={niche} />
      <NichePains tradeName={niche.name} pains={niche.pains} />
      <NicheOffer tradeName={niche.name} offer={niche.offer} />
      <NicheSteps steps={niche.howItWorks} />

      <Section variant="grain" id="proof">
        <Container>
          <ProofPlaceholder
            title={`${niche.name} case studies publish as accounts go live.`}
          />
        </Container>
      </Section>

      <Section variant="dark" id="faq">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>FAQ</Eyebrow>
            <Heading as="h2" id="faq-heading" className="mt-4">
              {niche.name} owners ask us this.
            </Heading>
            <FAQ items={niche.faq} className="mt-8" />
          </div>
        </Container>
      </Section>

      <NicheRelated niches={relatedNiches(niche)} />

      <CTAStrip
        eyebrow={niche.eyebrow}
        heading={niche.youHandleLine}
        body="No contracts. No commitments. A strategy call is a look at your account and your territory, not a pitch."
        primary={niche.cta}
        secondary={{ label: "See the free training", href: "/free-training" }}
      />
    </>
  );
}
