import { Reveal } from "../Reveal";

const leaks = [
  {
    title: "You're invisible when it matters most",
    body: "A homeowner's system backs up at 8pm and they search “septic pumping near me.” If you're not at the top of that page, the job goes to whoever is — even if their work can't touch yours.",
  },
  {
    title: "Missed calls are donated revenue",
    body: "The average service company misses 30–40% of inbound calls. Every one of them is a customer you already paid to attract — handed to a competitor for free.",
  },
  {
    title: "Your website gets looks, not bookings",
    body: "Traffic without a capture system is a leaky bucket. Visitors browse, hesitate, and leave — and you never even know they were there.",
  },
  {
    title: "Leads go cold while you're on a job",
    body: "Someone asks for a quote Monday. You get busy. By Wednesday they've booked someone else. Speed wins this game, and nobody can be fast from the top of a tank truck.",
  },
];

export function Problem() {
  return (
    <section id="problem" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-green">
            The real problem
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight md:text-5xl">
            You&apos;re not losing jobs to better companies.
            <br />
            <span className="text-muted">You&apos;re losing them to faster ones.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {leaks.map((leak, i) => (
            <Reveal key={leak.title} delay={i * 100}>
              <div className="card-lift h-full rounded-2xl border border-line bg-surface p-7">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-green/10">
                  <svg viewBox="0 0 20 20" className="h-5 w-5 text-green" fill="currentColor" aria-hidden="true">
                    <path d="M10 0a10 10 0 1 0 10 10A10 10 0 0 0 10 0Zm0 15.5a1.25 1.25 0 1 1 1.25-1.25A1.25 1.25 0 0 1 10 15.5Zm1-5a1 1 0 0 1-2 0v-5a1 1 0 0 1 2 0Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">{leak.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{leak.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-12 max-w-3xl text-lg text-foreground">
            Each of these leaks is fixable — and every one we plug puts jobs
            straight back in your truck.{" "}
            <span className="font-semibold text-green">
              That&apos;s exactly what the HOMEGRWN system does.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
