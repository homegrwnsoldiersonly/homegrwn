/**
 * GAQL (Google Ads Query Language) queries. Kept in one place so the exact set
 * of fields we depend on is auditable, and so the mapper's expectations and the
 * queries can't drift apart.
 *
 * All metrics queries use a 30-day window to match AccountSnapshot.windowDays.
 * `segments.date DURING LAST_30_DAYS` is relative to the account's timezone.
 */

export const DATE_RANGE = "LAST_30_DAYS" as const;
export const WINDOW_DAYS = 30;

/** Account identity + currency. Single row. */
export const CUSTOMER_QUERY = `
  SELECT
    customer.id,
    customer.descriptive_name,
    customer.currency_code,
    customer.time_zone
  FROM customer
  LIMIT 1
`;

/** Campaign rows with 30-day metrics. One row per enabled/paused campaign. */
export const CAMPAIGNS_QUERY = `
  SELECT
    campaign.id,
    campaign.name,
    campaign.status,
    campaign.advertising_channel_type,
    campaign.bidding_strategy_type,
    campaign_budget.amount_micros,
    metrics.clicks,
    metrics.impressions,
    metrics.cost_micros,
    metrics.conversions,
    metrics.conversions_value
  FROM campaign
  WHERE segments.date DURING ${DATE_RANGE}
    AND campaign.status != 'REMOVED'
`;

/** Search terms with cost, for the wasted-spend / negative-keyword rules. */
export const SEARCH_TERMS_QUERY = `
  SELECT
    campaign.id,
    search_term_view.search_term,
    metrics.clicks,
    metrics.cost_micros,
    metrics.conversions
  FROM search_term_view
  WHERE segments.date DURING ${DATE_RANGE}
`;

/** Keywords with quality score. */
export const KEYWORDS_QUERY = `
  SELECT
    campaign.id,
    ad_group_criterion.keyword.text,
    ad_group_criterion.keyword.match_type,
    ad_group_criterion.quality_info.quality_score,
    metrics.clicks,
    metrics.cost_micros,
    metrics.conversions
  FROM keyword_view
  WHERE segments.date DURING ${DATE_RANGE}
    AND ad_group_criterion.status != 'REMOVED'
`;

/** Conversion actions — the heart of the conversion-integrity checks. */
export const CONVERSION_ACTIONS_QUERY = `
  SELECT
    conversion_action.id,
    conversion_action.name,
    conversion_action.type,
    conversion_action.category,
    conversion_action.status,
    conversion_action.counting_type,
    conversion_action.primary_for_goal
  FROM conversion_action
  WHERE conversion_action.status = 'ENABLED'
`;

/** Location + proximity targeting criteria, per campaign. */
export const GEO_CRITERIA_QUERY = `
  SELECT
    campaign.id,
    campaign_criterion.type,
    campaign_criterion.negative,
    campaign_criterion.location.geo_target_constant,
    campaign_criterion.proximity.radius,
    campaign_criterion.proximity.radius_units
  FROM campaign_criterion
  WHERE campaign_criterion.type IN ('LOCATION', 'PROXIMITY')
    AND campaign_criterion.status != 'REMOVED'
`;

/** Resolve a set of geo_target_constant resource names to human labels. */
export function geoTargetConstantsQuery(resourceNames: string[]): string {
  const list = resourceNames.map((r) => `'${r}'`).join(", ");
  return `
    SELECT
      geo_target_constant.resource_name,
      geo_target_constant.canonical_name,
      geo_target_constant.target_type,
      geo_target_constant.country_code
    FROM geo_target_constant
    WHERE geo_target_constant.resource_name IN (${list})
  `;
}
