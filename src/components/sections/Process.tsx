import { Reveal } from "../Reveal";

const steps = [
  {
    num: "01",
    title: "Book your free growth plan",
    body: "A 30-minute call. We analyze your market, your current lead sources, and where jobs are leaking. You leave with a step-by-step plan — yours to keep whether or not we ever work together.",
  },
  {
    num: "02",
    title: "We build your system",
    body: "Ads, AI receptionists, landing pages, follow-up — tailored to your services, your radius, and the jobs you actually want. Most systems are live and ringing within 14 days.",
  },
  {
    num: "03",
    title: "You answer the phone",
    body: "Jobs land on your calendar. You watch the numbers in plain-English reports. No long contracts — you stay because it's working, not because a PDF says you have to.",
  },
];

export function Process() {
  return (
    <section id="process" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-green">
            How it works
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight md:text-5xl">
            From first call to first booked job
            <span className="text-muted"> in three steps.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 150}>
              <div className="relative h-full">
                {i < steps.length - 1 && (
                  <div
                    className="absolute left-full top-8 hidden h-px w-8 bg-gradient-to-r from-green/60 to-transparent md:block"
                    aria-hidden="true"
                  />
                )}
                <div className="card-lift h-full rounded-2xl border border-line bg-surface p-7">
                  <span className="text-sm font-bold tracking-widest text-green">
                    {step.num}
                  </span>
                  <h3 className="mt-3 text-xl font-bold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{step.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
