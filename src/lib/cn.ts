/** Minimal class joiner — no dependency, no dedupe. */
export function cn(
  ...parts: Array<string | number | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}
