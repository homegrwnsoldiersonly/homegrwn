import type { LegalContent } from "@/content/types";

/**
 * Personal injury — the legal parent niche. Marketing voice for a managing
 * partner / intake director; derived from the engine's judgment in
 * src/lib/knowledge/packs/legal-personal-injury.ts (signed-case economics,
 * intake hours, jurisdiction, budget floor, PMax caution, junk negatives).
 *
 * Claims gate (docs/content/claims.md): no numbers, percentages, case
 * values, settlement figures, or outcome promises in this copy.
 */
export const personalInjury: LegalContent = {
  slug: "personal-injury",
  name: "Personal injury",
  vertical: "legal",
  eyebrow: "Google Ads for personal-injury firms",
  headline: "Judged on signed cases. Not form-fills.",
  subhead:
    "PI clicks are expensive, and the ad platform cannot tell a signed retainer from a tire-kicker. We wire the account to the outcome your firm actually bills — and run every decision off it.",
  youHandleLine: "You handle the cases. We handle the tech.",
  pains: [
    {
      title: "Lead count climbs. Signed cases don't.",
      body: "Google optimizes to what it can see: a form or a call. It cannot see whether the caller was in your jurisdiction, in your practice area, or already represented. Left alone, it buys volume and calls it success.",
    },
    {
      title: "A wrong-practice-area click still costs PI money.",
      body: "Broad match and Performance Max will happily serve a car-accident ad to someone searching for a divorce attorney, a public defender, or a law-school job. At PI click prices, every one of those is a real invoice.",
    },
    {
      title: "Paid clicks landing when nobody can answer.",
      body: "Personal-injury cases sign with whoever answers first. Ads running while intake is unstaffed hand your most expensive clicks to the firm that picked up.",
    },
    {
      title: "Targeting the whole state from one office.",
      body: "Out-of-jurisdiction leads get referred out at best. Google still counts the form-fill as a win, and keeps buying more of them.",
    },
    {
      title: "Budget spread too thin to ever clear the auction.",
      body: "Competitive metros have a floor. Spend under it and impressions scatter across too many keywords and geos to accumulate signed cases — then someone concludes Google Ads “doesn't work.”",
    },
  ],
  offer: [
    {
      title: "Signed-case tracking",
      icon: "Database",
      body: "We connect your intake or case-management system back to Google Ads so a signed retainer — not a form-fill — is the conversion the account bids toward.",
    },
    {
      title: "Jurisdiction-locked targeting",
      icon: "MapPin",
      body: "Campaigns target only where you are licensed and can practically serve. No statewide or national spend unless a documented co-counsel arrangement justifies it.",
    },
    {
      title: "The PI negative baseline",
      icon: "Ban",
      body: "Wrong practice areas, job-seekers, “free lawyer” and DIY intent, and competitor traps are excluded from day one — and reviewed every week as the search-term report fills in.",
    },
    {
      title: "Intake-hours ad scheduling",
      icon: "Clock",
      body: "Ads run when a human can answer within minutes. If your intake is not staffed around the clock, we schedule around it or help you get coverage before we scale.",
    },
    {
      title: "Search first, PMax on a leash",
      icon: "Target",
      body: "Core PI intent lives in controllable Search campaigns with visible search terms. Performance Max stays a minority, brand-excluded, and instrumented — never the engine.",
    },
    {
      title: "A budget plan built for your metro",
      icon: "Gauge",
      body: "Before spend goes live we tell you plainly whether your budget can clear the auction in your market — and if it cannot, which sub-niche and geo to concentrate on first.",
    },
  ],
  howItWorks: [
    {
      step: 1,
      title: "Intake audit",
      body: "We map how a lead becomes a signed case at your firm: who answers, how fast, what qualifies, and where the data lives.",
    },
    {
      step: 2,
      title: "Wire the outcome",
      body: "Signed-case conversions flow back to Google Ads from your CRM or intake tool, with practice-area and jurisdiction checks built in.",
    },
    {
      step: 3,
      title: "Launch narrow",
      body: "Tight geo, exact-intent Search, the full negative baseline, and ad schedules matched to staffed hours.",
    },
    {
      step: 4,
      title: "Report on signed cases",
      body: "You see cost per signed case by campaign, not cost per lead. Decisions and budget follow the cases, not the clicks.",
    },
  ],
  faq: [
    {
      q: "Why do you optimize to signed cases instead of leads?",
      a: "Because a lead is not revenue. One campaign can produce plenty of cheap leads and no retainers while another produces a few leads and several signings. Without the signed-case signal, both Google and any generalist agency reward the wrong one.",
    },
    {
      q: "Do you need access to our case-management system?",
      a: "We need a way for “signed” to flow back to the ad platform — usually a CRM or intake-tool integration, sometimes a simple periodic upload. We work with your intake director on the least intrusive path, and client data stays under your control.",
    },
    {
      q: "Can you run ads statewide or nationally?",
      a: "Only if you can serve the case. For a single-office firm we target the jurisdictions you are licensed in and can practically handle. National intake makes sense in mass tort with a co-counsel network, and we treat that as a different program.",
    },
    {
      q: "What about Performance Max? Our last agency ran everything through it.",
      a: "In legal, PMax tends to cannibalize brand, buy cheap junk placements, and hide the search terms that show where money is leaking. We keep core intent in Search where every term is visible, and use PMax sparingly with brand exclusions and negatives.",
    },
    {
      q: "Is there a minimum budget?",
      a: "There is a floor for each metro, and it is higher than most home-services niches because the clicks are. We tell you where it sits for your market on the strategy call and will not take spend we do not think can clear the auction.",
    },
  ],
  cta: { label: "Book a strategy call", href: "/book" },
  seo: {
    title: "Google Ads for Personal Injury Law Firms",
    description:
      "HOMEGRWN runs Google Ads for personal-injury firms, tracked to signed cases instead of form-fills. Jurisdiction-locked, intake-aware, PMax on a leash. You handle the cases. We handle the tech.",
  },
  related: ["car-accident", "truck-accident", "mass-tort"],
  subNiches: ["car-accident", "truck-accident", "mass-tort"],
};
