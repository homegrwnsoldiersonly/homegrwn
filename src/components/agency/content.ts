import type { FaqItem, OfferBlock, Step, Vertical } from "@/content/types";

/**
 * Agency home copy. Everything here passes the claims gate
 * (docs/content/claims.md): no numbers, percentages, client counts,
 * testimonials, or brand-name clients. Proof renders <ProofPlaceholder/>.
 */

export interface NicheCard {
  slug: string;
  name: string;
  vertical: Vertical;
  href: string;
  /** "You handle the X. We handle the tech." — the per-trade promise. */
  youHandleLine: string;
  blurb: string;
}

export const NICHES: NicheCard[] = [
  {
    slug: "septic",
    name: "Septic",
    vertical: "home-services",
    href: "/niches/septic",
    youHandleLine: "You handle the tanks. We handle the tech.",
    blurb: "Pumping, inspections, installs — booked from search and social.",
  },
  {
    slug: "hvac",
    name: "HVAC",
    vertical: "home-services",
    href: "/niches/hvac",
    youHandleLine: "You handle the units. We handle the tech.",
    blurb: "Seasonal demand, answered fast — repairs, replacements, maintenance plans.",
  },
  {
    slug: "roofing",
    name: "Roofing",
    vertical: "home-services",
    href: "/niches/roofing",
    youHandleLine: "You handle the roofs. We handle the tech.",
    blurb: "Storm response, replacements, and inspections that turn into signed jobs.",
  },
  {
    slug: "plumbing",
    name: "Plumbing",
    vertical: "home-services",
    href: "/niches/plumbing",
    youHandleLine: "You handle the pipes. We handle the tech.",
    blurb: "Emergency calls routed and answered — drain, water heater, repipe.",
  },
  {
    slug: "solar",
    name: "Solar",
    vertical: "home-services",
    href: "/niches/solar",
    youHandleLine: "You handle the panels. We handle the tech.",
    blurb: "Qualified homeowner consults, not tire-kickers.",
  },
  {
    slug: "electrical",
    name: "Electrical",
    vertical: "home-services",
    href: "/niches/electrical",
    youHandleLine: "You handle the wiring. We handle the tech.",
    blurb: "Panel upgrades, EV chargers, service calls — scheduled while you're on site.",
  },
  {
    slug: "personal-injury",
    name: "Personal injury law",
    vertical: "legal",
    href: "/legal/personal-injury",
    youHandleLine: "You handle the cases. We handle the tech.",
    blurb: "Intake that answers the first call, qualifies, and books the consult.",
  },
];

export const BENEFITS: OfferBlock[] = [
  {
    title: "Follow-up that runs while you work",
    body: "Missed-call text-back, SMS and web-chat auto-replies, and calendar booking — nights, weekends, while you're under a house. Leads get a reply in minutes, not the next morning, with a human on the thread the moment it needs one.",
    icon: "Bot",
  },
  {
    title: "Landing pages built to convert",
    body: "Fast, trade-specific pages that speak to the job the customer needs done and remove the reasons not to call. Not a brochure — a booking page.",
    icon: "LayoutTemplate",
  },
  {
    title: "Paid ads: Google, Meta, and GBP",
    body: "Search, Maps, and social run as one system with one goal: booked jobs at a cost that makes sense. Wasted spend gets cut, winners get budget.",
    icon: "Megaphone",
  },
  {
    title: "CRO and reporting you can read",
    body: "Every dollar tracked to a call, form, or booking. Plain-language reports and a standing consult on what to change next — full transparency, no vanity metrics.",
    icon: "BarChart3",
  },
  {
    title: "Lead management and automations",
    body: "Missed calls texted back. Estimates followed up. Reviews requested after the job. The system does the chasing so the office isn't the bottleneck.",
    icon: "Inbox",
  },
];

export const STEPS: Step[] = [
  {
    step: 1,
    title: "Book a free growth plan",
    body: "A short call about your market, your current lead flow, and what you're spending today. No pitch deck.",
  },
  {
    step: 2,
    title: "Get a tailored strategy",
    body: "A written plan for your trade and your territory — which channels, which offers, what to build first. Yours to keep either way.",
  },
  {
    step: 3,
    title: "We build and run it",
    body: "Ads, pages, tracking, and follow-up go live. No contracts, no commitments. Stay only while you like your growth.",
  },
];

export interface Tool {
  title: string;
  body: string;
  icon: string;
  bullets: string[];
}

export const TOOLS: Tool[] = [
  {
    title: "Automated lead responder",
    body: "Missed-call text-back, SMS and web-chat auto-replies, and calendar booking — replies go out in minutes, pre-screen for the jobs you actually want, and a human takes the thread the moment it needs one.",
    icon: "MessageSquare",
    bullets: [
      "Scripted around your trade's questions and objections",
      "Text, web chat, and email in one thread",
      "Hands off to a human the moment it should",
    ],
  },
  {
    title: "Conversion-first landing pages",
    body: "A layout that speaks to the job, shows the proof, and asks for the call — tuned to the way homeowners and injured clients actually decide.",
    icon: "LayoutTemplate",
    bullets: [
      "Loads fast on the phone in the driveway",
      "One page per service, one clear next step",
      "Every button and form tracked end to end",
    ],
  },
  {
    title: "Tracking and reporting",
    body: "Calls, forms, and bookings tied back to the ad that produced them, so budget moves toward what books jobs — not what gets clicks.",
    icon: "Gauge",
    bullets: [
      "Call tracking with recordings and outcomes",
      "Offline conversions fed back to Google and Meta",
      "A report you can read in the truck",
    ],
  },
];

export type ComparisonValue = "yes" | "no" | "partial";

export interface ComparisonRow {
  feature: string;
  homegrwn: ComparisonValue;
  homegrwnNote: string;
  agency: ComparisonValue;
  agencyNote: string;
}

export const COMPARISON: ComparisonRow[] = [
  {
    feature: "Automated follow-up",
    homegrwn: "yes",
    homegrwnNote: "Leads get a reply in minutes, not the next morning",
    agency: "no",
    agencyNote: "Leads land in your inbox; the chase is on you",
  },
  {
    feature: "Real-time insights",
    homegrwn: "yes",
    homegrwnNote: "Spend, calls, and bookings in one live view",
    agency: "partial",
    agencyNote: "A monthly PDF of clicks and impressions",
  },
  {
    feature: "Plans built for your trade",
    homegrwn: "yes",
    homegrwnNote: "Scoped to your services, season, and territory",
    agency: "no",
    agencyNote: "The same package as the dentist down the street",
  },
  {
    feature: "Who answers when you call",
    homegrwn: "yes",
    homegrwnNote: "The person running your account",
    agency: "partial",
    agencyNote: "An account manager relaying to someone else",
  },
  {
    feature: "Full-stack: ads, pages, tracking, follow-up",
    homegrwn: "yes",
    homegrwnNote: "One team owns the whole funnel",
    agency: "partial",
    agencyNote: "Ads only — the rest is 'your web guy'",
  },
  {
    feature: "Automations that book the job",
    homegrwn: "yes",
    homegrwnNote: "Missed-call text-back, estimate follow-up, review requests",
    agency: "no",
    agencyNote: "Not their department",
  },
  {
    feature: "Contracts",
    homegrwn: "no",
    homegrwnNote: "None. Month to month. Earn your trust through results.",
    agency: "yes",
    agencyNote: "Long lock-ins and setup fees",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Do I need to be tech-savvy to use your services?",
    a: "No. We build and run the whole stack — ads, pages, tracking, follow-up. What you get is a phone that rings with the right jobs, a calendar that fills, and a report written in plain English. If you can send a text, you can run this.",
  },
  {
    q: "How quickly can I see results?",
    a: "Honest answer: it depends on your market, your offer, and where your account starts. We don't quote timelines or numbers we can't back. What we commit to is having the real numbers in front of you from the first week ads are live, and to you staying only while they're worth it.",
  },
  {
    q: "Can these tools scale with my business?",
    a: "Yes. The same follow-up system works for one truck or a fleet, and for a solo attorney or a firm with an intake desk. Ad budgets step up as the numbers justify it, never before. Nothing here needs to be rebuilt when you grow.",
  },
  {
    q: "What happens after I book a strategy call?",
    a: "You'll get a short call where we look at your market, your current lead flow, and what you're spending today. After it you get a written growth plan for your trade and territory — whether or not you hire us. No pitch deck, no pressure.",
  },
  {
    q: "How does pricing work?",
    a: "You'll get a scoped number on the strategy call, based on what needs to be built and what you'll spend on ads. Ad spend always shows separately from our fee, and there are no long-term contracts — you stay month to month.",
  },
  {
    q: "Which trades do you work with?",
    a: "Home services — septic, HVAC, roofing, plumbing, solar, and electrical — and personal-injury law. If your trade isn't on that list, book anyway: we'll tell you straight whether it's a fit, and point you somewhere useful if it isn't.",
  },
];

export const BUDGET_OPTIONS = [
  { value: "none", label: "Not running ads yet" },
  { value: "under-2500", label: "Under $2,500 / month" },
  { value: "2500-5000", label: "$2,500 – $5,000 / month" },
  { value: "5000-15000", label: "$5,000 – $15,000 / month" },
  { value: "15000-plus", label: "$15,000+ / month" },
  { value: "unsure", label: "Not sure" },
] as const;

export type BudgetValue = (typeof BUDGET_OPTIONS)[number]["value"];

export const TRADE_OPTIONS = [
  ...NICHES.map((n) => ({ value: n.slug, label: n.name })),
  { value: "other", label: "Other" },
] as const;
