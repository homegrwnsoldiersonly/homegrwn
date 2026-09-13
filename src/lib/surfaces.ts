/**
 * Cross-surface links — the one place that knows how to point from one
 * surface (agency / ads / app) at another.
 *
 * On production hosts every surface has its own domain, so the link is the
 * absolute canonical URL (`https://adsdriver.homegrwndigital.com/pricing`).
 * On localhost and Vercel previews all three surfaces share one host, so the
 * link carries the `?surface=` switch the proxy understands
 * (`/pricing?surface=ads`) — it sets the `hg_surface` cookie and rewrites.
 *
 * Mode is decided at build/render time from env, never from request headers,
 * so static marketing pages stay static:
 *   NEXT_PUBLIC_SURFACE_LINKS=host|query   explicit override
 *   VERCEL_ENV=production                  → host
 *   anything else                          → query
 *
 * Cross-surface links must render as plain <a> (full document load), not
 * <Link>: the target lives under a different layout tree and, in query mode,
 * the proxy has to see the request to set the cookie.
 */

import {
  SURFACE_LABELS,
  SURFACE_URLS,
  SURFACE_QUERY,
  type Surface,
} from "./surface";

export type SurfaceLinkMode = "host" | "query";

export function surfaceLinkMode(
  env: Record<string, string | undefined> = process.env,
): SurfaceLinkMode {
  const forced = env.NEXT_PUBLIC_SURFACE_LINKS;
  if (forced === "host" || forced === "query") return forced;
  return env.VERCEL_ENV === "production" ? "host" : "query";
}

function normalisePath(path: string): string {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

/** Href that lands on `surface` at `path`, correct for the current environment. */
export function surfaceHref(
  surface: Surface,
  path = "/",
  mode: SurfaceLinkMode = surfaceLinkMode(),
): string {
  const p = normalisePath(path);
  if (mode === "host") return `${SURFACE_URLS[surface]}${p === "/" ? "" : p}`;
  const sep = p.includes("?") ? "&" : "?";
  return `${p}${sep}${SURFACE_QUERY}=${surface}`;
}

export interface SurfaceLink {
  surface: Surface;
  label: string;
  href: string;
  /** Always true — cross-surface links must be full-document loads. */
  external: true;
}

/** Ready-made nav/footer entries for every surface except `current`. */
export function crossSurfaceLinks(
  current: Surface,
  options: { include?: readonly Surface[]; mode?: SurfaceLinkMode } = {},
): SurfaceLink[] {
  const include = options.include ?? (["agency", "ads", "app"] as const);
  return include
    .filter((s) => s !== current)
    .map((s) => ({
      surface: s,
      label: SURFACE_LABELS[s],
      href: surfaceHref(s, "/", options.mode),
      external: true as const,
    }));
}
