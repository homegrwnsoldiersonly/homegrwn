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
