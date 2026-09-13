/**
 * Tenant shell (Glassmorphism direction, docs/brand.md): left rail with
 * logo, tenant switcher and nav; top bar with the data-source badge, the
 * recommend-only posture label, the partial-data flag and sign-out; content
 * in GlassPanels over the charcoal→forest gradient with grain.
 *
 * Server Component. Client pieces: TenantSwitcher (auto-submit), NavLinks
 * (active state). Mobile-first: at 375px the rail collapses into the top bar
 * (logo row → switcher row → horizontally scrolling nav strip).
 */

import type { ReactNode } from "react";
import type { DataSourceKind } from "@/lib/ads/datasource";
import { Logo } from "@/components/ui/Logo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { DataSourceBadge, Pill } from "./chrome";
import { NavLinks, type AppNavItem } from "./NavLinks";
import { TenantSwitcher, type SwitcherTenant } from "./TenantSwitcher";

export const APP_NAV: AppNavItem[] = [
  { label: "Overview", href: "/" },
  { label: "Accounts", href: "/accounts" },
  { label: "Findings", href: "/findings" },
  { label: "Changes", href: "/changes" },
  { label: "History", href: "/history" },
];

export interface AppShellProps {
  tenants: SwitcherTenant[];
  active: { id: string; name: string; kind: DataSourceKind; note?: string } | null;
  partial: boolean;
  /** Password gate on → show sign-out. */
  gated: boolean;
  selectTenant: (formData: FormData) => Promise<void>;
  logout: () => Promise<void>;
  children: ReactNode;
}

function PostureLabel() {
  return (
    <Pill tone="lime">
      <span aria-hidden className="size-1.5 rounded-full bg-lime-500" />
      Recommend-only
    </Pill>
  );
}

export function AppShell({
  tenants,
  active,
  partial,
  gated,
  selectTenant,
  logout,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-dvh bg-ground-forest bg-grain text-white">
      <div className="lg:grid lg:grid-cols-[15.5rem_minmax(0,1fr)]">
        {/* Rail — desktop */}
        <aside className="hidden border-r border-white/10 bg-ink-950/30 backdrop-blur-xl lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:px-5 lg:py-6">
          <Logo variant="wordmark" href="/" height={30} />
          <p className="mt-2 text-xs uppercase tracking-eyebrow text-white/45">Reporting dashboard</p>
          <TenantSwitcher
            tenants={tenants}
            activeId={active?.id ?? null}
            action={selectTenant}
            className="mt-6"
          />
          <NavLinks items={APP_NAV} orientation="vertical" className="mt-8" />
          <div className="mt-auto border-t border-white/10 pt-5 text-xs text-white/50">
            <PostureLabel />
            <p className="mt-3">
              Nothing on this surface writes to an account. Findings are proposals; a human applies them.
            </p>
          </div>
        </aside>

        {/* Content column */}
        <div className="flex min-h-dvh min-w-0 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-charcoal-900/60 backdrop-blur-xl">
            <div className="flex h-14 items-center justify-between gap-3 px-5 sm:px-8 lg:px-10">
              <div className="flex min-w-0 items-center gap-3">
                <span className="lg:hidden">
                  <Logo variant="wordmark" href="/" height={26} />
                </span>
                <span className="hidden min-w-0 truncate text-sm text-white/70 lg:block">
                  {active ? active.name : "No tenant"}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {/* xs hides these two here and shows them on the switcher row below.
                    Wrap rather than pass `hidden` to Pill: cn() does not dedupe, so a
                    `hidden` appended after Pill's own `inline-flex` loses the cascade. */}
                {active && (
                  <span className="hidden sm:contents">
                    <DataSourceBadge kind={active.kind} />
                  </span>
                )}
                {partial && <Pill tone="warn">Partial data</Pill>}
                <span className="hidden sm:contents">
                  <PostureLabel />
                </span>
                {gated && (
                  <form action={logout}>
                    <button
                      type="submit"
                      className="rounded-lg px-2 py-1 text-xs font-medium text-white/60 transition-colors duration-150 ease-brand hover:text-lime-500"
                    >
                      Sign out
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Mobile: switcher (+ the badges the top row hides on xs), then the nav strip */}
            <div className="border-t border-white/10 px-5 py-3 sm:px-8 lg:hidden">
              <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                <TenantSwitcher
                  tenants={tenants}
                  activeId={active?.id ?? null}
                  action={selectTenant}
                  compact
                  className="min-w-[12rem] flex-1"
                />
                <div className="flex items-center gap-2 pb-1 sm:hidden">
                  {active && <DataSourceBadge kind={active.kind} />}
                  <PostureLabel />
                </div>
              </div>
            </div>
            {/* Nav strip: five items overflow 375px, so it scrolls. NavLinks scrolls the
                active item into view on mount; the ::after gradient signals more to the right. */}
            <div className="relative border-t border-white/10 lg:hidden after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-10 after:bg-linear-to-l after:from-charcoal-900 after:to-transparent sm:after:hidden">
              <div className="overflow-x-auto px-3 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <NavLinks items={APP_NAV} orientation="horizontal" />
              </div>
            </div>
          </header>

          {active?.note && (
            <div role="status" className="border-b border-red-400/30 bg-red-500/10 px-5 py-2 text-xs text-red-300 sm:px-8 lg:px-10">
              {active.name}: {active.note}
            </div>
          )}

          <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8 lg:px-10">{children}</main>
          <SiteFooter surface="app" compact />
        </div>
      </div>
    </div>
  );
}

/** Shell for anonymous requests (login, 404 before sign-in): no rail, no tenant data. */
export function BareShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-ground-forest bg-grain text-white">
      <header className="border-b border-white/10 bg-charcoal-900/60 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-5 sm:px-8">
          <Logo variant="wordmark" href="/" height={26} />
          <Pill>Internal</Pill>
        </div>
      </header>
      <main className="flex flex-1 items-center px-5 py-10 sm:px-8">{children}</main>
      <SiteFooter surface="app" compact />
    </div>
  );
}
