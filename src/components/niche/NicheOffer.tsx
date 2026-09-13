import type { OfferBlock } from "@/content/types";
import { Card, Container, Eyebrow, Heading, Section } from "@/components/ui";
import { NicheIcon } from "./NicheIcon";

export interface NicheOfferProps {
  tradeName: string;
  offer: OfferBlock[];
}

/** Light (sage-100) band: what HOMEGRWN actually builds for the trade. */
export function NicheOffer({ tradeName, offer }: NicheOfferProps) {
  return (
    <Section variant="light" id="offer">
      <Container>
        <Eyebrow tone="dark">What we build</Eyebrow>
        <Heading as="h2" id="offer-heading" className="mt-4 max-w-3xl">
          The {tradeName} account, built the way the trade works.
        </Heading>
        <ul className="mt-10 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {offer.map((block) => (
            <Card as="li" key={block.title} tone="light" className="flex flex-col">
              <span
                aria-hidden
                className="inline-flex size-11 items-center justify-center rounded-xl bg-charcoal-900 text-lime-500"
              >
                <NicheIcon name={block.icon} size={22} />
              </span>
              <Heading as="h3" size="subtitle" className="mt-5">
                {block.title}
              </Heading>
              <p className="mt-3 text-base text-charcoal-700">{block.body}</p>
            </Card>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
