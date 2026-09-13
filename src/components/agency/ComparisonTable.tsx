import { Container, Eyebrow, Heading, Section } from "@/components/ui";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";
import { COMPARISON, type ComparisonRow, type ComparisonValue } from "./content";

export interface ComparisonTableProps {
  id?: string;
  rows?: ComparisonRow[];
}

const MARK: Record<ComparisonValue, { icon: "Check" | "X" | "Minus"; label: string; className: string }> = {
  yes: { icon: "Check", label: "Yes", className: "border-lime-500/40 bg-lime-500/15 text-lime-500" },
  partial: { icon: "Minus", label: "Partly", className: "border-white/15 bg-white/5 text-white/60" },
  no: { icon: "X", label: "No", className: "border-white/15 bg-white/5 text-white/50" },
};

function Mark({ value, invert }: { value: ComparisonValue; invert?: boolean }) {
  // For the "Contracts" row a "no" is the good outcome; `invert` flips the tone.
  const tone = invert ? (value === "no" ? "yes" : value === "yes" ? "no" : "partial") : value;
  const m = MARK[tone];
  return (
    <span
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-full border",
        m.className,
      )}
    >
      <Icon name={m.icon} size={14} aria-label={MARK[value].label} />
    </span>
  );
}

const HOMEGRWN = "HOMEGRWN";
const AGENCY = "Regular agency";

/**
 * "Growth engineers vs. a regular agency."
 *
 * Mobile-first: below `md` every row is a card with two labelled lines
 * (HOMEGRWN / Regular agency) so the HOMEGRWN column — the point of the
 * section — is never off-screen at 375px. From `md` the same data renders as
 * a real <table> for semantics. The two are swapped with `md:hidden` /
 * `hidden md:block` (display:none), so assistive tech only ever sees one.
 */
export function ComparisonTable({ id = "compare", rows = COMPARISON }: ComparisonTableProps) {
  return (
    <Section variant="grain" id={id}>
      <Container>
        <div className="max-w-2xl">
          <Eyebrow flag>Growth engineers, not marketers</Eyebrow>
          <Heading as="h2" className="mt-4">
            We&apos;re not just marketers. We&apos;re growth engineers.
          </Heading>
          <p className="mt-4 text-md text-white/70">
            A regular agency buys clicks and sends a report. We build the
            machine that turns those clicks into booked jobs — and we keep our
            hands on it.
          </p>
        </div>

        {/* < md: stacked cards */}
        <ul className="mt-10 grid gap-3 md:hidden">
          {rows.map((r) => {
            const invert = r.feature === "Contracts";
            return (
              <li
                key={r.feature}
                className="rounded-2xl border border-charcoal-700 bg-charcoal-900 p-5"
              >
                <h3 className="text-base font-semibold text-white">{r.feature}</h3>
                <dl className="mt-4 grid gap-3">
                  <div className="flex items-start gap-3">
                    <Mark value={r.homegrwn} invert={invert} />
                    <div className="min-w-0">
                      <dt className="text-xs font-semibold uppercase tracking-eyebrow text-lime-500">
                        {HOMEGRWN}
                      </dt>
                      <dd className="mt-0.5 text-sm text-white/85">{r.homegrwnNote}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 border-t border-white/10 pt-3">
                    <Mark value={r.agency} invert={invert} />
                    <div className="min-w-0">
                      <dt className="text-xs font-semibold uppercase tracking-eyebrow text-white/50">
                        {AGENCY}
                      </dt>
                      <dd className="mt-0.5 text-sm text-white/60">{r.agencyNote}</dd>
                    </div>
                  </div>
                </dl>
              </li>
            );
          })}
        </ul>

        {/* md+: real table */}
        <div className="mt-10 hidden overflow-x-auto rounded-2xl border border-charcoal-700 bg-charcoal-900 md:block">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-eyebrow text-white/50">
                  Feature
                </th>
                <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-eyebrow text-lime-500">
                  {HOMEGRWN}
                </th>
                <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-eyebrow text-white/50">
                  {AGENCY}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {rows.map((r) => {
                const invert = r.feature === "Contracts";
                return (
                  <tr key={r.feature} className="align-top">
                    <th scope="row" className="px-5 py-4 font-semibold text-white">
                      {r.feature}
                    </th>
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <Mark value={r.homegrwn} invert={invert} />
                        <span className="text-white/85">{r.homegrwnNote}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <Mark value={r.agency} invert={invert} />
                        <span className="text-white/60">{r.agencyNote}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Container>
    </Section>
  );
}
