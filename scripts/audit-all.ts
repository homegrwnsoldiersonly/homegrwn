/**
 * Run the scheduled-audit loop locally: audit every account the datasource
 * can see, persist runs to .data/audit-history/, and print the run-over-run
 * diff. Run it twice to see the diff engine report "no changes".
 *
 *   npx tsx scripts/audit-all.ts
 */

import { getDataSource } from "../src/lib/ads";
import { FsHistoryStore } from "../src/lib/history/fs-store";
import { runScheduledAudit } from "../src/lib/history/runner";

async function main(): Promise<void> {
  const source = await getDataSource();
  const summary = await runScheduledAudit(source, new FsHistoryStore());

  console.log(`Scheduled audit @ ${summary.at} [datasource: ${summary.datasource}]`);
  console.log("─".repeat(72));

  for (const a of summary.accounts) {
    const d = a.diff;
    const flag = d.actionable ? "●" : "○";
    console.log(`\n${flag} ${a.accountName} (${a.accountId}) — pack ${a.packId}`);
    console.log(
      `  ${a.findings} findings, ~$${a.estimatedMonthlyWaste.toLocaleString()}/mo waste`,
    );
    if (d.firstRun) {
      console.log(`  First recorded run — baseline stored.`);
      continue;
    }
    if (!d.actionable) {
      console.log(`  No changes vs previous run.`);
      continue;
    }
    for (const f of d.newFindings) {
      console.log(`  + NEW [${f.severity}] ${f.title}`);
    }
    for (const f of d.resolvedFindings) {
      console.log(`  − RESOLVED ${f.title}`);
    }
    for (const s of d.severityShifts) {
      console.log(
        `  ~ ${s.worsened ? "WORSE" : "better"} ${s.title}: ${s.from} → ${s.to}`,
      );
    }
    if (d.wasteDelta !== 0) {
      const sign = d.wasteDelta > 0 ? "+" : "";
      console.log(`  Δ waste: ${sign}$${d.wasteDelta.toLocaleString()}/mo`);
    }
    if (a.storeError) console.log(`  (history not persisted: ${a.storeError})`);
  }

  if (summary.errors.length > 0) {
    console.log("\nErrors:");
    for (const e of summary.errors) console.log(`  ✖ ${e.accountId}: ${e.error}`);
  }
  console.log(`\nActionable accounts: ${summary.actionable.length > 0 ? summary.actionable.join(", ") : "none"}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
