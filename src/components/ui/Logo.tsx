import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { brand } from "@/lib/brand/tokens";
import { CheckerFlag } from "./CheckerFlag";

export interface LogoProps {
  /** lockup = wordmark + flag raster · wordmark = text-only "HOMEGRWN" */
  variant?: "lockup" | "wordmark";
  /** dark = on dark ground (ink inverted to white) · light = on light ground */
  tone?: "dark" | "light";
  /** Rendered height in px (lockup keeps its 468×282 ratio). */
  height?: number;
  /**
   * Wordmark only: add the small checkered-flag motif after the text (hidden
   * below `sm` so the wordmark + a badge fit a 375px nav).
   */
  flag?: boolean;
  /** Wrap in a <Link>. */
  href?: string;
  priority?: boolean;
  className?: string;
}

const RATIO = brand.lockupWidth / brand.lockupHeight;

/**
 * Brand mark. `wordmark` is the text-only HOMEGRWN (Inter black, +0.18em
 * tracking — docs/brand.md) and is the right choice anywhere under ~64px tall:
 * the raster lockup's wordmark line is unreadable that small. `lockup` is the
 * wordmark + flag + GROWTH PARTNERS raster (black ink on transparent; on dark
 * grounds it is inverted to white via CSS) for the footer and other large
 * placements.
 */
export function Logo({
  variant = "lockup",
  tone = "dark",
  height = 40,
  flag = false,
  href,
  priority = false,
  className,
}: LogoProps) {
  const inner =
    variant === "wordmark" ? (
      <span className="inline-flex items-center gap-2.5">
        <span
          className={cn(
            "font-black uppercase tracking-wordmark",
            tone === "dark" ? "text-white" : "text-charcoal-900",
          )}
          style={{ fontSize: Math.round(height * 0.55), lineHeight: 1 }}
        >
          {brand.name}
        </span>
        {flag && (
          <CheckerFlag
            size={Math.max(8, Math.round(height * 0.3))}
            cols={6}
            rows={2}
            className={cn(
              "hidden sm:inline-block",
              tone === "light" && "text-charcoal-900",
            )}
          />
        )}
      </span>
    ) : (
      <Image
        src={brand.lockupPath}
        alt={`${brand.name} — Growth Partners`}
        width={Math.round(height * RATIO)}
        height={height}
        sizes={`${Math.round(height * RATIO)}px`}
        priority={priority}
        className={cn("h-auto w-auto", tone === "dark" && "invert")}
        style={{ height, width: "auto" }}
      />
    );

  const classes = cn("inline-flex shrink-0 items-center", className);

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={`${brand.name} home`}>
        {inner}
      </Link>
    );
  }
  return <span className={classes}>{inner}</span>;
}
