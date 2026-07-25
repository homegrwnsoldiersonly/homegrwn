/**
 * Runnable demo of the ingestion + knowledge loop — no live Google Ads API
 * needed (falls back to fixtures when credentials are absent).
 *
 *   npx tsx scripts/audit.ts                # audits the messy PI demo account
 *   npx tsx scripts/audit.ts hvac           # audits the HVAC demo account
 *   npx tsx scripts/audit.ts clean          # audits the disciplined PI account
 *
 * With Google Ads credentials in the environment (see .env.example), the same
 * command pulls a real account instead:
 *   GOOGLE_ADS_CUSTOMER_ID=1234567890 npx tsx scripts/audit.ts live legal-personal-injury
 *
 * This is the "thin slice" made visible: datasource -> snapshot -> pack ->
 * prioritized, explainable findings.
 */

import { audit } from "../src/lib/knowledge";
import { getDataSource } from "../src/lib/ads";
import {
  piFirmSnapshot,
  hvacSnapshot,
  cleanPiSnapshot,
} from "../src/lib/knowledge/fixtures";
import type { AccountSnapshot, Severity } from "../src/lib/knowledge/types";

const SEVERITY_ICON: Record<Severity, string> = {
  critical: "🔴",
  high: "🟠",
  medium: "🟡",
  low: "⚪",
};

const cases: Record<string, { customerId: string; pack: string }> = {
  pi: { customerId: piFirmSnapshot.accountId, pack: "legal-personal-injury" },
  hvac: { customerId: hvacSnapshot.accountId, pack: "home-services" },
  clean: { customerId: cleanPiSnapshot.accountId, pack: "legal-personal-injury" },
};

const key = process.argv[2] ?? "pi";

async function resolveSnapshot(): Promise<{ snapshot: AccountSnapshot; pack: string }> {
  const source = await getDataSource();
  if (key === "live") {
    const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID ?? "";
    const pack = process.argv[3] ?? "legal-personal-injury";
    console.log(`[datasource: ${source.kind}] pulling ${customerId || "(default)"}\n`);
    return { snapshot: await source.fetchAccountSnapshot(customerId), pack };
  }
  const chosen = cases[key];
  if (!chosen) {
    console.error(
      `Unknown case "${key}". Try: ${Object.keys(cases).join(", ")}, or "live".`,
    );
    process.exit(1);
  }
  console.log(`[datasource: ${source.kind}]\n`);
  return {
    snapshot: await source.fetchAccountSnapshot(chosen.customerId),
    pack: chosen.pack,
  };
}

async function main(): Promise<void> {
  const { snapshot, pack } = await resolveSnapshot();
  const report = audit(snapshot, pack);

  const bar = "─".repeat(72);
  console.log(bar);
  console.log(`Account:   ${report.accountName} (${report.accountId})`);
  console.log(`Pack:      ${report.packLineage.join(" → ")}`);
  console.log(
    `Spend:     $${report.generatedFor.monthlySpend.toLocaleString()}/mo · ${report.generatedFor.windowDays}-day window`,
  );
  const s = report.summary.bySeverity;
  console.log(
    `Findings:  ${report.findings.length}  (🔴 ${s.critical}  🟠 ${s.high}  🟡 ${s.medium}  ⚪ ${s.low})`,
  );
  if (report.summary.estimatedMonthlyWaste > 0) {
    console.log(
      `Est. waste: ~$${report.summary.estimatedMonthlyWaste.toLocaleString()}/mo identified`,
    );
  }
  console.log(bar);

  report.findings.forEach((f, i) => {
    console.log(
      `\n${i + 1}. ${SEVERITY_ICON[f.severity]} [${f.severity.toUpperCase()}] ${f.title}`,
    );
    console.log(`   ${f.summary}`);
    for (const e of f.evidence) console.log(`     • ${e}`);
    console.log(`   → Recommend: ${f.recommendation}`);
    console.log(`   Why (niche): ${f.nicheRationale}`);
  });
  console.log(`\n${bar}`);
  console.log("Recommend-only: nothing above is auto-applied. A human decides.");
  console.log(bar);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
