import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

/**
 * Minimal inline icon set in the Lucide idiom (24-grid, 1.5px stroke,
 * `currentColor`). lucide-react is not installed yet; OfferBlock.icon names
 * resolve here so content files can keep using Lucide names. Add paths as
 * needed — or swap this file for lucide-react once the niche builder adds it.
 */

export type IconName =
  | "PhoneCall"
  | "LayoutTemplate"
  | "Megaphone"
  | "BarChart3"
  | "Inbox"
  | "Bot"
  | "MessageSquare"
  | "Gauge"
  | "MapPin"
  | "CalendarCheck"
  | "ClipboardList"
  | "Zap"
  | "Wrench"
  | "Check"
  | "X"
  | "Minus"
  | "ArrowRight"
  | "Play"
  | "Target"
  | "Star"
  | "Repeat";

const PATHS: Record<IconName, string[]> = {
  PhoneCall: [
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
    "M14.05 2a9 9 0 0 1 8 7.94",
    "M14.05 6A5 5 0 0 1 18 10",
  ],
  LayoutTemplate: [
    "M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z",
    "M3 15a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z",
    "M16 15a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1z",
  ],
  Megaphone: ["m3 11 18-5v12L3 14v-3z", "M11.6 16.8a3 3 0 1 1-5.8-1.6"],
  BarChart3: ["M3 3v18h18", "M18 17V9", "M13 17V5", "M8 17v-3"],
  Inbox: [
    "M22 12h-6l-2 3h-4l-2-3H2",
    "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
  ],
  Bot: [
    "M5 11a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z",
    "M12 9V5",
    "M10 5h4",
    "M9 15h.01",
    "M15 15h.01",
    "M2 14h3",
    "M19 14h3",
  ],
  MessageSquare: [
    "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  ],
  Gauge: ["m12 14 4-4", "M3.34 19a10 10 0 1 1 17.32 0"],
  MapPin: [
    "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",
    "M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  ],
  CalendarCheck: [
    "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
    "M16 2v4",
    "M8 2v4",
    "M3 10h18",
    "m9 16 2 2 4-4",
  ],
  ClipboardList: [
    "M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z",
    "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
    "M12 11h4",
    "M12 16h4",
    "M8 11h.01",
    "M8 16h.01",
  ],
  Zap: ["M13 2 3 14h9l-1 8 10-12h-9l1-8z"],
  Wrench: [
    "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  ],
  Check: ["M20 6 9 17l-5-5"],
  X: ["M18 6 6 18", "m6 6 12 12"],
  Minus: ["M5 12h14"],
  ArrowRight: ["M5 12h14", "m12 5 7 7-7 7"],
  Play: ["M6 3 20 12 6 21z"],
  Target: [
    "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z",
    "M18 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0z",
    "M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0z",
  ],
  Star: [
    "m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  ],
  Repeat: ["m17 2 4 4-4 4", "M3 11v-1a4 4 0 0 1 4-4h14", "m7 22-4-4 4-4", "M21 13v1a4 4 0 0 1-4 4H3"],
};

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName | string;
  /** Rendered size in px. */
  size?: number;
  className?: string;
}

export function isIconName(name: string): name is IconName {
  return name in PATHS;
}

/** Renders the named icon; unknown names fall back to a neutral Zap. */
export function Icon({ name, size = 20, className, ...rest }: IconProps) {
  const paths = PATHS[isIconName(name) ? name : "Zap"];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={rest["aria-label"] ? undefined : true}
      focusable="false"
      className={cn("inline-block shrink-0", className)}
      {...rest}
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
