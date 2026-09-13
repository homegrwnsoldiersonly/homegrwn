import { Container, Eyebrow, FAQ, Heading, Section } from "@/components/ui";
import type { FaqItem } from "@/content/types";

export interface LegalFaqProps {
  name: string;
  items: FaqItem[];
}

/** Five questions a managing partner asks before signing with an agency. */
export function LegalFaq({ name, items }: LegalFaqProps) {
  return (
    <Section variant="dark" id="faq">
      <Container>
        <div className="max-w-3xl">
          <Eyebrow tone="muted">{name} questions</Eyebrow>
          <Heading as="h2" size="display-sm" className="mt-4 text-balance">
            What managing partners and intake directors ask first.
          </Heading>
          <FAQ items={items} className="mt-8" headingLevel="h3" />
        </div>
      </Container>
    </Section>
  );
}
