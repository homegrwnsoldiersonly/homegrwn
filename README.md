# HOMEGRWN — homegrwnagency.com

Redesigned marketing site for HOMEGRWN, rebuilt from Framer into Next.js + Tailwind CSS, ready to deploy on Vercel.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Two things to plug in

Both live in **`src/lib/site.ts`**:

1. **Calendly** — replace `calendlyUrl` with your real scheduling link. The booking section at `#book` embeds it automatically with brand colors.
2. **Vimeo** — set `vimeoVideoId` to the numeric ID from your video URL (`vimeo.com/123456789` → `"123456789"`). The VSL section stays hidden until an ID is set.

## Logo

The wordmark + sprout mark is recreated in code at `src/components/Logo.tsx` so it scales crisply at any size. To use your original logo file instead, drop it into `public/` and swap the component contents for an `<Image>`.

## Deploy on Vercel

1. Push this repo to GitHub (already done if you're reading this on GitHub).
2. In [Vercel](https://vercel.com/new), import the repo — Next.js is auto-detected, no config needed.
3. Add the custom domain `homegrwnagency.com` in the Vercel project settings and point your DNS at Vercel.

## Structure

- `src/app/page.tsx` — section order for the landing page
- `src/components/sections/` — one file per section (hero, stats, problem, services, process, guarantee, FAQ, booking, footer)
- `src/app/globals.css` — brand tokens (black/white/grey + green) and all CSS animations (scroll reveals, marquee, glows, FAQ accordion)
- `src/lib/site.ts` — central config (links, email, tagline)
