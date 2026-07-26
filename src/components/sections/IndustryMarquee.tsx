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
