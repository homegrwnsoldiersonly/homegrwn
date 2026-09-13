import Image from "next/image";
import Link from "next/link";
import { Card, CheckerFlag, Eyebrow, Heading } from "@/components/ui";
import { Icon } from "./Icon";

export interface CaseStudyCardProps {
  href: string;
  title: string;
  summary: string;
  /** e.g. "Septic · Google Ads" */
  tags: string[];
  /**
   * Optional artwork. Omit it and the card renders a branded slate — the
   * claims gate: legacy thumbnails carry unverified outcome copy
   * (docs/content/claims.md), so nothing legacy renders until VERIFIED.
   */
  thumb?: { src: string; alt: string; width: number; height: number };
  /** Visible label so a video study is never mistaken for a written one. */
  kind?: "video" | "article";
}

/** Index card for /case-studies. No numbers here — claims gate. */
export function CaseStudyCard({
  href,
  title,
  summary,
  tags,
  thumb,
  kind = "video",
}: CaseStudyCardProps) {
  return (
    <Link
      href={href}
      className="group/study flex rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <Card
        interactive
        padding="none"
        className="flex w-full flex-col overflow-hidden"
      >
      <div className="relative aspect-video w-full overflow-hidden bg-ink-950">
        {thumb ? (
          <Image
            src={thumb.src}
            alt={thumb.alt}
            width={thumb.width}
            height={thumb.height}
            sizes="(min-width: 1024px) 480px, (min-width: 640px) 50vw, 100vw"
            className="size-full object-cover transition-transform duration-200 ease-brand group-hover/study:scale-[1.02]"
          />
        ) : (
          <div
            aria-hidden
            className="bg-ground bg-grain flex size-full flex-col justify-end p-5"
          >
            <span className="text-xs font-semibold uppercase tracking-eyebrow text-white/50">
              {tags.join(" · ")}
            </span>
            <CheckerFlag size={12} cols={10} rows={2} className="mt-3" />
          </div>
        )}
        {kind === "video" && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-ink-950/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            <Icon name="Play" size={12} className="text-lime-500" />
            Video case study
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <Eyebrow tone="muted" as="span">
          {tags.join(" · ")}
        </Eyebrow>
        <Heading as="h3" size="title" className="mt-3">
          {title}
        </Heading>
        <p className="mt-2 text-sm text-white/70">{summary}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-lime-500">
          Read the study
          <Icon
            name="ArrowRight"
            size={16}
            className="transition-transform duration-200 ease-brand group-hover/study:translate-x-0.5"
          />
        </span>
      </div>
      </Card>
    </Link>
  );
}
