import type { NicheContent } from "@/content/types";
import { Container, Eyebrow, Heading, Section } from "@/components/ui";
import { NicheCard } from "./NicheCard";

export interface NicheRelatedProps {
  niches: NicheContent[];
}

/** Cross-links to sibling trades. Renders nothing if there are none. */
export function NicheRelated({ niches }: NicheRelatedProps) {
  if (niches.length === 0) return null;
  return (
    <Section variant="dark" padding="sm">
      <Container>
        <Eyebrow>Other trades</Eyebrow>
        <Heading as="h2" id="related-heading" size="display-sm" className="mt-4">
          Same playbook, different truck.
        </Heading>
        <ul className="mt-8 grid list-none gap-4 p-0 sm:grid-cols-3">
          {niches.map((n) => (
            <NicheCard key={n.slug} niche={n} variant="compact" />
          ))}
        </ul>
      </Container>
    </Section>
  );
}
