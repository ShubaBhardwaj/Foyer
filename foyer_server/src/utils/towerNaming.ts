/**
 * Tower Naming Utility.
 *
 * Generates sequential tower names:
 *   A, B, C, ..., Z, A1, B1, ..., Z1, A2, B2, ..., Z2, ...
 *
 * @param startIndex - The zero-based index of the first tower to generate.
 * @param count - The number of tower names to generate.
 * @returns Array of tower names.
 */
export function generateTowerNames(startIndex: number, count: number): string[] {
  const names: string[] = [];

  for (let i = 0; i < count; i++) {
    const currentIndex = startIndex + i;
    const letterIndex = currentIndex % 26;
    const letter = String.fromCharCode(65 + letterIndex);
    const suffixNum = Math.floor(currentIndex / 26);
    const suffix = suffixNum === 0 ? "" : String(suffixNum);

    names.push(`${letter}${suffix}`);
  }

  return names;
}
