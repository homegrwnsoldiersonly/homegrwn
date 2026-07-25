/**
 * Minimal shapes for the Google Ads rows we actually read. The library's
 * `IGoogleAdsRow` is enormous; typing only the fields we consume keeps the
 * mapper honest and lets us unit-test it with hand-written fixtures — no live
 * API and no dependency on the library's generated protobuf types.
 *
 * Enum fields arrive as their string names (e.g. "SEARCH") under the library's
 * default parsing; money fields arrive as integer micros. The mapper tolerates
 * enums as string OR number just in case parsing is disabled upstream.
 */

export type EnumValue = string | number | null | undefined;

export interface RawMetrics {
  clicks?: number | null;
  impressions?: number | null;
  cost_micros?: number | null;
  conversions?: number | null;
  conversions_value?: number | null;
}

export interface RawCustomerRow {
  customer?: {
    id?: number | string | null;
    descriptive_name?: string | null;
    currency_code?: string | null;
    time_zone?: string | null;
  };
}

export interface RawCampaignRow {
  campaign?: {
    id?: number | string | null;
    name?: string | null;
    status?: EnumValue;
    advertising_channel_type?: EnumValue;
    bidding_strategy_type?: EnumValue;
  };
  campaign_budget?: { amount_micros?: number | null };
  metrics?: RawMetrics;
}

export interface RawSearchTermRow {
  campaign?: { id?: number | string | null };
  search_term_view?: { search_term?: string | null };
  metrics?: RawMetrics;
}

export interface RawKeywordRow {
  campaign?: { id?: number | string | null };
  ad_group_criterion?: {
    keyword?: { text?: string | null; match_type?: EnumValue };
    quality_info?: { quality_score?: number | null };
  };
  metrics?: RawMetrics;
}

export interface RawConversionActionRow {
  conversion_action?: {
    id?: number | string | null;
    name?: string | null;
    type?: EnumValue;
    category?: EnumValue;
    status?: EnumValue;
    counting_type?: EnumValue;
    primary_for_goal?: boolean | null;
  };
}

export interface RawGeoCriterionRow {
  campaign?: { id?: number | string | null };
  campaign_criterion?: {
    type?: EnumValue;
    negative?: boolean | null;
    location?: { geo_target_constant?: string | null };
    proximity?: { radius?: number | null; radius_units?: EnumValue };
  };
}

export interface RawGeoTargetConstantRow {
  geo_target_constant?: {
    resource_name?: string | null;
    canonical_name?: string | null;
    target_type?: string | null;
    country_code?: string | null;
  };
}
