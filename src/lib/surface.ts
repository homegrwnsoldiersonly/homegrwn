/**
 * Surface routing — pure logic shared by src/proxy.ts and the layouts.
 *
 * One Next.js app serves three surfaces. Each surface lives in a top-level
 * folder under src/app (route groups cannot be rewrite targets — see
 * docs/site-architecture.md), and src/proxy.ts rewrites clean public paths
 * onto that folder so URLs never show the prefix.
 *
 *   agency  homegrwndigital.com            → src/app/agency
 *   app     app.homegrwndigital.com        → src/app/app
 *   ads     adsdriver.homegrwndigital.com  → src/app/ads   (also homegrwn.io)
 *
 * Resolution order (first match wins):
 *   1. host names a surface (production hosts, or `<surface>.localhost`)
 *   2. `?surface=` query (persisted to a cookie so later navigations stick)
 *   3. cookie
 *   4. default → agency
 */

export const SURFACES = ["agency", "ads", "app"] as const;
export type Surface = (typeof SURFACES)[number];

export const DEFAULT_SURFACE: Surface = "agency";
export const SURFACE_COOKIE = "hg_surface";
export const SURFACE_QUERY = "surface";
/** Request header the proxy sets so server code can learn the surface. */
export const SURFACE_HEADER = "x-hg-surface";

/** Reserved top-level path prefixes. No public route may start with these. */
export const SURFACE_PREFIX: Record<Surface, `/${string}`> = {
  agency: "/agency",
  ads: "/ads",
  app: "/app",
};

export const SURFACE_HOSTS: Record<Surface, readonly string[]> = {
  agency: [
    "homegrwndigital.com",
    "www.homegrwndigital.com",
    // Legacy hosts (homegrwnagency.com registration lapses 2026-10-17).
    // Kept mapped so a 301 window is possible; drop after 2026-10-17.
    "homegrwnagency.com",
    "www.homegrwnagency.com",
  ],
  app: [
    "app.homegrwndigital.com",
    // Legacy — drop after 2026-10-17.
    "app.homegrwnagency.com",
  ],
  ads: [
    "adsdriver.homegrwndigital.com",
    "homegrwn.io",
    "www.homegrwn.io",
    // Legacy — drop after 2026-10-17.
    "adsdriver.homegrwnagency.com",
  ],
};

/** Canonical public URL per surface (footer cross-links, metadataBase). */
export const SURFACE_URLS: Record<Surface, string> = {
  agency: "https://homegrwndigital.com",
  app: "https://app.homegrwndigital.com",
  ads: "https://adsdriver.homegrwndigital.com",
};

export const SURFACE_LABELS: Record<Surface, string> = {
  agency: "HOMEGRWN Agency",
  ads: "Ads Driver",
  app: "Dashboard",
};

const ALIASES: Record<string, Surface> = {
  agency: "agency",
  ads: "ads",
  "ads-driver": "ads",
  adsdriver: "ads",
  app: "app",
  dashboard: "app",
};

/** Normalise a user-supplied surface name (query, cookie, subdomain label). */
export function parseSurface(
  value: string | null | undefined,
): Surface | null {
  if (!value) return null;
  return ALIASES[value.trim().toLowerCase()] ?? null;
}

function hostname(hostHeader: string | null | undefined): string {
  if (!hostHeader) return "";
  // Strip port; handle IPv6 literal "[::1]:3000" defensively.
  const h = hostHeader.trim().toLowerCase();
  if (h.startsWith("[")) return h.slice(0, h.indexOf("]") + 1);
  const i = h.indexOf(":");
  return i === -1 ? h : h.slice(0, i);
}

/**
 * Surface named by the Host header, or null when the host is neutral
 * (localhost, *.vercel.app, LAN IPs…).
 */
export function surfaceFromHost(
  hostHeader: string | null | undefined,
): Surface | null {
  const host = hostname(hostHeader);
  if (!host) return null;

  for (const s of SURFACES) {
    if (SURFACE_HOSTS[s].includes(host)) return s;
  }

  // `<label>.localhost` — Chrome/Firefox resolve any *.localhost to loopback.
  if (host.endsWith(".localhost")) {
    const label = host.slice(0, -".localhost".length).split(".").pop();
    return parseSurface(label);
  }

  return null;
}

/** If `pathname` starts with a reserved surface prefix, which surface. */
export function surfacePrefixOf(pathname: string): Surface | null {
  for (const s of SURFACES) {
    const p = SURFACE_PREFIX[s];
    if (pathname === p || pathname.startsWith(`${p}/`)) return s;
  }
  return null;
}

/** Strip a surface prefix from an internal pathname → public pathname. */
export function stripSurfacePrefix(pathname: string): string {
  const s = surfacePrefixOf(pathname);
  if (!s) return pathname;
  return pathname.slice(SURFACE_PREFIX[s].length) || "/";
}

/** Public pathname → internal pathname under the surface folder. */
export function toInternalPath(surface: Surface, pathname: string): string {
  const prefix = SURFACE_PREFIX[surface];
  if (pathname === "/" || pathname === "") return prefix;
  return `${prefix}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export type SurfaceSource = "host" | "query" | "cookie" | "default";

export function resolveSurface(input: {
  host?: string | null;
  query?: string | null;
  cookie?: string | null;
}): { surface: Surface; source: SurfaceSource } {
  const fromHost = surfaceFromHost(input.host);
  if (fromHost) return { surface: fromHost, source: "host" };

  const fromQuery = parseSurface(input.query);
  if (fromQuery) return { surface: fromQuery, source: "query" };

  const fromCookie = parseSurface(input.cookie);
  if (fromCookie) return { surface: fromCookie, source: "cookie" };

  return { surface: DEFAULT_SURFACE, source: "default" };
}

/**
 * Metadata image routes (`opengraph-image`, `twitter-image`, `icon`,
 * `apple-icon`) are colocated inside a surface folder, so Next emits their
 * URLs WITH the internal prefix (`/agency/opengraph-image?<hash>`). The proxy
 * must serve those directly instead of redirecting them to the clean path.
 */
const METADATA_IMAGE_RE =
  /^\/(?:agency|ads|app)\/(?:opengraph-image|twitter-image|icon|apple-icon)\d*$/;

export function isMetadataImagePath(pathname: string): boolean {
  return METADATA_IMAGE_RE.test(pathname);
}
