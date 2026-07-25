import { describe, it, expect } from "vitest";
import {
  buildSnapshot,
  buildGeo,
  fromMicros,
  isVerifiedValue,
  mapBidStrategy,
  mapCampaignType,
  mapConversionAction,
  mapConversionCategory,
  mapCounting,
  mapMatchType,
  type SnapshotInputs,
} from "./mapper";
import { audit } from "../../knowledge";
import type { RawGeoTargetConstantRow } from "./raw-types";

describe("micros conversion", () => {
  it("divides by 1e6", () => {
    expect(fromMicros(9_800_000)).toBe(9.8);
    expect(fromMicros(0)).toBe(0);
    expect(fromMicros(null)).toBe(0);
    expect(fromMicros(undefined)).toBe(0);
  });
});

describe("enum mapping tolerates string and numeric inputs", () => {
  it("campaign type", () => {
    expect(mapCampaignType("SEARCH")).toBe("search");
    expect(mapCampaignType("performance_max")).toBe("performance-max");
    expect(mapCampaignType(11)).toBe("local-services"); // numeric fallback
    expect(mapCampaignType(undefined)).toBe("unknown");
  });
  it("bid strategy", () => {
    expect(mapBidStrategy("MAXIMIZE_CONVERSIONS")).toBe("maximize-conversions");
    expect(mapBidStrategy("ENHANCED_CPC")).toBe("manual-cpc");
    expect(mapBidStrategy(8)).toBe("target-roas");
  });
  it("match type", () => {
    expect(mapMatchType("BROAD")).toBe("broad");
    expect(mapMatchType(2)).toBe("exact");
  });
  it("counting defaults to the riskier 'every' on unknown", () => {
    expect(mapCounting("ONE_PER_CLICK")).toBe("one");
    expect(mapCounting("MANY_PER_CLICK")).toBe("every");
    expect(mapCounting(undefined)).toBe("every");
  });
});

describe("conversion taxonomy collapse", () => {
  it("routes Google types/categories to our small set", () => {
    expect(mapConversionCategory("WEBSITE", "SUBMIT_LEAD_FORM")).toContain("form");
    expect(mapConversionCategory("WEBSITE_CALL", "PHONE_CALL_LEAD")).toContain("call");
    expect(mapConversionCategory("UPLOAD_CLICKS", "DEFAULT")).toContain("offline");
    expect(mapConversionCategory("WEBSITE", "PURCHASE")).toContain("purchase");
  });
  it("treats offline-import / purchase / qualified as verified", () => {
    expect(isVerifiedValue("UPLOAD_CLICKS", "DEFAULT")).toBe(true);
    expect(isVerifiedValue("WEBSITE", "QUALIFIED_LEAD")).toBe(true);
    expect(isVerifiedValue("WEBSITE", "SUBMIT_LEAD_FORM")).toBe(false);
  });
  it("maps a full conversion action row", () => {
    const action = mapConversionAction({
      conversion_action: {
        name: "Signed Case",
        type: "UPLOAD_CLICKS",
        category: "QUALIFIED_LEAD",
        counting_type: "ONE_PER_CLICK",
        primary_for_goal: true,
      },
    });
    expect(action).toMatchObject({
      name: "Signed Case",
      counting: "one",
      primaryForBidding: true,
      verifiedValue: true,
    });
    expect(action.category).toContain("offline");
  });
});

describe("geo building", () => {
  const labels = new Map<
    string,
    NonNullable<RawGeoTargetConstantRow["geo_target_constant"]>
  >([
    [
      "geoTargetConstants/2840",
      { resource_name: "geoTargetConstants/2840", canonical_name: "United States", target_type: "Country" },
    ],
    [
      "geoTargetConstants/1013962",
      { resource_name: "geoTargetConstants/1013962", canonical_name: "Los Angeles, California, United States", target_type: "City" },
    ],
  ]);

  it("resolves labels, flags national on a country target, converts km radius", () => {
    const geo = buildGeo(
      [
        {
          campaign: { id: 1 },
          campaign_criterion: {
            type: "LOCATION",
            negative: false,
            location: { geo_target_constant: "geoTargetConstants/2840" },
          },
        },
        {
          campaign: { id: 1 },
          campaign_criterion: {
            type: "PROXIMITY",
            negative: false,
            proximity: { radius: 40, radius_units: "KILOMETERS" },
          },
        },
      ],
      labels,
    );
    expect(geo.locations).toContain("United States");
    expect(geo.national).toBe(true);
    expect(geo.radiiMiles?.[0]).toBe(25); // 40km -> ~25mi
  });

  it("ignores negative (excluded) locations", () => {
    const geo = buildGeo(
      [
        {
          campaign: { id: 1 },
          campaign_criterion: {
            type: "LOCATION",
            negative: true,
            location: { geo_target_constant: "geoTargetConstants/2840" },
          },
        },
      ],
      labels,
    );
    expect(geo.national).toBeUndefined();
    expect(geo.locations).toHaveLength(0);
  });
});

describe("buildSnapshot end-to-end + feeds the knowledge engine", () => {
  const input: SnapshotInputs = {
    customer: {
      customer: { id: 1234567890, descriptive_name: "Test PI Firm", currency_code: "USD" },
    },
    campaigns: [
      {
        campaign: {
          id: 11,
          name: "Search — Car Accident",
          status: "ENABLED",
          advertising_channel_type: "SEARCH",
          bidding_strategy_type: "MAXIMIZE_CONVERSIONS",
        },
        campaign_budget: { amount_micros: 350_000_000 },
        metrics: {
          clicks: 720,
          impressions: 22000,
          cost_micros: 9_800_000_000,
          conversions: 88,
          conversions_value: 0,
        },
      },
    ],
    searchTerms: [
      {
        campaign: { id: 11 },
        search_term_view: { search_term: "divorce attorney" },
        metrics: { clicks: 30, cost_micros: 520_000_000, conversions: 1 },
      },
    ],
    keywords: [
      {
        campaign: { id: 11 },
        ad_group_criterion: {
          keyword: { text: "car accident lawyer", match_type: "BROAD" },
          quality_info: { quality_score: 6 },
        },
        metrics: { clicks: 300, cost_micros: 5_200_000_000, conversions: 30 },
      },
    ],
    conversionActions: [
      {
        conversion_action: {
          name: "Website Form",
          type: "WEBSITE",
          category: "SUBMIT_LEAD_FORM",
          counting_type: "MANY_PER_CLICK",
          primary_for_goal: true,
        },
      },
    ],
    geoCriteria: [],
    geoLabels: new Map(),
    context: { servesLocations: ["California"], subNiche: "car-accident" },
  };

  const snapshot = buildSnapshot(input);

  it("converts money from micros throughout", () => {
    expect(snapshot.campaigns[0].dailyBudget).toBe(350);
    expect(snapshot.campaigns[0].cost).toBe(9800);
    expect(snapshot.campaigns[0].searchTerms[0].cost).toBe(520);
    expect(snapshot.monthlySpend).toBe(9800);
  });

  it("carries structured fields the rules need", () => {
    expect(snapshot.campaigns[0].type).toBe("search");
    expect(snapshot.campaigns[0].keywords[0].matchType).toBe("broad");
    expect(snapshot.conversionActions[0].counting).toBe("every");
    expect(snapshot.conversionActions[0].verifiedValue).toBe(false);
  });

  it("a mapped snapshot flows into the audit engine unchanged", () => {
    const report = audit(snapshot, "legal-personal-injury");
    const ids = report.findings.map((f) => f.ruleId);
    // The unverified 'every'-counting form-fill primary action must be caught.
    expect(ids).toContain("pi.signed-case-tracking");
    expect(ids).toContain("base.conversion-integrity");
    // The divorce search term is wrong-practice-area waste.
    expect(ids).toContain("pi.junk-search-terms");
  });
});
