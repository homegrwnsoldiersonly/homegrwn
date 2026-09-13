import Link from "next/link";
import { Button, Container, Eyebrow, Heading, Section } from "@/components/ui";

export default function AdsDriverNotFound() {
  return (
    <Section variant="grain" padding="lg" as="div" className="flex min-h-[60dvh] items-center bg-ink-950">
      <Container size="md" className="text-center">
        <Eyebrow flag>404</Eyebrow>
        <Heading as="h1" size="display-md" className="mt-4">
          No route here.
        </Heading>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">Ads Driver home</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/apply">Apply for early access</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
