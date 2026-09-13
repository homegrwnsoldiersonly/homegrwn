import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/** Catch-all → this surface's not-found.tsx inside the Ads Driver layout. */
export default function AdsDriverCatchAll() {
  notFound();
}
