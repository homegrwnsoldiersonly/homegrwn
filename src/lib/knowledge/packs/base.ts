/**
 * Base pack: universal principles that keep the agent from regressing to the
 * mean. Every niche pack inherits from this. The rules here are vertical-
 * agnostic — they encode "don't trust proxy metrics you haven't verified" and
 * "don't act on noise."
 */

import type { NichePack, Finding } from "../types";
import { money, pct } from "../helpers";

export const basePack: NichePack = {
  id: "base",
  label: "Universal fundamentals",
  category: "base",
  description:
    "Vertical-agnostic guardrails against optimizing to platform-visible proxy metrics divorced from business value.",
  benchmarks: [],
  rules: [
    {
      id: "base.conversion-integrity",
      title: "Bidding on unverified conversions",
      category: "conversion-integrity",
      evaluate: ({ snapshot }): Finding[] => {
        const primary = snapshot.conversionActions.filter(
          (a) => a.primaryForBidding,
        );
        if (primary.length === 0) return [];
        const unverified = primary.filter((a) => !a.verifiedValue);
        if (unverified.length === 0) return [];

        const usesAutoBidding = snapshot.campaigns.some(
          (c) =>
            c.enabled &&
            (c.bidStrategy === "maximize-conversions" ||
              c.bidStrategy === "maximize-conversion-value" ||
              c.bidStrategy === "target-cpa" ||
              c.bidStrategy === "target-roas"),
        );
        if (!usesAutoBidding) return [];

        return [
          {
            ruleId: "base.conversion-integrity",
            title: "Automated bidding is steering toward unverified conversions",
            severity: "high",
            category: "conversion-integrity",
            confidence: 0.8,
            summary:
              "Primary conversion actions feeding the bid strategy are not verified business outcomes. Smart Bidding will optimize toward whatever it can count — which may be low-quality leads.",
            evidence: unverified.map(
              (a) =>
                `Primary action "${a.name}" (${a.category}, counts "${a.counting}") is not marked as a verified outcome.`,
            ),
            recommendation:
              "Import verified/offline outcomes (closed deals, signed cases, booked jobs) and set those as the primary conversion for bidding. Demote raw form-fills to secondary/observe.",
            nicheRationale:
              "Smart Bidding is only as good as the outcome it chases. Garbage in, garbage out — this is the single most common way generalist automation regresses to the mean.",
          },
        ];
      },
    },
    {
      id: "base.counting-every-on-leadgen",
      title: "Lead-gen action counting every conversion",
      category: "conversion-integrity",
      evaluate: ({ snapshot }): Finding[] => {
        const offenders = snapshot.conversionActions.filter(
          (a) =>
            a.counting === "every" &&
            (a.category.includes("form") || a.category.includes("call")),
        );
        if (offenders.length === 0) return [];
        return [
          {
            ruleId: "base.counting-every-on-leadgen",
            title: 'Lead actions set to count "every" conversion',
            severity: "medium",
            category: "conversion-integrity",
            confidence: 0.9,
            summary:
              'For lead generation, a single person submitting twice or calling twice is one lead, not two. Counting "every" inflates conversion volume and distorts bidding.',
            evidence: offenders.map(
              (a) => `"${a.name}" (${a.category}) is set to count "every".`,
            ),
            recommendation:
              'Switch lead-gen conversion actions to count "one" so a repeat contact is not double-counted.',
            nicheRationale:
              "Inflated counts make CPA look better than it is and push Smart Bidding to overspend on repeat-contact clusters.",
          },
        ];
      },
    },
    {
      id: "base.no-brand-separation",
      title: "Brand and non-brand not separated",
      category: "structure",
      evaluate: ({ snapshot }): Finding[] => {
        const enabledSearch = snapshot.campaigns.filter(
          (c) => c.enabled && c.type === "search",
        );
        if (enabledSearch.length === 0) return [];
        const hasBrand = enabledSearch.some((c) => c.isBrandCampaign);
        if (hasBrand) return [];
        return [
          {
            ruleId: "base.no-brand-separation",
            title: "No dedicated brand campaign detected",
            severity: "low",
            category: "structure",
            confidence: 0.55,
            summary:
              "Brand traffic mixed into non-brand campaigns flatters CPA and hides the true cost of acquiring new prospects.",
            evidence: [
              `${enabledSearch.length} enabled Search campaign(s), none flagged as brand.`,
            ],
            recommendation:
              "Separate brand terms into their own campaign so non-brand performance is measured honestly (and to defend the brand cheaply).",
            nicheRationale:
              "Clean brand/non-brand separation is the prerequisite for every downstream decision the agent makes — without it, all CPA math is contaminated.",
          },
        ];
      },
    },
    {
      id: "base.broad-match-share",
      title: "Broad match dominating spend without verified-outcome feedback",
      category: "wasted-spend",
      evaluate: ({ snapshot }): Finding[] => {
        const keywords = snapshot.campaigns
          .filter((c) => c.enabled)
          .flatMap((c) => c.keywords);
        const totalKwCost = keywords.reduce((a, k) => a + k.cost, 0);
        if (totalKwCost <= 0) return [];
        const broadCost = keywords
          .filter((k) => k.matchType === "broad")
          .reduce((a, k) => a + k.cost, 0);
        const share = broadCost / totalKwCost;
        if (share < 0.5) return [];

        const hasVerifiedFeedback = snapshot.conversionActions.some(
          (a) => a.primaryForBidding && a.verifiedValue,
        );
        if (hasVerifiedFeedback) return []; // broad + real outcome data is a valid strategy

        return [
          {
            ruleId: "base.broad-match-share",
            title: `Broad match is ${Math.round(share * 100)}% of keyword spend`,
            severity: share > 0.75 ? "high" : "medium",
            category: "wasted-spend",
            confidence: 0.7,
            summary:
              "Broad match hands query selection to Google. That's only safe when verified business outcomes feed the bid strategy — otherwise Google expands toward whatever converts cheapest, not what pays.",
            evidence: [
              `Broad-match keywords: ${money(broadCost)} of ${money(totalKwCost)} keyword spend.`,
              "No primary conversion action is a verified outcome.",
            ],
            recommendation:
              "Tighten core terms to phrase/exact, or wire verified-outcome import first and only then let broad match run against real value data.",
            nicheRationale:
              "Broad-match-plus-Smart-Bidding is the platform's default push — and the fastest route to regressing to the mean when the feedback loop is raw leads.",
          },
        ];
      },
    },
    {
      id: "base.thin-data-autobidding",
      title: "Smart Bidding on thin conversion data",
      category: "bidding",
      evaluate: ({ snapshot }): Finding[] => {
        const findings: Finding[] = [];
        for (const c of snapshot.campaigns) {
          if (!c.enabled) continue;
          const auto =
            c.bidStrategy === "target-cpa" ||
            c.bidStrategy === "target-roas" ||
            c.bidStrategy === "maximize-conversion-value";
          if (!auto) continue;
          // Rough monthly-normalized conversion count.
          const monthly = c.conversions * (30 / snapshot.windowDays);
          if (monthly < 15) {
            findings.push({
              ruleId: "base.thin-data-autobidding",
              title: `"${c.name}" runs value/target bidding on thin data`,
              severity: "medium",
              category: "bidding",
              confidence: 0.65,
              summary:
                "Target/value strategies need a meaningful conversion volume to learn. Below ~15/month they chase noise and swing wildly.",
              evidence: [
                `~${Math.round(monthly)} conversions/month on strategy "${c.bidStrategy}".`,
              ],
              recommendation:
                "Consolidate conversion volume, or fall back to Maximize Conversions / Manual CPC until the campaign clears ~15–30 conversions/month, then layer targets.",
              nicheRationale:
                "Acting on statistically insignificant samples is how automation manufactures volatility and calls it optimization.",
            });
          }
        }
        return findings;
      },
    },
  ],
  guardrails: [
    {
      id: "base.value-over-proxy",
      principle:
        "Never optimize toward a platform-visible proxy metric that has not been tied to a verified business outcome.",
      rationale:
        "Proxy metrics are tuned for the median advertiser; chasing them is what makes generalist tools regress to the mean.",
    },
    {
      id: "base.significance",
      principle:
        "Do not recommend spend-moving changes off statistically insignificant samples.",
      rationale: "Small-sample noise masquerades as signal.",
    },
    {
      id: "base.human-approval",
      principle:
        "In recommend-only mode, every change is proposed for human approval and never auto-applied.",
      rationale: "Trust is earned before write access is granted.",
    },
    {
      id: "base.negative-hygiene",
      principle:
        "Maintain continuous negative-keyword hygiene; broad reach without exclusions is never acceptable.",
      rationale: "Uncontrolled match types are the largest source of waste.",
    },
  ],
  redFlags: [
    "Conversion volume is up but the business reports no more real customers — classic proxy-metric inflation.",
    "Smart Bidding was switched on before verified outcomes were imported.",
  ],
};

// Re-export a couple of helpers so pack authors have them locally typed.
export { money, pct };
