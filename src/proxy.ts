/**
 * Host → surface routing (Next 16 `proxy`, formerly middleware).
 *
 * Every public request is rewritten onto one of three top-level surface
 * folders so URLs stay clean:
 *
 *   GET homegrwndigital.com/niches/septic   → /agency/niches/septic
 *   GET app.homegrwndigital.com/accounts/1  → /app/accounts/1
 *   GET adsdriver.homegrwndigital.com/      → /ads
 *
 * Neutral hosts (localhost, *.vercel.app) pick the surface from
 * `?surface=agency|ads|app` (persisted in the `hg_surface` cookie) or from a
 * `<surface>.localhost` subdomain; default is the agency site.
 *
 * Direct hits on a reserved prefix (`/app/...` typed by hand) are redirected
 * to the clean path with the cookie set, so the internal folder names never
 * become canonical URLs.
 *
 * Pure resolution logic lives in src/lib/surface.ts (unit-tested).
 */

import { NextResponse, type NextRequest } from "next/server";
import {
  isMetadataImagePath,
  resolveSurface,
  SURFACE_COOKIE,
  SURFACE_HEADER,
  SURFACE_PREFIX,
  SURFACE_QUERY,
  surfacePrefixOf,
  toInternalPath,
  type Surface,
} from "@/lib/surface";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function rememberSurface(res: NextResponse, surface: Surface) {
  res.cookies.set({
    name: SURFACE_COOKIE,
    value: surface,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    httpOnly: false,
  });
}

export function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const { pathname } = nextUrl;

  // 0. Generated metadata images live under the surface folder by design
  //    (/agency/opengraph-image) — serve them, never redirect them.
  if (isMetadataImagePath(pathname)) return NextResponse.next();

  // 1. Reserved prefix typed directly → redirect to the clean URL.
  const direct = surfacePrefixOf(pathname);
  if (direct) {
    const url = nextUrl.clone();
    url.pathname = pathname.slice(SURFACE_PREFIX[direct].length) || "/";
    url.searchParams.delete(SURFACE_QUERY);
    const res = NextResponse.redirect(url, 307);
    rememberSurface(res, direct);
    return res;
  }

  // 2. Resolve the surface and rewrite onto its folder.
  const { surface, source } = resolveSurface({
    host: request.headers.get("host"),
    query: nextUrl.searchParams.get(SURFACE_QUERY),
    cookie: request.cookies.get(SURFACE_COOKIE)?.value,
  });

  const url = nextUrl.clone();
  url.pathname = toInternalPath(surface, pathname);
  url.searchParams.delete(SURFACE_QUERY);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(SURFACE_HEADER, surface);

  const res = NextResponse.rewrite(url, {
    request: { headers: requestHeaders },
  });
  res.headers.set(SURFACE_HEADER, surface);
  if (source === "query") rememberSurface(res, surface);
  return res;
}

export const config = {
  matcher: [
    /*
     * Everything except:
     * - /api/*            (route handlers are surface-agnostic)
     * - /_next/*          (static chunks, image optimizer)
     * - files with an extension (public/ assets: /brand/*.png, /favicon.ico…)
     */
    "/((?!api|_next/static|_next/image|.*\\.[\\w]+$).*)",
  ],
};
