import type { NicheContent } from "@/content/types";

/**
 * Solar — marketing voice. Engine judgment: home-services pack plus the
 * long-consideration, appointment-set economics that make solar the outlier
 * among the trades (base.conversion-integrity: optimize to verified outcomes,
 * not raw form fills).
 *
 * Claims gate: no numbers, percentages, client counts, or testimonials here.
 */
export const solar: NicheContent = {
  slug: "solar",
  name: "Solar",
  vertical: "home-services",
  eyebrow: "Residential solar",
  headline: "Solar is a long decision. Your ads should know that.",
  subhead:
    "Nobody buys a solar system from a single click. Homeowners research for weeks, compare quotes, and stall on financing. We build for appointment-set economics — the cost of a sat consultation, not a form fill — and write for the objections that kill deals at the kitchen table.",
  youHandleLine: "You handle the panels. We handle the tech.",
  pains: [
    {
      title: "You're paying lead-gen prices for form fills that never sit.",
      body: "A solar lead that doesn't show up for the consultation is worth nothing, and cheap form-fill campaigns are optimized to produce exactly that.",
    },
    {
      title: "Financing objections show up after the click.",
      body: "Homeowners stall on payments, payback, and what happens if they sell the house. If the ads and landing page don't address it, the closer inherits the objection cold.",
    },
    {
      title: "Retail and research traffic matches your keywords.",
      body: "Panel prices per watt, DIY kits, RV and camping panels, how-solar-works explainers. None of it becomes an installed system.",
    },
    {
      title: "The account optimizes to the wrong event.",
      body: "If the primary conversion is the form fill, the bidding chases the cheapest fill. It should be chasing the sat appointment — and, when you can feed it back, the signed proposal.",
    },
  ],
  offer: [
    {
      title: "Appointment-set economics",
      body: "We make the sat consultation the conversion your account optimizes toward, and report cost per appointment — not cost per lead.",
      icon: "CalendarDays",
    },
    {
      title: "Objection-first landing pages",
      body: "Financing, payback, roof condition, what happens when you sell — the objections that kill deals get answered before the click, so the consultation starts warm.",
      icon: "ListChecks",
    },
    {
      title: "Built for a long consideration",
      body: "Search for high-intent terms, remarketing for the weeks of research in between, and a follow-up sequence that keeps you in the conversation until they're ready to sit.",
      icon: "Route",
    },
    {
      title: "Retail and research negatives",
      body: "A solar-specific negative list removes per-watt shoppers, DIY kits, RV panels, and explainer searches from your spend.",
      icon: "Filter",
    },
  ],
  howItWorks: [
    {
      step: 1,
      title: "Audit the funnel, not just the account",
      body: "We trace leads to appointments to proposals to signed deals and find where the drop-off actually is.",
    },
    {
      step: 2,
      title: "Rebuild around the appointment",
      body: "Conversion tracking, campaigns, and landing pages all pointed at the sat consultation.",
    },
    {
      step: 3,
      title: "Cover the consideration window",
      body: "Remarketing and follow-up so the weeks between first search and decision don't go to a competitor.",
    },
    {
      step: 4,
      title: "Report on appointments and proposals",
      body: "Monthly reporting shows cost per sat appointment and, with CRM data connected, cost per signed proposal.",
    },
  ],
  faq: [
    {
      q: "Why do you optimize for appointments instead of leads?",
      a: "Because a solar lead that doesn't sit is worth nothing. Form fills are easy to buy and easy to inflate. Appointment-set is the first event in the funnel that predicts revenue, so that's what the bidding chases and what we report.",
    },
    {
      q: "How do you handle financing objections?",
      a: "In the copy, before the click. Payments, payback, roof age, and what happens if the homeowner sells all get answered on the landing page, so the consultation starts with fewer surprises.",
    },
    {
      q: "Solar buyers take weeks to decide. What happens in between?",
      a: "Remarketing and a follow-up sequence keep you in front of them through the research phase. The goal is to be the installer they already know when they're ready to sit.",
    },
    {
      q: "Can you connect my CRM so we see closed deals?",
      a: "Yes, when you're ready. Offline conversion import brings appointments held and proposals signed back into the account, so bidding and reporting run on real outcomes.",
    },
    {
      q: "Is there a contract?",
      a: "No. Month to month. Solar sales cycles are long, so we set expectations up front about when the appointment numbers will show — and you can leave any time.",
    },
  ],
  cta: { label: "Book a solar call", href: "/book?trade=solar" },
  seo: {
    title: "Solar Marketing: Google Ads Built for Appointment-Set Economics",
    description:
      "Google Ads for residential solar installers: optimize to sat appointments instead of form fills, answer financing objections before the click, and cover the long consideration window with remarketing.",
  },
  related: ["roofing", "electrical", "hvac"],
};
