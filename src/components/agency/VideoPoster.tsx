import { CheckerFlag, Eyebrow } from "@/components/ui";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

export interface VideoPosterProps {
  /**
   * YouTube embed URL (https://www.youtube-nocookie.com/embed/<id>). When
   * set, the branded slate is replaced by the iframe. TODO(nathan): supply the
   * id of the septic case-study video; until then this renders an honest
   * "video publishing soon" slate — no fake play button.
   */
  embedUrl?: string;
  title: string;
  /** Small label above the title, e.g. "Case study · Septic · Google Ads". */
  eyebrow?: string;
  className?: string;
}

/**
 * Video slot: iframe when an embed URL exists, branded slate otherwise.
 *
 * Claims gate: the legacy thumbnail
 * (public/brand/legacy/case-study-septic-google-ads-thumb.png) carries
 * "LOWER COST PER LEAD" in display type, and docs/content/claims.md lists that
 * outcome as CLAIMS_TO_VERIFY. It also ships full-colour Google/YouTube marks
 * and a blue truck against the monochrome/lime imagery rule. So no legacy
 * artwork renders here until the before/after is VERIFIED — the slate is
 * tokens only.
 */
export function VideoPoster({ embedUrl, title, eyebrow, className }: VideoPosterProps) {
  return (
    <figure
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-2xl border border-charcoal-700 bg-ink-950",
        className,
      )}
    >
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <>
          <div aria-hidden className="bg-ground bg-grain absolute inset-0" />
          <div className="relative flex size-full flex-col justify-between p-5 sm:p-8">
            <CheckerFlag size={14} cols={10} rows={2} />
            <div className="max-w-xl">
              {eyebrow && <Eyebrow flag>{eyebrow}</Eyebrow>}
              <p
                className={cn(
                  "text-2xl font-extrabold tracking-display text-balance",
                  eyebrow && "mt-3",
                )}
              >
                {title}
              </p>
            </div>
          </div>
          <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-ink-950/80 px-4 py-3 text-xs text-white/80 backdrop-blur">
            <span className="inline-flex items-center gap-2">
              <Icon name="Play" size={12} className="text-lime-500" />
              Video walk-through
            </span>
            <span className="rounded-full border border-white/15 px-2.5 py-0.5 font-medium text-white/70">
              Video publishing soon
            </span>
          </figcaption>
        </>
      )}
    </figure>
  );
}
