import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { PUBLIC_SURFACES, sitemapEntries } from "@/lib/seo";
import { surfaceFromHost } from "@/lib/surface";

/**
 * /sitemap.xml — served for every host (the proxy skips paths with an
 * extension, so this file is reached directly). It reads the Host header so
 * each production domain lists only its own URLs; a neutral host (localhost,
 * *.vercel.app) lists every public surface. The dashboard contributes nothing
 * (noindex). Route lists live in src/lib/seo.ts and are unit-tested.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get("host");
  const surface = surfaceFromHost(host);
  const surfaces = surface ? [surface] : PUBLIC_SURFACES;
  const lastModified = new Date();
  return surfaces.flatMap((s) => sitemapEntries(s, lastModified));
}
