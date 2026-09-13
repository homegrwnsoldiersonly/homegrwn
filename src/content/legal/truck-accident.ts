import type { LegalContent } from "@/content/types";

/**
 * Truck accident — PI sub-niche. Low volume, very high case value, brutal
 * click prices; narrow, exact, and patient, judged on quarter-length windows
 * (src/lib/knowledge/packs/legal-pi-subniches.ts).
 * Claims-gated: no numbers, case values, or outcome promises.
 */
export const truckAccident: LegalContent = {
  slug: "truck-accident",
  name: "Truck accident",
  vertical: "legal",
  eyebrow: "Google Ads for truck-accident practices",
  headline: "Few clicks. Big cases. No room for waste.",
  subhead:
    "In truck-accident work the click is expensive because commercial-carrier case values price it in. Everything about the account has to be narrow, exact, and patient — and judged on the right time window.",
  youHandleLine: "You handle the cases. We handle the tech.",
  pains: [
    {
      title: "Job-seekers eating the budget invisibly.",
      body: "Much of the raw “truck” traffic is CDL applicants, driver-salary searches, owner-operators, and parts buyers. Without a specific negative block they spend your budget and never show up as leads.",
    },
    {
      title: "Fender-benders that aren't commercial cases.",
      body: "Many callers were near a truck, not hit by a commercial carrier. The difference is the whole economics — and intake, not the ad, has to qualify the defendant.",
    },
    {
      title: "Panicking over a quiet month.",
      body: "At this volume, a month without a signing is variance, not failure. Reacting to it — cutting budget, rewriting ads — is how good campaigns get destroyed.",
    },
    {
      title: "Broad match on the most expensive terms.",
      body: "Broad match on truck terms without the jobs block is the fastest way to burn a serious budget on people who will never be clients.",
    },
  ],
  offer: [
    {
      title: "The truck-specific negative block",
      icon: "Ban",
      body: "CDL, driving jobs, driver salary, owner-operator, starting a trucking company, trucks for sale, parts, DOT inspections — excluded before launch, expanded from the search-term report every week.",
    },
    {
      title: "Defendant-qualified tracking",
      icon: "Truck",
      body: "“Signed” means a commercial defendant confirmed, not just a retainer. That is the outcome we send back to Google Ads.",
    },
    {
      title: "Quarter-length judgment windows",
      icon: "Hourglass",
      body: "We evaluate truck campaigns over a full quarter at minimum and set that expectation with you up front, so nobody makes a panic decision off one month.",
    },
    {
      title: "Narrow, exact, in-jurisdiction",
      icon: "MapPin",
      body: "Exact-intent terms, the geos where you actually try these cases, and no experiments with the account's most expensive clicks.",
    },
    {
      title: "Intake script for the defendant question",
      icon: "ClipboardCheck",
      body: "We help your intake team ask the carrier and commercial-policy questions early, so the expensive click becomes a qualified case fast.",
    },
    {
      title: "An honest budget floor",
      icon: "Gauge",
      body: "The floor here is higher than in car accident because the clicks are. If your budget cannot buy enough of them to expect a case, we say so instead of spreading it thin.",
    },
  ],
  howItWorks: [
    {
      step: 1,
      title: "Intake and case-mix audit",
      body: "We look at how you qualify a commercial-carrier case today and what a signed one means to the firm.",
    },
    {
      step: 2,
      title: "Build narrow",
      body: "Exact-intent Search, the truck negative block, jurisdiction-locked geo, and ad schedules matched to staffed intake.",
    },
    {
      step: 3,
      title: "Wire the qualified outcome",
      body: "Retainers with a confirmed commercial defendant flow back to Google Ads as the conversion.",
    },
    {
      step: 4,
      title: "Report on the quarter",
      body: "Monthly reporting shows activity; decisions happen on quarterly windows, and we say that in writing before launch.",
    },
  ],
  faq: [
    {
      q: "We only sign a handful of truck cases a year. Is Google Ads even worth it?",
      a: "That is normal volume for the sub-niche, and it is why the account has to be judged on a quarter, not a month. Whether it is worth it depends on your fee economics and your metro's click prices — which we walk through on the call rather than promise.",
    },
    {
      q: "Why not run truck and car accident in the same campaign?",
      a: "Different defendants, different case values, different negatives. Mixing them means the cheap car-accident volume drives the bidding and the truck terms never get the budget or the patience they need.",
    },
    {
      q: "How do you keep truck-driver job-seekers out?",
      a: "A dedicated negative block for CDL, jobs, salary, owner-operator, and equipment terms goes in before launch, and every week we cut new ones from the search-term report.",
    },
    {
      q: "What counts as a signed case in your reporting?",
      a: "A retainer with a confirmed commercial defendant. A signed fender-bender near a truck is tracked as a car-accident case, not a truck case, so the truck numbers stay honest.",
    },
    {
      q: "Is there a minimum budget for truck accident?",
      a: "Yes, and it is higher than car accident. We tell you plainly on the call where the floor sits in your market and whether your budget can clear it.",
    },
  ],
  cta: { label: "Book a strategy call", href: "/book" },
  seo: {
    title: "Google Ads for Truck Accident Lawyers",
    description:
      "Truck-accident Google Ads built narrow and patient: CDL and job-seeker negatives, commercial-defendant-qualified tracking, quarter-length judgment windows. You handle the cases. We handle the tech.",
  },
  related: ["personal-injury", "car-accident", "mass-tort"],
};
