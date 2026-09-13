import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/brand/og";
import { OG_ALT } from "@/lib/seo";

/**
 * Open Graph image for every agency page (segment-level, inherited by all
 * routes below). Served at /agency/opengraph-image — the proxy passes that
 * path through (isMetadataImagePath) instead of redirecting it.
 */
export const alt = OG_ALT.agency;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    variant: "agency",
    eyebrow: "Growth Partners",
    title: ["You handle the work.", "We handle the tech."],
    footer: "Home services & legal · homegrwndigital.com",
  });
}
