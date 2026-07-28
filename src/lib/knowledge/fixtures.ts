/**
 * Sample normalized account snapshots. These stand in for real Google Ads API
 * pulls so the engine — and its tests — can run with zero live dependency.
 *
 * Each fixture is deliberately seeded with realistic mistakes the packs should
 * catch, so the demo and tests are meaningful.
 */

import type { AccountSnapshot } from "./types";

/**
 * A PI firm doing everything a generalist tool would leave alone: optimizing
 * to unverified form-fills, broad match leaking to divorce/DUI/jobs queries,
 * heavy PMax, national targeting, and no signed-case import.
 */
export const piFirmSnapshot: AccountSnapshot = {
  accountId: "pi-001",
  accountName: "Example Injury Law (demo)",
  currency: "USD",
  windowDays: 30,
  monthlySpend: 18000,
  context: {
    servesLocations: ["California"],
    subNiche: "car-accident",
  },
  conversionActions: [
    {
      name: "Website Form",
      category: "website-form",
      counting: "every",
      primaryForBidding: true,
      verifiedValue: false,
      count: 96,
      value: 0,
    },
    {
      name: "Phone Call",
      category: "phone-call",
      counting: "every",
      primaryForBidding: true,
      verifiedValue: false,
      callDurationThresholdSec: 15,
      count: 60,
      value: 0,
    },
  ],
  campaigns: [
    {
      id: "c-search-core",
      name: "Search — Car Accident",
      type: "search",
      enabled: true,
      bidStrategy: "maximize-conversions",
      dailyBudget: 350,
      geo: { locations: ["California"], national: false },
      schedule: { runsWhenIntakeClosed: true },
      isBrandCampaign: false,
      clicks: 720,
      impressions: 22000,
      cost: 9800,
      conversions: 88,
      conversionValue: 0,
      keywords: [
        {
          text: "car accident lawyer",
          matchType: "broad",
          clicks: 300,
          cost: 5200,
          conversions: 30,
          qualityScore: 6,
        },
        {
          text: "injury attorney near me",
          matchType: "phrase",
          clicks: 200,
          cost: 2600,
          conversions: 22,
          qualityScore: 7,
        },
      ],
      searchTerms: [
        { text: "car accident lawyer", clicks: 120, cost: 2100, conversions: 14 },
        { text: "free car accident lawyer", clicks: 40, cost: 620, conversions: 3 },
        { text: "divorce attorney", clicks: 30, cost: 520, conversions: 1 },
        { text: "dui lawyer near me", clicks: 22, cost: 470, conversions: 0 },
        { text: "personal injury attorney jobs", clicks: 18, cost: 300, conversions: 0 },
        { text: "how to sue after car accident", clicks: 25, cost: 360, conversions: 1 },
      ],
    },
    {
      id: "c-pmax",
      name: "PMax — Injury",
      type: "performance-max",
      enabled: true,
      bidStrategy: "maximize-conversion-value",
      dailyBudget: 200,
      geo: { locations: ["United States"], national: true },
      isBrandCampaign: false,
      clicks: 1400,
      impressions: 90000,
      cost: 8200,
      conversions: 68,
      conversionValue: 0,
      keywords: [],
      searchTerms: [
        { text: "accident", clicks: 200, cost: 900, conversions: 6 },
        { text: "lawyer", clicks: 180, cost: 800, conversions: 4 },
      ],
    },
  ],
};

/**
 * An HVAC contractor running only Search, no LSA, no call tracking, a 60-mile
 * radius, and a flat budget against a seasonal trade.
 */
export const hvacSnapshot: AccountSnapshot = {
  accountId: "hs-001",
  accountName: "Example Comfort HVAC (demo)",
  currency: "USD",
  windowDays: 30,
  monthlySpend: 3200,
  context: {
    servesLocations: ["Phoenix, AZ"],
    subNiche: "hvac",
  },
  conversionActions: [
    {
      name: "Website Form",
      category: "website-form",
      counting: "one",
      primaryForBidding: true,
      verifiedValue: false,
      count: 40,
      value: 0,
    },
  ],
  campaigns: [
    {
      id: "c-search",
      name: "Search — AC Repair",
      type: "search",
      enabled: true,
      bidStrategy: "maximize-conversions",
      dailyBudget: 107,
      geo: { locations: ["Phoenix, AZ"], radiiMiles: [60], national: false },
      isBrandCampaign: false,
      clicks: 420,
      impressions: 15000,
      cost: 3200,
      conversions: 44,
      conversionValue: 0,
      keywords: [
        {
          text: "ac repair phoenix",
          matchType: "phrase",
          clicks: 260,
          cost: 2100,
          conversions: 30,
          qualityScore: 7,
        },
      ],
      searchTerms: [
        { text: "ac repair phoenix", clicks: 150, cost: 1200, conversions: 18 },
        { text: "ac repair diy", clicks: 30, cost: 210, conversions: 0 },
        { text: "hvac technician jobs phoenix", clicks: 24, cost: 180, conversions: 0 },
        { text: "ac compressor parts", clicks: 20, cost: 150, conversions: 0 },
      ],
    },
  ],
};

/**
 * A comparatively clean PI account: brand campaign present, signed-case import
 * wired, tight geo, no PMax. Should produce far fewer / lower findings — the
 * control case proving the engine isn't just always alarmed.
 */
export const cleanPiSnapshot: AccountSnapshot = {
  accountId: "pi-clean",
  accountName: "Disciplined Injury Law (demo)",
  currency: "USD",
  windowDays: 30,
  monthlySpend: 14000,
  context: { servesLocations: ["Texas"], subNiche: "truck-accident" },
  conversionActions: [
    {
      name: "Signed Case (offline import)",
      category: "imported-offline",
      counting: "one",
      primaryForBidding: true,
      verifiedValue: true,
      count: 9,
      value: 135000,
    },
    {
      name: "Qualified Call",
      category: "phone-call",
      counting: "one",
      primaryForBidding: false,
      verifiedValue: false,
      callDurationThresholdSec: 90,
      count: 52,
      value: 0,
    },
  ],
  campaigns: [
    {
      id: "c-brand",
      name: "Search — Brand",
      type: "search",
      enabled: true,
      bidStrategy: "maximize-conversions",
      dailyBudget: 30,
      geo: { locations: ["Texas"], national: false },
      isBrandCampaign: true,
      clicks: 210,
      impressions: 3000,
      cost: 700,
      conversions: 24,
      conversionValue: 0,
      keywords: [],
      searchTerms: [{ text: "disciplined injury law", clicks: 180, cost: 500, conversions: 20 }],
    },
    {
      id: "c-core",
      name: "Search — Truck Accident",
      type: "search",
      enabled: true,
      bidStrategy: "maximize-conversion-value",
      dailyBudget: 430,
      geo: { locations: ["Dallas, TX", "Houston, TX"], national: false },
      isBrandCampaign: false,
      clicks: 300,
      impressions: 9000,
      cost: 13300,
      conversions: 30,
      conversionValue: 405000,
      keywords: [
        {
          text: "truck accident lawyer",
          matchType: "exact",
          clicks: 160,
          cost: 8000,
          conversions: 18,
          qualityScore: 9,
        },
      ],
      searchTerms: [
        { text: "truck accident lawyer dallas", clicks: 90, cost: 4200, conversions: 10 },
        { text: "18 wheeler accident attorney", clicks: 70, cost: 3600, conversions: 8 },
      ],
    },
  ],
};
