import { describe, expect, it } from "vitest";
import { selectablePacks } from "@/lib/knowledge";
import { PACK_COPY } from "./packCopy";

/** Claims gate: nothing in docs/content/claims.md is VERIFIED, so no numerals. */
const NUMERIC = /[0-9%]/;

describe("PACK_COPY (public copy for NichePacks)", () => {
  it("covers every selectable engine pack, and nothing else", () => {
    const engineIds = selectablePacks()
      .map((p) => p.id)
      .sort();
    expect(Object.keys(PACK_COPY).sort()).toEqual(engineIds);
  });

  for (const [id, copy] of Object.entries(PACK_COPY)) {
    it(`"${id}" description carries no digits or percent signs`, () => {
      expect(copy.description.trim().length).toBeGreaterThan(0);
      expect(copy.description).not.toMatch(NUMERIC);
    });
  }
});
