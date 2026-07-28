/**
 * Change-set generation: turn the junk-traffic diagnosis into a concrete,
 * reviewable artifact — a negative-keyword list in Google Ads Editor CSV
 * format, ready to paste. This is the first "proposed change" artifact of the
 * approval-queue architecture: generated from data, reviewed by a human,
 * applied by hand today (API mutation later, behind the same review gate).
 *
 * Two tiers, because precision and reach trade off:
 *  - TERM negatives (exact): the actual matched search terms. Safe to apply
 *    as-is — they block exactly what already wasted money.
 *  - SIGNAL negatives (phrase): the junk signal words themselves. Far wider
 *    reach, but can overblock (e.g. "free" also blocks "free consultation"
 *    searches) — always flagged for human review, never auto-recommended.
 */

import type { AccountSnapshot } from "../knowledge/types";
import type { ResolvedPack } from "../knowledge/types";

export interface TermNegative {
  campaignName: string;
  keyword: string;
  matchType: "exact";
  /** What it cost in the snapshot window — the "why" for the reviewer. */
  cost: number;
  clicks: number;
  matchedSignal: string;
}

export interface SignalNegative {
  keyword: string;
  matchType: "phrase";
  /** Terms in this account the signal matched (evidence). */
  matchedTerms: string[];
  totalCost: number;
  /** Signals prone to overblocking get a caution note. */
  caution?: string;
}

export interface NegativeChangeSet {
  accountId: string;
  packId: string;
  termNegatives: TermNegative[];
  signalNegatives: SignalNegative[];
  totalWasteInWindow: number;
  windowDays: number;
}

/** Signals whose phrase-negative form commonly blocks GOOD queries too. */
const OVERBLOCK_CAUTIONS: Record<string, string> = {
  free: 'Also blocks "free consultation/estimate/quote" searches — usually good queries. Apply only after checking your offer language.',
  job: 'Also blocks "nose job"-style and service-name collisions; verify against your keyword themes.',
  jobs: "Job-seeker intent — but check for service-name collisions before applying broadly.",
  parts: 'Blocks "parts of a lawsuit/claim"-style informational queries too; usually still safe for trades.',
};

export function buildNegativeChangeSet(
  snapshot: AccountSnapshot,
  pack: ResolvedPack,
): NegativeChangeSet {
  const signals = (pack.conversionModel?.junkLeadSignals ?? []).map((s) =>
    s.toLowerCase(),
  );
  const termNegatives: TermNegative[] = [];
  const bySignal = new Map<string, { terms: Set<string>; cost: number }>();
  let totalWasteInWindow = 0;

  for (const campaign of snapshot.campaigns) {
    if (!campaign.enabled) continue;
    for (const term of campaign.searchTerms) {
      const text = term.text.toLowerCase();
      const matched = signals.find((s) => text.includes(s));
      if (!matched) continue;
      termNegatives.push({
        campaignName: campaign.name,
        keyword: term.text,
        matchType: "exact",
        cost: term.cost,
        clicks: term.clicks,
        matchedSignal: matched,
      });
      totalWasteInWindow += term.cost;
      const bucket = bySignal.get(matched) ?? { terms: new Set(), cost: 0 };
      bucket.terms.add(term.text);
      bucket.cost += term.cost;
      bySignal.set(matched, bucket);
    }
  }

  termNegatives.sort((a, b) => b.cost - a.cost);

  const signalNegatives: SignalNegative[] = [...bySignal.entries()]
    .map(([signal, { terms, cost }]) => {
      const entry: SignalNegative = {
        keyword: signal,
        matchType: "phrase" as const,
        matchedTerms: [...terms].sort(),
        totalCost: cost,
      };
      const caution = OVERBLOCK_CAUTIONS[signal];
      if (caution) entry.caution = caution;
      return entry;
    })
    .sort((a, b) => b.totalCost - a.totalCost);

  return {
    accountId: snapshot.accountId,
    packId: pack.id,
    termNegatives,
    signalNegatives,
    totalWasteInWindow,
    windowDays: snapshot.windowDays,
  };
}

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/**
 * Google Ads Editor import format for campaign-level negatives:
 * Campaign, Keyword, Criterion Type. Only the safe tier (exact term
 * negatives) goes in the file; signal negatives are a review list, not an
 * import artifact.
 */
export function toEditorCsv(changeSet: NegativeChangeSet): string {
  const lines = ["Campaign,Keyword,Criterion Type"];
  for (const n of changeSet.termNegatives) {
    lines.push(
      [csvCell(n.campaignName), csvCell(n.keyword), "Negative Exact"].join(","),
    );
  }
  return lines.join("\n") + "\n";
}
