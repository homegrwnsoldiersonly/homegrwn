import Link from "next/link";
import { cn } from "@/lib/cn";
import type { CtaLink } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

export interface NavLink {
  label: string;
  href: string;
  /**
   * Full-document link (<a>, not <Link>): cross-surface targets and external
   * sites. Cross-surface hrefs come from src/lib/surfaces.ts.
   */
  external?: boolean;
}

export interface SiteNavProps {
  links: NavLink[];
  /** Primary CTA (lime). */
  cta?: CtaLink;
  /** Secondary CTA (outline). */
  secondaryCta?: CtaLink;
  /** Small label next to the logo, e.g. "Ads Driver" or "Internal". */
  badge?: string;
  /**
   * Small "by HOMEGRWN"-style link after the badge, pointing back at the
   * parent surface (always a full-document link).
   */
  brandLink?: CtaLink;
  /** glass = translucent dashboard chrome · solid = charcoal-900 */
  tone?: "solid" | "glass";
  /**
   * wordmark (default) = text HOMEGRWN + small flag, legible at nav height.
   * lockup = the raster; only readable at ≥64px, so not for a 64px-tall bar.
   */
  logoVariant?: "lockup" | "wordmark";
  className?: string;
}

/**
 * Sticky top nav. Server Component: the mobile menu is a native <details>
 * disclosure, so it works with zero client JS and is keyboard-accessible.
 */
export function SiteNav({
  links,
  cta,
  secondaryCta,
  badge,
  brandLink,
  tone = "solid",
  logoVariant = "wordmark",
  className,
}: SiteNavProps) {
  const ctas = (block: boolean) => (
    <>
      {secondaryCta && (
        <Button asChild variant="secondary" size="sm" block={block}>
          <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
        </Button>
      )}
      {cta && (
        <Button asChild variant="primary" size="sm" block={block}>
          <Link href={cta.href}>{cta.label}</Link>
        </Button>
      )}
    </>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-white/10 text-white",
        tone === "glass"
          ? "bg-charcoal-900/60 backdrop-blur-xl"
          : "bg-charcoal-900/90 backdrop-blur-xl",
        className,
      )}
    >
      <Container className="relative flex h-16 items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-3">
          <Logo
            href="/"
            variant={logoVariant}
            height={34}
            flag={logoVariant === "wordmark"}
            priority={logoVariant === "lockup"}
          />
          {/* Always visible: on a phone the badge is the only product identification in the chrome. */}
          {badge && (
            <span className="inline-block truncate rounded-full border border-white/15 px-2.5 py-0.5 text-xs font-medium text-white/70">
              {badge}
            </span>
          )}
          {brandLink && (
            <a
              href={brandLink.href}
              className="hidden truncate text-xs font-medium text-white/50 transition-colors duration-150 ease-brand hover:text-lime-500 lg:inline-block"
            >
              {brandLink.label}
            </a>
          )}
        </div>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <NavAnchor
              key={l.href}
              link={l}
              className="text-sm font-medium text-white/75 transition-colors duration-150 ease-brand hover:text-lime-500"
            />
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">{ctas(false)}</div>

        {/* Mobile disclosure */}
        <details className="group/menu md:hidden">
          <summary
            aria-label="Menu"
            className="flex size-11 cursor-pointer list-none items-center justify-center rounded-lg border border-white/15 text-white [&::-webkit-details-marker]:hidden group-open/menu:border-lime-500 group-open/menu:text-lime-500"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden
            >
              <path
                className="group-open/menu:hidden"
                d="M2 4.5h14M2 9h14M2 13.5h14"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
              <path
                className="hidden group-open/menu:block"
                d="M4 4l10 10M14 4L4 14"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </summary>
          <div className="absolute inset-x-0 top-full border-b border-white/10 bg-charcoal-900 px-5 pb-6 pt-2 shadow-2xl">
            <nav aria-label="Primary mobile" className="flex flex-col">
              {links.map((l) => (
                <NavAnchor
                  key={l.href}
                  link={l}
                  className="border-b border-white/10 py-3.5 text-md font-medium text-white/85 hover:text-lime-500"
                />
              ))}
              {brandLink && (
                <a
                  href={brandLink.href}
                  className="border-b border-white/10 py-3.5 text-sm font-medium text-white/60 hover:text-lime-500"
                >
                  {brandLink.label}
                </a>
              )}
            </nav>
            {(cta || secondaryCta) && (
              <div className="mt-4 flex flex-col gap-2">{ctas(true)}</div>
            )}
          </div>
        </details>
      </Container>
    </header>
  );
}

/** <Link> for in-surface routes, plain <a> for cross-surface / external ones. */
function NavAnchor({ link, className }: { link: NavLink; className: string }) {
  if (link.external) {
    return (
      <a href={link.href} className={className}>
        {link.label}
      </a>
    );
  }
  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}
