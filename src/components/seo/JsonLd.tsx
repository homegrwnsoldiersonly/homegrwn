import { serializeJsonLd } from "@/lib/seo";

/**
 * Inline JSON-LD (Next 16 guide: render a <script type="application/ld+json">
 * from the page). `<` is escaped so page data can never break out of the tag.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
