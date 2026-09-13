# Copy harvested from branch claude/homegrwn-redesign-github-vercel-bcslg0

Extracted 2026-09-13. A prior conversion-focused rebuild of the agency home. Its STRUCTURE and most of its COPY are strong and in Nathan's voice; its STATS are the rejected legacy numbers (see claims.md) — harvest the words, never the figures.

## Hero
```tsx
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
```

## Problem
```tsx
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
```

## Services
```tsx
import { Reveal } from "../Reveal";

const services = [
  {
    title: "Laser-Targeted Ads",
    body: "Google, Meta, and Local Services Ads aimed at the exact searches that mean someone needs you now. High-intent keywords, tight service radius, full conversion tracking — no wasted spend.",
    icon: (
      <path d="M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8Zm0 4a6 6 0 1 0 6 6h-2a4 4 0 1 1-4-4Zm0 4a2 2 0 1 0 2 2 2 2 0 0 0-2-2Zm8.7-7.3-3 3-1.4-1.4 3-3ZM22 4h-3V1h-2v3a2 2 0 0 0 2 2h3Z" />
    ),
  },
  {
    title: "24/7 AI Receptionists",
    body: "An AI voice agent and website chatbot that answer every call and message — nights, weekends, mid-job. They qualify the lead, capture the address, and book it straight into your calendar.",
    icon: (
      <path d="M12 1a9 9 0 0 0-9 9v7a3 3 0 0 0 3 3h2v-8H6v-2a6 6 0 0 1 12 0v2h-2v8h2v1h-6v2h6a3 3 0 0 0 3-3V10a9 9 0 0 0-9-9Z" />
    ),
  },
  {
    title: "Conversion-Obsessed Landing Pages",
    body: "Fast-loading pages engineered around one goal: turning visitors into booked jobs. Built for mobile, wired with booking tech, and matched to what your customers are actually searching.",
    icon: (
      <path d="M4 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Zm0 2h16v3H4Zm0 5h16v11H4Zm2 3v2h6v-2Zm0 4v2h9v-2Z" />
    ),
  },
  {
    title: "Automated Follow-Up",
    body: "Multi-step SMS and email sequences fire the moment a lead comes in and keep working it for 14 days. Zero missed leads, zero extra effort from your team.",
    icon: (
      <path d="M12 2A10 10 0 0 0 2 12a9.9 9.9 0 0 0 2.3 6.4L2 22l3.7-2.2A10 10 0 1 0 12 2Zm-5 9h10v2H7Zm0-4h10v2H7Zm0 8h7v2H7Z" />
    ),
  },
  {
    title: "Google Business Domination",
    body: "Weekly posts, review responses, photos, and category optimization that push you up the Maps rankings — so the free, organic calls come to you instead of the guy across town.",
    icon: (
      <path d="M12 2a8 8 0 0 0-8 8c0 5.4 7 11.5 7.3 11.8a1 1 0 0 0 1.4 0C13 21.5 20 15.4 20 10a8 8 0 0 0-8-8Zm0 11a3 3 0 1 1 3-3 3 3 0 0 1-3 3Z" />
    ),
  },
  {
    title: "Transparent Reporting",
    body: "See exactly which ad produced which call and what every job cost to win. Straight numbers, monthly strategy input, and no smoke — you'll always know your ROI.",
    icon: (
      <path d="M3 3h2v18H3Zm16 4h2v14h-2Zm-8 4h2v10h-2Zm-4 3h2v7H7Zm8-9h2v16h-2ZM19 3l3 3-3 3-1.4-1.4L19.2 6l-1.6-1.6Z" />
    ),
  },
];

export function Services() {
  return (
    <section id="services" className="border-t border-line bg-surface/40 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-green">
            The growth stack
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight md:text-5xl">
            Six weapons. One integrated system.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            À la carte pricing — take only what you need. Every piece works alone;
            together they compound.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={(i % 3) * 100}>
              <div className="card-lift group h-full rounded-2xl border border-line bg-surface p-7">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-green/10 transition-colors group-hover:bg-green/20">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-green" fill="currentColor" aria-hidden="true">
                    {service.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-bold">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{service.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## Process
```tsx
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
```

## Guarantee
```tsx
import { Reveal } from "../Reveal";

export function Guarantee() {
  return (
    <section className="section-glow border-y border-line py-20 md:py-24">
      <div className="mx-auto max-w-4xl px-5 text-center">
        <Reveal>
          <svg viewBox="0 0 24 24" className="mx-auto mb-6 h-12 w-12 text-green" fill="currentColor" aria-hidden="true">
            <path d="M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5Zm-1.4 15.3-3.9-3.9 1.4-1.4 2.5 2.5 5.3-5.3 1.4 1.4Z" />
          </svg>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            If it doesn&apos;t pay for itself,
            <br />
            <span className="text-green">don&apos;t keep us.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            We&apos;re a boutique operation, not a bloated agency — which means your
            account is never handed to an intern, and we only win when your phone
            rings. No long contracts. No lock-in. You see every number we see,
            and you stay month-to-month because the math works.
          </p>
        </Reveal>
        <Reveal delay={150}>
          <a
            href="#book"
            className="btn-glow mt-10 inline-block rounded-full bg-green px-8 py-4 text-base font-bold text-background"
          >
            Claim My Free Growth Plan →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
```

## Faq
```tsx
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
```

## BookCall
```tsx
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
```

## IndustryMarquee
```tsx
const industries = [
  "Septic Pumping",
  "Septic Installation",
  "HVAC",
  "Plumbing",
  "Electrical",
  "Roofing",
  "Landscaping",
  "Pest Control",
  "Garage Doors",
  "Well & Water",
];

export function IndustryMarquee() {
  return (
    <section aria-label="Industries we serve" className="border-y border-line bg-surface py-5">
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted">
        Built exclusively for home services — we don&apos;t do dentists or law firms
      </p>
      <div className="marquee overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="marquee-track flex w-max items-center">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
              {industries.map((name) => (
                <span
                  key={`${copy}-${name}`}
                  className="mx-6 flex items-center gap-3 whitespace-nowrap text-sm font-medium text-muted"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-green" />
                  {name}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## VideoSection
```tsx
import { site } from "@/lib/site";
import { Reveal } from "../Reveal";

/**
 * Vimeo VSL embed. Renders only when a video ID is configured in src/lib/site.ts.
 */
export function VideoSection() {
  if (!site.vimeoVideoId) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-5">
        <Reveal>
          <h2 className="text-center text-3xl font-extrabold tracking-tight md:text-4xl">
            Watch How the System Books Jobs{" "}
            <span className="text-green">While You&apos;re On One</span>
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <div className="card-lift mt-10 overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="relative aspect-video">
              <iframe
                src={`https://player.vimeo.com/video/${site.vimeoVideoId}?title=0&byline=0&portrait=0&color=22e06b`}
                className="absolute inset-0 h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="HOMEGRWN — how it works"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

## StatsBar
```tsx
import { Reveal } from "../Reveal";
import { StatCounter } from "../StatCounter";

const stats = [
  { value: 30, suffix: "%+", label: "average drop in cost per lead" },
  { value: 3, suffix: "x", label: "ROI our clients target in 60 days" },
  { value: 10000, suffix: "+", label: "leads generated with our AI systems" },
  { value: 92, suffix: "%", label: "of clients see remarkable growth" },
];

export function StatsBar() {
  return (
    <section className="section-glow border-b border-line py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 md:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 100}>
            <div className="text-center">
              <p className="text-4xl font-extrabold tracking-tight text-green md:text-5xl">
                <StatCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm text-muted">{stat.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

## Footer
```tsx
import { site } from "@/lib/site";
import { Logo } from "../Logo";

export function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-muted">{site.tagline}</p>
        </div>
        <div className="flex flex-col items-center gap-2 md:items-end">
          <a
            href={`mailto:${site.email}`}
            className="text-sm text-muted transition-colors hover:text-green"
          >
            {site.email}
          </a>
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

