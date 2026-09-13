import Link from "next/link";
import { Button, Container, Eyebrow, GlassPanel, Heading } from "@/components/ui";

/** Renders inside the tenant shell (or the bare shell before sign-in). */
export default function AppNotFound() {
  return (
    <Container size="md" className="w-full py-12 sm:py-20">
      <GlassPanel padding="lg" className="text-center">
        <Eyebrow flag>404</Eyebrow>
        <Heading as="h1" size="display-sm" className="mt-4">
          No such view.
        </Heading>
        <p className="mx-auto mt-3 max-w-prose text-sm text-white/65">
          The dashboard has Overview, Accounts, Findings, Changes and History. An account id that
          resolves in no data source also lands here.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Button asChild>
            <Link href="/">Overview</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/accounts">Accounts</Link>
          </Button>
        </div>
      </GlassPanel>
    </Container>
  );
}
