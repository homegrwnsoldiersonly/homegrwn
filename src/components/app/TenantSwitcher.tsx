"use client";

/**
 * Tenant switcher. A native <select> inside a form whose action is the
 * `selectTenant` server action (passed in from the layout).
 *
 * Submit rules (WCAG 3.2.2 On Input — a change of context must not happen
 * on every keystroke):
 * - Pointer-driven change (mouse / touch picked an option) → auto-submit.
 * - Keyboard-driven change (arrow keys browse the options) → no submit; the
 *   select is now "dirty", the Switch button becomes visible, and Enter on
 *   the select or activating Switch commits. Chrome and Safari fire `change`
 *   on every arrow press, so auto-submitting there bounced keyboard users
 *   through a full navigation per keystroke.
 * - Without JS the always-present Switch button submits the form.
 *
 * Client Component for the pointer/keyboard tracking + pending state.
 */

import { useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export interface SwitcherTenant {
  id: string;
  name: string;
  kind: string;
}

export function TenantSwitcher({
  tenants,
  activeId,
  action,
  compact = false,
  className,
}: {
  tenants: SwitcherTenant[];
  activeId: string | null;
  action: (formData: FormData) => Promise<void>;
  /** Hide the visible "Tenant" label (mobile top bar). */
  compact?: boolean;
  className?: string;
}) {
  const pathname = usePathname() ?? "/";
  return (
    <form action={action} className={cn("relative", className)}>
      <input type="hidden" name="next" value={pathname} />
      {/* key resets the local value when the server confirms a new tenant */}
      <Fields key={activeId ?? "none"} tenants={tenants} activeId={activeId} compact={compact} />
    </form>
  );
}

function Fields({
  tenants,
  activeId,
  compact,
}: {
  tenants: SwitcherTenant[];
  activeId: string | null;
  compact: boolean;
}) {
  const { pending } = useFormStatus();
  const id = useId();
  const [value, setValue] = useState(activeId ?? "");
  // True between a pointerdown on the select and the change it produces.
  const pointerDriven = useRef(false);
  const dirty = value !== (activeId ?? "");
  const disabled = pending || tenants.length === 0;

  return (
    <div>
      <label
        htmlFor={id}
        className={cn(
          "text-xs font-semibold uppercase tracking-eyebrow text-white/50",
          compact ? "sr-only" : "mb-1.5 block",
        )}
      >
        Tenant
      </label>
      {/* The button sits outside the <label> so a click on it is never retargeted to the select. */}
      <div className="flex items-center gap-2">
        <span className="relative block min-w-0 flex-1">
          <select
            id={id}
            name="tenant"
            value={value}
            disabled={disabled}
            aria-busy={pending || undefined}
            onPointerDown={() => {
              pointerDriven.current = true;
            }}
            onKeyDown={(e) => {
              pointerDriven.current = false;
              if (e.key === "Enter" && dirty) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
            onBlur={() => {
              pointerDriven.current = false;
            }}
            onChange={(e) => {
              setValue(e.currentTarget.value);
              if (pointerDriven.current) {
                pointerDriven.current = false;
                e.currentTarget.form?.requestSubmit();
              }
            }}
            className={cn(
              "glass w-full appearance-none rounded-xl py-2 pl-3 pr-9 text-sm font-medium text-white",
              "transition-[border-color,opacity] duration-150 ease-brand hover:border-white/25",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-500",
              "disabled:opacity-60 [&>option]:bg-charcoal-900 [&>option]:text-white",
            )}
          >
            {tenants.length === 0 && <option value="">No tenants</option>}
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} · {t.kind}
              </option>
            ))}
          </select>
          <svg
            aria-hidden
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
          >
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        {/* Visible once the select is dirty (keyboard browsing); otherwise sr-only
            but still focusable, so the no-JS / screen-reader path always has it. */}
        <button
          type="submit"
          disabled={disabled}
          className={cn(
            "shrink-0 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors duration-150 ease-brand",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-500 disabled:opacity-60",
            dirty
              ? "border-lime-500/40 text-lime-500 hover:border-lime-500"
              : "sr-only border-white/15 text-white/70 focus:not-sr-only",
          )}
        >
          Switch
        </button>
      </div>
    </div>
  );
}
