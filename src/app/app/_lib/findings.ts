/**
 * Pure helpers over audited accounts: flatten, sort, filter, summarize.
 * No Next imports — tested in findings.test.ts. Anything with `snapshot` +
 * `report` (a TenantAccount) satisfies `AccountLike` structurally.
 */

import type { AuditReport, Finding, Severity } from "../../../lib/knowledge/types";

export const SEVERITY_ORDER: readonly Severity[] = ["critical", "high", "medium", "low"];

export const SEVERITY_RANK: Record<Severity, number> = {
  critical: 3,
  high: 2,
  medium: 1,
  low: 0,
};

export function isSeverity(v: string): v is Severity {
  return (SEVERITY_ORDER as readonly string[]).includes(v);
}

export interface AccountLike {
  accountId: string;
  snapshot: { accountName: string; currency: string; monthlySpend: number };
  packId: string;
  report: AuditReport;
}

export interface FindingRef {
  accountId: string;
  accountName: string;
  currency: string;
  packId: string;
  finding: Finding;
}

export function flattenFindings(accounts: AccountLike[]): FindingRef[] {
  const out: FindingRef[] = [];
  for (const a of accounts) {
    for (const finding of a.report.findings) {
      out.push({
        accountId: a.accountId,
        accountName: a.snapshot.accountName,
        currency: a.snapshot.currency,
        packId: a.packId,
        finding,
      });
    }
  }
  return out;
}

/** Severity desc → estimated waste desc → confidence desc. Stable. */
export function sortFindings(refs: FindingRef[]): FindingRef[] {
  return [...refs].sort((a, b) => {
    const s = SEVERITY_RANK[b.finding.severity] - SEVERITY_RANK[a.finding.severity];
    if (s !== 0) return s;
    const w = (b.finding.estimatedMonthlyWaste ?? 0) - (a.finding.estimatedMonthlyWaste ?? 0);
    if (w !== 0) return w;
    return b.finding.confidence - a.finding.confidence;
  });
}

export interface FindingFilter {
  severities: Severity[];
  pack?: string;
  category?: string;
  account?: string;
}

type SearchParams = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string | undefined {
  const s = Array.isArray(v) ? v[0] : v;
  return s && s.trim() !== "" ? s.trim() : undefined;
}

/** `?severity=critical,high&pack=hs-hvac&category=wasted-spend&account=hs-001` */
export function parseFindingFilter(sp: SearchParams): FindingFilter {
  const severities = (first(sp.severity) ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(isSeverity);
  const filter: FindingFilter = { severities: [...new Set(severities)] };
  const pack = first(sp.pack);
  if (pack) filter.pack = pack;
  const category = first(sp.category);
  if (category) filter.category = category;
  const account = first(sp.account);
  if (account) filter.account = account;
  return filter;
}

export function applyFindingFilter(refs: FindingRef[], filter: FindingFilter): FindingRef[] {
  return refs.filter((r) => {
    if (filter.severities.length > 0 && !filter.severities.includes(r.finding.severity)) return false;
    if (filter.pack && r.packId !== filter.pack) return false;
    if (filter.category && r.finding.category !== filter.category) return false;
    if (filter.account && r.accountId !== filter.account) return false;
    return true;
  });
}

export function isFilterActive(filter: FindingFilter): boolean {
  return (
    filter.severities.length > 0 || !!filter.pack || !!filter.category || !!filter.account
  );
}

export interface TenantSummary {
  accounts: number;
  /** Currency of the first account; mixed-currency tenants show the first. */
  currency: string;
  monthlySpend: number;
  findings: number;
  estimatedMonthlyWaste: number;
  bySeverity: Record<Severity, number>;
  /** Distinct pack ids in use across the tenant's accounts. */
  packs: string[];
  /** Distinct finding categories present. */
  categories: string[];
}

export function summarizeAccounts(accounts: AccountLike[]): TenantSummary {
  const bySeverity: Record<Severity, number> = { critical: 0, high: 0, medium: 0, low: 0 };
  let findings = 0;
  let waste = 0;
  let spend = 0;
  const packs = new Set<string>();
  const categories = new Set<string>();
  for (const a of accounts) {
    spend += a.snapshot.monthlySpend;
    findings += a.report.findings.length;
    waste += a.report.summary.estimatedMonthlyWaste;
    packs.add(a.packId);
    for (const s of SEVERITY_ORDER) bySeverity[s] += a.report.summary.bySeverity[s];
    for (const f of a.report.findings) categories.add(f.category);
  }
  return {
    accounts: accounts.length,
    currency: accounts[0]?.snapshot.currency ?? "USD",
    monthlySpend: spend,
    findings,
    estimatedMonthlyWaste: waste,
    bySeverity,
    packs: [...packs].sort(),
    categories: [...categories].sort(),
  };
}
