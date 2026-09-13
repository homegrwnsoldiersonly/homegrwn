import { describe, expect, it } from "vitest";
import { LEGAL_SLUGS } from "@/content/legal";
import { NICHE_SLUGS } from "@/content/niches";
import {
  agencyJsonLd,
  publicRoutes,
  robotsFor,
  serializeJsonLd,
  sitemapEntries,
} from "./seo";

describe("publicRoutes", () => {
  it("derives every niche and legal slug for the agency", () => {
    const paths = publicRoutes("agency").map((r) => r.path);
    for (const s of NICHE_SLUGS) expect(paths).toContain(`/niches/${s}`);
    for (const s of LEGAL_SLUGS) expect(paths).toContain(`/legal/${s}`);
    expect(paths).toContain("/book");
    expect(paths).toContain("/privacy");
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("lists the Ads Driver pages and nothing for the dashboard", () => {
    expect(publicRoutes("ads").map((r) => r.path)).toEqual([
      "/",
      "/how-it-works",
      "/pricing",
      "/faq",
      "/apply",
      "/privacy",
    ]);
    expect(publicRoutes("app")).toEqual([]);
  });

  it("never emits a reserved prefix", () => {
    for (const s of ["agency", "ads"] as const) {
      for (const r of publicRoutes(s)) {
        expect(r.path).not.toMatch(/^\/(agency|ads|app)(\/|$)/);
      }
    }
  });
});

describe("sitemapEntries", () => {
  it("uses the surface's canonical host", () => {
    const when = new Date("2026-09-13T00:00:00Z");
    const ads = sitemapEntries("ads", when);
    expect(ads[0]).toMatchObject({
      url: "https://adsdriver.homegrwndigital.com",
      lastModified: when,
      priority: 1,
    });
    expect(ads[1].url).toBe("https://adsdriver.homegrwndigital.com/how-it-works");
  });
});

describe("robotsFor", () => {
  it("blocks the dashboard host entirely", () => {
    expect(robotsFor("app")).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });

  it("allows public hosts except the internal prefixes", () => {
    const r = robotsFor("agency");
    expect(r.rules).toMatchObject({
      allow: "/",
      disallow: ["/api/", "/agency/", "/ads/", "/app/", "/brand/legacy/"],
    });
    expect(r.sitemap).toEqual(["https://homegrwndigital.com/sitemap.xml"]);
  });

  it("lists every public sitemap on a neutral host", () => {
    expect(robotsFor(null).sitemap).toEqual([
      "https://homegrwndigital.com/sitemap.xml",
      "https://adsdriver.homegrwndigital.com/sitemap.xml",
    ]);
  });
});

describe("JSON-LD", () => {
  it("carries Organization + Service and no unverified claims", () => {
    const data = agencyJsonLd();
    const types = data["@graph"].map((n) => n["@type"]);
    expect(types).toContain("Organization");
    expect(types).toContain("Service");
    const text = JSON.stringify(data);
    expect(text).not.toMatch(/aggregateRating|reviewCount|foundingDate|\d+%/);
  });

  it("escapes < for inline scripts", () => {
    expect(serializeJsonLd({ a: "</script>" })).toBe('{"a":"\\u003c/script>"}');
  });
});
