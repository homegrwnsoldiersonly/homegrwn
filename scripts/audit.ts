/**
 * Runnable demo of the domain-knowledge engine — no live Google Ads API needed.
 *
 *   npx tsx scripts/audit.ts                # audits the messy PI demo account
 *   npx tsx scripts/audit.ts hvac           # audits the HVAC demo account
 *   npx tsx scripts/audit.ts clean          # audits the disciplined PI account
 *
 * This is the "thin slice" made visible: snapshot -> pack -> prioritized,
 * explainable findings. Later, the snapshot comes from the API instead of a
 * fixture and the report renders in the dashboard.
 */

import { audit } from "../src/lib/knowledge";
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

const cases: Record<string, { snapshot: AccountSnapshot; pack: string }> = {
  pi: { snapshot: piFirmSnapshot, pack: "legal-personal-injury" },
  hvac: { snapshot: hvacSnapshot, pack: "home-services" },
  clean: { snapshot: cleanPiSnapshot, pack: "legal-personal-injury" },
};

const key = process.argv[2] ?? "pi";
const chosen = cases[key];
if (!chosen) {
  console.error(`Unknown case "${key}". Try: ${Object.keys(cases).join(", ")}`);
  process.exit(1);
}

const report = audit(chosen.snapshot, chosen.pack);

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
