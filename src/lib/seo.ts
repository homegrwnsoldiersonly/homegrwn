/**
 * SEO — the pure, testable half of sitemap.ts, robots.ts and the JSON-LD.
 *
 * Public route lists are derived from the content registries so a new niche
 * or legal sub-niche shows up in the sitemap without anyone remembering to
 * add it. The dashboard (`app`) is noindex and contributes nothing.
 */

import type { Metadata, MetadataRoute } from "next";
import { LEGAL_SLUGS } from "@/content/legal";
import { NICHE_SLUGS } from "@/content/niches";
import { brand } from "@/lib/brand/tokens";
import { SURFACE_URLS, type Surface } from "@/lib/surface";

/** No registry exists for case studies yet — keep in step with src/app/agency/case-studies/. */
export const CASE_STUDY_SLUGS = ["septic-google-ads"] as const;

/** Surfaces that may be crawled. */
export const PUBLIC_SURFACES: readonly Surface[] = ["agency", "ads"];

export interface PublicRoute {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}

export function publicRoutes(surface: Surface): PublicRoute[] {
  switch (surface) {
    case "agency":
      return [
        { path: "/", changeFrequency: "weekly", priority: 1 },
        { path: "/niches", changeFrequency: "monthly", priority: 0.8 },
        ...NICHE_SLUGS.map((slug) => ({
          path: `/niches/${slug}`,
          changeFrequency: "monthly" as const,
          priority: 0.8,
        })),
        { path: "/legal", changeFrequency: "monthly", priority: 0.8 },
        ...LEGAL_SLUGS.map((slug) => ({
          path: `/legal/${slug}`,
          changeFrequency: "monthly" as const,
          priority: 0.8,
        })),
        { path: "/case-studies", changeFrequency: "monthly", priority: 0.7 },
        ...CASE_STUDY_SLUGS.map((slug) => ({
          path: `/case-studies/${slug}`,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        })),
        { path: "/free-training", changeFrequency: "monthly", priority: 0.6 },
        { path: "/book", changeFrequency: "yearly", priority: 0.9 },
        { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
      ];
    case "ads":
      return [
        { path: "/", changeFrequency: "weekly", priority: 1 },
        { path: "/how-it-works", changeFrequency: "monthly", priority: 0.8 },
        { path: "/pricing", changeFrequency: "monthly", priority: 0.8 },
        { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
        { path: "/apply", changeFrequency: "yearly", priority: 0.9 },
        { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
      ];
    case "app":
      return [];
  }
}

export function absoluteUrl(surface: Surface, path: string): string {
  const base = SURFACE_URLS[surface];
  return path === "/" ? base : `${base}${path}`;
}

export function sitemapEntries(
  surface: Surface,
  lastModified: Date,
): MetadataRoute.Sitemap {
  return publicRoutes(surface).map((r) => ({
    url: absoluteUrl(surface, r.path),
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}

/**
 * robots.txt per host. The dashboard host is fully disallowed; public hosts
 * allow everything except the internal folder prefixes, API, and the archived
 * old-site snapshot under /brand/legacy/. A neutral host (localhost,
 * *.vercel.app) gets the public rules and every public sitemap, so previews
 * are inspectable.
 */
export function robotsFor(surface: Surface | null): MetadataRoute.Robots {
  if (surface === "app") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  const sitemaps = (surface ? [surface] : PUBLIC_SURFACES).map(
    (s) => `${SURFACE_URLS[s]}/sitemap.xml`,
  );
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/agency/", "/ads/", "/app/", "/brand/legacy/"],
    },
    sitemap: sitemaps,
  };
}

/* ── Open Graph ──────────────────────────────────────────────────────────── */

/** Alt text for the generated OG image per surface (src/app/<surface>/opengraph-image.tsx). */
export const OG_ALT: Record<"agency" | "ads", string> = {
  agency: "HOMEGRWN — You handle the work. We handle the tech.",
  ads: "Ads Driver by HOMEGRWN — Judgment you can read. Execution you approve.",
};

/**
 * Per-page `openGraph` that keeps the surface image.
 *
 * Next merges metadata SHALLOWLY per segment: a page that defines its own
 * `openGraph` object replaces the layout's, including the image the
 * file-based `opengraph-image.tsx` injected there. Any page that sets
 * `openGraph` must build it through this helper, or it ships without an image.
 * The image URL is the internal segment path — that is exactly what Next
 * emits for file-based images, and src/proxy.ts serves it directly.
 */
type OpenGraph = NonNullable<Metadata["openGraph"]>;
/** `Omit` on a union collapses it to shared keys (losing `type`); distribute instead. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export function openGraphFor(
  surface: "agency" | "ads",
  overrides: DistributiveOmit<OpenGraph, "images"> = {},
): OpenGraph {
  return {
    siteName: surface === "ads" ? "Ads Driver by HOMEGRWN" : brand.name,
    type: "website",
    images: [
      {
        url: `/${surface}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: OG_ALT[surface],
      },
    ],
    ...overrides,
  };
}

/* ── JSON-LD ─────────────────────────────────────────────────────────────── */

const ORG_ID = `${SURFACE_URLS.agency}/#organization`;

/**
 * Organization + Service graph for the agency home. Claims gate: no ratings,
 * review counts, founding dates, or client names — only what is on the page.
 */
export function agencyJsonLd() {
  const trades = ["Septic", "HVAC", "Roofing", "Plumbing", "Solar", "Electrical"];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: brand.name,
        alternateName: "HOMEGRWN Growth Partners",
        slogan: brand.tagline,
        url: SURFACE_URLS.agency,
        logo: `${SURFACE_URLS.agency}${brand.lockupPath}`,
        email: "connect@homegrwndigital.com",
        sameAs: [SURFACE_URLS.ads],
      },
      {
        "@type": "Service",
        "@id": `${SURFACE_URLS.agency}/#service`,
        name: "Growth engineering for home services and legal",
        description:
          "Ads, landing pages, tracking, and AI follow-up built and run as one system for trades and personal-injury firms. No contracts.",
        serviceType: "Digital advertising management",
        provider: { "@id": ORG_ID },
        areaServed: "US",
        audience: {
          "@type": "Audience",
          audienceType: [...trades, "Personal injury law firms"],
        },
        url: SURFACE_URLS.agency,
        potentialAction: {
          "@type": "ReserveAction",
          name: "Book a free growth plan",
          target: `${SURFACE_URLS.agency}/book`,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SURFACE_URLS.agency}/#website`,
        url: SURFACE_URLS.agency,
        name: brand.name,
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

/** Serialise for a <script type="application/ld+json"> body (XSS-safe). */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
