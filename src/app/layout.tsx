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
  metadataBase: new URL("https://homegrwnagency.com"),
  title: "HOMEGRWN — Your Phone Should Never Stop Ringing",
  description:
    "AI-powered growth for septic & home service businesses: laser-targeted ads, 24/7 AI receptionists, and automated follow-up that turn local searches into booked jobs. Book a free growth plan call.",
  openGraph: {
    title: "HOMEGRWN — Your Phone Should Never Stop Ringing",
    description:
      "Laser-targeted ads, 24/7 AI receptionists, and automated follow-up for home service pros. Book a free growth plan call.",
    url: "https://homegrwnagency.com",
    siteName: "HOMEGRWN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HOMEGRWN — Your Phone Should Never Stop Ringing",
    description:
      "AI-powered growth systems for septic & home service businesses.",
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
