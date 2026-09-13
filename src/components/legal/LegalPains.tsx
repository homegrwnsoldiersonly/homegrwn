import { Container, Eyebrow, Heading, Section } from "@/components/ui";
import type { Pain } from "@/content/types";

export interface LegalPainsProps {
  /** Niche display name, e.g. "Personal injury". */
  name: string;
  pains: Pain[];
}

/**
 * The pains a managing partner / intake director recognises. Editorial list
 * on the dark ground — no cards, so nothing fights the charcoal for contrast.
 */
export function LegalPains({ name, pains }: LegalPainsProps) {
  return (
    <Section variant="dark" id="pains">
      <Container>
        <Eyebrow tone="muted">Where {name.toLowerCase()} budgets leak</Eyebrow>
        <Heading as="h2" size="display-md" className="mt-4 max-w-3xl text-balance">
          The platform sees a lead. It cannot see a case.
        </Heading>
        <ol className="mt-10 grid gap-x-10 border-t border-white/10 sm:grid-cols-2">
          {pains.map((pain, i) => (
            <li
              key={pain.title}
              className="flex gap-4 border-b border-white/10 py-6"
            >
              <span
                aria-hidden
                className="numerals mt-1 w-8 shrink-0 text-sm text-lime-500"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <Heading as="h3" size="subtitle">
                  {pain.title}
                </Heading>
                <p className="mt-2 text-base text-white/70">{pain.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
