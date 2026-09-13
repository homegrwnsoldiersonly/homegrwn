import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type StatDelta = {
  /** Already-formatted, e.g. "+12%" or "-$340". */
  value: string;
  direction: "up" | "down" | "flat";
  /** Which direction is good. Lime when good, restrained red when bad. */
  goodWhen?: "up" | "down";
};

export interface StatProps {
  label: string;
  /** Formatted value; rendered in Geist Mono tabular numerals. */
  value: ReactNode;
  unit?: string;
  delta?: StatDelta;
  hint?: string;
  size?: "sm" | "md" | "lg";
  /** dark = card · glass = translucent (dashboard) · light = white card · bare = no chrome */
  tone?: "dark" | "glass" | "light" | "bare";
  className?: string;
}

const VALUE_SIZES = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-3xl",
} as const;

const TONES = {
  dark: "rounded-xl border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-white",
  glass: "glass rounded-xl px-4 py-3 text-white",
  light: "rounded-xl border border-grey-200 bg-white px-4 py-3 text-charcoal-900",
  bare: "",
} as const;

function deltaColor(d: StatDelta) {
  if (d.direction === "flat") return "text-white/50";
  const good = (d.goodWhen ?? "up") === d.direction;
  return good ? "text-lime-500" : "text-red-400";
}

export function Stat({
  label,
  value,
  unit,
  delta,
  hint,
  size = "md",
  tone = "dark",
  className,
}: StatProps) {
  return (
    <div className={cn(TONES[tone], className)}>
      <div className="text-xs font-semibold uppercase tracking-eyebrow opacity-60">
        {label}
      </div>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className={cn("numerals font-semibold", VALUE_SIZES[size])}>
          {value}
        </span>
        {unit && <span className="text-sm opacity-60">{unit}</span>}
        {delta && (
          <span className={cn("numerals text-sm font-medium", deltaColor(delta))}>
            {delta.value}
          </span>
        )}
      </div>
      {hint && <div className="mt-1 text-xs opacity-60">{hint}</div>}
    </div>
  );
}
