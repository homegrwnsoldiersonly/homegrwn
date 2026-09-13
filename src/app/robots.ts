import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { robotsFor } from "@/lib/seo";
import { surfaceFromHost } from "@/lib/surface";

/**
 * /robots.txt — host-aware. app.homegrwndigital.com is disallowed outright;
 * the agency and Ads Driver hosts are crawlable except the internal folder
 * prefixes (/agency, /ads, /app — those 307 to clean paths anyway) and /api.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host");
  return robotsFor(surfaceFromHost(host));
}
