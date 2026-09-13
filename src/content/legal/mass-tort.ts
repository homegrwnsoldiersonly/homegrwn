import type { LegalContent } from "@/content/types";

/**
 * Mass tort — PI sub-niche where the jurisdiction rule inverts: national
 * intake with co-counsel is the model; eligibility screening and one tort
 * per campaign govern everything (src/lib/knowledge/packs/legal-pi-subniches.ts).
 * Claims-gated: no numbers, case values, or outcome promises.
 */
export const massTort: LegalContent = {
  slug: "mass-tort",
  name: "Mass tort",
  vertical: "legal",
  eyebrow: "Google Ads for mass-tort intake",
  headline: "National reach. One tort at a time. Retained, eligible claimants.",
  subhead:
    "Mass tort is where PI's geography rule inverts: national intake with co-counsel is the model, and volume is the point. The risk moves from jurisdiction to eligibility — and cost per retained, eligible claimant is the number we run on.",
  youHandleLine: "You handle the cases. We handle the tech.",
  pains: [
    {
      title: "Celebrating volume while eligibility is unknown.",
      body: "Raw claimant leads are noise. If the retained-eligible rate is unknown or falling, the campaign is buying wash-out.",
    },
    {
      title: "Other firms' claimants in your funnel.",
      body: "“Check my settlement status,” “settlement calculator,” “how much will I get” — those are existing claimants of other firms, and they convert on your form.",
    },
    {
      title: "Torts mixed in one campaign.",
      body: "Eligibility criteria, ad language, and value per claimant differ per tort. Mixing them in an ad group or landing page destroys measurement.",
    },
    {
      title: "A local-firm geo strategy on a national docket.",
      body: "Narrow geography caps claimant volume without improving quality. Agencies trained on local PI apply it by habit.",
    },
    {
      title: "Sub-scale spend on a scale game.",
      body: "Mass tort is a scale business. Spend under the floor buys leads that age out before a docket resolves.",
    },
  ],
  offer: [
    {
      title: "National targeting, co-counsel confirmed",
      icon: "Globe",
      body: "With a co-counsel network in place, targeting opens nationally and quality is controlled through eligibility screening, not geography.",
    },
    {
      title: "Eligibility in the ad and on the lander",
      icon: "ClipboardCheck",
      body: "Exposure dates, diagnosis, and prior-representation screens live in the ad copy and the landing page — so ineligible claimants filter themselves before you pay for intake.",
    },
    {
      title: "One tort per campaign",
      icon: "Layers",
      body: "Each tort gets its own campaign, ad groups, and landing page. Measurement stays clean and budget can move between torts on real retained-eligible numbers.",
    },
    {
      title: "Existing-claimant negatives",
      icon: "Ban",
      body: "Settlement-status, calculator, claim-form-download, and rebate terms excluded so you stop paying for other firms' claimants.",
    },
    {
      title: "Retained-eligible conversion feedback",
      icon: "Database",
      body: "Retained plus passed the tort-specific eligibility screen is the outcome sent back to Google Ads. Bidding chases eligible claimants, not raw leads.",
    },
    {
      title: "Docket-aware budget planning",
      icon: "Gauge",
      body: "We size spend to the tort's maturity and media saturation, and we say plainly when a budget is sub-scale for the docket.",
    },
  ],
  howItWorks: [
    {
      step: 1,
      title: "Tort and eligibility workshop",
      body: "We document each tort's criteria, your co-counsel arrangement, and how intake screens today.",
    },
    {
      step: 2,
      title: "Build per tort",
      body: "A campaign, ad group set, and landing page per tort, with eligibility language up front and the existing-claimant negatives in place.",
    },
    {
      step: 3,
      title: "Wire retained-eligible",
      body: "Retained claimants who pass the screen flow back to Google Ads as the conversion.",
    },
    {
      step: 4,
      title: "Scale on real numbers",
      body: "Budget moves between torts on cost per retained, eligible claimant — with no celebration of raw lead counts.",
    },
  ],
  faq: [
    {
      q: "Do you need our co-counsel arrangement documented before national targeting?",
      a: "Yes. National intake without a way to represent the claimant locally is spend on cases you cannot sign. Once the arrangement is confirmed, geography opens up and eligibility becomes the control.",
    },
    {
      q: "Why put eligibility criteria in the ad itself?",
      a: "Because every ineligible lead is waste that the platform counts as success. Screening in the ad and on the landing page filters before the click is paid for, not after intake has spent time on it.",
    },
    {
      q: "Can we run several torts in one campaign to save budget?",
      a: "No. Different torts have different criteria, language, and value per claimant. Mixing them means you cannot tell which one is working, and budget flows to whichever produces the cheapest — not the most eligible — leads.",
    },
    {
      q: "What do you count as a conversion?",
      a: "A retained claimant who passes the tort-specific eligibility screen. A signed retainer that later washes out on dates or diagnosis is not a conversion in our reporting.",
    },
    {
      q: "How much budget does mass tort need?",
      a: "More than local PI. It is a scale game, and sub-scale spend buys leads that age out. We size it to the tort's maturity and saturation on the call rather than quote a figure here.",
    },
  ],
  cta: { label: "Book a strategy call", href: "/book" },
  seo: {
    title: "Google Ads for Mass Tort Claimant Acquisition",
    description:
      "Mass-tort Google Ads run for retained, eligible claimants: one tort per campaign, eligibility in the ad, existing-claimant negatives, national reach with co-counsel. You handle the cases. We handle the tech.",
  },
  related: ["personal-injury", "car-accident", "truck-accident"],
};
