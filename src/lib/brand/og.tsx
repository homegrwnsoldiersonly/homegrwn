import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { colors, tracking } from "./tokens";

/**
 * Shared Open Graph image renderer for the marketing surfaces
 * (src/app/{agency,ads}/opengraph-image.tsx). Colours come from tokens.ts —
 * never raw hex here. Satori (next/og) draws with flexbox only, so every
 * multi-child box declares `display: flex`.
 *
 * Font: Inter 800 is committed at src/assets/fonts/Inter-ExtraBold.ttf
 * (SIL OFL; the Google Fonts static TTF) and read from disk, so the cards
 * are deterministic and never depend on the network. A missing file throws —
 * the build fails loudly instead of shipping the thin next/og fallback face.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

export interface OgImageSpec {
  eyebrow: string;
  /** Up to two lines; the second is lime. */
  title: [string, string?];
  footer: string;
  /** "agency" = charcoal/forest ground · "ads" = ink ground, sharper */
  variant: "agency" | "ads";
}

const INTER_EXTRABOLD_PATH = join(
  process.cwd(),
  "src/assets/fonts/Inter-ExtraBold.ttf",
);

let interExtraBold: Promise<Buffer> | undefined;

/** Inter 800, read once per process and shared by both OG images. */
function loadInterExtraBold(): Promise<Buffer> {
  interExtraBold ??= readFile(INTER_EXTRABOLD_PATH).catch((err: unknown) => {
    interExtraBold = undefined;
    throw new Error(
      `OG image font missing: expected Inter 800 at ${INTER_EXTRABOLD_PATH}. ` +
        "Restore src/assets/fonts/Inter-ExtraBold.ttf (docs/brand.md: display = Inter 800). " +
        `Cause: ${err instanceof Error ? err.message : String(err)}`,
    );
  });
  return interExtraBold;
}

function Flag({ cols, size }: { cols: number; size: number }) {
  const rows = 2;
  const cells: Array<{ x: number; y: number }> = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if ((r + c) % 2 === 0) cells.push({ x: c, y: r });
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: cols * size,
        height: rows * size,
        transform: "skewX(-12deg)",
      }}
    >
      {cells.map((c) => (
        <div
          key={`${c.x}-${c.y}`}
          style={{
            position: "absolute",
            left: c.x * size,
            top: c.y * size,
            width: size,
            height: size,
            background: colors.lime500,
          }}
        />
      ))}
    </div>
  );
}

export async function renderOgImage(spec: OgImageSpec): Promise<ImageResponse> {
  const inter = await loadInterExtraBold();
  const family = "Inter";
  const isAds = spec.variant === "ads";
  const background = isAds
    ? `linear-gradient(180deg, ${colors.ink950} 0%, ${colors.charcoal900} 100%)`
    : `linear-gradient(160deg, ${colors.charcoal900} 0%, ${colors.forest800} 100%)`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background,
          color: colors.white,
          fontFamily: family,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: "0.18em",
            }}
          >
            HOMEGRWN
          </div>
          <Flag cols={8} size={9} />
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: tracking.eyebrow,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            {spec.eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: isAds ? 84 : 78,
              fontWeight: 800,
              lineHeight: 0.98,
              letterSpacing: tracking.display,
            }}
          >
            {spec.title[0]}
          </div>
          {spec.title[1] && (
            <div
              style={{
                display: "flex",
                fontSize: isAds ? 84 : 78,
                fontWeight: 800,
                lineHeight: 0.98,
                letterSpacing: tracking.display,
                color: colors.lime500,
              }}
            >
              {spec.title[1]}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <div style={{ display: "flex" }}>{spec.footer}</div>
          <div
            style={{
              display: "flex",
              width: 220,
              height: isAds ? 6 : 4,
              background: colors.lime500,
              borderRadius: isAds ? 0 : 999,
              boxShadow: isAds ? `0 0 48px 0 ${colors.lime500}` : "none",
            }}
          />
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [{ name: "Inter", data: inter, style: "normal", weight: 800 }],
    },
  );
}
