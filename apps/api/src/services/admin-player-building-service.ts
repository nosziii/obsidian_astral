import type { AdminActionResult, AdminBuildingMutationInput } from "@obsidian-astral/shared";

import { prisma } from "../db.js";
import { GameRuleError } from "../lib/errors.js";
import { buildingMap } from "../lib/catalog.js";

export async function updateAdminPlayerBuilding(
  playerId: string,
  input: AdminBuildingMutationInput,
): Promise<AdminActionResult> {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: { id: true, name: true },
  });

  if (!player) {
    throw new GameRuleError("A játékos nem található.", 404);
  }

  const building = buildingMap.get(input.buildingKey);

  if (!building) {
    throw new GameRuleError("Az épület nem található a katalógusban.", 404);
  }

  await prisma.buildingState.upsert({
    where: {
      playerId_buildingKey: {
        playerId,
        buildingKey: input.buildingKey,
      },
    },
    update: {
      level: input.level,
    },
    create: {
      playerId,
      buildingKey: input.buildingKey,
      level: input.level,
    },
  });

  return {
    message: `${player.name} ${building.label} épületszintje ${input.level}. szintre állítva.`,
  };
}
