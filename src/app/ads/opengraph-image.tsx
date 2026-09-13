import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/brand/og";
import { OG_ALT } from "@/lib/seo";

/** Open Graph image for every Ads Driver page (served at /ads/opengraph-image). */
export const alt = OG_ALT.ads;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    variant: "ads",
    eyebrow: "Ads Driver",
    title: ["Judgment you can read.", "Execution you approve."],
    footer: "Google Ads for trades & law firms · recommend-first",
  });
}
