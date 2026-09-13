import Link from "next/link";
import { cn } from "@/lib/cn";
import { brand } from "@/lib/brand/tokens";
import type { Surface } from "@/lib/surface";
import { crossSurfaceLinks } from "@/lib/surfaces";
import { CheckerFlag } from "@/components/ui/CheckerFlag";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import type { NavLink } from "./SiteNav";

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export interface SiteFooterProps {
  /** Which surface this footer sits on (its cross-link is omitted). */
  surface: Surface;
  columns?: FooterColumn[];
  /** One-line note under the logo. */
  note?: string;
  /** Hide the cross-surface links (e.g. on the internal dashboard). */
  hideSurfaceLinks?: boolean;
  /** compact = single row (dashboard) */
  compact?: boolean;
  className?: string;
}

export function SiteFooter({
  surface,
  columns = [],
  note = brand.secondaryLine,
  hideSurfaceLinks = false,
  compact = false,
  className,
}: SiteFooterProps) {
  const year = new Date().getFullYear();
  // Environment-aware: canonical hosts in production, ?surface= on previews.
  const others = crossSurfaceLinks(surface);

  if (compact) {
    return (
      <footer
        className={cn(
          "border-t border-white/10 py-6 text-xs text-white/50",
          className,
        )}
      >
        <Container className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {brand.name}. {brand.tagline}
          </span>
          {!hideSurfaceLinks && (
            <span className="flex flex-wrap gap-4">
              {others.map((l) => (
                <a key={l.surface} href={l.href} className="hover:text-lime-500">
                  {l.label}
                </a>
              ))}
            </span>
          )}
        </Container>
      </footer>
    );
  }

  return (
    <footer
      className={cn(
        "border-t border-white/10 bg-ink-950 py-14 text-white",
        className,
      )}
    >
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(var(--cols),1fr)]" style={{ ["--cols" as string]: Math.max(columns.length, 1) }}>
          <div>
            {/* The raster lockup needs ≥64px for its wordmark line to read. */}
            <Logo variant="lockup" height={64} href="/" />
            <p className="mt-4 max-w-xs text-sm text-white/60">{note}</p>
            <CheckerFlag size={12} cols={10} rows={2} className="mt-5" />
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="text-xs font-semibold uppercase tracking-eyebrow text-white/50">
                {col.title}
              </h2>
              {/* Touch: each link is a ≥44px row (py-3 + 20px line). Pointer (md+): tighter pitch. */}
              <ul className="mt-1 md:mt-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    {l.external ? (
                      <a
                        href={l.href}
                        className="block py-3 text-sm leading-5 text-white/80 transition-colors duration-150 ease-brand hover:text-lime-500 md:py-1"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        className="block py-3 text-sm leading-5 text-white/80 transition-colors duration-150 ease-brand hover:text-lime-500 md:py-1"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {brand.name}. {brand.tagline}
          </span>
          {!hideSurfaceLinks && (
            <span className="flex flex-wrap gap-x-4 gap-y-1">
              {others.map((l) => (
                <a key={l.surface} href={l.href} className="hover:text-lime-500">
                  {l.label}
                </a>
              ))}
            </span>
          )}
        </div>
      </Container>
    </footer>
  );
}
