/**
 * HOMEGRWN brand tokens as TypeScript constants.
 *
 * Mirror of the `@theme` block in src/app/globals.css, which mirrors
 * docs/brand.md. Use these where CSS classes cannot reach: chart palettes,
 * OG-image generation (ImageResponse), canvas, inline SVG fills.
 *
 * Do not add colors here that are not in docs/brand.md.
 */

export const colors = {
  ink950: "#0d0d0d",
  charcoal900: "#1d1f13",
  charcoal700: "#404245",
  slate800: "#262c37",
  forest800: "#14281b",
  lime500: "#a9ed42",
  lime300: "#dbff94",
  lime100: "#f0ffd1",
  sage100: "#eaf0dd",
  paper50: "#f7f8f5",
  white: "#ffffff",
  grey200: "#d6d6d6",
  /** Restrained red — negative deltas on the dashboard only. */
  red500: "#d8564b",
  red400: "#e57a6f",
  red300: "#f0a49b",
} as const;

export type ColorToken = keyof typeof colors;

/** Tailwind token names → hex, for anything that wants the CSS names. */
export const colorByTokenName: Record<string, string> = {
  "ink-950": colors.ink950,
  "charcoal-900": colors.charcoal900,
  "charcoal-700": colors.charcoal700,
  "slate-800": colors.slate800,
  "forest-800": colors.forest800,
  "lime-500": colors.lime500,
  "lime-300": colors.lime300,
  "lime-100": colors.lime100,
  "sage-100": colors.sage100,
  "paper-50": colors.paper50,
  white: colors.white,
  "grey-200": colors.grey200,
  "red-500": colors.red500,
  "red-400": colors.red400,
  "red-300": colors.red300,
};

/**
 * Chart palette. Lime is the single accent; everything else is a neutral step
 * so a multi-series chart still reads "one accent per viewport".
 */
export const chart = {
  primary: colors.lime500,
  secondary: colors.lime300,
  tertiary: colors.lime100,
  neutral: colors.charcoal700,
  neutralSoft: colors.grey200,
  negative: colors.red500,
  grid: "rgba(255,255,255,0.08)",
  axis: "rgba(255,255,255,0.35)",
  textOnDark: colors.white,
  textOnLight: colors.charcoal900,
} as const;

/** Grounds (match the `bg-ground*` utilities in globals.css). */
export const gradients = {
  ground: `linear-gradient(180deg, ${colors.ink950} 0%, ${colors.charcoal900} 100%)`,
  groundForest: `linear-gradient(160deg, ${colors.charcoal900} 0%, ${colors.forest800} 100%)`,
} as const;

/** Type scale in px: 12 / 14 / 16 / 18 / 22 / 28 / 36 / 48 / 64 / 88. */
export const typeScale = {
  xs: 12,
  sm: 14,
  base: 16,
  md: 18,
  lg: 22,
  xl: 28,
  "2xl": 36,
  "3xl": 48,
  "4xl": 64,
  "5xl": 88,
} as const;

export const tracking = {
  display: "-0.02em",
  eyebrow: "0.14em",
  wordmark: "0.18em",
} as const;

export const fontFamilies = {
  /** Inter — UI and display (weight + tracking make the display voice). */
  sans: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  /** Geist Mono — data, IDs, money. */
  mono: "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
} as const;

export const radii = {
  /** Agency: rounded-2xl cards. */
  card: 16,
  /** Ads Driver: sharper xl radii. */
  product: 12,
  pill: 9999,
} as const;

export const motion = {
  /** Only 150–200 ms ease-out on the dashboard. */
  fastMs: 150,
  baseMs: 200,
  ease: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

export const brand = {
  name: "HOMEGRWN",
  tagline: "Growth Partners.",
  secondaryLine: "You handle the work. We handle the tech.",
  lockupPath: "/brand/homegrwn-wordmark-flag.png",
  lockupWidth: 468,
  lockupHeight: 282,
} as const;

export const tokens = {
  colors,
  chart,
  gradients,
  typeScale,
  tracking,
  fontFamilies,
  radii,
  motion,
  brand,
} as const;

export default tokens;
