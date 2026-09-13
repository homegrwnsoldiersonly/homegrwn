import type { NicheContent } from "@/content/types";

/**
 * Septic — marketing voice. Engine judgment for the same trade lives in
 * src/lib/knowledge/packs/home-services.ts (LSA-first, duration-qualified
 * calls, profitable radius, junk-term negatives).
 *
 * Claims gate: no numbers, percentages, client counts, or testimonials here.
 */
export const septic: NicheContent = {
  slug: "septic",
  name: "Septic",
  vertical: "home-services",
  eyebrow: "Septic pumping & inspections",
  headline: "Emergency pump-outs on the phone. Inspections on the calendar.",
  subhead:
    "Google Ads and Local Services Ads run by people who know the difference between a backed-up tank on a Saturday night and a real-estate inspection with a closing date. We build both lanes, count the calls that matter, and stop paying for the counties your trucks don't reach.",
  youHandleLine: "You handle the tanks. We handle the tech.",
  pains: [
    {
      title: "Your ads pay for counties you won't drive to.",
      body: "A pump truck burns margin on windshield time. Most generalist accounts draw one big radius and call it a service area. The far edge of that circle sends you jobs that lose money before the hose comes off the truck.",
    },
    {
      title: "A backed-up tank and a curious homeowner look identical to Google.",
      body: "“Septic tank backing up” and “how does a septic system work” both count as a click. One is a job tonight. The other is a homework assignment. Without a negative list and match types tuned for the trade, your budget funds the homework.",
    },
    {
      title: "The phone rings, and the account can't see it.",
      body: "Septic is phone-first. If the account counts form fills and ignores calls — or counts misdials and hang-ups the same as a real booking — the bidding learns from noise and starves the terms that put trucks in driveways.",
    },
    {
      title: "Nobody is running Local Services Ads.",
      body: "The Google Guaranteed block sits above every search ad on the page. If you aren't in it, a competitor is, and they are paying per lead instead of per click.",
    },
  ],
  offer: [
    {
      title: "LSA first, Search second",
      body: "We get you Google Guaranteed and stand up Local Services Ads before we scale Search. Then we compare cost per booked job across both — not cost per click.",
      icon: "ShieldCheck",
    },
    {
      title: "Two lanes: emergency and scheduled",
      body: "Emergency pump-out terms get click-to-call, after-hours coverage, and bids that hold. Inspection and real-estate terms get their own campaign, their own budget, and landing pages that talk about closing dates.",
      icon: "PhoneCall",
    },
    {
      title: "County-by-county radius",
      body: "We target the counties your trucks actually cover, price the outer ring for what it costs you to drive it, and drop the rest.",
      icon: "MapPin",
    },
    {
      title: "Calls that count",
      body: "Call tracking on every ad and every landing page, with a minimum duration so wrong numbers and hang-ups never teach the bidding what a customer looks like.",
      icon: "Clock",
    },
  ],
  howItWorks: [
    {
      step: 1,
      title: "Account and territory audit",
      body: "We map your current spend against your real service area and your dispatch log. You see where money is leaking before we touch a bid.",
    },
    {
      step: 2,
      title: "Build the two lanes",
      body: "Emergency and scheduled work get separate campaigns, negatives, and landing pages. Local Services Ads gets stood up or cleaned up.",
    },
    {
      step: 3,
      title: "Wire the phone",
      body: "Call tracking with duration thresholds goes in, and calls become the primary conversion your account optimizes toward.",
    },
    {
      step: 4,
      title: "Report on booked jobs",
      body: "Monthly reporting in dispatch language: calls that turned into pump-outs and inspections, by county — not impressions.",
    },
  ],
  faq: [
    {
      q: "Do I need Local Services Ads if I'm already running Google Ads?",
      a: "Almost certainly. Local Services Ads sit above the search ads, bill per lead instead of per click, and carry the Google Guaranteed badge, so we stand them up first and compare cost per booked job against Search before scaling either.",
    },
    {
      q: "Can you target only the counties we actually serve?",
      a: "Yes. We build targeting county by county from your dispatch reality, not from a circle on a map. If the far edge of your territory only makes sense for a full system install, that edge gets install terms and nothing else.",
    },
    {
      q: "How do you keep how-to and DIY searches out of my budget?",
      a: "A septic-specific negative keyword list goes in on day one: DIY, how-to, parts, additives, salary and job-seeker terms, permit lookups, and the retail products that match trade keywords. We review the search terms report on a schedule and keep adding to it.",
    },
    {
      q: "What counts as a lead in your reporting?",
      a: "A tracked call that lasts long enough to be a real conversation, or a form that asks for the address and the problem. Hang-ups and misdials are filtered out before they reach the numbers you see — and before they reach Google's bidding.",
    },
    {
      q: "Is there a contract?",
      a: "No. No contracts, no commitments. We earn the next month by what the last month booked.",
    },
  ],
  cta: { label: "Book a septic call", href: "/book?trade=septic" },
  seo: {
    title: "Septic Marketing: Google Ads & Local Services Ads for Pumping and Inspections",
    description:
      "Google Ads and LSA for septic companies: emergency pump-outs and scheduled inspections as separate lanes, county-by-county targeting, and call tracking that only counts real conversations.",
  },
  related: ["plumbing", "hvac", "electrical"],
};
