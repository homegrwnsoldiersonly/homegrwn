import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

/**
 * Resolves `OfferBlock.icon` (a Lucide icon NAME) to an inline SVG.
 * lucide-react is not a dependency yet; these are the Lucide path sets for the
 * handful of names the niche content uses (ISC-licensed), drawn at the brand
 * spec: 24px grid, 1.5px stroke, currentColor. Unknown names fall back to a
 * checkered-square glyph so a typo never renders nothing.
 */

const PATHS: Record<string, string[]> = {
  PhoneCall: [
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
    "M14.05 2a9 9 0 0 1 8 7.94",
    "M14.05 6A5 5 0 0 1 18 10",
  ],
  MapPin: [
    "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
    "M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  ],
  ShieldCheck: [
    "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
    "m9 12 2 2 4-4",
  ],
  Clock: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 6v6l4 2"],
  Thermometer: ["M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"],
  CircleDollarSign: [
    "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
    "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",
    "M12 18V6",
  ],
  Wrench: [
    "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  ],
  CloudLightning: [
    "M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973",
    "m13 12-3 5h4l-3 5",
  ],
  Home: [
    "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    "M9 22V12h6v10",
  ],
  Filter: ["M22 3H2l8 9.46V19l4 2v-8.54L22 3z"],
  Gauge: ["m12 14 4-4", "M3.34 19a10 10 0 1 1 17.32 0"],
  Droplets: [
    "M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z",
    "M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97",
  ],
  CalendarDays: [
    "M8 2v4",
    "M16 2v4",
    "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
    "M3 10h18",
    "M8 14h.01",
    "M12 14h.01",
    "M16 14h.01",
    "M8 18h.01",
    "M12 18h.01",
    "M16 18h.01",
  ],
  ListChecks: ["m3 17 2 2 4-4", "m3 7 2 2 4-4", "M13 6h8", "M13 12h8", "M13 18h8"],
  Route: [
    "M9 19a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
    "M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15",
    "M21 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  ],
  Zap: [
    "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
  ],
  PlugZap: [
    "M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z",
    "m2 22 3-3",
    "M7.5 13.5 10 11",
    "M10.5 16.5 13 14",
    "m18 3-4 4h6l-4 4",
  ],
};

const FALLBACK = [
  "M3 3h18v18H3z",
  "M3 9h18",
  "M3 15h18",
  "M9 3v18",
  "M15 3v18",
];

export const NICHE_ICON_NAMES = Object.keys(PATHS);

export interface NicheIconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  /** Lucide icon name from OfferBlock.icon. */
  name: string;
  /** Pixel size (width = height). Default 24. */
  size?: number;
}

export function NicheIcon({ name, size = 24, className, ...rest }: NicheIconProps) {
  const paths = PATHS[name] ?? FALLBACK;
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
      aria-hidden
      focusable="false"
      className={cn("shrink-0", className)}
      {...rest}
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
