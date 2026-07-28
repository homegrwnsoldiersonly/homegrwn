/**
 * Filesystem history store: one JSONL file per account under .data/ (gitignored).
 *
 * Right-sized for the internal tool running locally or on a persistent host.
 * On serverless (Vercel) the filesystem is ephemeral, so history won't survive
 * between invocations there — the HistoryStore port exists precisely so a
 * KV/Postgres adapter can slot in without touching the runner. The cron route
 * treats store failures as non-fatal for the same reason.
 */

import { appendFile, mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { HistoryStore, StoredAuditRun } from "./types";

const DEFAULT_DIR = ".data/audit-history";

/** Account ids come from external systems — never let one shape a path. */
function safeName(accountId: string): string {
  return accountId.replace(/[^A-Za-z0-9_-]/g, "_");
}

export class FsHistoryStore implements HistoryStore {
  private readonly dir: string;

  constructor(dir: string = process.env.AUDIT_HISTORY_DIR ?? DEFAULT_DIR) {
    this.dir = dir;
  }

  private fileFor(accountId: string): string {
    return join(this.dir, `${safeName(accountId)}.jsonl`);
  }

  async append(run: StoredAuditRun): Promise<void> {
    await mkdir(this.dir, { recursive: true });
    await appendFile(this.fileFor(run.accountId), JSON.stringify(run) + "\n", "utf8");
  }

  async list(accountId: string, limit = 30): Promise<StoredAuditRun[]> {
    let text: string;
    try {
      text = await readFile(this.fileFor(accountId), "utf8");
    } catch {
      return [];
    }
    const runs: StoredAuditRun[] = [];
    for (const line of text.split("\n")) {
      if (!line.trim()) continue;
      try {
        runs.push(JSON.parse(line) as StoredAuditRun);
      } catch {
        // A torn write must not poison the whole history.
      }
    }
    return runs.slice(-limit);
  }

  async latest(accountId: string): Promise<StoredAuditRun | null> {
    const runs = await this.list(accountId);
    return runs.length > 0 ? runs[runs.length - 1] : null;
  }
}
