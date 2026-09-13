import Link from "next/link";
import { Button, Container, Eyebrow, Heading } from "@/components/ui";

/** Root fallback (only reachable for paths the proxy does not route). */
export default function RootNotFound() {
  return (
    <main className="flex min-h-dvh items-center bg-ground bg-grain py-24">
      <Container size="md" className="text-center">
        <Eyebrow flag>404</Eyebrow>
        <Heading as="h1" size="display-md" className="mt-4">
          Nothing at this address.
        </Heading>
        <div className="mt-8">
          <Button asChild>
            <Link href="/">Back to HOMEGRWN</Link>
          </Button>
        </div>
      </Container>
    </main>
  );
}
