import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CardTone = "dark" | "light" | "lime";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps {
  /** dark = charcoal-900 + charcoal-700 border · light = white + grey-200 · lime = lime-100 tint */
  tone?: CardTone;
  padding?: CardPadding;
  /** Lime border on hover (for link cards). */
  interactive?: boolean;
  /** Sharper xl radius (Ads Driver surface) instead of 2xl. */
  radius?: "xl" | "2xl";
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

const TONES: Record<CardTone, string> = {
  dark: "bg-charcoal-900 border-charcoal-700 text-white",
  light: "bg-white border-grey-200 text-charcoal-900",
  lime: "bg-lime-100 border-lime-300 text-charcoal-900",
};

const PADDINGS: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  tone = "dark",
  padding = "md",
  interactive = false,
  radius = "2xl",
  as: Tag = "div",
  className,
  children,
}: CardProps) {
  return (
    <Tag
      className={cn(
        "border",
        radius === "2xl" ? "rounded-2xl" : "rounded-xl",
        TONES[tone],
        PADDINGS[padding],
        interactive &&
          "transition-colors duration-200 ease-brand hover:border-lime-500",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
