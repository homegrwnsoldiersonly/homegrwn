"use client";

/**
 * Dashboard nav with active state. Client Component for `usePathname()` —
 * layouts cannot know the current path on the server — and, in the
 * horizontal (mobile strip) orientation, to scroll the active item into view
 * so the lime tab is never hidden off the right edge. No state, no handlers.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

export interface AppNavItem {
  label: string;
  href: string;
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({
  items,
  orientation = "vertical",
  className,
}: {
  items: AppNavItem[];
  orientation?: "vertical" | "horizontal";
  className?: string;
}) {
  const pathname = usePathname() ?? "/";
  const vertical = orientation === "vertical";
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (vertical) return;
    // `nearest` on both axes: only the strip's own scrollLeft moves; the
    // page never jumps (the strip sits in the sticky header anyway).
    activeRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [pathname, vertical]);

  return (
    <nav
      aria-label="Dashboard"
      className={cn(vertical ? "flex flex-col gap-1" : "flex items-center gap-1", className)}
    >
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            ref={active ? activeRef : undefined}
            aria-current={active ? "page" : undefined}
            className={cn(
              "whitespace-nowrap rounded-lg text-sm font-medium transition-colors duration-150 ease-brand",
              vertical
                ? "flex items-center gap-2.5 px-3 py-2"
                : "flex min-h-11 items-center px-2.5", // ≥44px tap target on the strip
              active
                ? "bg-lime-500/10 text-lime-500"
                : "text-white/70 hover:bg-white/5 hover:text-white",
            )}
          >
            {vertical && (
              <span
                aria-hidden
                className={cn(
                  "size-1.5 rounded-full",
                  active ? "bg-lime-500" : "bg-white/25",
                )}
              />
            )}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
