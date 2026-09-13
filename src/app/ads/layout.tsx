import type { Metadata } from "next";
import { SiteFooter, SiteNav } from "@/components/layout";
import { SURFACE_URLS } from "@/lib/surface";
import { surfaceHref } from "@/lib/surfaces";

/**
 * ads surface — adsdriver.homegrwndigital.com / homegrwn.io.
 * Mars × Perspective direction: ink-950 ground, large numerals, layered
 * translucent planes, sharper (xl) radii, lime data-glow (docs/brand.md).
 *
 * metadataBase is overridden here so relative canonicals / og:url on Ads
 * Driver pages resolve to the Ads Driver host, not the agency's.
 */

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_ADS_URL ?? SURFACE_URLS.ads),
  title: {
    default: "Ads Driver by HOMEGRWN",
    template: "%s — Ads Driver",
  },
  description:
    "Ads Driver audits and drives Google Ads accounts for home-services and legal businesses. Findings, changes, history — recommend-first.",
  openGraph: { siteName: "Ads Driver by HOMEGRWN", type: "website" },
};

const NAV = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Apply", href: "/apply" },
];

const FOOTER = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQ", href: "/faq" },
      { label: "Apply for early access", href: "/apply" },
    ],
  },
  {
    title: "HOMEGRWN",
    links: [
      { label: "Agency site", href: surfaceHref("agency"), external: true },
      { label: "Book a call", href: surfaceHref("agency", "/book"), external: true },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export default function AdsDriverLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col bg-ink-950">
      <SiteNav
        links={NAV}
        badge="Ads Driver"
        brandLink={{ label: "by HOMEGRWN", href: surfaceHref("agency") }}
        cta={{ label: "Apply for early access", href: "/apply" }}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter
        surface="ads"
        columns={FOOTER}
        note="Ads Driver is the HOMEGRWN engine, productized. Recommend-first: a human approves every change."
      />
    </div>
  );
}
