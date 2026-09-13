import type { NicheContent } from "@/content/types";

/**
 * Electrical — marketing voice. Engine judgment: home-services pack
 * (LSA-first, duration-qualified calls, junk-term negatives) plus the
 * service-call vs upgrade split that mirrors HVAC's value problem.
 *
 * Claims gate: no numbers, percentages, client counts, or testimonials here.
 */
export const electrical: NicheContent = {
  slug: "electrical",
  name: "Electrical",
  vertical: "home-services",
  eyebrow: "Electrical service & upgrades",
  headline: "Panel upgrades and EV chargers on one side. Service calls on the other.",
  subhead:
    "An outlet that stopped working and a homeowner ready for a panel upgrade or an EV charger are different jobs with different tickets. We split them, track the calls, and keep the DIY and parts searches out of your spend.",
  youHandleLine: "You handle the wiring. We handle the tech.",
  pains: [
    {
      title: "Service calls set the bid for everything.",
      body: "Small troubleshooting jobs are frequent and cheap to win, so the account learns to chase them and underfunds the panel and EV charger terms that carry the margin.",
    },
    {
      title: "EV charger intent is a keyword set most accounts don't have.",
      body: "Homeowners search by charger brand, by vehicle, and by installer-near-me. If the campaign was built before that demand existed, it isn't catching it.",
    },
    {
      title: "DIY and parts searches match your ads.",
      body: "Breaker sizes, wire gauge charts, how-to-wire videos, and parts lookups match generic electrical keywords and never hire an electrician.",
    },
    {
      title: "The phone isn't counted right.",
      body: "Electrical is phone-first. Untracked calls, or calls counted before anyone speaks, leave the bidding blind to what a real booking looks like.",
    },
  ],
  offer: [
    {
      title: "Upgrade lane vs service lane",
      body: "Panel upgrades, EV chargers, generators, and rewires get their own campaigns and budgets, separate from troubleshooting and repair.",
      icon: "Zap",
    },
    {
      title: "EV charger demand captured",
      body: "Brand, vehicle, and installer-intent keywords with a landing page that answers the questions homeowners actually ask about charger installs.",
      icon: "PlugZap",
    },
    {
      title: "LSA and call tracking",
      body: "Local Services Ads stood up for the electrical trade, calls tracked with a duration threshold, and calls set as the primary conversion.",
      icon: "PhoneCall",
    },
    {
      title: "Trade-specific negatives",
      body: "DIY, parts, wire gauge, breaker size, code lookups, and job-seeker searches go on the negative list on day one.",
      icon: "Filter",
    },
  ],
  howItWorks: [
    {
      step: 1,
      title: "Audit by job type",
      body: "We sort your spend and your conversions into service and upgrade work and find which one is actually funding the other.",
    },
    {
      step: 2,
      title: "Split the campaigns",
      body: "Service, panel and generator, and EV charger campaigns with their own negatives and landing pages.",
    },
    {
      step: 3,
      title: "Wire tracking and LSA",
      body: "Call tracking with thresholds, Local Services Ads stood up or cleaned up, calls set as the primary conversion.",
    },
    {
      step: 4,
      title: "Report by ticket size",
      body: "Monthly reporting shows booked jobs by lane, so you can see the upgrade work on its own line.",
    },
  ],
  faq: [
    {
      q: "Can you separate panel upgrade leads from service calls?",
      a: "Yes. Upgrade work — panels, generators, rewires, EV chargers — runs in separate campaigns with separate budgets, so the bigger tickets aren't starved by cheap troubleshooting clicks.",
    },
    {
      q: "How do you go after EV charger installs?",
      a: "A dedicated campaign built around charger brands, vehicle models, and installer-intent searches, with a landing page that covers panel capacity, permits, and timelines — the questions homeowners ask before they call.",
    },
    {
      q: "Is Local Services Ads worth it for electricians?",
      a: "Usually yes for service and repair demand: it sits at the top of the page, bills per lead, and carries the Google Guaranteed badge. Upgrade intent often needs Search and a strong page. We run both and compare cost per booked job.",
    },
    {
      q: "How do you keep DIY searches out?",
      a: "An electrical-specific negative list from day one — breaker sizes, wire gauge, how-to, parts, code questions, salary and job searches — and a scheduled review of the search terms report to keep adding.",
    },
    {
      q: "Is there a contract?",
      a: "No. No contracts, no commitments. We earn the next month with what the last one booked.",
    },
  ],
  cta: { label: "Book an electrical call", href: "/book?trade=electrical" },
  seo: {
    title: "Electrical Marketing: Google Ads & LSA for Panels, EV Chargers and Service",
    description:
      "Google Ads and Local Services Ads for electricians: panel upgrades and EV charger installs kept separate from service calls, EV charger keyword sets, and call tracking that only counts real conversations.",
  },
  related: ["hvac", "plumbing", "solar"],
};
