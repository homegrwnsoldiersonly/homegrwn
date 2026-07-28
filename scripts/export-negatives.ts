/**
 * Export a reviewable negative-keyword change-set for an account.
 *
 *   npx tsx scripts/export-negatives.ts pi-001
 *   npx tsx scripts/export-negatives.ts pi-001 --pack legal-pi-car-accident \
 *     --out negatives.csv
 *
 * Prints the two-tier review (exact term negatives + phrase signal candidates
 * with overblock cautions) and writes the SAFE tier as a Google Ads Editor
 * CSV. Nothing touches the account — the CSV is applied by a human in Editor.
 */

import { writeFileSync } from "node:fs";
import { getDataSource } from "../src/lib/ads";
import { PACKS, resolvePack, suggestPackId } from "../src/lib/knowledge";
import {
  buildNegativeChangeSet,
  toEditorCsv,
} from "../src/lib/changesets/negatives";

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main(): Promise<void> {
  const accountId = process.argv[2];
  if (!accountId) {
    console.error(
      "Usage: npx tsx scripts/export-negatives.ts <accountId> [--pack <id>] [--out <file.csv>]",
    );
    process.exit(1);
  }

  const source = await getDataSource();
  const snapshot = await source.fetchAccountSnapshot(accountId);
  const packId = arg("--pack") ?? suggestPackId(snapshot);
  if (!packId || !PACKS[packId]) {
    console.error(
      `No pack suggested for this account — pass one explicitly with --pack. Available: ${Object.keys(PACKS).join(", ")}`,
    );
    process.exit(1);
  }

  const changeSet = buildNegativeChangeSet(snapshot, resolvePack(packId, PACKS));
  const bar = "─".repeat(72);

  console.log(bar);
  console.log(
    `Negative-keyword change-set — ${snapshot.accountName} · pack ${changeSet.packId}`,
  );
  console.log(
    `Junk spend in last ${changeSet.windowDays} days: $${changeSet.totalWasteInWindow.toLocaleString()}`,
  );
  console.log(bar);

  console.log(`\nTier 1 — exact term negatives (safe to apply as-is):`);
  if (changeSet.termNegatives.length === 0) console.log("  none found");
  for (const n of changeSet.termNegatives) {
    console.log(
      `  [${n.campaignName}] "${n.keyword}" — $${n.cost.toLocaleString()} / ${n.clicks} clicks (signal: ${n.matchedSignal})`,
    );
  }

  console.log(`\nTier 2 — phrase signal candidates (REVIEW before applying):`);
  if (changeSet.signalNegatives.length === 0) console.log("  none found");
  for (const s of changeSet.signalNegatives) {
    console.log(
      `  "${s.keyword}" (phrase) — $${s.totalCost.toLocaleString()} across ${s.matchedTerms.length} term(s)`,
    );
    if (s.caution) console.log(`    ⚠ ${s.caution}`);
  }

  const out = arg("--out");
  if (out) {
    writeFileSync(out, toEditorCsv(changeSet), "utf8");
    console.log(
      `\nWrote ${changeSet.termNegatives.length} exact negatives (Tier 1 only) to ${out} — import via Google Ads Editor.`,
    );
  } else {
    console.log(`\n(Pass --out negatives.csv to write the Editor import file.)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
