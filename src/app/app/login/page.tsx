/**
 * /login — the password gate form. When APP_PASSWORD is unset on a deployed
 * host the gate fails closed and this page renders the "not configured" state
 * instead (nothing else on the surface is reachable). Locally with the gate
 * off, and when already signed in, it bounces to the overview. The form posts
 * to the `login` server action, which throttles failures per IP and sets the
 * signed session cookie (./_lib/session.ts). Wrong password → ?error=1;
 * throttled → ?error=locked. Pure Server Component: no client JS.
 */

import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Heading } from "@/components/ui/Heading";
import { login } from "../_lib/actions";
import {
  hasSession,
  passwordGateEnabled,
  passwordGateMisconfigured,
} from "../_lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (passwordGateMisconfigured()) return <NotConfigured />;
  if (!passwordGateEnabled() || (await hasSession())) redirect("/");

  const sp = await props.searchParams;
  const error = sp.error === "1" || sp.error === "locked";
  const locked = sp.error === "locked";
  const nextRaw = typeof sp.next === "string" ? sp.next : "/";
  const next = nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/";

  return (
    <Container size="sm" className="w-full">
      <GlassPanel padding="lg" as="section" aria-labelledby="login-title">
        <Eyebrow flag>Internal · recommend-only</Eyebrow>
        <Heading as="h1" size="display-sm" id="login-title" className="mt-4">
          Dashboard sign-in
        </Heading>
        <p className="mt-3 text-sm text-white/65">
          Shared operator password. Sessions last 14 days; rotating{" "}
          <span className="font-mono">APP_PASSWORD</span> signs everyone out.
        </p>

        <form action={login} className="mt-8 space-y-4">
          <input type="hidden" name="next" value={next} />
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-eyebrow text-white/60">
              Password
            </span>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              autoFocus
              aria-invalid={error || undefined}
              aria-describedby={error ? "login-error" : undefined}
              className="glass w-full rounded-xl px-3 py-2.5 text-base text-white placeholder:text-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-500"
            />
          </label>
          {error && (
            <p id="login-error" role="alert" className="text-sm text-red-300">
              {locked
                ? "Too many attempts. Wait a moment and try again."
                : "That password did not match."}
            </p>
          )}
          <Button type="submit" block>
            Sign in
          </Button>
        </form>
      </GlassPanel>
    </Container>
  );
}

/** Deployed without APP_PASSWORD: say so instead of opening the dashboard. */
function NotConfigured() {
  return (
    <Container size="sm" className="w-full">
      <GlassPanel padding="lg" as="section" aria-labelledby="login-title">
        <Eyebrow flag>Internal · recommend-only</Eyebrow>
        <Heading as="h1" size="display-sm" id="login-title" className="mt-4">
          Dashboard locked
        </Heading>
        <p className="mt-3 text-sm text-white/65">
          <span className="font-mono">APP_PASSWORD</span> is not configured for
          this deployment, so the gate is closed. Set it in the project&apos;s
          environment variables and redeploy.
        </p>
      </GlassPanel>
    </Container>
  );
}
