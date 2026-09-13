import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4";
export type HeadingSize =
  | "display-xl" // 88
  | "display-lg" // 64
  | "display-md" // 48
  | "display-sm" // 36
  | "title" // 28
  | "subtitle"; // 22

export interface HeadingProps {
  as?: HeadingLevel;
  size?: HeadingSize;
  /** inherit (default) · dark (charcoal-900 on light) · light (white) */
  tone?: "inherit" | "dark" | "light";
  id?: string;
  className?: string;
  children: ReactNode;
}

const SIZES: Record<HeadingSize, string> = {
  "display-xl": "text-5xl font-black tracking-display",
  "display-lg": "text-4xl font-black tracking-display",
  "display-md": "text-3xl font-extrabold tracking-display",
  "display-sm": "text-2xl font-extrabold tracking-display",
  title: "text-xl font-bold tracking-tight",
  subtitle: "text-lg font-semibold tracking-tight",
};

const TONES = {
  inherit: "",
  dark: "text-charcoal-900",
  light: "text-white",
} as const;

/** Inter at 800–900, tight leading, -0.02em tracking for display sizes. */
export function Heading({
  as: Tag = "h2",
  size = "display-md",
  tone = "inherit",
  id,
  className,
  children,
}: HeadingProps) {
  return (
    <Tag id={id} className={cn(SIZES[size], TONES[tone], className)}>
      {children}
    </Tag>
  );
}
