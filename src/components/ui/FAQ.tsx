"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import type { FaqItem } from "@/content/types";

export interface FAQProps {
  items: FaqItem[];
  /** Index open on first render. */
  defaultOpen?: number | null;
  /** Let several items stay open at once. */
  allowMultiple?: boolean;
  /** Heading level for each question. */
  headingLevel?: "h3" | "h4";
  /** dark (default) · light (charcoal text, grey dividers) */
  tone?: "dark" | "light";
  className?: string;
}

/**
 * Accessible accordion: each question is a <button aria-expanded aria-controls>
 * inside a heading; each answer is a labelled region. Keyboard works natively.
 */
export function FAQ({
  items,
  defaultOpen = 0,
  allowMultiple = false,
  headingLevel: H = "h3",
  tone = "dark",
  className,
}: FAQProps) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<number>>(
    () => new Set(defaultOpen === null ? [] : [defaultOpen]),
  );

  function toggle(i: number) {
    setOpen((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  const divider = tone === "dark" ? "divide-white/10" : "divide-grey-200";
  const question =
    tone === "dark"
      ? "text-white hover:text-lime-500"
      : "text-charcoal-900 hover:text-charcoal-700";
  const answer = tone === "dark" ? "text-white/70" : "text-charcoal-700";

  return (
    <div className={cn("divide-y", divider, className)}>
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const btnId = `${baseId}-q-${i}`;
        const panelId = `${baseId}-a-${i}`;
        return (
          <div key={btnId}>
            <H className="m-0">
              <button
                type="button"
                id={btnId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className={cn(
                  "flex w-full items-start justify-between gap-4 py-4 text-left text-md font-semibold",
                  "transition-colors duration-150 ease-brand",
                  question,
                )}
              >
                <span>{item.q}</span>
                <span
                  aria-hidden
                  className={cn(
                    "mt-1 inline-block shrink-0 text-lime-500 transition-transform duration-200 ease-brand",
                    isOpen && "rotate-45",
                  )}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 2v12M2 8h12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>
            </H>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className={cn("pb-5 pr-8 text-base", answer)}
            >
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
