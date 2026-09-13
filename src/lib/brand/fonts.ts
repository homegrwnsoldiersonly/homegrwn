/**
 * Brand fonts via next/font (self-hosted at build time, zero runtime requests).
 *
 * Inter  → UI + display (variable weight; display voice = 800–900 + tight tracking)
 * Geist Mono → data, IDs, money
 *
 * Both are exposed as CSS variables that src/app/globals.css maps to
 * `--font-sans` / `--font-mono`, so `font-sans` / `font-mono` utilities just work.
 */

import { Geist_Mono, Inter } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

/** Class string to put on <body>. */
export const fontVariables = `${inter.variable} ${geistMono.variable}`;
