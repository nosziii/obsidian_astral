import type { AdminPlayerDetail } from "@obsidian-astral/shared";

import { prisma } from "../db.js";
import { getGameState } from "./player-service.js";

export async function getAdminPlayerDetail(playerId: string): Promise<AdminPlayerDetail> {
  const [player, gameState] = await Promise.all([
    prisma.player.findUniqueOrThrow({
      where: { id: playerId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        level: true,
      credits: true,
      astralite: true,
      energy: true,
      energyMax: true,
      createdAt: true,
      bio: true,
      fleet: true,
      },
    }),
    getGameState(playerId),
  ]);

  return {
    player: {
      id: player.id,
      email: player.email ?? "nincs@beallitva.local",
      name: player.name,
      role: player.role as AdminPlayerDetail["player"]["role"],
      level: player.level,
      credits: player.credits,
      astralite: player.astralite,
      energy: player.energy,
      energyMax: player.energyMax,
      createdAt: player.createdAt.toISOString(),
      bio: player.bio,
      fleet: player.fleet,
    },
    inventory: gameState.inventory.slice(0, 12),
    buildings: gameState.buildings,
    activities: gameState.activities,
  };
}
