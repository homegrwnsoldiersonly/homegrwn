"use client";

/**
 * Findings filter bar. State lives in the URL (?severity=…&pack=…&category=…
 * &account=…) so the Server Component page does the filtering and links are
 * shareable. Client Component only for the router writes.
 */

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { Severity } from "@/lib/knowledge/types";
import { cn } from "@/lib/cn";
import { SEVERITIES, SEVERITY_STYLES } from "./severity";

export interface FilterOption {
  value: string;
  label: string;
}

export function FindingsFilters({
  packs,
  categories,
  accounts,
  className,
}: {
  packs: FilterOption[];
  categories: FilterOption[];
  accounts: FilterOption[];
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname() ?? "/findings";
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const severities = (params.get("severity") ?? "")
    .split(",")
    .filter((s): s is Severity => (SEVERITIES as readonly string[]).includes(s));
  const pack = params.get("pack") ?? "";
  const category = params.get("category") ?? "";
  const account = params.get("account") ?? "";
  const anyActive = severities.length > 0 || !!pack || !!category || !!account;

  function update(mutate: (next: URLSearchParams) => void) {
    const next = new URLSearchParams(params.toString());
    mutate(next);
    const qs = next.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  function toggleSeverity(s: Severity) {
    update((next) => {
      const set = new Set(severities);
      if (set.has(s)) set.delete(s);
      else set.add(s);
      const ordered = SEVERITIES.filter((k) => set.has(k));
      if (ordered.length > 0) next.set("severity", ordered.join(","));
      else next.delete("severity");
    });
  }

  function setParam(key: string, value: string) {
    update((next) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
  }

  const selectClass =
    "glass appearance-none rounded-lg py-1.5 pl-3 pr-8 text-sm text-white " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-500 " +
    "[&>option]:bg-charcoal-900 [&>option]:text-white";

  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      aria-busy={pending || undefined}
      data-pending={pending || undefined}
    >
      {/* The <button> is the ≥44px hit area; the inner span is the 26px visual chip. */}
      <div className="-my-1 flex flex-wrap items-center gap-x-2" role="group" aria-label="Severity">
        {SEVERITIES.map((s) => {
          const on = severities.includes(s);
          return (
            <button
              key={s}
              type="button"
              aria-pressed={on}
              onClick={() => toggleSeverity(s)}
              className="group/chip inline-flex min-h-11 items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-500"
            >
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors duration-150 ease-brand",
                  on
                    ? "border-lime-500 bg-lime-500/10 text-lime-500"
                    : "border-white/15 text-white/70 group-hover/chip:border-white/30 group-hover/chip:text-white",
                )}
              >
                <span aria-hidden className={cn("size-1.5 rounded-full", SEVERITY_STYLES[s].dot)} />
                {SEVERITY_STYLES[s].label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SelectField
          label="Pack"
          value={pack}
          options={packs}
          onChange={(v) => setParam("pack", v)}
          className={selectClass}
        />
        <SelectField
          label="Category"
          value={category}
          options={categories}
          onChange={(v) => setParam("category", v)}
          className={selectClass}
        />
        {accounts.length > 1 && (
          <SelectField
            label="Account"
            value={account}
            options={accounts}
            onChange={(v) => setParam("account", v)}
            className={selectClass}
          />
        )}
        {anyActive && (
          <button
            type="button"
            onClick={() =>
              update((next) => {
                for (const k of ["severity", "pack", "category", "account"]) next.delete(k);
              })
            }
            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white/60 transition-colors duration-150 ease-brand hover:text-lime-500"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  className: string;
}) {
  return (
    <label className="relative inline-flex items-center gap-2 text-xs text-white/60">
      <span className="sr-only sm:not-sr-only">{label}</span>
      <span className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className={className}>
          <option value="">All {plural(label.toLowerCase())}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          width="12"
          height="12"
          viewBox="0 0 14 14"
          fill="none"
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/60"
        >
          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </label>
  );
}

/** English plural for filter labels ("category" → "categories"). */
function plural(word: string): string {
  return /[^aeiou]y$/i.test(word) ? word.slice(0, -1) + "ies" : word + "s";
}
