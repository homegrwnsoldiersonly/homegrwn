/**
 * Offline conversion import CLI. Dry-run by default: parses the CSV, validates
 * every row, and prints the reviewable plan. Nothing reaches Google Ads
 * without an explicit --apply.
 *
 *   npx tsx scripts/import-conversions.ts <file.csv> \
 *     --customer 1234567890 \
 *     --action 987654321 \
 *     --tz -07:00 \
 *     [--apply]
 *
 * CSV columns (flexible headers, see HEADER_ALIASES in build.ts):
 *   gclid, conversion_time (or signed_at/booked_at), value, currency,
 *   order_id (or case_id/job_id)
 *
 * A template lives at docs/templates/signed-cases.example.csv.
 */

import { readFileSync } from "node:fs";
import { planFromCsv } from "../src/lib/conversions/build";
import { hasGoogleAdsCredentials } from "../src/lib/ads";
import { normalizeCustomerId } from "../src/lib/ads/config";

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main(): Promise<void> {
  const file = process.argv[2];
  const customer = arg("--customer");
  const action = arg("--action");
  const tz = arg("--tz") ?? "+00:00";
  const apply = process.argv.includes("--apply");

  if (!file || !customer || !action) {
    console.error(
      "Usage: npx tsx scripts/import-conversions.ts <file.csv> --customer <id> --action <conversion-action-id> [--tz ±hh:mm] [--apply]",
    );
    process.exit(1);
  }

  const csv = readFileSync(file, "utf8");
  const plan = planFromCsv(csv, {
    customerId: normalizeCustomerId(customer),
    conversionActionId: action,
    defaultUtcOffset: tz,
  });

  const bar = "─".repeat(72);
  const s = plan.summary;
  console.log(bar);
  console.log(`Import plan for ${file}`);
  console.log(
    `Rows: ${s.inputRows} in · ${s.valid} valid · ${s.rejected} rejected · ${s.deduped} deduplicated`,
  );
  if (s.valid > 0) {
    console.log(
      `Total value: ${s.currency ?? ""} ${s.totalValue.toLocaleString()} across ${s.valid} conversions`,
    );
  }
  console.log(bar);

  const errors = plan.issues.filter((i) => i.level === "error");
  const warnings = plan.issues.filter((i) => i.level === "warning");
  for (const issue of errors) {
    console.log(`  ✖ line ${issue.line} [${issue.field}] ${issue.message}`);
  }
  for (const issue of warnings) {
    console.log(`  ⚠ line ${issue.line} [${issue.field}] ${issue.message}`);
  }
  if (plan.issues.length > 0) console.log(bar);

  if (!apply) {
    console.log("DRY RUN — nothing uploaded. Re-run with --apply to upload.");
    return;
  }
  if (plan.conversions.length === 0) {
    console.log("Nothing valid to upload.");
    process.exit(errors.length > 0 ? 1 : 0);
  }
  if (!hasGoogleAdsCredentials()) {
    console.error(
      "--apply requires Google Ads credentials (see docs/google-ads-credentials.md).",
    );
    process.exit(1);
  }

  const { ConversionUploader } = await import(
    "../src/lib/ads/google-ads/uploader"
  );
  const uploader = new ConversionUploader();
  const result = await uploader.upload(plan, normalizeCustomerId(customer));
  console.log(
    `Uploaded ${result.attempted} conversions — ${result.clean ? "all accepted" : "PARTIAL FAILURE"}`,
  );
  for (const e of result.rowErrors) console.log(`  ✖ ${e}`);
  process.exit(result.clean ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
