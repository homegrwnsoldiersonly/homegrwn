import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HOMEGRWN — Stop Paying for Leads. Start Owning Your Market.",
  description:
    "The HOMEGRWN system teaches home services businesses (HVAC, Septic, Solar) how to generate their own leads — no agencies, no middlemen.",
  openGraph: {
    title: "HOMEGRWN — Stop Paying for Leads.",
    description: "Free A-Z marketing training for home services businesses.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
