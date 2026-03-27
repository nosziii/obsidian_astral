export function xpToNextLevel(level: number): number {
  return 100 + (level - 1) * 55;
}

export function applyXp(level: number, xp: number, gainedXp: number): { level: number; xp: number } {
  let nextLevel = level;
  let nextXp = xp + gainedXp;

  while (nextXp >= xpToNextLevel(nextLevel)) {
    nextXp -= xpToNextLevel(nextLevel);
    nextLevel += 1;
  }

  return { level: nextLevel, xp: nextXp };
}
