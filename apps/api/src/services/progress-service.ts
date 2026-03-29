import { prisma } from "../db.js";
import { GameRuleError } from "../lib/errors.js";
import { applyXp } from "../lib/leveling.js";

export async function applyPlayerProgress(playerId: string, energyDelta: number, gainedXp: number) {
  const player = await prisma.player.findUniqueOrThrow({ where: { id: playerId } });
  const nextEnergy = player.energy + energyDelta;

  if (nextEnergy < 0) {
    throw new GameRuleError("Nincs elég energia a művelethez.");
  }

  const progressed = applyXp(player.level, player.xp, gainedXp);

  return prisma.player.update({
    where: { id: playerId },
    data: {
      energy: Math.min(nextEnergy, player.energyMax),
      level: progressed.level,
      xp: progressed.xp,
      energyMax: progressed.level > player.level ? player.energyMax + 10 * (progressed.level - player.level) : player.energyMax,
    },
  });
}
