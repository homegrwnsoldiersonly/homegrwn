"use client";

import { useActionState, useId } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { BUDGET_OPTIONS, TRADE_OPTIONS } from "./content";
import { Icon } from "./Icon";
import type {
  StrategyCallAction,
  StrategyCallField,
  StrategyCallState,
} from "./strategy-call";

export interface StrategyCallFormProps {
  /** Server action passed down from the page (src/app/agency/book/actions.ts). */
  action: StrategyCallAction;
  /** Preselects the trade <select> (niche CTAs link /book?trade=<slug>). */
  defaultTrade?: string;
  className?: string;
}

const INITIAL: StrategyCallState = { status: "idle" };

const FIELD =
  "mt-1.5 block w-full rounded-xl border bg-ink-950/60 px-4 py-3 text-base text-white placeholder:text-white/35 " +
  "transition-[border-color,box-shadow] duration-150 ease-brand " +
  "focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500/30 " +
  "aria-[invalid=true]:border-red-400";

const LABEL = "block text-sm font-semibold text-white";

/**
 * The /book form shell. Progressive: with JS it stays in place and swaps to
 * the confirmation state; without JS the server action re-renders the page
 * with errors or the confirmation. Field errors come back from the action.
 */
export function StrategyCallForm({
  action,
  defaultTrade,
  className,
}: StrategyCallFormProps) {
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const id = useId();

  if (state.status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "rounded-2xl border border-lime-500/40 bg-lime-500/10 p-6 sm:p-8",
          className,
        )}
      >
        <span className="inline-flex size-11 items-center justify-center rounded-full bg-lime-500 text-ink-950">
          <Icon name="Check" size={22} />
        </span>
        <h2 className="mt-5 text-xl font-bold tracking-tight">
          Got it{state.firstName ? `, ${state.firstName}` : ""}. We&apos;ll reach out.
        </h2>
        <p className="mt-2 text-base text-white/75">
          Expect a text or email from us to find a time that works. If you&apos;d
          rather not wait, reply to that message with a couple of windows and
          we&apos;ll lock one in.
        </p>
      </div>
    );
  }

  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : undefined;

  const fieldProps = (name: StrategyCallField) => ({
    id: `${id}-${name}`,
    name,
    defaultValue: values?.[name] ?? "",
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
  });

  const fieldError = (name: StrategyCallField) =>
    errors[name] ? (
      <p id={`${id}-${name}-error`} className="mt-1.5 text-sm text-red-400">
        {errors[name]}
      </p>
    ) : null;

  return (
    <form
      action={formAction}
      noValidate
      className={cn("relative rounded-2xl border border-charcoal-700 bg-charcoal-900 p-6 sm:p-8", className)}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className={LABEL}>
            Your name
          </label>
          <input
            {...fieldProps("name")}
            type="text"
            autoComplete="name"
            required
            placeholder="First and last"
            className={FIELD}
          />
          {fieldError("name")}
        </div>

        <div>
          <label htmlFor={`${id}-business`} className={LABEL}>
            Business name
          </label>
          <input
            {...fieldProps("business")}
            type="text"
            autoComplete="organization"
            required
            placeholder="As it appears on the truck"
            className={FIELD}
          />
          {fieldError("business")}
        </div>

        <div>
          <label htmlFor={`${id}-trade`} className={LABEL}>
            Trade
          </label>
          <select
            {...fieldProps("trade")}
            defaultValue={
              values?.trade ??
              (TRADE_OPTIONS.some((t) => t.value === defaultTrade)
                ? defaultTrade
                : "")
            }
            required
            className={FIELD}
          >
            <option value="" disabled>
              Pick the closest one
            </option>
            {TRADE_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          {fieldError("trade")}
        </div>

        <div>
          <label htmlFor={`${id}-budget`} className={LABEL}>
            Monthly ad budget
          </label>
          <select {...fieldProps("budget")} required className={FIELD}>
            <option value="" disabled>
              Roughly what you spend today
            </option>
            {BUDGET_OPTIONS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
          {fieldError("budget")}
        </div>

        <div>
          <label htmlFor={`${id}-phone`} className={LABEL}>
            Phone
          </label>
          <input
            {...fieldProps("phone")}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
            placeholder="Best number to text"
            className={FIELD}
          />
          {fieldError("phone")}
        </div>

        <div>
          <label htmlFor={`${id}-email`} className={LABEL}>
            Email
          </label>
          <input
            {...fieldProps("email")}
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            placeholder="you@company.com"
            className={FIELD}
          />
          {fieldError("email")}
        </div>
      </div>

      {/* Honeypot — bots fill it, people never see it. Checked in the action. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && Object.keys(errors).length === 0 && (
        <p role="alert" className="mt-5 text-sm text-red-400">
          {state.message ??
            "Something went wrong on our end. Try again, or email us directly."}
        </p>
      )}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={pending} className="sm:min-w-56">
          {pending ? "Sending…" : "Book my free growth plan"}
        </Button>
        <p className="text-xs text-white/50">
          No contracts. No spam. We reply to every request ourselves.
        </p>
      </div>
    </form>
  );
}
