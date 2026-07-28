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
import {
  piCarAccidentPack,
  piMassTortPack,
  piTruckAccidentPack,
} from "./packs/legal-pi-subniches";
import { hvacPack, roofingPack } from "./packs/home-services-subniches";

export const PACKS: Record<string, NichePack> = {
  [basePack.id]: basePack,
  [personalInjuryPack.id]: personalInjuryPack,
  [homeServicesPack.id]: homeServicesPack,
  [piCarAccidentPack.id]: piCarAccidentPack,
  [piTruckAccidentPack.id]: piTruckAccidentPack,
  [piMassTortPack.id]: piMassTortPack,
  [hvacPack.id]: hvacPack,
  [roofingPack.id]: roofingPack,
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

/**
 * Ordered hint table, most specific first: a "truck accident" account must
 * route to the truck pack before the generic "accident" hint catches it.
 */
const PACK_HINTS: Array<{ hints: string[]; packId: string }> = [
  { hints: ["truck", "18 wheeler", "semi"], packId: "legal-pi-truck-accident" },
  {
    hints: ["mass tort", "mass-tort", "class action", "claimant"],
    packId: "legal-pi-mass-tort",
  },
  {
    hints: ["car accident", "auto accident", "car-accident", "auto-accident"],
    packId: "legal-pi-car-accident",
  },
  { hints: ["hvac", "heating", "cooling", "air condition"], packId: "hs-hvac" },
  { hints: ["roof"], packId: "hs-roofing" },
  {
    hints: ["accident", "injury", "law", "legal", "attorney", "tort", "malpractice"],
    packId: "legal-personal-injury",
  },
  {
    hints: [
      "plumb",
      "electric",
      "septic",
      "solar",
      "pest",
      "landscap",
      "garage",
      "cleaning",
      "restoration",
    ],
    packId: "home-services",
  },
];

/**
 * Suggest a pack for an account from its declared sub-niche (and, failing
 * that, its name). Most specific hint wins. Returns null when there's no
 * confident match — the UI should then require an explicit operator choice
 * rather than guessing.
 */
export function suggestPackId(snapshot: AccountSnapshot): string | null {
  const haystack = [snapshot.context?.subNiche, snapshot.accountName]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  for (const { hints, packId } of PACK_HINTS) {
    if (hints.some((h) => haystack.includes(h))) return packId;
  }
  return null;
}

export { resolvePack, auditAccount };
export * from "./types";
