import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type GlassPadding = "none" | "sm" | "md" | "lg";

export interface GlassPanelProps {
  padding?: GlassPadding;
  radius?: "xl" | "2xl";
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

const PADDINGS: Record<GlassPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/**
 * Glassmorphism panel (dashboard): bg-white/5, backdrop-blur-xl, 1px white/10
 * border, inner top highlight. Layer it over `bg-ground-forest`.
 */
export function GlassPanel({
  padding = "md",
  radius = "2xl",
  as: Tag = "div",
  className,
  children,
}: GlassPanelProps) {
  return (
    <Tag
      className={cn(
        "glass text-white",
        radius === "2xl" ? "rounded-2xl" : "rounded-xl",
        PADDINGS[padding],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
