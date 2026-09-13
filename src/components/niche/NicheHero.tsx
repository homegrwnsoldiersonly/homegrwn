import Link from "next/link";
import type { NicheContent } from "@/content/types";
import {
  Button,
  CheckerFlag,
  Container,
  Eyebrow,
  Heading,
  Section,
} from "@/components/ui";

export interface NicheHeroProps {
  niche: NicheContent;
}

/** Trade eyebrow → headline → subhead → "You handle the X. We handle the tech." */
export function NicheHero({ niche }: NicheHeroProps) {
  const [youHandle, weHandle] = splitYouHandle(niche.youHandleLine);
  return (
    <Section variant="grain" padding="lg" as="div">
      <Container>
        <Eyebrow flag>{niche.eyebrow}</Eyebrow>
        <Heading as="h1" size="display-lg" className="mt-5 max-w-4xl">
          {niche.headline}
        </Heading>
        <p className="mt-6 max-w-2xl text-md text-white/70">{niche.subhead}</p>
        <p className="mt-8 max-w-2xl text-lg font-semibold tracking-tight">
          {youHandle}{" "}
          {weHandle && <span className="text-lime-500">{weHandle}</span>}
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href={niche.cta.href}>{niche.cta.label}</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/niches">All home-services trades</Link>
          </Button>
        </div>
        <CheckerFlag size={18} cols={14} rows={3} className="mt-14" />
      </Container>
    </Section>
  );
}

/**
 * "You handle the tanks. We handle the tech." → ["You handle the tanks.", "We handle the tech."]
 * so the second sentence can take the lime accent. Falls back to the whole
 * line unsplit if the sentence boundary isn't there.
 */
function splitYouHandle(line: string): [string, string | null] {
  const idx = line.indexOf(". ");
  if (idx === -1) return [line, null];
  return [line.slice(0, idx + 1), line.slice(idx + 2)];
}
