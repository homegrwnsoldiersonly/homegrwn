/**
 * The live Google Ads adapter. This is the only file that imports the Google
 * Ads client library; everything else depends on the AdsDataSource interface
 * and the pure mapper. Keeping the dependency confined here means the rest of
 * the app builds and tests without credentials.
 *
 * Nothing here runs until real credentials are present (see config.ts). It is a
 * thin orchestrator: run the GAQL queries, resolve geo labels, hand the rows to
 * buildSnapshot().
 */

import { GoogleAdsApi, type Customer } from "google-ads-api";
import type { AccountSnapshot } from "../../knowledge/types";
import type { AdsDataSource, AccountRef } from "../datasource";
import { loadGoogleAdsConfig, type GoogleAdsConfig } from "../config";
import * as Q from "./queries";
import { buildSnapshot } from "./mapper";
import type {
  RawCampaignRow,
  RawConversionActionRow,
  RawCustomerRow,
  RawGeoCriterionRow,
  RawGeoTargetConstantRow,
  RawKeywordRow,
  RawSearchTermRow,
} from "./raw-types";

export class GoogleAdsDataSource implements AdsDataSource {
  readonly kind = "google-ads" as const;
  private readonly api: GoogleAdsApi;
  private readonly config: GoogleAdsConfig;

  constructor(config: GoogleAdsConfig = loadGoogleAdsConfig()) {
    this.config = config;
    this.api = new GoogleAdsApi({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      developer_token: config.developerToken,
    });
  }

  private customer(customerId: string): Customer {
    return this.api.Customer({
      customer_id: customerId,
      refresh_token: this.config.refreshToken,
      login_customer_id: this.config.loginCustomerId,
    });
  }

  async listAccounts(): Promise<AccountRef[]> {
    const res = await this.api.listAccessibleCustomers(this.config.refreshToken);
    return (res.resource_names ?? []).map((rn) => ({
      customerId: rn.replace("customers/", ""),
    }));
  }

  async fetchAccountSnapshot(
    customerId = this.config.defaultCustomerId ?? "",
  ): Promise<AccountSnapshot> {
    if (!customerId) {
      throw new Error(
        "No customerId provided and GOOGLE_ADS_CUSTOMER_ID is not set.",
      );
    }
    const customer = this.customer(customerId);

    // Independent reads — fire them together.
    const [customerRows, campaigns, searchTerms, keywords, conversionActions, geoCriteria] =
      await Promise.all([
        customer.query<RawCustomerRow[]>(Q.CUSTOMER_QUERY),
        customer.query<RawCampaignRow[]>(Q.CAMPAIGNS_QUERY),
        customer.query<RawSearchTermRow[]>(Q.SEARCH_TERMS_QUERY),
        customer.query<RawKeywordRow[]>(Q.KEYWORDS_QUERY),
        customer.query<RawConversionActionRow[]>(Q.CONVERSION_ACTIONS_QUERY),
        customer.query<RawGeoCriterionRow[]>(Q.GEO_CRITERIA_QUERY),
      ]);

    const geoLabels = await this.resolveGeoLabels(customer, geoCriteria);

    return buildSnapshot({
      customer: customerRows[0] ?? {},
      campaigns,
      searchTerms,
      keywords,
      conversionActions,
      geoCriteria,
      geoLabels,
    });
  }

  /** Second-step lookup: geo_target_constant resource names -> human labels. */
  private async resolveGeoLabels(
    customer: Customer,
    geoCriteria: RawGeoCriterionRow[],
  ): Promise<Map<string, NonNullable<RawGeoTargetConstantRow["geo_target_constant"]>>> {
    const names = [
      ...new Set(
        geoCriteria
          .map((g) => g.campaign_criterion?.location?.geo_target_constant)
          .filter((n): n is string => !!n),
      ),
    ];
    const labels = new Map<
      string,
      NonNullable<RawGeoTargetConstantRow["geo_target_constant"]>
    >();
    if (names.length === 0) return labels;

    const rows = await customer.query<RawGeoTargetConstantRow[]>(
      Q.geoTargetConstantsQuery(names),
    );
    for (const row of rows) {
      const g = row.geo_target_constant;
      if (g?.resource_name) labels.set(g.resource_name, g);
    }
    return labels;
  }
}
