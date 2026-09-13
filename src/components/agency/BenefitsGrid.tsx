import type { OfferBlock } from "@/content/types";
import { Card, Container, Eyebrow, Heading, Section } from "@/components/ui";
import { Icon } from "./Icon";
import { BENEFITS } from "./content";

export interface BenefitsGridProps {
  id?: string;
  eyebrow?: string;
  heading?: string;
  intro?: string;
  items?: OfferBlock[];
}

/** "Why choose us" — the five service pillars, icon + title + body. */
export function BenefitsGrid({
  id = "what-we-run",
  eyebrow = "What we run for you",
  heading = "The whole growth stack. One team. Nothing to babysit.",
  intro = "Most agencies sell ads and leave the rest to you. We own the funnel end to end — from the click to the booked job to the review.",
  items = BENEFITS,
}: BenefitsGridProps) {
  return (
    <Section variant="grain" id={id}>
      <Container>
        <div className="max-w-2xl">
          <Eyebrow flag>{eyebrow}</Eyebrow>
          <Heading as="h2" className="mt-4">
            {heading}
          </Heading>
          <p className="mt-4 text-md text-white/70">{intro}</p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <li
              key={item.title}
              className={
                items.length === 5 && i === items.length - 1
                  ? "sm:col-span-2 lg:col-span-1"
                  : undefined
              }
            >
              <Card padding="md" className="h-full">
                <span className="inline-flex size-11 items-center justify-center rounded-xl border border-lime-500/30 bg-lime-500/10 text-lime-500">
                  <Icon name={item.icon} size={22} />
                </span>
                <Heading as="h3" size="subtitle" className="mt-5">
                  {item.title}
                </Heading>
                <p className="mt-2 text-sm text-white/70">{item.body}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
