import type { Metadata } from "next";
import { AppShell, BareShell } from "@/components/app";
import { SURFACE_URLS } from "@/lib/surface";
import { hasSession, passwordGateEnabled } from "./_lib/auth";
import { logout, selectTenant } from "./_lib/actions";
import { getActiveTenant, tenantStatus } from "./_lib/tenants";

/**
 * app surface — app.homegrwndigital.com. Tenant shell for the multi-tenant
 * reporting dashboard (Glassmorphism direction, docs/brand.md). noindex.
 *
 * Reads cookies (session + active tenant), so every route under it is
 * dynamic — correct for a dashboard. Anonymous requests (APP_PASSWORD set,
 * no valid session) get the bare shell: no rail, no tenant names. Pages
 * additionally call requireSession() themselves (see _lib/auth.ts).
 */

export const metadata: Metadata = {
  metadataBase: new URL(SURFACE_URLS.app),
  title: {
    default: "HOMEGRWN Dashboard",
    template: "%s — HOMEGRWN Dashboard",
  },
  description: "Internal Google Ads audit dashboard. Recommend-only.",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const gated = passwordGateEnabled();
  if (!(await hasSession())) {
    return <BareShell>{children}</BareShell>;
  }

  const { tenants, active } = await getActiveTenant();
  const status = active ? await tenantStatus(active) : { partial: false, missing: [] };

  return (
    <AppShell
      tenants={tenants.map((t) => ({ id: t.id, name: t.name, kind: t.kind }))}
      active={active ? { id: active.id, name: active.name, kind: active.kind, note: active.note } : null}
      partial={status.partial}
      gated={gated}
      selectTenant={selectTenant}
      logout={logout}
    >
      {children}
    </AppShell>
  );
}
