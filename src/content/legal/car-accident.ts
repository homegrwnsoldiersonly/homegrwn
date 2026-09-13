import type { LegalContent } from "@/content/types";

/**
 * Car accident — PI sub-niche. High-volume, commoditized; discipline and
 * speed decide who profits (src/lib/knowledge/packs/legal-pi-subniches.ts).
 * Claims-gated: no numbers, case values, or outcome promises.
 */
export const carAccident: LegalContent = {
  slug: "car-accident",
  name: "Car accident",
  vertical: "legal",
  eyebrow: "Google Ads for car-accident practices",
  headline: "The crowded lane in PI. Win it on discipline and speed.",
  subhead:
    "Car-accident search is high-volume and commoditized — aggregators and mass advertisers bid on everything. The firms that profit are not the cleverest targeters; they are the ones that exclude the junk and answer first.",
  youHandleLine: "You handle the cases. We handle the tech.",
  pains: [
    {
      title: "Cheap leads that were never cases.",
      body: "Minor-impact, no-injury, and at-fault callers are the volume trap. Cost per lead looks great while your signed-case rate quietly collapses.",
    },
    {
      title: "Paying to feed the aggregators.",
      body: "Lawyer-match sites bid the same queries you do. Their landing pages convert the curiosity clicks you paid for, then sell the lead back to a firm — sometimes yours.",
    },
    {
      title: "Research intent dressed as a lead.",
      body: "“Accident report,” “was it my fault,” “insurance quote,” “rental car” — real people with real questions and no case. Without negatives they fill your form.",
    },
    {
      title: "Second place gets nothing.",
      body: "In a commoditized sub-niche, speed is the edge that lasts. If intake takes an hour to call back, the case is already signed elsewhere.",
    },
  ],
  offer: [
    {
      title: "Car-accident negative block",
      icon: "Ban",
      body: "The PI baseline plus the car-specific research terms — accident reports, fault questions, repair, insurance quotes, rental cars, license points — excluded before the first click.",
    },
    {
      title: "Minutes-not-hours intake standard",
      icon: "PhoneCall",
      body: "We set the response standard with your intake team and schedule ads to the hours you can hit it. If you cannot yet, that comes before scaling.",
    },
    {
      title: "Qualification built into the funnel",
      icon: "Filter",
      body: "Injury, liability, and jurisdiction questions on the landing page and in the call script, so the account learns from cases, not curiosity.",
    },
    {
      title: "Signed-case feedback loop",
      icon: "Database",
      body: "Retainers flow back to Google Ads so bidding chases cases with clear liability, not the cheapest possible form.",
    },
    {
      title: "Exact-intent Search first",
      icon: "Target",
      body: "Controllable Search on the terms that sign, with every search term reviewed weekly. Broad match and PMax only where the negatives can contain them.",
    },
    {
      title: "Aggregator watch",
      icon: "ShieldCheck",
      body: "We watch the search-term report for lawyer-match brand names and cut them, so you stop paying to hand leads to middlemen.",
    },
  ],
  howItWorks: [
    {
      step: 1,
      title: "Intake audit",
      body: "How fast does a paid caller reach a human, and which questions decide whether they are a case? We start here.",
    },
    {
      step: 2,
      title: "Negatives before spend",
      body: "The car-accident exclusion block goes in first. Then exact-intent Search campaigns targeted to the counties you serve.",
    },
    {
      step: 3,
      title: "Wire signed cases",
      body: "Retainers flow back from your CRM with liability and jurisdiction flags.",
    },
    {
      step: 4,
      title: "Weekly search-term review",
      body: "New junk gets cut, new intent gets added, and budget moves toward the campaigns that sign.",
    },
  ],
  faq: [
    {
      q: "Our cost per lead is already low. Why change anything?",
      a: "Low cost per lead in car accident usually means the account is filling with minor-impact and at-fault callers. The number that matters is cost per signed case with clear liability. If nobody can say that number, the account is flying blind.",
    },
    {
      q: "How fast does intake really need to be?",
      a: "Fast enough that the caller has not reached the next firm. During ad hours we set a minutes-level standard with your intake team — and we will not scale spend into hours you cannot cover.",
    },
    {
      q: "Should we bid on aggregator or competitor brand names?",
      a: "Usually not. Competitor brand clicks are expensive and rarely sign; aggregator names in your search terms are a sign you are already paying them indirectly. We treat both as negatives unless there is a specific reason not to.",
    },
    {
      q: "Do we need a separate landing page from our main site?",
      a: "Yes. A page built for one intent, with the qualifying questions up front and a click-to-call that reaches intake, converts cases better than a homepage built for everything.",
    },
    {
      q: "Can this run alongside our TV or billboard campaigns?",
      a: "Yes, and it should be tracked separately. Brand searches driven by offline media are protected in their own campaign so they do not inflate the results of the non-brand work.",
    },
  ],
  cta: { label: "Book a strategy call", href: "/book" },
  seo: {
    title: "Google Ads for Car Accident Lawyers",
    description:
      "Car-accident Google Ads run for signed cases, not form-fills: research-term negatives, aggregator watch, and an intake speed standard. You handle the cases. We handle the tech.",
  },
  related: ["personal-injury", "truck-accident", "mass-tort"],
};
