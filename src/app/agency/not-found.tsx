import Link from "next/link";
import { Button, Container, Eyebrow, Heading, Section } from "@/components/ui";

export default function AgencyNotFound() {
  return (
    <Section variant="grain" padding="lg" as="div" className="flex min-h-[60dvh] items-center">
      <Container size="md" className="text-center">
        <Eyebrow flag>404</Eyebrow>
        <Heading as="h1" size="display-md" className="mt-4">
          That page isn&apos;t here.
        </Heading>
        <p className="mt-4 text-md text-white/70">
          The link may be old, or the page hasn&apos;t been published yet.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/book">Book a strategy call</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
