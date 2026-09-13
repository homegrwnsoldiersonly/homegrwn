import Link from "next/link";
import type { Step } from "@/content/types";
import {
  Button,
  CheckerFlag,
  Container,
  Eyebrow,
  Heading,
  Section,
} from "@/components/ui";
import { STEPS } from "./content";

export interface HowItWorksProps {
  id?: string;
  steps?: Step[];
  cta?: { label: string; href: string };
}

/** Three steps, no contracts. Light band for rhythm against the dark hero. */
export function HowItWorks({
  id = "how-it-works",
  steps = STEPS,
  cta = { label: "Book a free growth plan", href: "/book" },
}: HowItWorksProps) {
  return (
    <Section variant="light" id={id}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <Eyebrow tone="dark" flag>
              How it works
            </Eyebrow>
            <Heading as="h2" className="mt-4">
              Three steps. No strings.
            </Heading>
            <p className="mt-4 text-md text-charcoal-700">
              No long-term commitment, cancel anytime. We earn the next month
              by what happened in the last one.
            </p>
            <div className="mt-8 hidden lg:block">
              <Button asChild size="lg">
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            </div>
          </div>

          <ol className="grid gap-4 sm:grid-cols-3">
            {steps.map((s) => (
              <li
                key={s.step}
                className="flex flex-col rounded-2xl border border-grey-200 bg-white p-6"
              >
                <span className="numerals text-3xl font-black leading-none text-charcoal-900">
                  0{s.step}
                </span>
                <CheckerFlag
                  size={8}
                  cols={6}
                  rows={2}
                  className="mt-3 text-charcoal-900"
                />
                <Heading as="h3" size="subtitle" className="mt-4">
                  {s.title}
                </Heading>
                <p className="mt-2 text-sm text-charcoal-700">{s.body}</p>
              </li>
            ))}
          </ol>

          <div className="lg:hidden">
            <Button asChild size="lg" block>
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
