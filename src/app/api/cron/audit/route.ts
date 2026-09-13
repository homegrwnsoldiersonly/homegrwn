/**
 * Scheduled-audit endpoint. Wire a Vercel cron (or any scheduler) at this
 * path and every account gets pulled, audited, persisted, and diffed; the
 * response highlights accounts needing attention.
 *
 * Auth follows the Vercel cron convention: requests must carry
 * `Authorization: Bearer ${CRON_SECRET}`. With no CRON_SECRET configured the
 * endpoint refuses in production (fail closed) and allows local dev runs.
 *
 * Note: on serverless the filesystem history store is ephemeral, so diffs
 * only carry between runs on a persistent host (or once a KV/Postgres
 * HistoryStore adapter is dropped in). The audit output itself is unaffected.
 */

import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { getDataSource } from "@/lib/ads";
import { FsHistoryStore } from "@/lib/history/fs-store";
import { runScheduledAudit } from "@/lib/history/runner";

/** Constant-time bearer check (length is compared first, then bytes). */
function bearerMatches(header: string | null, secret: string): boolean {
  const expected = Buffer.from(`Bearer ${secret}`, "utf8");
  const given = Buffer.from(header ?? "", "utf8");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function GET(req: NextRequest): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    if (!bearerMatches(req.headers.get("authorization"), secret)) {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    return Response.json(
      { error: "CRON_SECRET is not configured; refusing unauthenticated scheduled runs in production." },
      { status: 503 },
    );
  }

  const source = await getDataSource();
  const summary = await runScheduledAudit(source, new FsHistoryStore());
  return Response.json(summary);
}
