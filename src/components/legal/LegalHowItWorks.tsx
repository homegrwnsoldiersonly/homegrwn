import { Container, Eyebrow, Heading, Section } from "@/components/ui";
import type { Step } from "@/content/types";

export interface LegalHowItWorksProps {
  steps: Step[];
}

/** Numbered engagement steps. Anchor target for the hero's secondary CTA. */
export function LegalHowItWorks({ steps }: LegalHowItWorksProps) {
  return (
    <Section variant="grain" id="how-it-works">
      <Container>
        <Eyebrow flag>How it works</Eyebrow>
        <Heading as="h2" size="display-md" className="mt-4 max-w-3xl text-balance">
          Signed cases become the signal before a dollar of spend goes live.
        </Heading>
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.step} className="border-t border-white/15 pt-5">
              <span className="numerals text-sm text-lime-500">
                Step {String(step.step).padStart(2, "0")}
              </span>
              <Heading as="h3" size="subtitle" className="mt-3">
                {step.title}
              </Heading>
              <p className="mt-2 text-base text-white/70">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
