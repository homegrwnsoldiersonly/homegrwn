import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SectionVariant = "dark" | "light" | "grain";
export type SectionPadding = "none" | "sm" | "md" | "lg";

export interface SectionProps {
  /** dark = charcoal-900 · light = sage-100 · grain = ink→charcoal + CSS noise */
  variant?: SectionVariant;
  padding?: SectionPadding;
  as?: ElementType;
  id?: string;
  className?: string;
  children: ReactNode;
}

const VARIANTS: Record<SectionVariant, string> = {
  dark: "bg-charcoal-900 text-white",
  light: "bg-sage-100 text-charcoal-900",
  grain: "bg-ground bg-grain text-white",
};

const PADDINGS: Record<SectionPadding, string> = {
  none: "",
  sm: "py-10 sm:py-14",
  md: "py-16 sm:py-24",
  lg: "py-24 sm:py-32",
};

/**
 * Full-bleed band. Sets its own ground + text color and exposes `data-tone`
 * so children can adapt (`group-data-[tone=light]:…` is available via `group`).
 */
export function Section({
  variant = "dark",
  padding = "md",
  as: Tag = "section",
  id,
  className,
  children,
}: SectionProps) {
  return (
    <Tag
      id={id}
      data-tone={variant === "light" ? "light" : "dark"}
      className={cn("group", VARIANTS[variant], PADDINGS[padding], className)}
    >
      {children}
    </Tag>
  );
}
