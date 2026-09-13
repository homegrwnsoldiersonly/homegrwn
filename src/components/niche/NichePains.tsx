import type { Pain } from "@/content/types";
import { Card, Container, Eyebrow, Heading, Section } from "@/components/ui";

export interface NichePainsProps {
  tradeName: string;
  pains: Pain[];
}

/** "Why most {trade} accounts leak money" — the pains grid. */
export function NichePains({ tradeName, pains }: NichePainsProps) {
  return (
    <Section variant="dark" id="pains">
      <Container>
        <Eyebrow>The problem</Eyebrow>
        <Heading as="h2" id="pains-heading" className="mt-4 max-w-3xl">
          Where most {tradeName} ad accounts leak money.
        </Heading>
        <ul className="mt-10 grid list-none gap-4 p-0 sm:grid-cols-2">
          {pains.map((pain) => (
            <Card as="li" key={pain.title} className="border-white/10 bg-white/[0.03]">
              <Heading as="h3" size="subtitle">
                {pain.title}
              </Heading>
              <p className="mt-3 text-base text-white/70">{pain.body}</p>
            </Card>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
