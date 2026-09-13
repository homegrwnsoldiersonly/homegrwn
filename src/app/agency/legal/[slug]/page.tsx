import type { Metadata } from "next";
import { openGraphFor } from "@/lib/seo";
import { notFound } from "next/navigation";
import { CTAStrip } from "@/components/ui";
import {
  LegalFaq,
  LegalHero,
  LegalHowItWorks,
  LegalOffer,
  LegalPains,
  LegalProof,
  LegalRelated,
} from "@/components/legal";
import {
  LEGAL_PARENT_SLUG,
  LEGAL_SLUGS,
  getLegalContent,
  getLegalParent,
} from "@/content/legal";

/**
 * /legal/[slug] — personal-injury parent + car-accident / truck-accident /
 * mass-tort sub-niches, one template. Public URL is /legal/<slug>; the proxy
 * rewrites it here (docs/site-architecture.md). Fully static: every slug is
 * enumerated and unknown slugs 404 inside the agency chrome.
 */

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: string }> {
  return LEGAL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = getLegalContent(slug);
  if (!content) return {};
  const path = `/legal/${content.slug}`;
  return {
    title: content.seo.title,
    description: content.seo.description,
    alternates: { canonical: path },
    openGraph: openGraphFor("agency", {
      siteName: "HOMEGRWN",
      type: "website",
      url: path,
      title: `${content.seo.title} — HOMEGRWN`,
      description: content.seo.description,
    }),
  };
}

export default async function LegalNichePage({ params }: Props) {
  const { slug } = await params;
  const content = getLegalContent(slug);
  if (!content) notFound();

  const isParent = content.slug === LEGAL_PARENT_SLUG;
  const parent = isParent ? null : getLegalParent();

  // Parent lists its sub-niches; sub-niches list parent + siblings.
  const relatedSlugs = isParent
    ? (content.subNiches ?? content.related)
    : content.related;
  const related = relatedSlugs
    .map((s) => getLegalContent(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <>
      <LegalHero content={content} parent={parent} />
      <LegalPains name={content.name} pains={content.pains} />
      <LegalOffer
        name={content.name}
        youHandleLine={content.youHandleLine}
        offer={content.offer}
      />
      <LegalHowItWorks steps={content.howItWorks} />
      <LegalProof name={content.name} />
      <LegalFaq name={content.name} items={content.faq} />
      {related.length > 0 && (
        <LegalRelated
          eyebrow={isParent ? "Sub-niches we run" : "Related practices"}
          heading={
            isParent
              ? "Same signed-case discipline, tuned to each practice's economics."
              : "Every practice under the personal-injury program."
          }
          items={related}
          currentSlug={content.slug}
        />
      )}
      <CTAStrip
        eyebrow="Next step"
        heading="Bring your intake numbers. We bring the plan."
        body={`${content.youHandleLine} No contracts. No commitments. We earn your trust through results you can audit in your own account.`}
        primary={content.cta}
        secondary={{ label: "See the free training", href: "/free-training" }}
      />
    </>
  );
}
