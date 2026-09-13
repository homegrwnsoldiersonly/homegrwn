import type { Step } from "@/content/types";
import { Container, Eyebrow, Heading, Section } from "@/components/ui";

export interface NicheStepsProps {
  steps: Step[];
}

/** How it works — numbered (Geist Mono numerals) steps on the dark ground. */
export function NicheSteps({ steps }: NicheStepsProps) {
  return (
    <Section variant="dark" id="how-it-works">
      <Container>
        <Eyebrow>How it works</Eyebrow>
        <Heading as="h2" id="how-heading" className="mt-4 max-w-3xl">
          From audit to booked jobs.
        </Heading>
        <ol className="mt-10 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li
              key={s.step}
              className="relative border-t border-white/10 pt-6"
            >
              <span
                aria-hidden
                className="numerals block text-sm font-medium text-lime-500"
              >
                {String(s.step).padStart(2, "0")}
              </span>
              <Heading as="h3" size="subtitle" className="mt-3">
                <span className="sr-only">Step {s.step}: </span>
                {s.title}
              </Heading>
              <p className="mt-3 text-base text-white/70">{s.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
