/**
 * Public entry point for the domain-knowledge system.
 *
 * The registry maps pack ids to packs. Adding a new vertical is a matter of
 * writing one pack file and registering it here — the moat grows by accretion.
 */

import type { AccountSnapshot, AuditReport, NichePack } from "./types";
import { auditAccount, resolvePack } from "./engine";
import { basePack } from "./packs/base";
import { personalInjuryPack } from "./packs/legal-personal-injury";
import { homeServicesPack } from "./packs/home-services";

export const PACKS: Record<string, NichePack> = {
  [basePack.id]: basePack,
  [personalInjuryPack.id]: personalInjuryPack,
  [homeServicesPack.id]: homeServicesPack,
};

/** Packs a user would actually pick for an account (base is abstract). */
export function selectablePacks(): NichePack[] {
  return Object.values(PACKS).filter((p) => p.category !== "base");
}

/** Audit an account against a registered pack id. */
export function audit(
  snapshot: AccountSnapshot,
  packId: string,
): AuditReport {
  return auditAccount(snapshot, packId, PACKS);
}

export { resolvePack, auditAccount };
export * from "./types";
