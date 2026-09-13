import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ContainerProps {
  size?: ContainerSize;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

const SIZES: Record<ContainerSize, string> = {
  sm: "max-w-2xl",
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-[76rem]",
  full: "max-w-none",
};

/** Horizontal page gutter. 20px at 375px, 32px from sm, 40px from lg. */
export function Container({
  size = "xl",
  as: Tag = "div",
  className,
  children,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-10",
        SIZES[size],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
