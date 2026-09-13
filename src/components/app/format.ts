/** Formatting helpers for dashboard data (mono numerals via `.numerals`). */

export function formatMoney(n: number, currency = "USD", fractionDigits = 0): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: fractionDigits,
      minimumFractionDigits: fractionDigits,
    }).format(n);
  } catch {
    return `${currency} ${n.toFixed(fractionDigits)}`;
  }
}

export function formatInt(n: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
}

/** "Sep 13, 2026 · 05:30 UTC" — runs render in UTC so two operators agree. */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const date = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(d);
  return `${date} · ${time} UTC`;
}

/** "+$340" / "−$120" / "±$0" for waste deltas. */
export function formatSignedMoney(n: number, currency = "USD"): string {
  if (n === 0) return `±${formatMoney(0, currency)}`;
  return `${n > 0 ? "+" : "−"}${formatMoney(Math.abs(n), currency)}`;
}
