/**
 * GET /changes/<accountId>/export?pack=<packId>
 *
 * Streams the Tier-1 negative-keyword change-set as a Google Ads Editor CSV
 * (Campaign, Keyword, Criterion Type). Public path has no file extension on
 * purpose — src/proxy.ts skips extension-bearing paths, so `.csv` in the URL
 * would never reach this surface. The filename comes from Content-Disposition.
 *
 * Gated like every page: the password cookie is checked here too, because
 * route handlers do not pass through the layout.
 */

import type { NextRequest } from "next/server";
import { PACKS, resolvePack } from "@/lib/knowledge";
import { buildNegativeChangeSet, toEditorCsv } from "@/lib/changesets/negatives";
import { hasSession } from "../../../_lib/auth";
import { loadAccount } from "../../../_lib/tenants";

export const dynamic = "force-dynamic";

function safeFilename(id: string): string {
  return id.replace(/[^A-Za-z0-9_-]+/g, "_").slice(0, 80) || "account";
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  if (!(await hasSession())) {
    return new Response("Unauthorized", { status: 401, headers: { "cache-control": "no-store" } });
  }

  const { id } = await ctx.params;
  const pack = req.nextUrl.searchParams.get("pack") ?? undefined;
  const account = await loadAccount(id, pack);
  if (!account) {
    return new Response("Not found", { status: 404, headers: { "cache-control": "no-store" } });
  }

  const changeSet = buildNegativeChangeSet(account.snapshot, resolvePack(account.packId, PACKS));
  const csv = toEditorCsv(changeSet);

  return new Response(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="negatives-${safeFilename(id)}-${safeFilename(account.packId)}.csv"`,
      "cache-control": "no-store",
      "x-robots-tag": "noindex",
    },
  });
}
