import { PACKS, selectablePacks, type NichePack } from "@/lib/knowledge";
import { Card, Eyebrow, Heading } from "@/components/ui";
import { cn } from "@/lib/cn";
import { PACK_COPY } from "./packCopy";

/**
 * The real niche packs, read from the engine registry
 * (src/lib/knowledge/index.ts) so the site can never list a pack that
 * doesn't exist. Ids, labels, north stars, and guardrail principles are the
 * engine's own strings and are unit-tested to carry no digits or percent
 * signs (src/lib/knowledge/knowledge.test.ts). Descriptions are NOT the
 * engine's — they come from ./packCopy, which marketing owns and the claims
 * gate governs; a pack with no public copy renders its label only.
 */

interface Group {
  parentId: string;
  eyebrow: string;
  youHandle: string;
  routes: string;
}

const GROUPS: Group[] = [
  {
    parentId: "home-services",
    eyebrow: "Home services",
    youHandle: "You handle the trucks. We handle the tech.",
    routes:
      "Plumbing, electrical, septic, solar, pest, landscaping, garage, cleaning, and restoration accounts route to this pack. HVAC and roofing get their own.",
  },
  {
    parentId: "legal-personal-injury",
    eyebrow: "Personal-injury law",
    youHandle: "You handle the cases. We handle the tech.",
    routes:
      "Any PI account without a sub-niche match routes to this pack. Car accident, truck accident, and mass tort get their own.",
  },
];

function subPacksOf(parentId: string): NichePack[] {
  return selectablePacks().filter((p) => p.extends === parentId);
}

function publicDescription(packId: string): string | undefined {
  return PACK_COPY[packId]?.description;
}

export function NichePacks({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-2", className)}>
      {GROUPS.map((g) => {
        const parent = PACKS[g.parentId];
        if (!parent) return null;
        const subs = subPacksOf(parent.id);
        const parentCopy = publicDescription(parent.id);
        return (
          <Card
            key={parent.id}
            radius="xl"
            padding="lg"
            className="flex flex-col border-white/10 bg-charcoal-900/70"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Eyebrow flag>{g.eyebrow}</Eyebrow>
              <span className="numerals text-xs text-white/45">{parent.id}</span>
            </div>
            <Heading as="h3" size="display-sm" className="mt-4">
              {parent.label}
            </Heading>
            <p className="mt-2 text-sm font-medium text-lime-300">{g.youHandle}</p>
            {parentCopy && (
              <p className="mt-3 text-sm text-white/65">{parentCopy}</p>
            )}

            {parent.conversionModel && (
              <div className="mt-5 rounded-lg border border-lime-500/30 bg-lime-500/5 p-4">
                <div className="text-xs font-semibold uppercase tracking-eyebrow text-lime-500">
                  Optimizes to
                </div>
                <p className="mt-1 text-sm text-white">
                  {parent.conversionModel.northStar}
                </p>
              </div>
            )}

            <div className="mt-5">
              <div className="text-xs font-semibold uppercase tracking-eyebrow text-white/55">
                Guardrails — hard gates once it can write
              </div>
              <ul className="mt-2 space-y-2">
                {parent.guardrails.map((gr) => (
                  <li key={gr.id} className="flex gap-2.5 text-sm text-white/75">
                    <span
                      aria-hidden
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-lime-500"
                    />
                    <span>
                      {gr.principle}
                      <span className="numerals ml-2 text-xs text-white/35">
                        {gr.id}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5">
              <div className="text-xs font-semibold uppercase tracking-eyebrow text-white/55">
                Sub-niche packs
              </div>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {subs.map((s) => {
                  const copy = publicDescription(s.id);
                  return (
                    <li
                      key={s.id}
                      className="rounded-lg border border-white/10 bg-ink-950/50 p-3"
                    >
                      <div className="text-sm font-semibold text-white">
                        {s.label.replace(/^.*— /, "")}
                      </div>
                      {copy && <p className="mt-1 text-xs text-white/60">{copy}</p>}
                    </li>
                  );
                })}
              </ul>
            </div>

            <p className="mt-5 text-xs text-white/50">{g.routes}</p>
          </Card>
        );
      })}
    </div>
  );
}
