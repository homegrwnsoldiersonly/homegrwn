# Control architecture — checks, balances, and the optimization loop

Seed document for the control-workflow spec: who checks what, what checks
*them*, and how an account actually gets optimized. Everything labeled
**[built]** exists in this repo today; **[planned]** is the designed next rung.
GitHub renders the diagrams below natively.

## 1. The system as a mindmap

```mermaid
mindmap
  root((Google Ads<br/>Agent System))
    Encoded judgment
      Niche packs — benchmarks, value models, junk signals
      Sub-niche inheritance — overrides by data, not code
      Guardrails — principles that become hard gates on writes
      Checked by: git review — every judgment change is a diff a human approves
    Deterministic spine
      Rule engine — pure, reproducible, explainable
      Every finding carries evidence + recommendation + niche rationale
      Checked by: test suite — 72 tests incl. control-account fixtures
      Checked by: clean-account canary — a disciplined account must audit clean
    Data intake
      Read-only API pull → normalized snapshot
      Pure mapper — micros, enums, taxonomy — fully unit-tested
      Approximations documented, never silent
      Checked by: mapper tests + typed raw-row contracts
    Ground truth
      Offline conversion import — signed cases, booked jobs
      The platform-invisible value the whole system optimizes toward
      Checked by: dry-run plan preview + human --apply gate
      Checked by: order-id dedupe — re-uploads cannot double-count
    Change proposals
      Findings → concrete change-sets — negatives CSV today
      Two-tier risk split — safe exact terms vs review-required phrases
      Checked by: human applies via Editor — no API write path exists yet
    Memory and drift watch
      Audit history — every run persisted
      Diff engine — only new, worsened, resolved surfaces
      Checked by: actionable flag — no news is silenced, noise is suppressed
    Human operator
      Approves every change — recommend-only posture
      Calibrates benchmarks from real account outcomes
      Checked by: the diff engine — yesterday's approval is re-audited tomorrow
    Future agent layer
      LLM classifiers inside guardrails — never holding the spend pen
      Proposer / verifier / auditor separation
      Checked by: deterministic engine + policy gates + kill switch
```

## 2. The account optimization loop

```mermaid
flowchart TD
    subgraph OBSERVE["Observe — built"]
        A[Scheduled pull<br/>read-only snapshot] --> B[Rule engine<br/>audit through niche pack]
        B --> C[History store<br/>persist run]
        C --> D{Diff vs last run<br/>anything new/worse?}
    end

    subgraph PROPOSE["Propose — built"]
        D -- yes --> E[Findings with evidence,<br/>recommendation, rationale]
        E --> F[Change-set generation<br/>e.g. negatives CSV, two risk tiers]
    end

    subgraph APPROVE["Approve — human today, policy-gated later"]
        F --> G{Human review<br/>in cockpit / CLI}
        G -- approve --> H[Apply change<br/>via Editor today, API later]
        G -- reject --> I[Feedback: adjust pack data<br/>benchmarks, signals, rules]
    end

    subgraph VERIFY["Verify — the loop closes"]
        H --> J[Next scheduled run<br/>diff shows finding RESOLVED?]
        J -- no --> E
        J -- yes --> K[Outcome check:<br/>signed cases / booked jobs<br/>via offline import]
        K --> L[Benchmark calibration<br/>pack data updated via git]
        L --> B
    end

    D -- no --> M[Silent — no operator noise]
    I --> B
```

The loop has **two feedback frequencies**: the fast loop (daily diff — did the
account change?) and the slow loop (outcome data — did signed cases actually
get cheaper?). A change is not "verified" when the finding disappears; it's
verified when the slow loop confirms the economics moved. That distinction is
what keeps the system from gaming its own metrics — the exact failure mode of
platform-native automation.

## 3. Checks-and-balances matrix

| Actor / layer | What it checks | What checks IT |
|---|---|---|
| Niche packs (judgment) | Accounts, via benchmarks + rules | Git review of every data change; well-formedness tests; clean-account canary |
| Rule engine | Account state vs pack judgment | 72-test suite; determinism (same input → same report); error isolation (a crashing rule can't sink an audit) |
| Ingestion mapper | Raw API data → honest normalization | Unit tests per landmine (micros, enums, taxonomy); documented approximations |
| Conversion import | That bidding chases real value | Dry-run plan preview; human `--apply` gate; dedupe; partial-failure surfacing |
| Change-sets | That proposals are concrete + risk-tiered | Human applies them; Tier-2 overblock cautions; no auto-write path exists |
| Diff engine | Drift, regressions, whether fixes landed | Its own test suite; "actionable" logic reviewed like code |
| Human operator | Everything above — final approval | The diff engine re-audits the results of their approvals; outcome data scores their calls |
| Future LLM agents | Fuzzy classification, drafting | Deterministic engine bounds them; verifier/auditor agents; policy gates; kill switch |

## 4. How agents will validate other agents [planned]

When LLM agents enter (ambiguous search-term classification, ad-copy drafting,
intake-summary parsing), the control pattern is **separation of powers**:

1. **Proposer** — generates the candidate (e.g. "these 40 ambiguous terms are
   junk"). Never executes.
2. **Verifier** — independently re-derives the answer from the same evidence,
   prompted adversarially ("argue this term is actually a good lead").
   Disagreement → human queue, never auto-resolve.
3. **Auditor** — samples *agreed* decisions after the fact and scores them
   against outcome data (did blocking that term reduce waste without reducing
   signed cases?). Auditor findings flow back as pack-data edits — reviewed in
   git like everything else.
4. **Hard boundaries** — LLM output can only enter the system as *data through
   existing gates* (a proposed negative list enters the same two-tier review
   as rule-generated ones). No agent gets a write scope; the executor is
   deterministic code behind the approval queue, with per-change spend-impact
   caps, an audit log, and a kill switch.

The principle throughout: **judgment is versioned, execution is gated,
verification is independent, and ground truth is business outcomes — never
platform metrics.**

## 5. Autonomy ladder (where we are)

| Rung | Capability | Gate | Status |
|---|---|---|---|
| 0 | Manual audit on demand (cockpit, CLI) | — | **built** |
| 1 | Scheduled audits + diff alerts | read-only scope | **built** (cron endpoint + history) |
| 2 | Change-set generation for human application | human applies externally | **built** (negatives CSV) |
| 3 | Approval queue → API executor | human click per change-set | planned |
| 4 | Policy auto-execution of pre-approved change classes | policy definitions + spend caps + kill switch | planned |
| 5 | LLM agents proposing within guardrails | proposer/verifier/auditor + all rung-3/4 gates | planned |
