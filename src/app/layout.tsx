import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/brand/fonts";
import { colors } from "@/lib/brand/tokens";
import { SURFACE_URLS } from "@/lib/surface";
import "./globals.css";

/**
 * Root layout: html/body, fonts, metadata base. Surface-specific chrome
 * (nav, footer, title templates) lives in src/app/{agency,ads,app}/layout.tsx.
 */

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? SURFACE_URLS.agency,
  ),
  applicationName: "HOMEGRWN",
  title: "HOMEGRWN",
  openGraph: { siteName: "HOMEGRWN", type: "website" },
};

export const viewport: Viewport = {
  themeColor: colors.ink950,
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-dvh bg-ink-950 font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}
