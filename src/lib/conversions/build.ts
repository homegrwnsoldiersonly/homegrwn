/**
 * The pure core of offline conversion import: outcome rows -> a reviewable
 * ImportPlan. Every rule Google enforces server-side that we can check locally
 * is checked here, so operators see problems in the dry-run preview instead of
 * as opaque partial-failure errors after an upload.
 */

import { parseCsvRecords } from "./csv";
import type {
  BuildPlanOptions,
  ClickConversionPayload,
  ImportPlan,
  OutcomeRow,
  RowIssue,
} from "./types";

const OFFSET_RE = /^[+-]\d{2}:\d{2}$/;
/** Google's required format: "yyyy-mm-dd hh:mm:ss±hh:mm". */
const GOOGLE_DT_RE =
  /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})([+-]\d{2}:\d{2})$/;
const ISO_DT_RE =
  /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?(Z|[+-]\d{2}:?\d{2})?$/;

/**
 * Normalize a timestamp to Google's conversion format. Accepts ISO 8601
 * (with/without offset, Z, or seconds) and already-formatted values.
 * Timestamps without an offset get `defaultUtcOffset`.
 */
export function normalizeConversionTime(
  input: string,
  defaultUtcOffset: string,
): { ok: true; value: string; epochMs: number } | { ok: false; reason: string } {
  const trimmed = input.trim();
  let m = GOOGLE_DT_RE.exec(trimmed);
  let offset: string;
  let parts: { y: string; mo: string; d: string; h: string; mi: string; s: string };

  if (m) {
    parts = { y: m[1], mo: m[2], d: m[3], h: m[4], mi: m[5], s: m[6] };
    offset = m[7];
  } else {
    m = ISO_DT_RE.exec(trimmed);
    if (!m) {
      return {
        ok: false,
        reason: `Unrecognized timestamp "${input}" (expected ISO 8601 or "yyyy-mm-dd hh:mm:ss±hh:mm")`,
      };
    }
    parts = { y: m[1], mo: m[2], d: m[3], h: m[4], mi: m[5], s: m[6] ?? "00" };
    const rawOffset = m[7];
    if (!rawOffset) {
      offset = defaultUtcOffset;
    } else if (rawOffset === "Z") {
      offset = "+00:00";
    } else {
      offset =
        rawOffset.includes(":")
          ? rawOffset
          : `${rawOffset.slice(0, 3)}:${rawOffset.slice(3)}`;
    }
  }

  if (!OFFSET_RE.test(offset)) {
    return { ok: false, reason: `Invalid UTC offset "${offset}"` };
  }

  const value = `${parts.y}-${parts.mo}-${parts.d} ${parts.h}:${parts.mi}:${parts.s}${offset}`;
  const epochMs = Date.parse(
    `${parts.y}-${parts.mo}-${parts.d}T${parts.h}:${parts.mi}:${parts.s}${offset}`,
  );
  if (Number.isNaN(epochMs)) {
    return { ok: false, reason: `Timestamp "${input}" is not a real date/time` };
  }
  return { ok: true, value, epochMs };
}

const CURRENCY_RE = /^[A-Z]{3}$/;
const GCLID_RE = /^[A-Za-z0-9_-]{20,}$/;

/** Map flexible CSV headers to OutcomeRow fields. */
const HEADER_ALIASES: Record<string, keyof OutcomeRow> = {
  gclid: "gclid",
  gbraid: "gbraid",
  wbraid: "wbraid",
  conversion_time: "conversionTime",
  conversion_date_time: "conversionTime",
  signed_time: "conversionTime",
  signed_at: "conversionTime",
  booked_at: "conversionTime",
  time: "conversionTime",
  value: "value",
  conversion_value: "value",
  case_value: "value",
  job_value: "value",
  currency: "currency",
  currency_code: "currency",
  order_id: "orderId",
  case_id: "orderId",
  job_id: "orderId",
  matter_id: "orderId",
};

/** Parse CSV text into OutcomeRows (header-flexible). Pure. */
export function parseOutcomeCsv(text: string): {
  rows: OutcomeRow[];
  issues: RowIssue[];
} {
  const { headers, records } = parseCsvRecords(text);
  const issues: RowIssue[] = [];
  const rows: OutcomeRow[] = [];

  const mapped = headers.filter((h) => HEADER_ALIASES[h]);
  if (mapped.length === 0) {
    issues.push({
      line: 0,
      level: "error",
      field: "header",
      message: `No recognized columns. Got [${headers.join(", ")}]; need at least a click id (gclid/gbraid/wbraid), a time column, and value.`,
    });
    return { rows, issues };
  }

  for (const { values, line } of records) {
    const row: Partial<OutcomeRow> = { line };
    for (const [header, field] of Object.entries(HEADER_ALIASES)) {
      const v = values[header];
      if (!v) continue;
      if (field === "value") row.value = Number(v.replace(/[$,]/g, ""));
      else if (field === "currency") row.currency = v.toUpperCase();
      else (row as Record<string, unknown>)[field] = v;
    }
    rows.push({
      conversionTime: row.conversionTime ?? "",
      value: row.value ?? NaN,
      currency: row.currency ?? "",
      gclid: row.gclid,
      gbraid: row.gbraid,
      wbraid: row.wbraid,
      orderId: row.orderId,
      line,
    });
  }
  return { rows, issues };
}

/** Validate outcome rows and build the upload plan. Pure. */
export function buildImportPlan(
  rows: OutcomeRow[],
  options: BuildPlanOptions,
  extraIssues: RowIssue[] = [],
): ImportPlan {
  const {
    customerId,
    conversionActionId,
    defaultUtcOffset,
    maxAgeDays = 90,
  } = options;
  const now = options.now ?? new Date();
  const issues: RowIssue[] = [...extraIssues];
  const conversions: ClickConversionPayload[] = [];
  const seen = new Set<string>();
  let deduped = 0;
  let totalValue = 0;
  let currency: string | null = null;

  if (!/^\d+$/.test(customerId)) {
    issues.push({
      line: 0,
      level: "error",
      field: "customerId",
      message: `Customer id must be digits only, got "${customerId}".`,
    });
  }
  if (!/^\d+$/.test(conversionActionId)) {
    issues.push({
      line: 0,
      level: "error",
      field: "conversionActionId",
      message: `Conversion action id must be digits only, got "${conversionActionId}".`,
    });
  }
  if (!OFFSET_RE.test(defaultUtcOffset)) {
    issues.push({
      line: 0,
      level: "error",
      field: "defaultUtcOffset",
      message: `UTC offset must look like "-07:00", got "${defaultUtcOffset}".`,
    });
  }
  if (issues.some((i) => i.level === "error")) {
    return {
      conversions,
      issues,
      summary: {
        inputRows: rows.length,
        valid: 0,
        rejected: rows.length,
        deduped: 0,
        totalValue: 0,
        currency: null,
      },
    };
  }

  const conversionAction = `customers/${customerId}/conversionActions/${conversionActionId}`;

  for (const row of rows) {
    const rowErrors: RowIssue[] = [];
    const err = (field: string, message: string) =>
      rowErrors.push({ line: row.line, level: "error", field, message });
    const warn = (field: string, message: string) =>
      issues.push({ line: row.line, level: "warning", field, message });

    const clickIds = [row.gclid, row.gbraid, row.wbraid].filter(Boolean);
    if (clickIds.length === 0) {
      err("gclid", "Missing click id: need one of gclid, gbraid, wbraid.");
    } else if (clickIds.length > 1) {
      err("gclid", "Provide exactly one of gclid, gbraid, wbraid — got several.");
    } else if (row.gclid && !GCLID_RE.test(row.gclid)) {
      err("gclid", `"${row.gclid}" doesn't look like a valid gclid.`);
    }

    let dateTime = "";
    let epochMs = 0;
    if (!row.conversionTime) {
      err("conversion_time", "Missing conversion time.");
    } else {
      const t = normalizeConversionTime(row.conversionTime, defaultUtcOffset);
      if (!t.ok) err("conversion_time", t.reason);
      else {
        dateTime = t.value;
        epochMs = t.epochMs;
        if (epochMs > now.getTime()) {
          err("conversion_time", `Conversion time ${t.value} is in the future.`);
        } else if (
          now.getTime() - epochMs >
          maxAgeDays * 24 * 60 * 60 * 1000
        ) {
          err(
            "conversion_time",
            `Conversion is older than ${maxAgeDays} days — outside Google's click-conversion window.`,
          );
        }
      }
    }

    if (Number.isNaN(row.value)) {
      err("value", "Missing or non-numeric value.");
    } else if (row.value < 0) {
      err("value", `Value ${row.value} is negative.`);
    } else if (row.value === 0) {
      warn(
        "value",
        "Value is 0 — the conversion will count but teach bidding nothing about worth.",
      );
    }

    if (!row.currency) {
      err("currency", "Missing currency code.");
    } else if (!CURRENCY_RE.test(row.currency)) {
      err("currency", `"${row.currency}" is not a 3-letter ISO currency code.`);
    } else if (currency && row.currency !== currency) {
      warn(
        "currency",
        `Mixed currencies in one file (${currency} and ${row.currency}).`,
      );
    }

    if (!row.orderId) {
      warn(
        "order_id",
        "No order/case id — re-uploading this file may double-count without one.",
      );
    }

    if (rowErrors.length > 0) {
      issues.push(...rowErrors);
      continue;
    }

    const dedupeKey = `${row.gclid ?? row.gbraid ?? row.wbraid}|${row.orderId ?? ""}|${dateTime}`;
    if (seen.has(dedupeKey)) {
      deduped++;
      continue;
    }
    seen.add(dedupeKey);

    currency ??= row.currency;
    totalValue += row.value;
    const payload: ClickConversionPayload = {
      conversion_action: conversionAction,
      conversion_date_time: dateTime,
      conversion_value: row.value,
      currency_code: row.currency,
    };
    if (row.gclid) payload.gclid = row.gclid;
    if (row.gbraid) payload.gbraid = row.gbraid;
    if (row.wbraid) payload.wbraid = row.wbraid;
    if (row.orderId) payload.order_id = row.orderId;
    conversions.push(payload);
  }

  return {
    conversions,
    issues,
    summary: {
      inputRows: rows.length,
      valid: conversions.length,
      rejected: rows.length - conversions.length - deduped,
      deduped,
      totalValue,
      currency,
    },
  };
}

/** Convenience: CSV text -> ImportPlan in one call. Pure. */
export function planFromCsv(
  csvText: string,
  options: BuildPlanOptions,
): ImportPlan {
  const { rows, issues } = parseOutcomeCsv(csvText);
  return buildImportPlan(rows, options, issues);
}
