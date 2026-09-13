import Link from "next/link";
import { Card, Container, Eyebrow, Heading, Section } from "@/components/ui";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";
import { NICHES, type NicheCard } from "./content";

export interface NicheSelectorProps {
  id?: string;
  niches?: NicheCard[];
  className?: string;
}

/**
 * "Pick your trade" — one card per niche, each carrying that trade's
 * "You handle the X. We handle the tech." line. Links to /niches/* and
 * /legal/*, which the niche builder lands.
 */
export function NicheSelector({
  id = "niches",
  niches = NICHES,
  className,
}: NicheSelectorProps) {
  return (
    <Section variant="dark" id={id} className={className}>
      <Container>
        <div className="max-w-2xl">
          <Eyebrow flag>Pick your trade</Eyebrow>
          <Heading as="h2" className="mt-4">
            Built for the trades that run on the phone ringing.
          </Heading>
          <p className="mt-4 text-md text-white/70">
            Every niche gets its own playbook — the offers, the seasons, the
            objections. Choose yours to see how the system runs for it.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {niches.map((n) => (
            <li
              key={n.slug}
              className={cn(
                "flex",
                n.vertical === "legal" && "sm:col-span-2 lg:col-span-1",
              )}
            >
              <Link
                href={n.href}
                className="group/niche flex w-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <Card
                  interactive
                  padding="md"
                  className="flex w-full flex-col justify-between"
                >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <Eyebrow tone="muted" as="span">
                      {n.vertical === "legal" ? "Legal" : "Home services"}
                    </Eyebrow>
                    <Icon
                      name="ArrowRight"
                      size={18}
                      className="text-white/40 transition-[color,transform] duration-200 ease-brand group-hover/niche:translate-x-0.5 group-hover/niche:text-lime-500"
                    />
                  </div>
                  <Heading as="h3" size="title" className="mt-3">
                    {n.name}
                  </Heading>
                  <p className="mt-2 text-sm text-white/65">{n.blurb}</p>
                </div>
                <p className="mt-5 text-sm font-semibold text-lime-500">
                  {n.youHandleLine}
                </p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
