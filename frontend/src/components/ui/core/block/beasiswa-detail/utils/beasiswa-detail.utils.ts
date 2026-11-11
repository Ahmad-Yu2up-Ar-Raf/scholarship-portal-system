export function parseRequirements(requirementsString: string): string[] {
  return requirementsString
    .split("•")
    .map((r) => r.trim())
    .filter(Boolean);
}
