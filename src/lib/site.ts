/**
 * Central site configuration.
 *
 * ── SWAP THESE TWO VALUES ──────────────────────────────────────────────
 * CALENDLY_URL   → your real Calendly scheduling link
 * VIMEO_VIDEO_ID → the numeric ID from your Vimeo video URL
 *                  (vimeo.com/123456789 → "123456789")
 * Everything else on the site reads from this file.
 */
export const site = {
  name: "HOMEGRWN",
  domain: "homegrwnagency.com",
  email: "contact@homegrwnagency.com",

  // TODO(nathan): replace with your real Calendly link
  calendlyUrl: "https://calendly.com/homegrwnagency/strategy-call",

  // TODO(nathan): replace with your real Vimeo video ID (empty string hides the video section)
  vimeoVideoId: "",

  tagline: "AI-powered growth for home service businesses",
} as const;

export const calendlyEmbedUrl = `${site.calendlyUrl}?hide_gdpr_banner=1&background_color=0a0a0a&text_color=f5f5f5&primary_color=22e06b`;
