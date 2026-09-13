import type { NicheContent } from "@/content/types";

/**
 * Plumbing — marketing voice. Engine judgment: home-services pack
 * (call-first tracking, LSA-first, junk-term negatives) plus the after-hours
 * and intent-split economics specific to the trade.
 *
 * Claims gate: no numbers, percentages, client counts, or testimonials here.
 */
export const plumbing: NicheContent = {
  slug: "plumbing",
  name: "Plumbing",
  vertical: "home-services",
  eyebrow: "Plumbing repair & installation",
  headline: "After-hours emergencies on the phone. Water heaters on the schedule.",
  subhead:
    "A burst pipe at midnight and a homeowner pricing a new water heater are different customers on different clocks. We run them as separate lanes, keep the phone tracked around the clock, and keep the drain-coupon crowd from eating the budget.",
  youHandleLine: "You handle the pipes. We handle the tech.",
  pains: [
    {
      title: "Emergency calls come in when the account is asleep.",
      body: "Nights and weekends are where the margin is in plumbing. If ad schedules, bids, and call routing don't reflect that, you're paying daytime prices for calls you can't answer and missing the ones you can.",
    },
    {
      title: "Water heater intent is buried under drain clicks.",
      body: "Drain cleaning is cheap, frequent, and price-shopped. Water heater and repipe intent is rarer and worth many times more. Most accounts let the cheap clicks set the bid strategy for both.",
    },
    {
      title: "You're competing with the coupon.",
      body: "Franchise and lead-gen sites run drain specials on the exact terms you bid. Without a clear offer and tight match types, you're paying to send shoppers to their coupon.",
    },
    {
      title: "Nobody counts the calls properly.",
      body: "Plumbing is almost entirely phone-first. Untracked calls — or calls counted before anyone says hello — leave the bidding guessing at what a customer looks like.",
    },
  ],
  offer: [
    {
      title: "Emergency lane, around the clock",
      body: "Emergency terms get after-hours bid schedules, click-to-call, and routing to whoever is actually on call. Daytime and after-hours are reported separately.",
      icon: "Clock",
    },
    {
      title: "Intent split: drains, water heaters, repipes",
      body: "Each job family gets its own campaign, budget, and landing page, so water heater and repipe intent can't be starved by drain clicks.",
      icon: "Droplets",
    },
    {
      title: "LSA in front of Search",
      body: "Google Guaranteed and Local Services Ads stood up first for the plumbing trade, then Search scaled on the terms and hours LSA doesn't reach.",
      icon: "ShieldCheck",
    },
    {
      title: "Duration-qualified call tracking",
      body: "Every number tracked, every call timed. Only calls long enough to be a conversation count, so the account learns from bookings, not hang-ups.",
      icon: "PhoneCall",
    },
  ],
  howItWorks: [
    {
      step: 1,
      title: "Audit the phone and the schedule",
      body: "We look at when your calls actually come in, when your ads run, and what the search terms report is paying for.",
    },
    {
      step: 2,
      title: "Split the lanes",
      body: "Emergency, drain, water heater, and repipe campaigns with their own negatives and landing pages.",
    },
    {
      step: 3,
      title: "Wire tracking and LSA",
      body: "Call tracking with thresholds, Local Services Ads stood up or cleaned up, calls set as the primary conversion.",
    },
    {
      step: 4,
      title: "Report by job type",
      body: "Monthly reporting shows booked jobs by lane and by hour, so you can see the after-hours math for yourself.",
    },
  ],
  faq: [
    {
      q: "Can you run ads differently at night and on weekends?",
      a: "Yes. Emergency campaigns carry their own ad schedule and bid adjustments for after-hours windows, and calls route to the tech on call. We report after-hours results separately so you can decide whether the overtime is paying.",
    },
    {
      q: "How do you separate water heater leads from drain calls?",
      a: "Separate campaigns with separate budgets. Water heater, repipe, and sewer-line terms never share a budget with drain cleaning, so the expensive-but-valuable intent stays funded.",
    },
    {
      q: "Should I be on Local Services Ads?",
      a: "For plumbing, almost always. It sits above the search ads, bills per lead, and carries the Google Guaranteed badge. We evaluate it first and use Search to cover the terms and hours it doesn't.",
    },
    {
      q: "What about the franchise coupons I keep seeing on my keywords?",
      a: "We don't chase them on price. Tight match types and a clear offer on the landing page keep you out of the coupon fight, and the negatives keep cheap, coupon, and DIY searches out of your spend.",
    },
    {
      q: "Is there a contract?",
      a: "No. No contracts, no commitments. We earn the next month with the last month's booked jobs.",
    },
  ],
  cta: { label: "Book a plumbing call", href: "/book?trade=plumbing" },
  seo: {
    title: "Plumbing Marketing: Google Ads & LSA for Emergencies and Water Heaters",
    description:
      "Google Ads and Local Services Ads for plumbers: after-hours emergency lanes, water heater and repipe intent kept separate from drain clicks, and call tracking that only counts real conversations.",
  },
  related: ["septic", "hvac", "electrical"],
};
