import { Card, Container, Eyebrow, Heading, Section } from "@/components/ui";
import type { OfferBlock } from "@/content/types";
import { LegalIcon } from "./LegalIcon";

export interface LegalOfferProps {
  name: string;
  youHandleLine: string;
  offer: OfferBlock[];
}

/** What HOMEGRWN runs for the firm. Light band, white cards, charcoal icons. */
export function LegalOffer({ name, youHandleLine, offer }: LegalOfferProps) {
  return (
    <Section variant="light" id="what-we-run">
      <Container>
        <Eyebrow tone="dark">What we run for {name.toLowerCase()} firms</Eyebrow>
        <Heading as="h2" size="display-md" className="mt-4 max-w-3xl text-balance">
          {youHandleLine}
        </Heading>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offer.map((block) => (
            <Card key={block.title} as="li" tone="light" padding="md">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-charcoal-900 text-lime-500">
                <LegalIcon name={block.icon} size={20} />
              </span>
              <Heading as="h3" size="subtitle" className="mt-5">
                {block.title}
              </Heading>
              <p className="mt-2 text-base text-charcoal-700">{block.body}</p>
            </Card>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
