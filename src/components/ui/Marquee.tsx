import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface MarqueeProps {
  /** Items to scroll. Rendered twice for a seamless loop. */
  items: ReactNode[];
  /** Seconds per loop. */
  speed?: number;
  /** Pause on hover. */
  pauseOnHover?: boolean;
  /** Gap between items (Tailwind gap class). */
  gapClassName?: string;
  /** Fade the edges into the ground. */
  fade?: boolean;
  className?: string;
  /** Accessible label for the strip; items are treated as decorative. */
  "aria-label"?: string;
}

/**
 * CSS-only marquee. Two copies of the track translate by -50%; the second copy
 * is aria-hidden. Honors prefers-reduced-motion (animation disabled globally).
 */
export function Marquee({
  items,
  speed = 40,
  pauseOnHover = true,
  gapClassName = "gap-10",
  fade = true,
  className,
  "aria-label": ariaLabel,
}: MarqueeProps) {
  const track = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className={cn("flex shrink-0 items-center pr-10", gapClassName)}
    >
      {items.map((item, i) => (
        <li key={i} className="shrink-0 whitespace-nowrap">
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      role={ariaLabel ? "region" : undefined}
      aria-label={ariaLabel}
      className={cn(
        "group/marquee relative w-full overflow-hidden",
        fade &&
          "[mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]",
        className,
      )}
      style={{ ["--marquee-duration" as string]: `${speed}s` }}
    >
      <div
        className={cn(
          "flex w-max animate-marquee will-change-transform motion-reduce:animate-none",
          pauseOnHover && "group-hover/marquee:[animation-play-state:paused]",
        )}
      >
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}
