import { PACKS } from "@/lib/knowledge";
import { cn } from "@/lib/cn";

/**
 * "What it optimizes to" — the platform-visible proxy on the left, the
 * business outcome on the right. North-star strings come from the packs.
 */

const PROXIES = [
  { label: "Form fill", note: "Counted the moment it lands. Nothing about who filled it." },
  { label: "Any phone call", note: "A wrong number and a booked job look identical." },
  { label: "'Conversions'", note: "Whatever the bid strategy was told to chase." },
];

export function OptimizesTo({ className }: { className?: string }) {
  const hs = PACKS["home-services"]?.conversionModel?.northStar;
  const pi = PACKS["legal-personal-injury"]?.conversionModel?.northStar;

  return (
    <div className={cn("grid gap-4 lg:grid-cols-2", className)}>
      {/* Left: what the platform sees */}
      <div className="rounded-xl border border-white/10 bg-ink-950/60 p-6 sm:p-8">
        <div className="text-xs font-semibold uppercase tracking-eyebrow text-white/50">
          What the platform can count
        </div>
        <ul className="mt-5 space-y-4">
          {PROXIES.map((p) => (
            <li key={p.label} className="flex gap-3">
              <span
                aria-hidden
                className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-md border border-white/20 text-white/40"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <div className="text-base font-semibold text-white/80">{p.label}</div>
                <p className="mt-0.5 text-sm text-white/50">{p.note}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-white/55">
          Smart Bidding chases what it can see. If what it sees is a form fill,
          it will buy you form fills. This is how generalist automation
          regresses to the mean.
        </p>
      </div>

      {/* Right: what Ads Driver optimizes to */}
      <div className="rounded-xl border border-lime-500/40 bg-charcoal-900 p-6 shadow-glow-lime sm:p-8">
        <div className="text-xs font-semibold uppercase tracking-eyebrow text-lime-500">
          What Ads Driver optimizes to
        </div>
        <dl className="mt-5 space-y-5">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-eyebrow text-white/55">
              Home services
            </dt>
            <dd className="mt-1 text-lg font-bold tracking-tight text-white">
              {hs ?? "Booked job, weighted by job value"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-eyebrow text-white/55">
              Personal-injury law
            </dt>
            <dd className="mt-1 text-lg font-bold tracking-tight text-white">
              {pi ?? "Signed case"}
            </dd>
          </div>
        </dl>
        <div className="mt-6 border-t border-white/10 pt-5">
          <div className="text-xs font-semibold uppercase tracking-eyebrow text-white/55">
            How it gets there
          </div>
          <ul className="mt-2 space-y-1.5 text-sm text-white/75">
            <li className="flex gap-2">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-lime-500" />
              Offline conversion import — the outcome the platform can&apos;t see becomes the primary conversion.
            </li>
            <li className="flex gap-2">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-lime-500" />
              Dry-run plan preview before any upload. A human runs the apply.
            </li>
            <li className="flex gap-2">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-lime-500" />
              Order-id dedupe — a re-upload can never double-count a job or a case.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
