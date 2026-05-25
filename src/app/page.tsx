export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <p className="text-orange-400 font-semibold uppercase tracking-widest text-sm mb-4">
          For HVAC · Septic · Solar · Home Services
        </p>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
          Stop Paying for Leads.<br />
          <span className="text-orange-400">Start Owning Your Market.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10">
          The HOMEGRWN system teaches home services businesses how to generate their own leads —
          no agencies, no middlemen, no monthly fees eating your margin.
        </p>
        <a
          href="#training"
          className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
        >
          Get Free Access →
        </a>
      </section>

      {/* Training Modules */}
      <section id="training" className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">The A-Z Training</h2>
        <p className="text-gray-400 text-center max-w-xl mx-auto mb-16">
          Everything you need to build a marketing machine for your home services business — from scratch.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {modules.map((mod) => (
            <div
              key={mod.title}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-orange-500 transition-colors"
            >
              <div className="text-3xl mb-4">{mod.icon}</div>
              <h3 className="text-xl font-bold mb-2">{mod.title}</h3>
              <p className="text-gray-400 text-sm">{mod.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 px-6 text-center bg-orange-500">
        <h2 className="text-4xl font-bold text-white mb-4">Ready to Own Your Market?</h2>
        <p className="text-orange-100 mb-8 max-w-xl mx-auto">
          Join home services businesses across the country who stopped renting leads and started owning their growth.
        </p>
        <a
          href="#"
          className="bg-white text-orange-500 font-bold px-8 py-4 rounded-xl text-lg hover:bg-orange-50 transition-colors"
        >
          Start Free Training →
        </a>
      </section>

      <footer className="py-8 text-center text-gray-600 text-sm bg-gray-950">
        © {new Date().getFullYear()} HOMEGRWN. All rights reserved.
      </footer>
    </main>
  );
}

const modules = [
  {
    icon: "🎯",
    title: "Module A — Know Your Market",
    description: "Find out exactly who your best customers are and where they're already looking for you.",
  },
  {
    icon: "🌐",
    title: "Module B — Build Your Foundation",
    description: "Set up a website that actually converts visitors into booked jobs.",
  },
  {
    icon: "📍",
    title: "Module C — Own Local Search",
    description: "Dominate Google Maps and local SEO so your phone rings without paying per click.",
  },
  {
    icon: "📱",
    title: "Module D — Social That Sells",
    description: "Turn your social media into a lead generation machine — no dancing required.",
  },
  {
    icon: "⭐",
    title: "Module E — Reviews & Reputation",
    description: "Build a 5-star reputation that sells for you 24/7.",
  },
  {
    icon: "🔁",
    title: "Module F — Follow-Up Systems",
    description: "Automate follow-up so no lead slips through the cracks ever again.",
  },
];
