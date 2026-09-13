import type { Metadata } from "next";
import { SiteFooter, SiteNav } from "@/components/layout";
import { surfaceHref } from "@/lib/surfaces";

/**
 * agency surface — homegrwndigital.com. Forest direction: organic dark,
 * grain, generous whitespace, lime as growth accent (docs/brand.md).
 * Public paths rewrite here via src/proxy.ts; links stay clean ("/niches/…").
 * Cross-surface links (Ads Driver, Dashboard) go through src/lib/surfaces.ts
 * so they resolve to the real subdomain in production and to the
 * `?surface=` switch on localhost / Vercel previews.
 */

export const metadata: Metadata = {
  title: {
    default: "HOMEGRWN — Growth Partners for home services and legal",
    template: "%s — HOMEGRWN",
  },
  description:
    "HOMEGRWN runs the ads, the tracking and the tech for home-services and legal businesses. You handle the work. We handle the tech.",
};

const NAV = [
  { label: "Niches", href: "/niches" },
  { label: "Legal", href: "/legal" },
  { label: "Case studies", href: "/case-studies" },
  { label: "Free training", href: "/free-training" },
  { label: "Ads Driver", href: surfaceHref("ads"), external: true },
];

const FOOTER = [
  {
    title: "Home services",
    links: [
      { label: "Septic", href: "/niches/septic" },
      { label: "HVAC", href: "/niches/hvac" },
      { label: "Roofing", href: "/niches/roofing" },
      { label: "Plumbing", href: "/niches/plumbing" },
      { label: "Solar", href: "/niches/solar" },
      { label: "Electrical", href: "/niches/electrical" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Personal injury", href: "/legal/personal-injury" },
      { label: "Car accident", href: "/legal/car-accident" },
      { label: "Truck accident", href: "/legal/truck-accident" },
      { label: "Mass tort", href: "/legal/mass-tort" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Case studies", href: "/case-studies" },
      { label: "Free training", href: "/free-training" },
      { label: "Book a call", href: "/book" },
      { label: "Ads Driver", href: surfaceHref("ads"), external: true },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export default function AgencyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col bg-ground">
      <SiteNav links={NAV} cta={{ label: "Book a call", href: "/book" }} />
      <main className="flex-1">{children}</main>
      <SiteFooter surface="agency" columns={FOOTER} />
    </div>
  );
}
