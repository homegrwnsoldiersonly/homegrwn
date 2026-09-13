import Link from "next/link";
import { cn } from "@/lib/cn";
import type { CtaLink } from "@/content/types";
import { Button } from "./Button";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";
import { Heading } from "./Heading";

export interface CTAStripProps {
  eyebrow?: string;
  heading: string;
  body?: string;
  primary: CtaLink;
  secondary?: CtaLink;
  /** lime = lime-500 band, ink text · dark = charcoal · grain = ink→charcoal + noise */
  tone?: "lime" | "dark" | "grain";
  className?: string;
}

/** Full-width call-to-action band. Copy only — no numbers, no social proof. */
export function CTAStrip({
  eyebrow,
  heading,
  body,
  primary,
  secondary,
  tone = "lime",
  className,
}: CTAStripProps) {
  const isLime = tone === "lime";
  return (
    <section
      data-tone={isLime ? "light" : "dark"}
      className={cn(
        "group py-16 sm:py-24",
        isLime && "bg-lime-500 text-ink-950",
        tone === "dark" && "bg-charcoal-900 text-white",
        tone === "grain" && "bg-ground bg-grain text-white",
        className,
      )}
    >
      <Container size="lg" className="text-center">
        {eyebrow && (
          <Eyebrow tone={isLime ? "dark" : "lime"} className={isLime ? "text-ink-950/70" : undefined}>
            {eyebrow}
          </Eyebrow>
        )}
        <Heading as="h2" size="display-md" className={eyebrow ? "mt-4" : undefined}>
          {heading}
        </Heading>
        {body && (
          <p
            className={cn(
              "mx-auto mt-4 max-w-2xl text-md",
              isLime ? "text-ink-950/75" : "text-white/70",
            )}
          >
            {body}
          </p>
        )}
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          {/* On the lime band the primary is ink-on-lime: the `inverse` variant
              carries no light-tone overrides, so its white text survives the
              section's data-tone="light" (a className override would lose to
              the higher-specificity group selector). */}
          <Button asChild size="lg" variant={isLime ? "inverse" : "primary"}>
            <Link href={primary.href}>{primary.label}</Link>
          </Button>
          {secondary && (
            <Button asChild size="lg" variant="ghost">
              <Link href={secondary.href}>{secondary.label}</Link>
            </Button>
          )}
        </div>
      </Container>
    </section>
  );
}
