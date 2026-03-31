import type { AdminActionResult, AdminBuildingMutationInput } from "@obsidian-astral/shared";

import { prisma } from "../db.js";
import { buildingMap } from "../lib/catalog.js";
import { GameRuleError } from "../lib/errors.js";
import { createAdminAuditLog } from "./admin-audit-service.js";

interface AdminActor {
  id: string;
  name: string;
}

export async function updateAdminPlayerBuilding(
  actor: AdminActor,
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

  await createAdminAuditLog({
    actorPlayerId: actor.id,
    actorName: actor.name,
    targetPlayerId: player.id,
    targetName: player.name,
    actionKind: "building_update",
    summary: `${actor.name} ${input.level}. szintre állította ezt az épületet: ${building.label}.`,
    metadata: {
      buildingKey: input.buildingKey,
      buildingLabel: building.label,
      level: input.level,
    },
  });

  return {
    message: `${player.name} ${building.label} épületszintje ${input.level}. szintre állítva.`,
  };
}
