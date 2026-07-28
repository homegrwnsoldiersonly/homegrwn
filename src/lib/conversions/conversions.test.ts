import { describe, it, expect } from "vitest";
import { parseCsv, parseCsvRecords } from "./csv";
import {
  buildImportPlan,
  normalizeConversionTime,
  parseOutcomeCsv,
  planFromCsv,
} from "./build";
import type { OutcomeRow } from "./types";

const NOW = new Date("2026-07-25T12:00:00Z");
const OPTS = {
  customerId: "1234567890",
  conversionActionId: "555",
  defaultUtcOffset: "-07:00",
  now: NOW,
};

const GCLID = "Cj0KCQjw_valid_gclid_1234567890abcdefghij";

function row(overrides: Partial<OutcomeRow> = {}): OutcomeRow {
  return {
    gclid: GCLID,
    conversionTime: "2026-07-20T10:00:00-07:00",
    value: 15000,
    currency: "USD",
    orderId: "CASE-1",
    line: 1,
    ...overrides,
  };
}

describe("csv parsing", () => {
  it("handles quotes, embedded commas and CRLF", () => {
    const rows = parseCsv('a,"b,1","say ""hi"""\r\nc,d,e\n');
    expect(rows).toEqual([
      ["a", "b,1", 'say "hi"'],
      ["c", "d", "e"],
    ]);
  });

  it("maps headers to records with normalized keys", () => {
    const { records } = parseCsvRecords("Case ID,Signed-At\nX-1,2026-01-01\n");
    expect(records[0].values).toEqual({ case_id: "X-1", signed_at: "2026-01-01" });
  });
});

describe("timestamp normalization", () => {
  it("passes through Google format and converts ISO variants", () => {
    expect(
      normalizeConversionTime("2026-07-20 10:00:00-07:00", "-07:00"),
    ).toMatchObject({ ok: true, value: "2026-07-20 10:00:00-07:00" });
    expect(
      normalizeConversionTime("2026-07-20T10:00:00Z", "-07:00"),
    ).toMatchObject({ ok: true, value: "2026-07-20 10:00:00+00:00" });
    expect(
      normalizeConversionTime("2026-07-20T10:00", "-07:00"),
    ).toMatchObject({ ok: true, value: "2026-07-20 10:00:00-07:00" });
  });

  it("applies the default offset when none is given", () => {
    const r = normalizeConversionTime("2026-07-20 10:00:00", "-05:00");
    expect(r).toMatchObject({ ok: true, value: "2026-07-20 10:00:00-05:00" });
  });

  it("rejects garbage", () => {
    expect(normalizeConversionTime("last tuesday", "-07:00").ok).toBe(false);
  });
});

describe("plan validation", () => {
  it("accepts a clean row and builds the exact payload", () => {
    const plan = buildImportPlan([row()], OPTS);
    expect(plan.summary).toMatchObject({ valid: 1, rejected: 0 });
    expect(plan.conversions[0]).toEqual({
      gclid: GCLID,
      conversion_action: "customers/1234567890/conversionActions/555",
      conversion_date_time: "2026-07-20 10:00:00-07:00",
      conversion_value: 15000,
      currency_code: "USD",
      order_id: "CASE-1",
    });
  });

  it("rejects missing click id, multiple click ids, and bad gclid", () => {
    const plan = buildImportPlan(
      [
        row({ gclid: undefined, line: 1 }),
        row({ gbraid: "x".repeat(24), line: 2 }), // gclid AND gbraid
        row({ gclid: "short", line: 3 }),
      ],
      OPTS,
    );
    expect(plan.summary.valid).toBe(0);
    expect(plan.issues.filter((i) => i.level === "error")).toHaveLength(3);
  });

  it("rejects future and stale conversions", () => {
    const plan = buildImportPlan(
      [
        row({ conversionTime: "2026-08-01T10:00:00Z", line: 1 }), // future
        row({ conversionTime: "2026-01-01T10:00:00Z", line: 2 }), // >90 days
      ],
      OPTS,
    );
    expect(plan.summary.valid).toBe(0);
    expect(plan.summary.rejected).toBe(2);
  });

  it("warns on zero value and missing order id but still uploads", () => {
    const plan = buildImportPlan(
      [row({ value: 0, orderId: undefined })],
      OPTS,
    );
    expect(plan.summary.valid).toBe(1);
    const warnings = plan.issues.filter((i) => i.level === "warning");
    expect(warnings.map((w) => w.field)).toEqual(
      expect.arrayContaining(["value", "order_id"]),
    );
  });

  it("dedupes identical click+order+time rows", () => {
    const plan = buildImportPlan([row({ line: 1 }), row({ line: 2 })], OPTS);
    expect(plan.summary).toMatchObject({ valid: 1, deduped: 1, rejected: 0 });
  });

  it("fails fast on malformed config instead of producing payloads", () => {
    const plan = buildImportPlan([row()], { ...OPTS, customerId: "123-456" });
    expect(plan.conversions).toHaveLength(0);
    expect(plan.issues[0].field).toBe("customerId");
  });
});

describe("end-to-end: CSV -> plan", () => {
  it("parses the intake export format and totals values", () => {
    const csv = [
      "gclid,signed_at,case_value,currency,case_id",
      `${GCLID},2026-07-20T14:30:00,15000,USD,CASE-0142`,
      `${GCLID}x,2026-07-21 09:15:00-07:00,"42,000",USD,CASE-0143`,
      ",2026-07-22T10:00:00,1000,USD,CASE-0144", // missing gclid -> rejected
    ].join("\n");
    const plan = planFromCsv(csv, OPTS);
    expect(plan.summary).toMatchObject({
      inputRows: 3,
      valid: 2,
      rejected: 1,
      totalValue: 57000,
      currency: "USD",
    });
    // Times normalized: naive one got the default offset.
    expect(plan.conversions[0].conversion_date_time).toBe(
      "2026-07-20 14:30:00-07:00",
    );
  });

  it("rejects a CSV with no recognizable columns", () => {
    const plan = planFromCsv("foo,bar\n1,2\n", OPTS);
    expect(plan.summary.valid).toBe(0);
    expect(plan.issues[0].field).toBe("header");
  });
});
