/**
 * Small server-safe chrome pieces shared by every dashboard page: pills,
 * the data-source badge, page headers, empty states, the partial-data
 * notice, and the page frame. No state, no handlers.
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { DataSourceKind } from "@/lib/ads/datasource";
import type { CsvIngestMeta, CsvTable } from "@/lib/ads/csv-datasource";
import { CheckerFlag } from "@/components/ui/CheckerFlag";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Heading } from "@/components/ui/Heading";

export type PillTone = "muted" | "lime" | "warn";

const PILL_TONES: Record<PillTone, string> = {
  muted: "border-white/15 text-white/70",
  lime: "border-lime-500/40 text-lime-500",
  warn: "border-red-400/40 text-red-300",
};

export function Pill({
  tone = "muted",
  mono = false,
  className,
  children,
}: {
  tone?: PillTone;
  mono?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium",
        mono && "font-mono",
        PILL_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** fixture | google-ads | csv — where the active tenant's data comes from. */
export function DataSourceBadge({ kind, className }: { kind: DataSourceKind; className?: string }) {
  return (
    <Pill mono className={className}>
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          kind === "google-ads" ? "bg-lime-500" : "bg-white/50",
        )}
      />
      {kind}
    </Pill>
  );
}

export function PageFrame({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[80rem] space-y-8", className)}>{children}</div>;
}

export function PageHeader({
  eyebrow,
  title,
  meta,
  actions,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  /** Line under the title: mono ids, counts. */
  meta?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        <Eyebrow flag>{eyebrow}</Eyebrow>
        <Heading as="h1" size="display-sm" className="mt-3 break-words">
          {title}
        </Heading>
        {meta && <div className="mt-2 text-sm text-white/60">{meta}</div>}
      </div>
      {actions && <div className="flex flex-wrap gap-2 sm:shrink-0">{actions}</div>}
    </header>
  );
}

export function SectionTitle({
  children,
  count,
  action,
  className,
}: {
  children: ReactNode;
  count?: number;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex flex-wrap items-baseline justify-between gap-3", className)}>
      <h2 className="text-lg font-bold tracking-tight">
        {children}
        {count != null && (
          <span className="numerals ml-2 text-sm font-medium text-white/50">{count}</span>
        )}
      </h2>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
  className,
}: {
  title: string;
  body?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <GlassPanel padding="lg" className={cn("text-center", className)}>
      <CheckerFlag size={12} cols={10} rows={2} className="mx-auto text-white/40" />
      <p className="mt-4 text-md font-semibold">{title}</p>
      {body && <div className="mx-auto mt-2 max-w-prose text-sm text-white/60">{body}</div>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </GlassPanel>
  );
}

const TABLE_LABELS: Record<CsvTable, string> = {
  campaigns: "campaigns.csv",
  keywords: "keywords.csv",
  search_terms: "search_terms.csv",
  conversions: "conversions.csv",
};

/**
 * Visible, honest partial-data state for CSV tenants: which files are
 * missing and every inference the mapper made. Never hidden behind a
 * plausible-looking number.
 */
export function PartialDataNotice({
  ingest,
  className,
}: {
  ingest: CsvIngestMeta;
  className?: string;
}) {
  if (!ingest.partial && ingest.warnings.length === 0) return null;
  return (
    <div
      role="note"
      className={cn(
        "rounded-2xl border border-dashed border-red-400/40 bg-red-500/5 p-5 text-sm",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {ingest.partial ? <Pill tone="warn">Partial data</Pill> : <Pill>Ingest notes</Pill>}
        <span className="text-white/70">
          {ingest.partial
            ? `Missing ${ingest.missing.map((m) => TABLE_LABELS[m]).join(", ")} — rules that depend on them cannot fire.`
            : "All four tables present."}
        </span>
      </div>
      {ingest.warnings.length > 0 && (
        <details className="mt-3 group">
          <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-eyebrow text-white/60 hover:text-lime-500">
            {ingest.warnings.length} ingest note{ingest.warnings.length === 1 ? "" : "s"}
          </summary>
          <ul className="mt-2 space-y-1 border-l-2 border-white/10 pl-4 text-xs text-white/60">
            {ingest.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </details>
      )}
      <p className="mt-3 text-xs text-white/50">
        Drop the missing files into <span className="font-mono">data/case-studies/{ingest.tenant}/</span> —
        columns in <span className="font-mono">data/case-studies/TEMPLATE.csv</span>.
      </p>
    </div>
  );
}
