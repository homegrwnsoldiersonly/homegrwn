import { calendlyEmbedUrl } from "@/lib/site";
import { Reveal } from "../Reveal";

const takeaways = [
  "A read on your local market and who's currently winning it",
  "The leaks costing you jobs right now — and the fix for each",
  "A step-by-step growth plan that's yours to keep, no strings",
];

export function BookCall() {
  return (
    <section id="book" className="border-t border-line bg-surface/40 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-start gap-12 px-5 lg:grid-cols-2">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <p className="text-sm font-semibold uppercase tracking-widest text-green">
              Free strategy call
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
              30 minutes.
              <br />
              Walk away with a plan
              <span className="text-muted"> either way.</span>
            </h2>
            <p className="mt-5 max-w-md text-lg text-muted">
              This isn&apos;t a sales ambush. It&apos;s a working session on your
              market — and everything we map out is yours to keep, even if we
              never work together.
            </p>
            <ul className="mt-8 flex flex-col gap-4">
              {takeaways.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                  <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0 text-green" fill="currentColor" aria-hidden="true">
                    <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0Zm3.7 6.2-4.2 4.4a.8.8 0 0 1-1.2 0L4.3 8.5a.8.8 0 1 1 1.2-1.1l1.4 1.5 3.6-3.8a.8.8 0 1 1 1.2 1.1Z" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="overflow-hidden rounded-2xl border border-line bg-surface">
            <iframe
              src={calendlyEmbedUrl}
              className="h-[680px] w-full"
              title="Book your free growth plan call"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
