import type { Metadata } from "next";
import { Card, Container, Eyebrow, Heading, Section } from "@/components/ui";
import { ApplyForm } from "@/components/ads-driver";

export const metadata: Metadata = {
  title: "Apply for early access",
  alternates: { canonical: "/apply" },
  description:
    "Apply for Ads Driver early access. Trades and personal-injury firms only. Manager-link on read-only scope, no passwords, no card, and a first audit before any conversation about money.",
  robots: { index: true, follow: true },
};

const NEXT_STEPS = [
  {
    title: "A human reads it",
    body: "Early access is a short, hand-run list. We check the account is a fit for a pack we have today.",
  },
  {
    title: "Manager-link invite",
    body: "You accept a manager-account link from inside your own Google Ads. Read-only scope. No passwords, no billing access.",
  },
  {
    title: "First audit, in writing",
    body: "Ranked findings with evidence and niche rationale. You read them before anyone talks about a fee.",
  },
  {
    title: "You decide",
    body: "The flat monthly fee is quoted to you first. No contract, cancel any time, spend stays on your billing.",
  },
];

export default function ApplyPage() {
  return (
    <>
      <Section variant="grain" padding="md" as="div" className="bg-ink-950">
        <Container size="lg">
          <Eyebrow flag>Early access</Eyebrow>
          <Heading as="h1" size="display-lg" className="mt-5 max-w-3xl">
            Apply for Ads Driver.
          </Heading>
          <p className="mt-6 max-w-2xl text-md text-white/70">
            Trades and personal-injury firms running — or about to run — Google
            Ads. Five fields and an optional note. No card. The next step, if it&apos;s a fit, is a
            read-only manager link and a first audit.
          </p>
        </Container>
      </Section>

      <Section variant="dark" className="bg-ink-950">
        <Container size="xl" className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <Card radius="xl" padding="lg" className="relative border-white/10 bg-charcoal-900/80">
            <ApplyForm />
          </Card>

          <aside>
            <Eyebrow>What happens next</Eyebrow>
            <ol className="mt-5 space-y-6">
              {NEXT_STEPS.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[2.5rem_1fr] gap-x-3">
                  <span className="numerals text-2xl font-black leading-none text-lime-500">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-bold tracking-tight text-white">{s.title}</h3>
                    <p className="mt-1 text-sm text-white/65">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-8 rounded-lg border border-white/10 bg-charcoal-900/60 p-4 text-xs text-white/55">
              Not a trade or a PI firm? Apply anyway and say what you do. We
              will tell you plainly whether a pack is coming rather than run a
              generic account through the wrong judgment.
            </p>
          </aside>
        </Container>
      </Section>
    </>
  );
}
