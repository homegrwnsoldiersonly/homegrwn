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
