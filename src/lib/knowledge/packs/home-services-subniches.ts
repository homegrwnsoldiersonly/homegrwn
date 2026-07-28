/**
 * Trade sub-niche packs. HVAC and roofing share local-service fundamentals
 * but diverge hard on demand shape: HVAC is weather-cyclical with a bimodal
 * job-value split (service call vs. system install); roofing is storm-driven
 * with insurance-funded tickets and door-knocking competitors. Mostly data
 * overrides; code only where the failure mode is trade-specific.
 */

import type { Finding, NichePack } from "../types";
import { HOME_SERVICE_JUNK_SIGNALS } from "./home-services";

export const hvacPack: NichePack = {
  id: "hs-hvac",
  label: "Home services — HVAC",
  category: "local-service",
  description:
    "Weather-cyclical trade with a 50x job-value split between service calls and installs. Value tracking and seasonal pacing decide profitability.",
  extends: "home-services",
  benchmarks: [
    {
      metric: "cpc",
      unit: "currency",
      min: 8,
      typical: 22,
      max: 55,
      note: "Peak-season emergency terms ('ac not cooling') hit the top of the range.",
    },
    {
      metric: "cpl",
      unit: "currency",
      min: 30,
      typical: 90,
      max: 300,
      note: "In-season repair leads cheap; shoulder-season install leads expensive but worth 20x more.",
    },
    {
      metric: "cpa-signed",
      unit: "currency",
      min: 80,
      typical: 250,
      max: 900,
      note: "Blended. A $250 booked-job cost is terrible for a tune-up and phenomenal for a $12k install.",
    },
  ],
  conversionModel: {
    northStar: "Booked job, value-weighted (service call vs. system install)",
    valuePerOutcome: { min: 150, typical: 600, max: 15000 },
    leadToOutcomeRate: { min: 0.25, typical: 0.45, max: 0.65 },
    junkLeadSignals: [
      ...HOME_SERVICE_JUNK_SIGNALS,
      "filter",
      "thermostat manual",
      "how does a heat pump work",
      "btu calculator",
      "freon price",
      "window unit",
      "portable ac",
      "space heater",
    ],
    notes: [
      "The service-call/install value split is the whole game: both are 'a conversion' to the platform, one is worth 50x the other.",
      "Window-unit and portable-AC shoppers are retail traffic, not HVAC service demand.",
    ],
  },
  rules: [
    {
      id: "hvac.value-blind",
      title: "Conversions counted without job values",
      category: "tracking",
      evaluate: ({ snapshot }): Finding[] => {
        const converting = snapshot.campaigns.filter(
          (c) => c.enabled && c.conversions > 0,
        );
        if (converting.length === 0) return [];
        const valueBlind = converting.filter((c) => c.conversionValue === 0);
        if (valueBlind.length !== converting.length) return [];
        return [
          {
            ruleId: "hvac.value-blind",
            title: "Bidding can't tell a $150 tune-up from a $12k install",
            severity: "high",
            category: "tracking",
            confidence: 0.8,
            summary:
              "Every converting campaign reports zero conversion value. In a trade with a 50x job-value split, value-blind optimization steers budget toward whatever books cheapest — service calls.",
            evidence: valueBlind.map(
              (c) => `"${c.name}": ${c.conversions} conversions, $0 value.`,
            ),
            recommendation:
              "Import job values (from the field-service platform or booking system) and move install-intent campaigns to value-based bidding.",
            nicheRationale:
              "HVAC profit lives in installs and replacements. Value-blind bidding systematically underfunds the keywords that sell them.",
          },
        ];
      },
    },
  ],
  guardrails: [
    {
      id: "hvac.season-pacing",
      principle:
        "Budget follows the weather: hold impression share through heat waves and cold snaps, throttle the shoulder season.",
      rationale:
        "In-season emergency demand is the year's margin; a flat budget forfeits it to whoever paced correctly.",
    },
  ],
  redFlags: [
    "Install-intent keywords ('ac replacement cost', 'new hvac system') starved while cheap repair terms eat budget.",
    "No job-value data flowing back from the field-service platform.",
  ],
};

export const roofingPack: NichePack = {
  id: "hs-roofing",
  label: "Home services — Roofing",
  category: "local-service",
  description:
    "Storm-driven, insurance-funded, high-ticket trade. Surge readiness and homeowner-vs-shopper filtering decide the year.",
  extends: "home-services",
  benchmarks: [
    {
      metric: "cpc",
      unit: "currency",
      min: 10,
      typical: 30,
      max: 80,
      note: "Post-storm auctions spike violently as out-of-town operators flood in.",
    },
    {
      metric: "cpl",
      unit: "currency",
      min: 60,
      typical: 180,
      max: 450,
      note: "High vs. other trades — but the average ticket is $10k+, often insurance-funded.",
    },
    {
      metric: "cpa-signed",
      unit: "currency",
      min: 200,
      typical: 600,
      max: 1800,
      note: "Per signed contract. Excellent against $8-30k replacement tickets.",
    },
  ],
  conversionModel: {
    northStar: "Signed contract (replacement or major repair), value-weighted",
    valuePerOutcome: { min: 800, typical: 12000, max: 60000 },
    leadToOutcomeRate: { min: 0.15, typical: 0.3, max: 0.5 },
    junkLeadSignals: [
      ...HOME_SERVICE_JUNK_SIGNALS,
      "shingle colors",
      "shingles for sale",
      "metal roofing prices per sheet",
      "tarp",
      "roof coating",
      "flat roof sealant",
      "how to shingle",
      "roofing calculator",
    ],
    notes: [
      "Material shoppers and DIY patchers dominate generic roofing queries; contractor intent needs 'repair/replacement/inspection + urgency' signals.",
      "Storm surges compress the whole year into weeks — budget agility matters more than average efficiency.",
    ],
  },
  rules: [
    {
      id: "roof.surge-headroom",
      title: "No budget headroom for storm surge",
      category: "budget",
      evaluate: ({ snapshot, pack }): Finding[] => {
        // Detectable proxy for surge readiness: campaigns already spending
        // ~their full daily budget have zero headroom the day a storm hits.
        const search = snapshot.campaigns.filter(
          (c) => c.enabled && c.type === "search" && c.dailyBudget > 0,
        );
        if (search.length === 0) return [];
        const capped = search.filter(
          (c) => c.cost / snapshot.windowDays >= c.dailyBudget * 0.9,
        );
        if (capped.length === 0) return [];
        void pack;
        return [
          {
            ruleId: "roof.surge-headroom",
            title: "Campaigns running at budget cap — no storm-surge headroom",
            severity: "medium",
            category: "budget",
            confidence: 0.6,
            summary:
              "Roofing demand arrives in surges. Campaigns already spending ~100% of daily budget will be throttled by the budget cap during the exact hours post-storm demand (and competition) explodes.",
            evidence: capped.map(
              (c) =>
                `"${c.name}" avg daily spend ${Math.round(c.cost / snapshot.windowDays)} vs budget ${c.dailyBudget}.`,
            ),
            recommendation:
              "Pre-authorize a storm-response budget (2-4x daily caps, activation checklist) so surge demand isn't rationed by yesterday's budget setting.",
            nicheRationale:
              "The two weeks after a hail event can be half the year's revenue; the budget cap is the silent rationing mechanism that gives it to competitors.",
          },
        ];
      },
    },
  ],
  guardrails: [
    {
      id: "roof.storm-playbook",
      principle:
        "Maintain a pre-approved storm-response playbook: surge budgets, damage-inspection ad variants, and geo adjustments ready to activate within hours.",
      rationale:
        "Post-storm auctions are won by whoever was ready before the storm.",
    },
    {
      id: "roof.local-proof",
      principle:
        "Ads and landers must prove local permanence (address, local reviews, license #) — homeowners are primed to fear storm-chasing out-of-towners.",
      rationale:
        "Local trust signals are the conversion lever the out-of-town surge competitors can't copy.",
    },
  ],
  redFlags: [
    "Budget caps still at normal levels a day after a major hail event.",
    "Rising spend on material-shopper queries (shingle prices, colors) — retail traffic, not contracts.",
  ],
};
