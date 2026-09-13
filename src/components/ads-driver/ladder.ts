/**
 * Autonomy ladder — mirrors docs/control-architecture.md §5 rung for rung.
 * `status` is the honest state of this repo today. When a rung ships, flip it
 * here and the site, FAQ, and comparison table all update together.
 */
export type RungStatus = "built" | "planned";

export interface Rung {
  rung: number;
  capability: string;
  detail: string;
  gate: string;
  status: RungStatus;
}

export const RUNGS: Rung[] = [
  {
    rung: 0,
    capability: "Manual audit on demand",
    detail:
      "Run the niche pack against the account from the cockpit or CLI. Read the ranked findings.",
    gate: "None needed — it only reads",
    status: "built",
  },
  {
    rung: 1,
    capability: "Scheduled audits + diff alerts",
    detail:
      "A cron endpoint pulls a read-only snapshot, audits it, persists the run, and diffs it against the last one. Only new, worsened, or resolved findings surface.",
    gate: "Read-only API scope",
    status: "built",
  },
  {
    rung: 2,
    capability: "Change-set generation",
    detail:
      "Findings become concrete change-sets you apply yourself — a negatives CSV today, split into safe exact terms and phrases that need your eyes.",
    gate: "A human applies every change externally",
    status: "built",
  },
  {
    rung: 3,
    capability: "Approval queue → API executor",
    detail:
      "Approve a change-set with one click; deterministic code applies it through the API and writes the audit log.",
    gate: "One human click per change-set",
    status: "planned",
  },
  {
    rung: 4,
    capability: "Policy auto-execution",
    detail:
      "Change classes you have pre-approved run on their own, inside per-change spend caps, with a kill switch.",
    gate: "Written policy + spend caps + kill switch",
    status: "planned",
  },
  {
    rung: 5,
    capability: "LLM agents proposing within guardrails",
    detail:
      "Proposer, verifier, auditor — three separated roles. Their output enters as data through the same gates as everything else. No agent ever holds the spend pen.",
    gate: "Proposer / verifier / auditor + every rung-3 and rung-4 gate",
    status: "planned",
  },
];

/** Highest rung that is built today. */
export const CURRENT_RUNG = Math.max(
  ...RUNGS.filter((r) => r.status === "built").map((r) => r.rung),
);
