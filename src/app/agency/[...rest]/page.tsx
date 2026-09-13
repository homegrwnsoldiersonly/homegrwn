import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/**
 * Catch-all so unmatched agency URLs render this surface's not-found.tsx
 * inside the agency layout (the root not-found has no nav/footer).
 */
export default function AgencyCatchAll() {
  notFound();
}
