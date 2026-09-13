import type { NicheContent } from "@/content/types";

/**
 * HVAC — marketing voice. Engine judgment: hvacPack in
 * src/lib/knowledge/packs/home-services-subniches.ts (value-blind bidding,
 * seasonal pacing, retail-shopper negatives).
 *
 * Claims gate: no numbers, percentages, client counts, or testimonials here.
 */
export const hvac: NicheContent = {
  slug: "hvac",
  name: "HVAC",
  vertical: "home-services",
  eyebrow: "HVAC repair, replacement & maintenance",
  headline: "Own the summer surge. Stay funded in the shoulder season.",
  subhead:
    "Demand for heating and cooling moves with the weather, and a service call and a full system replacement are worth wildly different amounts. We pace budget to the forecast, feed job value back into the account, and keep the install keywords funded while cheap repair clicks try to eat the budget.",
  youHandleLine: "You handle the systems. We handle the tech.",
  pains: [
    {
      title: "One flat budget for a weather-driven trade.",
      body: "The first heat wave of the year is where the margin is made. A flat monthly budget caps out by mid-afternoon on the hottest days and overspends in the mild weeks when nobody is calling.",
    },
    {
      title: "The account can't tell a tune-up from a replacement.",
      body: "Both are “a conversion.” The bidding chases whichever books cheapest — repair calls — and quietly starves the replacement terms that carry your year.",
    },
    {
      title: "Retail shoppers are matching your ads.",
      body: "Window units, portable AC, space heaters, filter sizes, thermostat manuals. None of them hire a contractor, and all of them match a generic HVAC keyword.",
    },
    {
      title: "Maintenance plans don't get a campaign.",
      body: "Recurring plan revenue is the most predictable money in the trade, and most accounts never build a campaign for it.",
    },
  ],
  offer: [
    {
      title: "Seasonal pacing",
      body: "A budget curve that follows the weather: headroom during heat waves and cold snaps, a throttle in the shoulder months, and a plan for the first hot week of the year.",
      icon: "Thermometer",
    },
    {
      title: "Job value in the account",
      body: "We connect job values from your field-service platform so the bidding knows a replacement from a repair — and funds install intent accordingly.",
      icon: "CircleDollarSign",
    },
    {
      title: "Repair, replace, maintain: three lanes",
      body: "Emergency repair, system replacement, and maintenance plans each get their own campaign, landing page, and offer. No more one-size-fits-all ad for a trade with three businesses inside it.",
      icon: "Wrench",
    },
    {
      title: "LSA and call tracking",
      body: "Local Services Ads stood up for the trade, calls tracked with a duration threshold, and calls set as the primary conversion.",
      icon: "PhoneCall",
    },
  ],
  howItWorks: [
    {
      step: 1,
      title: "Audit spend against the calendar",
      body: "We lay your past year of spend over the weather and your booked jobs to find where budget capped out and where it burned.",
    },
    {
      step: 2,
      title: "Rebuild by job type",
      body: "Repair, replacement, and maintenance campaigns with trade-specific negatives and landing pages.",
    },
    {
      step: 3,
      title: "Connect job value",
      body: "Field-service or booking data flows back into the account so bidding sees revenue, not just conversions.",
    },
    {
      step: 4,
      title: "Pace and report",
      body: "Budgets move with the forecast. Reporting shows booked jobs and revenue by lane, not clicks.",
    },
  ],
  faq: [
    {
      q: "How do you handle the summer surge without blowing the budget?",
      a: "We pre-plan surge budgets for heat waves and cold snaps so the account isn't rationed by a budget cap on the days demand peaks. In the shoulder season we throttle back and shift weight to replacement and maintenance terms, where the intent is slower but the ticket is bigger.",
    },
    {
      q: "Can you separate repair leads from replacement leads?",
      a: "Yes, at the campaign level and in reporting. Replacement and new-system intent gets its own campaign with its own budget so it can't be starved by cheap repair clicks. When job values flow back from your field-service platform, the bidding sees the difference too.",
    },
    {
      q: "Is Local Services Ads worth it for HVAC?",
      a: "For repair and maintenance demand, usually yes: it sits at the top of the page and bills per lead. Big-ticket replacement intent tends to need Search and a strong landing page. We run both and compare cost per booked job.",
    },
    {
      q: "What about maintenance plans?",
      a: "They get their own campaign and offer. Plan sign-ups are the most predictable revenue in the trade and the cheapest customer to keep, so they deserve a dedicated lane instead of a line on the repair page.",
    },
    {
      q: "Do I have to sign a long-term contract?",
      a: "No. Month to month. If the shoulder season is quiet, we scale spend down with it rather than spending to hit a retainer.",
    },
  ],
  cta: { label: "Book an HVAC call", href: "/book?trade=hvac" },
  seo: {
    title: "HVAC Marketing: Google Ads & LSA That Follow the Weather",
    description:
      "Google Ads and Local Services Ads for HVAC contractors: seasonal budget pacing, job value fed back into bidding so replacements aren't starved by repair clicks, and maintenance plans as their own lane.",
  },
  related: ["plumbing", "electrical", "solar"],
};
