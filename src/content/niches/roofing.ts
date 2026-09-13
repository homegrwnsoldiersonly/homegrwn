import type { NicheContent } from "@/content/types";

/**
 * Roofing — marketing voice. Engine judgment: roofingPack in
 * src/lib/knowledge/packs/home-services-subniches.ts (storm-surge headroom,
 * local-proof guardrail, material-shopper negatives).
 *
 * Claims gate: no numbers, percentages, client counts, or testimonials here.
 */
export const roofing: NicheContent = {
  slug: "roofing",
  name: "Roofing",
  vertical: "home-services",
  eyebrow: "Roofing repair & replacement",
  headline: "Be ready before the storm hits. Look local when it does.",
  subhead:
    "Roofing compresses the year into a few weeks after hail and wind. The accounts that win are pre-approved for surge budgets, run damage-inspection ads within hours, and prove they're from here while out-of-town crews flood the auction.",
  youHandleLine: "You handle the roofs. We handle the tech.",
  pains: [
    {
      title: "Budget caps still at normal levels the day after the storm.",
      body: "Campaigns already spending their full daily budget have zero headroom the morning hail hits. The cap quietly rations the best weeks of your year to whoever raised theirs.",
    },
    {
      title: "Homeowners can't tell you from the storm chasers.",
      body: "After a big event the auction fills with out-of-town operators. If your ads and landing page don't prove a local address, local reviews, and a license, you're paying the same click price as the truck with out-of-state plates.",
    },
    {
      title: "Shingle shoppers are spending your money.",
      body: "Shingle colors, metal roofing prices, tarps, coatings, how-to-shingle videos. Material and DIY searches match generic roofing terms and never sign a contract.",
    },
    {
      title: "Insurance work isn't in the copy.",
      body: "Homeowners with a claim search differently from homeowners paying cash. Most accounts run one message for both and lose the insurance jobs to the crew that mentions the adjuster.",
    },
  ],
  offer: [
    {
      title: "Storm-response playbook",
      body: "Pre-approved surge budgets, damage-inspection ad variants, and geo adjustments staged so the account is live within hours of an event, not days.",
      icon: "CloudLightning",
    },
    {
      title: "Local proof on every page",
      body: "Address, license number, local reviews, and crew photos on the ads and landing pages — the trust signals the out-of-town surge can't copy.",
      icon: "Home",
    },
    {
      title: "Contractor intent only",
      body: "A roofing-specific negative list keeps material shoppers and DIY patchers out, and match types are tuned to repair, replacement, and inspection intent.",
      icon: "Filter",
    },
    {
      title: "Surge headroom built in",
      body: "Daily budgets are set with room to run on the days it matters, and we watch the weather so the cap never becomes the reason a competitor got the call.",
      icon: "Gauge",
    },
  ],
  howItWorks: [
    {
      step: 1,
      title: "Audit surge readiness",
      body: "We check every campaign for budget headroom, storm ad variants, and local proof — the three things that decide the post-storm auction.",
    },
    {
      step: 2,
      title: "Build the playbook",
      body: "Storm campaigns, inspection landing pages, and an activation checklist, all approved in advance.",
    },
    {
      step: 3,
      title: "Prove local",
      body: "Landing pages and ad extensions carry your address, license, and reviews. Call tracking goes on every number.",
    },
    {
      step: 4,
      title: "Run the season",
      body: "Steady-state campaigns between events; the playbook activates when the weather moves. Reporting is by signed contract, not lead count.",
    },
  ],
  faq: [
    {
      q: "What happens to my account when a hail storm hits?",
      a: "The storm playbook activates: surge budgets go live, the damage-inspection ads switch on, and geo targeting tightens to the affected areas. Because it was all approved in advance, it happens in hours instead of waiting for a meeting.",
    },
    {
      q: "How do you compete with out-of-town storm chasers?",
      a: "We don't outbid them. We out-prove them. Local address, license, reviews, and crew photos on every ad and landing page — homeowners are already primed to fear the out-of-town truck, and we make the difference obvious.",
    },
    {
      q: "Do you handle insurance-claim jobs differently?",
      a: "Yes. Claim-driven homeowners get their own ad copy and landing page that speaks to inspections, adjuster meetings, and documentation. Cash-pay repair and replacement run in separate lanes.",
    },
    {
      q: "Can you keep material shoppers out of my spend?",
      a: "That's the first thing we fix. Shingle prices, colors, tarps, coatings, calculators, and how-to searches go on the negative list on day one, and the search terms report is reviewed on a schedule.",
    },
    {
      q: "Is there a contract?",
      a: "No. Month to month, and we scale spend with the season. A quiet stretch between storms should cost you less, not the same.",
    },
  ],
  cta: { label: "Book a roofing call", href: "/book?trade=roofing" },
  seo: {
    title: "Roofing Marketing: Storm-Ready Google Ads & Local Services Ads",
    description:
      "Google Ads and LSA for roofers: a pre-approved storm-response playbook, local proof that beats out-of-town storm chasers, and negatives that keep shingle shoppers out of your budget.",
  },
  related: ["solar", "hvac", "plumbing"],
};
