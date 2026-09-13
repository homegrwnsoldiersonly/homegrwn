import { describe, expect, it } from "vitest";
import { crossSurfaceLinks, surfaceHref, surfaceLinkMode } from "./surfaces";

describe("surfaceLinkMode", () => {
  it("is host only on Vercel production, query everywhere else", () => {
    expect(surfaceLinkMode({ VERCEL_ENV: "production" })).toBe("host");
    expect(surfaceLinkMode({ VERCEL_ENV: "preview" })).toBe("query");
    expect(surfaceLinkMode({})).toBe("query");
  });

  it("honours the explicit override", () => {
    expect(
      surfaceLinkMode({ VERCEL_ENV: "production", NEXT_PUBLIC_SURFACE_LINKS: "query" }),
    ).toBe("query");
    expect(surfaceLinkMode({ NEXT_PUBLIC_SURFACE_LINKS: "host" })).toBe("host");
    expect(surfaceLinkMode({ NEXT_PUBLIC_SURFACE_LINKS: "bogus" })).toBe("query");
  });
});

describe("surfaceHref", () => {
  it("uses the canonical host in host mode", () => {
    expect(surfaceHref("ads", "/", "host")).toBe(
      "https://adsdriver.homegrwndigital.com",
    );
    expect(surfaceHref("ads", "/pricing", "host")).toBe(
      "https://adsdriver.homegrwndigital.com/pricing",
    );
    expect(surfaceHref("agency", "privacy", "host")).toBe(
      "https://homegrwndigital.com/privacy",
    );
  });

  it("uses the ?surface= switch in query mode", () => {
    expect(surfaceHref("ads", "/", "query")).toBe("/?surface=ads");
    expect(surfaceHref("app", "/accounts", "query")).toBe(
      "/accounts?surface=app",
    );
    expect(surfaceHref("agency", "/book?trade=septic", "query")).toBe(
      "/book?trade=septic&surface=agency",
    );
  });
});

describe("crossSurfaceLinks", () => {
  it("omits the current surface and marks every link external", () => {
    const links = crossSurfaceLinks("agency", { mode: "query" });
    expect(links.map((l) => l.surface)).toEqual(["ads", "app"]);
    expect(links.every((l) => l.external)).toBe(true);
    expect(links[0]).toMatchObject({ label: "Ads Driver", href: "/?surface=ads" });
  });

  it("can be narrowed", () => {
    expect(
      crossSurfaceLinks("ads", { include: ["agency", "ads"], mode: "host" }),
    ).toEqual([
      {
        surface: "agency",
        label: "HOMEGRWN Agency",
        href: "https://homegrwndigital.com",
        external: true,
      },
    ]);
  });
});
