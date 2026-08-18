import { Reveal } from "../Reveal";

const faqs = [
  {
    q: "I already get plenty of work from referrals. Why would I need this?",
    a: "Referrals are the best leads there are — and the least predictable. They dry up the moment you hit a slow season or a key customer moves away. This system doesn't replace referrals; it adds a second, predictable channel you control. Most operators find ad-driven leads even easier to close, because those people are actively searching right now.",
  },
  {
    q: "I tried Google Ads before and it didn't work.",
    a: "Almost every operator with a bad Google Ads story was either running it themselves or using a generalist agency that didn't know the industry. Wrong keywords + generic landing page + no call tracking = burned money. We build service-industry-specific campaigns with tightly matched search intent and tracking that shows exactly which ad produced which call.",
  },
  {
    q: "Will the AI sound robotic to my customers?",
    a: "No — and you'll hear it before your customers ever do. We tune the voice, pacing, and script to sound like a friendly dispatcher, demo it for you before it goes live, and you approve every word it says. The goal: the caller gets their question answered or their appointment booked, and has a great first experience with your company.",
  },
  {
    q: "What if I get more leads than I can handle?",
    a: "A good problem — and one we plan for. The AI can book leads into future slots instead of same-day, so you build a queue rather than overload tomorrow's calendar. We also set geographic and job-type filters so you only get the work you actually want.",
  },
  {
    q: "What's the minimum commitment?",
    a: "Services are à la carte — take only what you need, priced so small businesses can actually afford them. We ask for enough runway for the ads to exit the learning phase, then you're month-to-month. We're not interested in keeping clients who aren't getting results; our goal is ROI so clear that staying is the obvious decision.",
  },
  {
    q: "How fast will my phone start ringing?",
    a: "Most systems are built, tested, and live within 14 days of our first call. Ads start producing calls as soon as they're live; rankings and automation compound from there over the first 60–90 days.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5">
        <Reveal>
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-green">
            Straight answers
          </p>
          <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight md:text-5xl">
            What you&apos;re probably thinking
          </h2>
        </Reveal>

        <div className="mt-12 flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 60}>
              <details className="faq-item group rounded-xl border border-line bg-surface transition-colors open:border-green/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left font-semibold">
                  {faq.q}
                  <span className="faq-icon flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line text-muted">
                    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                      <path d="M6 1v10M1 6h10" />
                    </svg>
                  </span>
                </summary>
                <div className="faq-body px-6 pb-6 text-sm leading-relaxed text-muted">
                  {faq.a}
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
