import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

export interface CheckerFlagProps extends Omit<SVGProps<SVGSVGElement>, "height" | "width"> {
  /** Rendered height in px; width follows from cols/rows. */
  size?: number;
  cols?: number;
  rows?: number;
  /** Skew for the "warped" flag feel. 0 = flat grid. */
  skew?: number;
  className?: string;
}

/**
 * Small checkered-flag motif. Uses `currentColor` — set `text-lime-500` on
 * dark. Decorative by default (aria-hidden); pass `aria-label` to expose it.
 */
export function CheckerFlag({
  size = 16,
  cols = 8,
  rows = 3,
  skew = -12,
  className,
  ...rest
}: CheckerFlagProps) {
  const cell = 10;
  const w = cols * cell;
  const h = rows * cell;
  const squares: Array<[number, number]> = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r + c) % 2 === 0) squares.push([c * cell, r * cell]);
    }
  }
  const skewPad = Math.abs(Math.tan((skew * Math.PI) / 180) * h);
  // cn() does not dedupe and Tailwind 4 emits `.text-charcoal-900` before
  // `.text-lime-500`, so a caller's colour class would lose to the default.
  // Only apply the lime default when the caller sets no text colour.
  const hasTextColor = /(^|\s)text-(?!\[)[a-z]+-\d+/.test(className ?? "");

  return (
    <svg
      viewBox={`${skew < 0 ? -skewPad : 0} 0 ${w + skewPad} ${h}`}
      height={size}
      width={(size * (w + skewPad)) / h}
      aria-hidden={rest["aria-label"] ? undefined : true}
      focusable="false"
      className={cn(
        "inline-block shrink-0",
        !hasTextColor && "text-lime-500",
        className,
      )}
      {...rest}
    >
      <g transform={`skewX(${skew})`} fill="currentColor">
        {squares.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={cell} height={cell} />
        ))}
      </g>
    </svg>
  );
}
