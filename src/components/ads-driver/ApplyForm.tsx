"use client";

import Link from "next/link";
import { useActionState, useId } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { submitEarlyAccess } from "./applyAction";
import {
  INITIAL_APPLY_STATE,
  SPEND_BANDS,
  TRADE_OPTIONS,
  type ApplyField,
  type ApplyState,
} from "./applyTypes";

const FIELD =
  "block w-full rounded-lg border bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/35 " +
  "transition-colors duration-150 ease-brand focus:border-lime-500 focus:outline-none " +
  "aria-[invalid=true]:border-red-400";
const LABEL = "block text-sm font-semibold text-white";
const HINT = "mt-1 text-xs text-white/50";
const ERR = "mt-1.5 text-xs font-medium text-red-300";

function fieldValue(state: ApplyState, f: ApplyField): string {
  return state.status === "error" ? state.values[f] : "";
}
function fieldError(state: ApplyState, f: ApplyField): string | undefined {
  return state.status === "error" ? state.errors[f] : undefined;
}

/**
 * Early-access form. Client component only for the pending state and
 * inline errors via useActionState; the action (applyAction.ts) runs the
 * honeypot, the per-client rate limit, validation, and webhook delivery, and
 * returns an error state — values intact — if delivery fails.
 */
export function ApplyForm({ className }: { className?: string }) {
  const [state, formAction, pending] = useActionState(
    submitEarlyAccess,
    INITIAL_APPLY_STATE,
  );
  const id = useId();

  if (state.status === "ok") {
    return (
      <div
        role="status"
        className={cn(
          "rounded-xl border border-lime-500/40 bg-lime-500/5 p-6 sm:p-8",
          className,
        )}
      >
        <div className="text-xs font-semibold uppercase tracking-eyebrow text-lime-500">
          Application received
        </div>
        <p className="mt-3 text-lg font-bold tracking-tight text-white">
          Thanks. Early access is a short, hand-run list.
        </p>
        <p className="mt-2 text-sm text-white/70">
          A human reads every application. If your account is a fit for a
          niche pack we have today, you&apos;ll get a manager-link invite —
          read-only scope, no passwords — and a first audit before any
          conversation about money.
        </p>
        <Button asChild variant="secondary" className="mt-6">
          <Link href="/how-it-works">Read how the loop works</Link>
        </Button>
      </div>
    );
  }

  const invalid = (f: ApplyField) => Boolean(fieldError(state, f));

  return (
    <form action={formAction} noValidate className={cn("space-y-6", className)}>
      {state.status === "error" && (
        <p
          role="alert"
          className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {state.message}
        </p>
      )}

      <div>
        <label htmlFor={`${id}-business`} className={LABEL}>
          Business name
        </label>
        <input
          id={`${id}-business`}
          name="business"
          type="text"
          required
          autoComplete="organization"
          defaultValue={fieldValue(state, "business")}
          aria-invalid={invalid("business")}
          aria-describedby={invalid("business") ? `${id}-business-err` : undefined}
          className={cn(FIELD, "mt-2 border-white/15")}
          placeholder="Acme Septic & Drain"
        />
        {fieldError(state, "business") && (
          <p id={`${id}-business-err`} className={ERR}>
            {fieldError(state, "business")}
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-practice`} className={LABEL}>
            Trade or practice area
          </label>
          <select
            id={`${id}-practice`}
            name="practice"
            required
            defaultValue={fieldValue(state, "practice")}
            aria-invalid={invalid("practice")}
            aria-describedby={invalid("practice") ? `${id}-practice-err` : undefined}
            className={cn(FIELD, "mt-2 border-white/15 [&>optgroup]:bg-charcoal-900 [&>optgroup>option]:bg-charcoal-900")}
          >
            <option value="" disabled>
              Pick the closest match
            </option>
            {TRADE_OPTIONS.map((g) => (
              <optgroup key={g.group} label={g.group}>
                {g.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <p className={HINT}>Determines which niche pack audits the account.</p>
          {fieldError(state, "practice") && (
            <p id={`${id}-practice-err`} className={ERR}>
              {fieldError(state, "practice")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${id}-spend`} className={LABEL}>
            Monthly Google Ads spend
          </label>
          <select
            id={`${id}-spend`}
            name="spend"
            required
            defaultValue={fieldValue(state, "spend")}
            aria-invalid={invalid("spend")}
            aria-describedby={invalid("spend") ? `${id}-spend-err` : undefined}
            className={cn(FIELD, "mt-2 border-white/15 [&>option]:bg-charcoal-900")}
          >
            <option value="" disabled>
              Pick a band
            </option>
            {SPEND_BANDS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <p className={HINT}>A band, not a figure. Spend stays on your own billing.</p>
          {fieldError(state, "spend") && (
            <p id={`${id}-spend-err`} className={ERR}>
              {fieldError(state, "spend")}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-site`} className={LABEL}>
          Website <span className="font-normal text-white/50">(optional)</span>
        </label>
        <input
          id={`${id}-site`}
          name="site"
          type="text"
          inputMode="url"
          autoComplete="url"
          defaultValue={fieldValue(state, "site")}
          aria-invalid={invalid("site")}
          aria-describedby={invalid("site") ? `${id}-site-err` : undefined}
          className={cn(FIELD, "mt-2 border-white/15")}
          placeholder="yourcompany.com"
        />
        {fieldError(state, "site") && (
          <p id={`${id}-site-err`} className={ERR}>
            {fieldError(state, "site")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${id}-email`} className={LABEL}>
          Email
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={fieldValue(state, "email")}
          aria-invalid={invalid("email")}
          aria-describedby={invalid("email") ? `${id}-email-err` : undefined}
          className={cn(FIELD, "mt-2 border-white/15")}
          placeholder="you@yourcompany.com"
        />
        {fieldError(state, "email") && (
          <p id={`${id}-email-err`} className={ERR}>
            {fieldError(state, "email")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${id}-notes`} className={LABEL}>
          Anything we should know?{" "}
          <span className="font-normal text-white/50">(optional)</span>
        </label>
        <textarea
          id={`${id}-notes`}
          name="notes"
          rows={4}
          maxLength={2000}
          defaultValue={fieldValue(state, "notes")}
          aria-invalid={invalid("notes")}
          aria-describedby={invalid("notes") ? `${id}-notes-err` : undefined}
          className={cn(FIELD, "mt-2 resize-y border-white/15")}
          placeholder="A question, a service area, an LSA situation, whatever is on your mind."
        />
        <p className={HINT}>A human reads this. Questions get answered here too.</p>
        {fieldError(state, "notes") && (
          <p id={`${id}-notes-err`} className={ERR}>
            {fieldError(state, "notes")}
          </p>
        )}
      </div>

      {/* Honeypot — hidden from people, filled by bots. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor={`${id}-fax`}>Fax</label>
        <input id={`${id}-fax`} name="company_fax" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={pending} aria-busy={pending}>
          {pending ? "Sending…" : "Apply for early access"}
        </Button>
        <p className="text-xs text-white/50">
          No passwords, no card. A manager-link invite is the next step if
          it&apos;s a fit.
        </p>
      </div>
    </form>
  );
}
