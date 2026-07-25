/**
 * Live upload of an ImportPlan via ConversionUploadService. Thin by design:
 * all validation happened in the pure plan builder; this file only transmits
 * and reports.
 *
 * partial_failure is always on — Google applies the good rows and returns
 * per-row errors for the bad ones, which we surface instead of failing the
 * whole batch.
 */

import { GoogleAdsApi, services } from "google-ads-api";
import type { GoogleAdsConfig } from "../config";
import { loadGoogleAdsConfig } from "../config";
import type { ImportPlan } from "../../conversions/types";

export interface UploadResult {
  attempted: number;
  /** Row-level errors reported by Google (partial failure detail). */
  rowErrors: string[];
  /** True when every conversion was accepted. */
  clean: boolean;
}

export class ConversionUploader {
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

  async upload(plan: ImportPlan, customerId: string): Promise<UploadResult> {
    if (plan.conversions.length === 0) {
      return { attempted: 0, rowErrors: [], clean: true };
    }
    const customer = this.api.Customer({
      customer_id: customerId,
      refresh_token: this.config.refreshToken,
      login_customer_id: this.config.loginCustomerId,
    });

    const request = new services.UploadClickConversionsRequest({
      customer_id: customerId,
      conversions: plan.conversions,
      partial_failure: true,
      validate_only: false,
    });

    const response = await customer.conversionUploads.uploadClickConversions(
      request,
    );

    const rowErrors: string[] = [];
    const partial = response.partial_failure_error;
    if (partial?.message) rowErrors.push(partial.message);

    return {
      attempted: plan.conversions.length,
      rowErrors,
      clean: rowErrors.length === 0,
    };
  }
}
