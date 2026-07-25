/**
 * Personal-injury law pack.
 *
 * PI is the sharpest illustration of the whole thesis: clicks are $50–$400,
 * a form-fill is nearly worthless, and a signed case is worth $10k–$1M+ to the
 * firm. The platform can see the form-fill; it cannot see whether the case was
 * signed, in-jurisdiction, non-referral, and the right practice area. That gap
 * is the entire game, and it's why a generalist agent that optimizes to raw
 * conversions actively destroys value here.
 */

import type { NichePack, Finding } from "../types";
import {
  allSearchTerms,
  campaignsOfType,
  money,
  pct,
  sumCost,
  termsMatching,
} from "../helpers";

/** Terms that signal the wrong practice area or a worthless click in PI. */
const PI_JUNK_SIGNALS = [
  "free",
  "pro bono",
  "salary",
  "jobs",
  "job",
  "become a",
  "how to",
  "law school",
  "attorney general",
  "public defender",
  // wrong practice areas frequently caught by broad match / PMax
  "divorce",
  "custody",
  "criminal",
  "dui",
  "immigration",
  "bankruptcy",
  "traffic ticket",
  "will and testament",
  "real estate",
];

export const personalInjuryPack: NichePack = {
  id: "legal-personal-injury",
  label: "Personal-injury law",
  category: "legal",
  description:
    "Encoded judgment for high-CPC, high-case-value PI advertising where signed-case economics — not form-fill volume — govern every decision.",
  extends: "base",
  benchmarks: [
    {
      metric: "cpc",
      unit: "currency",
      min: 40,
      typical: 150,
      max: 400,
      note: "Highly sub-niche dependent: car-accident lower, truck/mass-tort/mesothelioma far higher.",
    },
    {
      metric: "cpl",
      unit: "currency",
      min: 200,
      typical: 700,
      max: 2000,
      note: "Cost per raw lead (form or call). Wide range by market and sub-niche.",
    },
    {
      metric: "cpa-signed",
      unit: "currency",
      min: 2000,
      typical: 6000,
      max: 20000,
      note: "Cost per SIGNED case — the metric that actually matters.",
    },
    {
      metric: "lead-to-signed-rate",
      unit: "rate",
      min: 0.03,
      typical: 0.1,
      max: 0.25,
      note: "Fraction of paid leads that become signed cases after intake.",
    },
    {
      metric: "monthly-budget-floor",
      unit: "currency",
      min: 5000,
      typical: 10000,
      max: 15000,
      note: "Below this, a firm generally cannot win enough auctions in a competitive metro to sign cases predictably.",
    },
  ],
  conversionModel: {
    northStar: "Signed case (retainer executed, in-jurisdiction, correct practice area)",
    valuePerOutcome: { min: 3000, typical: 15000, max: 100000 },
    leadToOutcomeRate: { min: 0.03, typical: 0.1, max: 0.25 },
    junkLeadSignals: PI_JUNK_SIGNALS,
    notes: [
      "A form-fill is a lead, not an outcome. Optimize to signed cases via offline conversion import.",
      "Referral-out cases and existing clients should not count as new acquisition.",
      "Out-of-jurisdiction and wrong-practice-area leads are pure waste even when the platform counts them as conversions.",
    ],
  },
  rules: [
    {
      id: "pi.junk-search-terms",
      title: "Spend on wrong-practice-area / junk search terms",
      category: "wasted-spend",
      evaluate: ({ snapshot }): Finding[] => {
        const terms = allSearchTerms(snapshot);
        if (terms.length === 0) return [];
        const junk = termsMatching(terms, PI_JUNK_SIGNALS);
        const junkCost = sumCost(junk);
        if (junk.length === 0 || junkCost <= 0) return [];
        const monthlyWaste = junkCost * (30 / snapshot.windowDays);
        const examples = [...junk]
          .sort((a, b) => b.cost - a.cost)
          .slice(0, 6)
          .map((t) => `"${t.text}" — ${money(t.cost, snapshot.currency)}`);
        return [
          {
            ruleId: "pi.junk-search-terms",
            title: "Budget leaking to non-PI and junk searches",
            severity: monthlyWaste > 1000 ? "critical" : "high",
            category: "wasted-spend",
            confidence: 0.85,
            summary:
              "Broad/phrase match (or PMax) is matching queries that are the wrong practice area, job-seekers, or 'free lawyer' intent — none of which sign cases.",
            evidence: [
              `${junk.length} matched junk terms costing ${money(junkCost, snapshot.currency)} in ${snapshot.windowDays} days (~${money(monthlyWaste, snapshot.currency)}/mo).`,
              ...examples,
            ],
            recommendation:
              "Add these as campaign/account negatives and deploy the PI negative-keyword baseline (wrong practice areas, jobs/salary, DIY, pro-bono/free, competitor brand where not desired).",
            nicheRationale:
              "In PI, one wrong-practice-area click can cost $150+. A generalist tool sees a cheap 'conversion' and doubles down; the encoded rule sees a divorce lead in a car-accident campaign and cuts it.",
            estimatedMonthlyWaste: Math.round(monthlyWaste),
          },
        ];
      },
    },
    {
      id: "pi.pmax-in-legal",
      title: "Performance Max over-reliance in legal",
      category: "channel-mix",
      evaluate: ({ snapshot }): Finding[] => {
        const pmax = campaignsOfType(snapshot, "performance-max");
        if (pmax.length === 0) return [];
        const pmaxSpend = pmax.reduce((a, c) => a + c.cost, 0);
        const totalSpend = snapshot.campaigns.reduce((a, c) => a + c.cost, 0);
        if (totalSpend <= 0) return [];
        const share = pmaxSpend / totalSpend;
        if (share < 0.15) return [];
        return [
          {
            ruleId: "pi.pmax-in-legal",
            title: `Performance Max is ${pct(share)} of spend`,
            severity: share > 0.4 ? "high" : "medium",
            category: "channel-mix",
            confidence: 0.7,
            summary:
              "PMax in legal tends to (a) cannibalize brand, (b) buy cheap junk Display/Search-partner placements, and (c) hide the search terms that reveal wasted spend — exactly the visibility a high-CPC vertical needs.",
            evidence: [
              `PMax spend ${money(pmaxSpend, snapshot.currency)} of ${money(totalSpend, snapshot.currency)} total (${pct(share)}).`,
            ],
            recommendation:
              "Add brand as an account-level PMax exclusion, add junk/wrong-practice-area negatives, and shift budget toward controllable Search for core PI intent. Keep PMax minority and instrumented.",
            nicheRationale:
              "PMax optimizes to conversions it can see. Without signed-case feedback and tight exclusions, it will happily buy the cheapest, worst PI leads in the account.",
          },
        ];
      },
    },
    {
      id: "pi.signed-case-tracking",
      title: "No signed-case (offline) conversion tracking",
      category: "tracking",
      evaluate: ({ snapshot }): Finding[] => {
        const hasOffline = snapshot.conversionActions.some(
          (a) => a.category.includes("offline") || a.verifiedValue,
        );
        if (hasOffline) return [];
        return [
          {
            ruleId: "pi.signed-case-tracking",
            title: "Optimizing to leads, blind to signed cases",
            severity: "critical",
            category: "tracking",
            confidence: 0.9,
            summary:
              "No verified/offline outcome is imported, so every automated decision is made on form-fills and calls — not on which campaigns actually produce signed cases.",
            evidence: [
              `Conversion actions: ${snapshot.conversionActions.map((a) => a.name).join(", ") || "none"}.`,
            ],
            recommendation:
              "Wire offline conversion import (or an intake/CRM webhook) so 'Signed Case' with its estimated fee value flows back to Google Ads, then bid to value.",
            nicheRationale:
              "This is the whole ballgame in PI. A campaign can produce 40 cheap leads and zero signed cases while another produces 8 leads and 3 signings. Without offline import, the agent — and Google — reward the wrong one.",
          },
        ];
      },
    },
    {
      id: "pi.jurisdiction-targeting",
      title: "Targeting beyond served jurisdictions",
      category: "targeting",
      evaluate: ({ snapshot }): Finding[] => {
        const findings: Finding[] = [];
        for (const c of snapshot.campaigns) {
          if (!c.enabled) continue;
          if (c.geo.national) {
            findings.push({
              ruleId: "pi.jurisdiction-targeting",
              title: `"${c.name}" targets nationally`,
              severity: "high",
              category: "targeting",
              confidence: 0.75,
              summary:
                "National targeting in PI pays for clicks the firm can't ethically or practically serve, unless this is a documented mass-tort intake funnel with co-counsel.",
              evidence: [`Campaign geo flagged national.`],
              recommendation:
                "Constrain to licensed jurisdictions / viable metros, or confirm a mass-tort co-counsel arrangement that justifies national intake.",
              nicheRationale:
                "Leads outside the firm's jurisdiction get referred out at best and are pure waste at worst — but Google still counts the form-fill as a win.",
            });
          }
        }
        // NOTE: a finer "targets a metro outside the served jurisdiction" check
        // needs a real geo hierarchy (Dallas ⊂ Texas ⊂ USA). String matching
        // false-positives on city-within-state, and a false jurisdiction alarm
        // erodes trust in a recommend-only tool. Deferred until we ingest the
        // Google Ads geo-target dataset.
        return findings;
      },
    },
    {
      id: "pi.budget-floor",
      title: "Below competitive budget floor",
      category: "budget",
      evaluate: ({ snapshot, pack }): Finding[] => {
        const floor = pack.benchmarks.find(
          (b) => b.metric === "monthly-budget-floor",
        );
        if (!floor) return [];
        if (snapshot.monthlySpend >= floor.min) return [];
        return [
          {
            ruleId: "pi.budget-floor",
            title: "Budget likely below the competitive floor",
            severity: "medium",
            category: "budget",
            confidence: 0.6,
            summary:
              "PI auctions are expensive and lumpy. Too little budget means impressions are spread across too many keywords/geos to ever accumulate signed cases.",
            evidence: [
              `Monthly spend ${money(snapshot.monthlySpend, snapshot.currency)} vs. floor ${money(floor.min, snapshot.currency)}.`,
            ],
            recommendation:
              "Either concentrate budget on the single highest-value sub-niche and tightest geo to clear the auction, or advise the client that current spend can't support predictable PI acquisition.",
            nicheRationale:
              "Spreading a sub-floor budget thin is how firms conclude 'Google Ads doesn't work' — when the real problem is sub-scale allocation.",
          },
        ];
      },
    },
    {
      id: "pi.intake-hours",
      title: "Ads running while intake is unstaffed",
      category: "structure",
      evaluate: ({ snapshot }): Finding[] => {
        const offenders = snapshot.campaigns.filter(
          (c) => c.enabled && c.schedule?.runsWhenIntakeClosed,
        );
        if (offenders.length === 0) return [];
        return [
          {
            ruleId: "pi.intake-hours",
            title: "Paid clicks arriving when no one can answer",
            severity: "high",
            category: "structure",
            confidence: 0.7,
            summary:
              "PI leads sign with whoever answers first. Running ads with no live intake or answering service torches the most expensive clicks in the account.",
            evidence: offenders.map(
              (c) => `"${c.name}" runs outside staffed intake hours.`,
            ),
            recommendation:
              "Add 24/7 answering-service coverage, or restrict ad schedule to staffed hours. Speed-to-lead is the highest-leverage lever in PI intake.",
            nicheRationale:
              "A $200 click that rings out is worse than not bidding at all — the competitor who answers signs that case.",
          },
        ];
      },
    },
  ],
  guardrails: [
    {
      id: "pi.optimize-to-signed",
      principle:
        "Optimize to signed-case value, never to raw lead volume. If offline outcomes aren't wired, fixing that comes before any bid-strategy change.",
      rationale:
        "Lead volume and signed-case yield diverge sharply in PI; the platform only sees the former.",
    },
    {
      id: "pi.negative-baseline",
      principle:
        "Maintain the PI negative-keyword baseline (wrong practice areas, jobs/salary, DIY, pro-bono/free) at all times.",
      rationale: "High CPCs make every off-intent click disproportionately costly.",
    },
    {
      id: "pi.jurisdiction",
      principle:
        "Only target jurisdictions the firm is licensed and able to serve, unless an explicit mass-tort co-counsel funnel is documented.",
      rationale: "Out-of-jurisdiction leads cannot become signed cases.",
    },
    {
      id: "pi.speed-to-lead",
      principle:
        "Never scale spend into hours or channels where intake cannot respond within minutes.",
      rationale: "First-to-contact wins the case; unanswered clicks are total loss.",
    },
  ],
  redFlags: [
    "Lead count climbing while signed cases stay flat — the account is buying volume, not cases.",
    "PMax or broad match added without a wrong-practice-area negative baseline.",
    "Cost-per-lead looks great but no one can say the cost-per-signed-case.",
    "National or state-wide targeting for a single-office firm with no co-counsel network.",
  ],
};
