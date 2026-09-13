import { describe, it, expect } from "vitest";
import {
  issueSessionToken,
  passwordMatches,
  SESSION_TTL_MS,
  verifySessionToken,
} from "./session";

describe("dashboard session tokens", () => {
  const secret = "correct horse battery staple";
  const now = 1_800_000_000_000;

  it("round-trips a freshly issued token", () => {
    const token = issueSessionToken(secret, now);
    expect(verifySessionToken(secret, token, now)).toBe(true);
    expect(verifySessionToken(secret, token, now + SESSION_TTL_MS - 1)).toBe(true);
  });

  it("expires", () => {
    const token = issueSessionToken(secret, now);
    expect(verifySessionToken(secret, token, now + SESSION_TTL_MS)).toBe(false);
  });

  it("rejects tampering, wrong secret, and garbage", () => {
    const token = issueSessionToken(secret, now);
    const [exp, sig] = token.split(".");
    expect(verifySessionToken("other", token, now)).toBe(false);
    expect(verifySessionToken(secret, `${Number(exp) + 1}.${sig}`, now)).toBe(false);
    expect(verifySessionToken(secret, `${exp}.${sig.slice(0, -1)}x`, now)).toBe(false);
    expect(verifySessionToken(secret, `${exp}.`, now)).toBe(false);
    expect(verifySessionToken(secret, "nodot", now)).toBe(false);
    expect(verifySessionToken(secret, "", now)).toBe(false);
    expect(verifySessionToken(secret, undefined, now)).toBe(false);
    expect(verifySessionToken(undefined, token, now)).toBe(false);
    expect(verifySessionToken("", token, now)).toBe(false);
  });

  it("compares passwords in constant time regardless of length", () => {
    expect(passwordMatches(secret, secret)).toBe(true);
    expect(passwordMatches(secret, "nope")).toBe(false);
    expect(passwordMatches(secret, "")).toBe(false);
    expect(passwordMatches(secret, secret + " ")).toBe(false);
  });
});
