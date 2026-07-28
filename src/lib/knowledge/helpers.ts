/** Small pure helpers shared by rule implementations. */

import type { AccountSnapshot, Campaign, SearchTerm } from "./types";

export function round(n: number): number {
  return Math.round(n * 100) / 100;
}

export function money(n: number, currency = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `$${Math.round(n)}`;
  }
}

export function pct(rate: number): string {
  return `${round(rate * 100)}%`;
}

export function allSearchTerms(snapshot: AccountSnapshot): SearchTerm[] {
  return snapshot.campaigns.flatMap((c) => c.searchTerms);
}

/** Search terms whose text contains any of the given (lowercased) signals. */
export function termsMatching(
  terms: SearchTerm[],
  signals: string[],
): SearchTerm[] {
  const needles = signals.map((s) => s.toLowerCase());
  return terms.filter((t) => {
    const text = t.text.toLowerCase();
    return needles.some((n) => text.includes(n));
  });
}

export function sumCost(terms: { cost: number }[]): number {
  return terms.reduce((acc, t) => acc + t.cost, 0);
}

export function searchCampaigns(snapshot: AccountSnapshot): Campaign[] {
  return snapshot.campaigns.filter((c) => c.enabled && c.type === "search");
}

export function campaignsOfType(
  snapshot: AccountSnapshot,
  type: Campaign["type"],
): Campaign[] {
  return snapshot.campaigns.filter((c) => c.enabled && c.type === type);
}

export function accountCpc(snapshot: AccountSnapshot): number | null {
  const clicks = snapshot.campaigns.reduce((a, c) => a + c.clicks, 0);
  const cost = snapshot.campaigns.reduce((a, c) => a + c.cost, 0);
  return clicks > 0 ? cost / clicks : null;
}
