import { cn } from "@/lib/cn";
import { CURRENT_RUNG, RUNGS, type RungStatus } from "./ladder";

function StatusChip({ status }: { status: RungStatus }) {
  const live = status === "built";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
        live
          ? "border-lime-500/60 bg-lime-500/10 text-lime-500"
          : "border-dashed border-white/25 text-white/55",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          live ? "bg-lime-500" : "bg-white/40",
        )}
      />
      {live ? "Built" : "Planned"}
    </span>
  );
}

/**
 * The autonomy ladder as a visual: rungs 0–5 with big mono numerals, a rail
 * down the left, and an honest "you are here" marker after the last built
 * rung. Data lives in ./ladder.ts and mirrors docs/control-architecture.md.
 */
export function AutonomyLadder({ className }: { className?: string }) {
  return (
    <ol className={cn("relative", className)}>
      {RUNGS.map((r, i) => {
        const live = r.status === "built";
        const isCurrent = r.rung === CURRENT_RUNG;
        const last = i === RUNGS.length - 1;
        return (
          <li
            key={r.rung}
            className="relative grid grid-cols-[3.25rem_1fr] gap-x-4 sm:grid-cols-[5rem_1fr]"
          >
            {/* numeral + rail */}
            <div className="relative flex flex-col items-center">
              <span
                className={cn(
                  "numerals text-3xl font-black leading-none sm:text-4xl",
                  live ? "text-lime-500" : "text-white/30",
                )}
              >
                {r.rung}
              </span>
              {!last && (
                <span
                  aria-hidden
                  className={cn(
                    "mt-2 w-px flex-1",
                    live && RUNGS[i + 1]?.status === "built"
                      ? "bg-lime-500/60"
                      : "border-l border-dashed border-white/20",
                  )}
                />
              )}
            </div>

            {/* content */}
            <div className={cn("pb-8", last && "pb-0")}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h3
                  className={cn(
                    "text-lg font-bold tracking-tight",
                    live ? "text-white" : "text-white/70",
                  )}
                >
                  {r.capability}
                </h3>
                <StatusChip status={r.status} />
              </div>
              <p className="mt-2 max-w-prose text-sm text-white/65">
                {r.detail}
              </p>
              <p className="mt-2 text-xs text-white/50">
                <span className="font-semibold uppercase tracking-eyebrow">
                  Gate
                </span>
                <span className="mx-2 text-white/25">·</span>
                {r.gate}
              </p>

              {isCurrent && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-lime-500/40 bg-lime-500/5 px-3 py-1.5 text-xs font-semibold text-lime-500">
                  <span aria-hidden className="size-1.5 rounded-full bg-lime-500" />
                  You are here. Rungs {CURRENT_RUNG + 1}–{RUNGS.length - 1} are
                  designed, not shipped.
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
