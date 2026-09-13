import { describe, expect, it } from "vitest";
import {
  isMetadataImagePath,
  resolveSurface,
  stripSurfacePrefix,
  surfaceFromHost,
  surfacePrefixOf,
  toInternalPath,
} from "./surface";

describe("surfaceFromHost", () => {
  it("maps production hosts", () => {
    expect(surfaceFromHost("homegrwndigital.com")).toBe("agency");
    expect(surfaceFromHost("www.homegrwndigital.com")).toBe("agency");
    expect(surfaceFromHost("app.homegrwndigital.com")).toBe("app");
    expect(surfaceFromHost("adsdriver.homegrwndigital.com")).toBe("ads");
    expect(surfaceFromHost("homegrwn.io")).toBe("ads");
  });

  it("maps legacy homegrwnagency.com hosts to the same surfaces (301 window; drop after 2026-10-17)", () => {
    expect(surfaceFromHost("homegrwnagency.com")).toBe("agency");
    expect(surfaceFromHost("www.homegrwnagency.com")).toBe("agency");
    expect(surfaceFromHost("app.homegrwnagency.com")).toBe("app");
    expect(surfaceFromHost("adsdriver.homegrwnagency.com")).toBe("ads");
  });

  it("maps *.localhost subdomains and ignores ports", () => {
    expect(surfaceFromHost("app.localhost:3000")).toBe("app");
    expect(surfaceFromHost("ads.localhost:3000")).toBe("ads");
    expect(surfaceFromHost("adsdriver.localhost")).toBe("ads");
    expect(surfaceFromHost("agency.localhost")).toBe("agency");
  });

  it("is neutral on localhost, previews and unknown hosts", () => {
    expect(surfaceFromHost("localhost:3000")).toBeNull();
    expect(surfaceFromHost("homegrwn-abc123.vercel.app")).toBeNull();
    expect(surfaceFromHost("nope.localhost")).toBeNull();
    expect(surfaceFromHost(null)).toBeNull();
  });
});

describe("resolveSurface", () => {
  it("host beats query beats cookie beats default", () => {
    expect(
      resolveSurface({ host: "app.homegrwndigital.com", query: "ads" }),
    ).toEqual({ surface: "app", source: "host" });
    expect(
      resolveSurface({ host: "localhost:3000", query: "ads", cookie: "app" }),
    ).toEqual({ surface: "ads", source: "query" });
    expect(resolveSurface({ host: "x.vercel.app", cookie: "app" })).toEqual({
      surface: "app",
      source: "cookie",
    });
    expect(resolveSurface({ host: "localhost:3000" })).toEqual({
      surface: "agency",
      source: "default",
    });
  });

  it("accepts aliases", () => {
    expect(resolveSurface({ query: "ads-driver" }).surface).toBe("ads");
    expect(resolveSurface({ query: "dashboard" }).surface).toBe("app");
    expect(resolveSurface({ query: "bogus" }).surface).toBe("agency");
  });
});

describe("path helpers", () => {
  it("builds and strips internal paths", () => {
    expect(toInternalPath("agency", "/")).toBe("/agency");
    expect(toInternalPath("agency", "/niches/septic")).toBe(
      "/agency/niches/septic",
    );
    expect(toInternalPath("app", "/accounts/123")).toBe("/app/accounts/123");
    expect(stripSurfacePrefix("/ads/pricing")).toBe("/pricing");
    expect(stripSurfacePrefix("/app")).toBe("/");
    expect(stripSurfacePrefix("/niches/septic")).toBe("/niches/septic");
  });

  it("detects reserved prefixes without false positives", () => {
    expect(surfacePrefixOf("/app/accounts/1")).toBe("app");
    expect(surfacePrefixOf("/ads")).toBe("ads");
    expect(surfacePrefixOf("/apply")).toBeNull();
    expect(surfacePrefixOf("/adsdriver")).toBeNull();
  });
});

describe("isMetadataImagePath", () => {
  it("matches generated metadata images under a surface folder", () => {
    expect(isMetadataImagePath("/agency/opengraph-image")).toBe(true);
    expect(isMetadataImagePath("/ads/opengraph-image")).toBe(true);
    expect(isMetadataImagePath("/ads/twitter-image2")).toBe(true);
    expect(isMetadataImagePath("/app/icon")).toBe(true);
  });

  it("does not match ordinary reserved-prefix paths", () => {
    expect(isMetadataImagePath("/agency")).toBe(false);
    expect(isMetadataImagePath("/agency/niches/septic")).toBe(false);
    expect(isMetadataImagePath("/opengraph-image")).toBe(false);
    expect(isMetadataImagePath("/agency/opengraph-image/x")).toBe(false);
  });
});
