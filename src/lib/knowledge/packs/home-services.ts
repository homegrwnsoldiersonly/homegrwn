/**
 * Home / local-services pack (plumbing, HVAC, electrical, roofing, etc.).
 *
 * The economics are the inverse of PI: cheaper clicks, smaller budgets,
 * call-dominant intent, and a hard dependency on Local Services Ads (LSA) plus
 * a profitable drive radius. The generalist failure here is treating it like
 * any other lead-gen account and ignoring LSA, service-area geometry, and job
 * value.
 */

import type { NichePack, Finding } from "../types";
import {
  allSearchTerms,
  campaignsOfType,
  money,
  searchCampaigns,
  sumCost,
  termsMatching,
} from "../helpers";

const HOME_SERVICE_JUNK_SIGNALS = [
  "diy",
  "how to",
  "jobs",
  "job",
  "salary",
  "hiring",
  "parts",
  "manual",
  "warranty",
  "free",
  "used",
  "rental",
  "training",
  "certification",
  "wholesale",
];

export const homeServicesPack: NichePack = {
  id: "home-services",
  label: "Home & local services",
  category: "local-service",
  description:
    "Encoded judgment for call-driven local trades where LSA allocation, service-area geometry, seasonality, and job value govern ROI.",
  extends: "base",
  benchmarks: [
    {
      metric: "cpc",
      unit: "currency",
      min: 4,
      typical: 15,
      max: 45,
      note: "Emergency and roofing skew higher; routine maintenance lower.",
    },
    {
      metric: "cpl",
      unit: "currency",
      min: 20,
      typical: 75,
      max: 250,
      note: "Search cost per lead. LSA leads are often cheaper and pre-qualified.",
    },
    {
      metric: "cpa-signed",
      unit: "currency",
      min: 60,
      typical: 200,
      max: 600,
      note: "Cost per booked job. Full-system installs justify far higher than a service call.",
    },
    {
      metric: "landing-conv-rate",
      unit: "rate",
      min: 0.08,
      typical: 0.13,
      max: 0.2,
      note: "Call-focused local intent converts well when click-to-call is prominent.",
    },
    {
      metric: "monthly-budget-floor",
      unit: "currency",
      min: 1000,
      typical: 2500,
      max: 5000,
      note: "Per service area. Enough to hold impression share in a single trade + metro.",
    },
  ],
  conversionModel: {
    northStar: "Booked job (dispatched and completed), weighted by job value",
    valuePerOutcome: { min: 150, typical: 800, max: 12000 },
    leadToOutcomeRate: { min: 0.2, typical: 0.4, max: 0.6 },
    junkLeadSignals: HOME_SERVICE_JUNK_SIGNALS,
    notes: [
      "A service call and a full HVAC install are both 'a lead' to the platform but differ 50x in value — import job value.",
      "LSA leads bill per lead and are Google-Guaranteed; treat them as a distinct, usually cheaper, channel.",
      "Calls dominate; without call tracking the account is effectively flying blind.",
    ],
  },
  rules: [
    {
      id: "hs.missing-lsa",
      title: "Running Search without Local Services Ads",
      category: "channel-mix",
      evaluate: ({ snapshot }): Finding[] => {
        const search = searchCampaigns(snapshot);
        const lsa = campaignsOfType(snapshot, "local-services");
        if (search.length === 0) return [];
        if (lsa.length > 0) return [];
        return [
          {
            ruleId: "hs.missing-lsa",
            title: "No Local Services Ads presence",
            severity: "high",
            category: "channel-mix",
            confidence: 0.8,
            summary:
              "Spending on Search but not running LSA leaves the cheapest, highest-intent, Google-Guaranteed lead source on the table — and cedes the top-of-page LSA block to competitors.",
            evidence: [
              `${search.length} Search campaign(s), 0 LSA campaigns.`,
            ],
            recommendation:
              "Pursue Google Guaranteed / LSA eligibility for the trade and stand up LSA before scaling Search further. Reallocate a test budget to compare cost-per-booked-job across channels.",
            nicheRationale:
              "For most local trades LSA delivers a lower cost-per-booked-job than Search and sits above it on the page. A generalist agent that only knows Search never surfaces this.",
          },
        ];
      },
    },
    {
      id: "hs.no-call-tracking",
      title: "Call-driven account without call conversions",
      category: "tracking",
      evaluate: ({ snapshot }): Finding[] => {
        const hasCall = snapshot.conversionActions.some((a) =>
          a.category.includes("call"),
        );
        if (hasCall) return [];
        return [
          {
            ruleId: "hs.no-call-tracking",
            title: "No call conversion tracking",
            severity: "high",
            category: "tracking",
            confidence: 0.85,
            summary:
              "Local-service demand is phone-first. With no call tracking, most real conversions are invisible and bidding optimizes against a fraction of the truth.",
            evidence: [
              `Conversion actions: ${snapshot.conversionActions.map((a) => a.category).join(", ") || "none"}.`,
            ],
            recommendation:
              "Add call-from-ads and website-call tracking with a minimum duration threshold (e.g. 60s), then include calls as primary conversions.",
            nicheRationale:
              "Without calls counted, Smart Bidding starves the exact keywords that drive the phone to ring.",
          },
        ];
      },
    },
    {
      id: "hs.short-call-counting",
      title: "Counting sub-threshold calls as conversions",
      category: "conversion-integrity",
      evaluate: ({ snapshot }): Finding[] => {
        const offenders = snapshot.conversionActions.filter(
          (a) =>
            a.category.includes("call") &&
            (a.callDurationThresholdSec === undefined ||
              a.callDurationThresholdSec < 30),
        );
        if (offenders.length === 0) return [];
        return [
          {
            ruleId: "hs.short-call-counting",
            title: "Call conversions have no meaningful duration threshold",
            severity: "medium",
            category: "conversion-integrity",
            confidence: 0.75,
            summary:
              "Wrong numbers, hang-ups, and 5-second misdials get counted as conversions, inflating volume and misleading bidding.",
            evidence: offenders.map(
              (a) =>
                `"${a.name}" threshold: ${a.callDurationThresholdSec ?? "none"}s.`,
            ),
            recommendation:
              "Set a 60–90s minimum call duration before a call counts as a conversion.",
            nicheRationale:
              "A real booking conversation is rarely under a minute; the threshold cheaply filters noise out of the bidding signal.",
          },
        ];
      },
    },
    {
      id: "hs.service-radius",
      title: "Service-area geometry too wide or national",
      category: "targeting",
      evaluate: ({ snapshot }): Finding[] => {
        const findings: Finding[] = [];
        for (const c of snapshot.campaigns) {
          if (!c.enabled) continue;
          if (c.geo.national) {
            findings.push({
              ruleId: "hs.service-radius",
              title: `"${c.name}" targets nationally for a local trade`,
              severity: "high",
              category: "targeting",
              confidence: 0.85,
              summary:
                "A dispatch-based trade paying for national reach is buying clicks it can never service.",
              evidence: ["Campaign geo flagged national."],
              recommendation:
                "Target the profitable drive-time radius around each service location; drop everything beyond it.",
              nicheRationale:
                "Beyond the profitable drive radius, even a booked job loses money on windshield time.",
            });
            continue;
          }
          const widest = Math.max(0, ...(c.geo.radiiMiles ?? [0]));
          if (widest > 40) {
            findings.push({
              ruleId: "hs.service-radius",
              title: `"${c.name}" radius is ${widest} miles`,
              severity: "medium",
              category: "targeting",
              confidence: 0.6,
              summary:
                "A radius beyond ~40 miles usually includes jobs that aren't profitable once drive time is priced in.",
              evidence: [`Radius target: ${widest} miles.`],
              recommendation:
                "Tighten to the profitable drive-time radius, or bid down the outer ring.",
              nicheRationale:
                "Profit per job, not lead count, defines the right service area for a trade.",
            });
          }
        }
        return findings;
      },
    },
    {
      id: "hs.junk-terms",
      title: "Spend on DIY / research / job-seeker searches",
      category: "wasted-spend",
      evaluate: ({ snapshot }): Finding[] => {
        const terms = allSearchTerms(snapshot);
        if (terms.length === 0) return [];
        const junk = termsMatching(terms, HOME_SERVICE_JUNK_SIGNALS);
        const junkCost = sumCost(junk);
        if (junk.length === 0 || junkCost <= 0) return [];
        const monthlyWaste = junkCost * (30 / snapshot.windowDays);
        const examples = [...junk]
          .sort((a, b) => b.cost - a.cost)
          .slice(0, 6)
          .map((t) => `"${t.text}" — ${money(t.cost, snapshot.currency)}`);
        return [
          {
            ruleId: "hs.junk-terms",
            title: "Budget leaking to non-buyer searches",
            severity: monthlyWaste > 400 ? "high" : "medium",
            category: "wasted-spend",
            confidence: 0.8,
            summary:
              "DIY guides, parts lookups, job-seekers, and warranty checks are matching paid ads but never book a job.",
            evidence: [
              `${junk.length} junk terms costing ${money(junkCost, snapshot.currency)} in ${snapshot.windowDays} days (~${money(monthlyWaste, snapshot.currency)}/mo).`,
              ...examples,
            ],
            recommendation:
              "Add the local-services negative baseline (DIY, how-to, parts, jobs/salary, warranty, used/rental) and tighten match types.",
            nicheRationale:
              "Small budgets can't absorb research traffic; every non-buyer click is a booked job the budget didn't fund.",
            estimatedMonthlyWaste: Math.round(monthlyWaste),
          },
        ];
      },
    },
    {
      id: "hs.seasonality-flat-budget",
      title: "Flat budgets against seasonal demand",
      category: "budget",
      evaluate: ({ snapshot }): Finding[] => {
        const sub = snapshot.context?.subNiche?.toLowerCase() ?? "";
        const seasonal = ["hvac", "roofing", "heating", "cooling", "ac"].some(
          (s) => sub.includes(s),
        );
        if (!seasonal) return [];
        return [
          {
            ruleId: "hs.seasonality-flat-budget",
            title: "Seasonal trade should pace budget to demand",
            severity: "low",
            category: "budget",
            confidence: 0.5,
            summary:
              "Trades like HVAC and roofing see demand spike with weather. Flat monthly budgets underspend in-season and overspend in the trough.",
            evidence: [`Sub-niche: "${snapshot.context?.subNiche}".`],
            recommendation:
              "Build a seasonal budget curve (and storm-response playbook for roofing) so spend follows demand and impression share holds during peaks.",
            nicheRationale:
              "In-season impression share is where the year's margin is made; a flat budget forfeits it.",
          },
        ];
      },
    },
  ],
  guardrails: [
    {
      id: "hs.lsa-first",
      principle:
        "Evaluate LSA before scaling Search for any LSA-eligible trade.",
      rationale: "LSA is usually the lowest cost-per-booked-job channel and sits above Search.",
    },
    {
      id: "hs.calls-primary",
      principle:
        "Treat tracked, duration-qualified calls as primary conversions.",
      rationale: "Local-service intent is phone-first; untracked calls blind the bidder.",
    },
    {
      id: "hs.profitable-radius",
      principle:
        "Constrain targeting to the profitable drive-time radius per location.",
      rationale: "Drive time is a real cost that lead-count optimization ignores.",
    },
  ],
  redFlags: [
    "Lots of Search spend and zero LSA in an LSA-eligible trade.",
    "Conversions counted but nobody can tell a service call from an install in the data.",
    "One flat budget for a weather-driven trade.",
  ],
};
