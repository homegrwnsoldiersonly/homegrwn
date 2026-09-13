import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CheckerFlag } from "./CheckerFlag";

export type EyebrowTone = "lime" | "muted" | "dark";

export interface EyebrowProps {
  /** lime (default, on dark) · muted (white/60 on dark) · dark (charcoal on light) */
  tone?: EyebrowTone;
  /** Prefix a small checkered-flag motif. */
  flag?: boolean;
  as?: "p" | "span" | "div";
  className?: string;
  children: ReactNode;
}

const TONES: Record<EyebrowTone, string> = {
  lime: "text-lime-500",
  muted: "text-white/60",
  dark: "text-charcoal-700",
};

/** Uppercase label, +0.14em tracking, 12px. */
export function Eyebrow({
  tone = "lime",
  flag = false,
  as: Tag = "p",
  className,
  children,
}: EyebrowProps) {
  return (
    <Tag
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-eyebrow",
        TONES[tone],
        className,
      )}
    >
      {flag && <CheckerFlag size={10} cols={6} rows={2} aria-hidden />}
      {children}
    </Tag>
  );
}
