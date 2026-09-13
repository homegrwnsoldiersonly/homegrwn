import {
  Children,
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /**
   * primary = lime fill · secondary = outline · ghost = text only ·
   * inverse = ink fill, white text (the primary CTA on a lime band).
   */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * Render the single child element (e.g. <Link>) with the button classes
   * instead of a <button>. The child keeps its own props.
   */
  asChild?: boolean;
  /** Stretch to the container width (mobile CTAs). */
  block?: boolean;
  children: ReactNode;
}

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap select-none " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-brand " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-50 active:translate-y-px";

/**
 * `secondary` and `ghost` adapt to a light ancestor via `group-data-[tone=light]`
 * (Section / CTAStrip set `data-tone`). Those selectors carry (0,2,0)+
 * specificity, so a caller's `className` cannot override their colour — use a
 * dedicated variant instead of fighting them. `inverse` deliberately has no
 * tone overrides: it is ink-on-anything.
 */
const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-lime-500 text-ink-950 hover:bg-lime-300 shadow-[0_0_0_0_rgb(169_237_66/0)] hover:shadow-glow-lime",
  secondary:
    "border border-white/20 text-white hover:border-lime-500 hover:text-lime-500 " +
    "group-data-[tone=light]:border-charcoal-900/25 group-data-[tone=light]:text-charcoal-900 " +
    "group-data-[tone=light]:hover:border-charcoal-900 group-data-[tone=light]:hover:text-charcoal-900",
  ghost:
    "text-white/80 hover:text-lime-500 hover:bg-white/5 " +
    // Never lime text on a light ground (docs/brand.md): keep charcoal on hover too.
    "group-data-[tone=light]:text-charcoal-900 group-data-[tone=light]:hover:text-charcoal-900 " +
    "group-data-[tone=light]:hover:bg-charcoal-900/5",
  inverse:
    "border border-ink-950 bg-ink-950 text-white hover:border-charcoal-900 hover:bg-charcoal-900 hover:text-white",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-base",
  lg: "h-13 px-7 text-md",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  block = false,
  className,
}: Pick<ButtonProps, "variant" | "size" | "block" | "className"> = {}) {
  return cn(BASE, VARIANTS[variant], SIZES[size], block && "w-full", className);
}

export function Button({
  variant = "primary",
  size = "md",
  asChild = false,
  block = false,
  className,
  children,
  type,
  ...rest
}: ButtonProps) {
  const classes = buttonClasses({ variant, size, block, className });

  if (asChild) {
    const child = Children.only(children);
    if (!isValidElement<{ className?: string }>(child)) {
      throw new Error("<Button asChild> expects a single element child.");
    }
    return cloneElement(child as ReactElement<{ className?: string }>, {
      className: cn(child.props.className, classes),
    });
  }

  return (
    <button type={type ?? "button"} className={classes} {...rest}>
      {children}
    </button>
  );
}
