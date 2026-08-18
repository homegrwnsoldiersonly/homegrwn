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
