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
