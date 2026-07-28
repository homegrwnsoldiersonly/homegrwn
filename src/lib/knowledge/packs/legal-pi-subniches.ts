/**
 * PI sub-niche packs. Car accident, truck accident, and mass tort share PI
 * fundamentals but have genuinely different economics — CPCs, case values,
 * signing rates, viable budgets, and even whether national targeting is a
 * mistake. Each pack extends `legal-personal-injury` and overrides mostly
 * DATA: benchmarks (which inherited rules like pi.budget-floor read),
 * conversion models (whose junkLeadSignals feed pi.junk-search-terms), and
 * red flags. Code only appears where a sub-niche needs a genuinely different
 * check.
 */

import type { NichePack } from "../types";
import { PI_JUNK_SIGNALS } from "./legal-personal-injury";

/**
 * Car accident: the highest-volume, most commoditized PI sub-niche. Lead
 * aggregators and mass-advertisers compress margins; discipline and speed
 * decide who profits.
 */
export const piCarAccidentPack: NichePack = {
  id: "legal-pi-car-accident",
  label: "PI — Car accident",
  category: "legal",
  description:
    "High-volume, commoditized PI. Aggressive negative discipline and intake speed matter more than clever targeting.",
  extends: "legal-personal-injury",
  benchmarks: [
    {
      metric: "cpc",
      unit: "currency",
      min: 40,
      typical: 120,
      max: 250,
      note: "Below the PI-wide top end — volume exists, but so do aggregators bidding on everything.",
    },
    {
      metric: "cpl",
      unit: "currency",
      min: 150,
      typical: 450,
      max: 900,
      note: "Volume keeps CPL below rarer sub-niches; quality varies wildly.",
    },
    {
      metric: "cpa-signed",
      unit: "currency",
      min: 1500,
      typical: 4000,
      max: 9000,
      note: "Car-accident cases sign cheaper but are worth less than truck/commercial.",
    },
    {
      metric: "lead-to-signed-rate",
      unit: "rate",
      min: 0.05,
      typical: 0.12,
      max: 0.3,
      note: "Higher than PI-wide: intent is usually genuine, but minor-impact and at-fault callers dilute it.",
    },
  ],
  conversionModel: {
    northStar:
      "Signed case (retainer executed, injury + clear liability, in-jurisdiction)",
    valuePerOutcome: { min: 3000, typical: 9000, max: 50000 },
    leadToOutcomeRate: { min: 0.05, typical: 0.12, max: 0.3 },
    junkLeadSignals: [
      ...PI_JUNK_SIGNALS,
      // research / no-case intent specific to car accidents
      "accident report",
      "was it my fault",
      "insurance quote",
      "car repair",
      "blue book",
      "trade in",
      "rental car",
      "points on license",
    ],
    notes: [
      "Minor-impact, no-injury, and at-fault inquiries are the volume trap: cheap leads that never sign.",
      "Aggregators (lawyer-match sites) bid the same queries; their landing pages convert curiosity clicks you paid for.",
    ],
  },
  rules: [],
  guardrails: [
    {
      id: "pi-car.speed",
      principle:
        "Car-accident intake must respond in under 5 minutes during ad hours — competitors and aggregators sign the case otherwise.",
      rationale:
        "The sub-niche is commoditized; speed is the only durable conversion edge.",
    },
  ],
  redFlags: [
    "CPL trending down while signed-case rate collapses — the account is filling with minor-impact junk.",
    "Aggregator brand names appearing in search terms (paying to hand leads to middlemen).",
  ],
};

/**
 * Truck accident: low volume, enormous case values, brutal CPCs. Everything
 * about the account should be narrow, exact, and patient.
 */
export const piTruckAccidentPack: NichePack = {
  id: "legal-pi-truck-accident",
  label: "PI — Truck accident",
  category: "legal",
  description:
    "Low-volume, very-high-value PI. Precision targeting and patience beat volume plays; one signed case pays for months of spend.",
  extends: "legal-personal-injury",
  benchmarks: [
    {
      metric: "cpc",
      unit: "currency",
      min: 150,
      typical: 350,
      max: 900,
      note: "Among the most expensive clicks in all of advertising — commercial-policy case values price them in.",
    },
    {
      metric: "cpl",
      unit: "currency",
      min: 500,
      typical: 1500,
      max: 4000,
      note: "A handful of leads a month is normal at meaningful spend.",
    },
    {
      metric: "cpa-signed",
      unit: "currency",
      min: 5000,
      typical: 15000,
      max: 50000,
      note: "Absurd next to car accident — and still excellent ROI against 6-7 figure fees.",
    },
    {
      metric: "lead-to-signed-rate",
      unit: "rate",
      min: 0.02,
      typical: 0.08,
      max: 0.2,
      note: "Many callers were in truck-adjacent fender-benders, not commercial-carrier cases.",
    },
    {
      metric: "monthly-budget-floor",
      unit: "currency",
      min: 10000,
      typical: 20000,
      max: 40000,
      // Read by the inherited pi.budget-floor rule — the floor rises with the CPCs.
      note: "At $350 CPCs, less than $10k/mo cannot buy enough clicks to expect a signed case in any given month.",
    },
  ],
  conversionModel: {
    northStar:
      "Signed commercial-carrier case (retainer executed, commercial defendant confirmed)",
    valuePerOutcome: { min: 25000, typical: 100000, max: 1000000 },
    leadToOutcomeRate: { min: 0.02, typical: 0.08, max: 0.2 },
    junkLeadSignals: [
      ...PI_JUNK_SIGNALS,
      // wrong-audience traffic that plagues truck keywords
      "cdl",
      "truck driving jobs",
      "truck driver salary",
      "owner operator",
      "trucking company start",
      "semi truck for sale",
      "truck parts",
      "dot inspection",
    ],
    notes: [
      "The gap between a car case and a commercial-carrier case is the whole economics — intake must qualify the defendant, not just the injury.",
      "Truck-driver job seekers are a large share of raw truck-keyword traffic; without negatives they eat the budget invisibly.",
    ],
  },
  rules: [],
  guardrails: [
    {
      id: "pi-truck.variance",
      principle:
        "Judge truck-accident campaigns on 90-day windows minimum; never react to a signed-case-free month at this volume.",
      rationale:
        "At ~1-3 signed cases a quarter, monthly optimization is statistically meaningless and destroys good campaigns.",
    },
  ],
  redFlags: [
    "Anyone panicking over a zero-signing month at normal spend — variance, not failure, at this volume.",
    "Broad match on 'truck accident' terms without the CDL/jobs negative block.",
  ],
};

/**
 * Mass tort: the sub-niche where PI's jurisdiction rule INVERTS. National
 * intake with co-counsel is the business model, volume is the point, and the
 * risk is tort-eligibility screening, not geography.
 */
export const piMassTortPack: NichePack = {
  id: "legal-pi-mass-tort",
  label: "PI — Mass tort",
  category: "legal",
  description:
    "National-scale claimant acquisition for specific torts. Geography rules invert; eligibility screening and cost-per-qualified-claimant govern everything.",
  extends: "legal-personal-injury",
  benchmarks: [
    {
      metric: "cpl",
      unit: "currency",
      min: 100,
      typical: 400,
      max: 1500,
      note: "Per raw claimant lead; varies enormously by tort maturity and media saturation.",
    },
    {
      metric: "cpa-signed",
      unit: "currency",
      min: 500,
      typical: 2000,
      max: 8000,
      note: "Per RETAINED, ELIGIBLE claimant. Eligibility wash-out is the number that kills campaigns.",
    },
    {
      metric: "monthly-budget-floor",
      unit: "currency",
      min: 25000,
      typical: 50000,
      max: 150000,
      // Read by the inherited pi.budget-floor rule.
      note: "Mass tort is a scale game; sub-scale spend buys leads that age out before a docket resolves.",
    },
  ],
  conversionModel: {
    northStar:
      "Retained eligible claimant (signed + passes tort-specific eligibility screen)",
    valuePerOutcome: { min: 3000, typical: 15000, max: 200000 },
    leadToOutcomeRate: { min: 0.05, typical: 0.15, max: 0.35 },
    junkLeadSignals: [
      ...PI_JUNK_SIGNALS,
      "class action rebate",
      "settlement calculator",
      "how much will i get",
      "check status",
      "claim form download",
    ],
    notes: [
      "'Check my settlement status' searchers are existing claimants of OTHER firms, not new claimants.",
      "Eligibility criteria (dates of use/exposure, diagnosis) must be in the ad and lander — every ineligible lead is pure waste the platform counts as success.",
    ],
  },
  rules: [
    {
      // Deliberate OVERRIDE of the inherited PI rule by id: national targeting
      // is the mass-tort business model (co-counsel networks handle local
      // representation), so the parent's national-targeting flag would be a
      // false alarm here. The replacement checks the opposite failure mode.
      id: "pi.jurisdiction-targeting",
      title: "Geo-targeting vs. mass-tort scale model",
      category: "targeting",
      evaluate: ({ snapshot }) => {
        const narrow = snapshot.campaigns.filter(
          (c) =>
            c.enabled &&
            !c.geo.national &&
            c.geo.locations.length > 0 &&
            c.geo.locations.length <= 2,
        );
        if (narrow.length === 0) return [];
        return [
          {
            ruleId: "pi.jurisdiction-targeting",
            title: "Mass-tort campaigns constrained to narrow geography",
            severity: "low" as const,
            category: "targeting" as const,
            confidence: 0.5,
            summary:
              "Mass-tort acquisition is usually national (co-counsel handles jurisdiction). Narrow geo caps volume without improving claimant quality — confirm it's intentional (e.g. venue-specific strategy).",
            evidence: narrow.map(
              (c) => `"${c.name}" targets only: ${c.geo.locations.join(", ")}.`,
            ),
            recommendation:
              "If a co-counsel network is in place, open targeting nationally and control quality through eligibility screening instead of geography.",
            nicheRationale:
              "This is the sub-niche where PI's jurisdiction discipline inverts — the constraint that protects a local firm starves a mass-tort docket.",
          },
        ];
      },
    },
  ],
  guardrails: [
    {
      id: "pi-mt.eligibility",
      principle:
        "Every mass-tort campaign must screen eligibility (exposure dates, diagnosis, prior representation) before a lead counts as an outcome.",
      rationale:
        "Cost-per-retained-eligible-claimant is the only metric that matters; raw lead volume is noise.",
    },
    {
      id: "pi-mt.tort-focus",
      principle:
        "One tort per campaign — never mix torts in one ad group or lander.",
      rationale:
        "Eligibility criteria, ad language, and value per claimant differ per tort; mixing destroys measurement.",
    },
  ],
  redFlags: [
    "Celebrating lead volume while retained-eligible rate is unknown or falling.",
    "'Settlement calculator' and 'check my status' queries converting — that's other firms' claimants, not yours.",
    "A local-firm geo strategy applied to a national docket.",
  ],
};
