import { Reveal } from "../Reveal";

const proofChips = [
  "10,000+ leads generated",
  "14 years running paid ads",
  "Live in 14 days",
];

export function Hero() {
  return (
    <section id="top" className="hero-bg relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
      <div className="mx-auto max-w-5xl px-5 text-center">
        <Reveal>
          <p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-green">
            <span className="relative inline-flex h-2 w-2">
              <span className="ping-dot relative inline-flex h-2 w-2 rounded-full bg-green" />
            </span>
            For Septic &amp; Home Service Pros
          </p>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Your Phone Should
            <br />
            <span className="accent-underline">Never Stop Ringing.</span>
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted md:text-xl">
            Your competitors aren&apos;t beating you on quality — they&apos;re beating you
            on visibility. HOMEGRWN installs a lead machine built for local service
            businesses: laser-targeted ads, AI that answers every call and chat
            24/7, and follow-up that never forgets — so searches in your area turn
            into jobs on your schedule.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#book"
              className="btn-glow w-full rounded-full bg-green px-8 py-4 text-base font-bold text-background sm:w-auto"
            >
              Get My Free Growth Plan →
            </a>
            <a
              href="#process"
              className="w-full rounded-full border border-line bg-surface px-8 py-4 text-base font-semibold text-foreground transition-colors hover:border-green/50 sm:w-auto"
            >
              See How It Works
            </a>
          </div>
          <p className="mt-4 text-sm text-muted">
            Free 30-minute strategy call · No long contracts · Stay only if you grow
          </p>
        </Reveal>

        <Reveal delay={400}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {proofChips.map((chip) => (
              <span key={chip} className="flex items-center gap-2 text-sm text-muted">
                <svg viewBox="0 0 16 16" className="h-4 w-4 text-green" fill="currentColor" aria-hidden="true">
                  <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0Zm3.7 6.2-4.2 4.4a.8.8 0 0 1-1.2 0L4.3 8.5a.8.8 0 1 1 1.2-1.1l1.4 1.5 3.6-3.8a.8.8 0 1 1 1.2 1.1Z" />
                </svg>
                {chip}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
