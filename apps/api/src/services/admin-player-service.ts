import type { AdminPlayerDetail } from "@obsidian-astral/shared";

import { prisma } from "../db.js";
import { buildingMap } from "../lib/catalog.js";
import { listAdminAuditLogs } from "./admin-audit-service.js";
import { getGameState } from "./player-service.js";

export async function getAdminPlayerDetail(playerId: string): Promise<AdminPlayerDetail> {
  const [player, gameState, auditLogs] = await Promise.all([
    prisma.player.findUniqueOrThrow({
      where: { id: playerId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isSuspended: true,
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
    listAdminAuditLogs(playerId),
  ]);

  return {
    player: {
      id: player.id,
      email: player.email ?? "nincs@beallitva.local",
      name: player.name,
      role: player.role as AdminPlayerDetail["player"]["role"],
      isSuspended: player.isSuspended,
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
    buildings: gameState.buildings.map((building) => {
      const catalog = buildingMap.get(building.key);

      return {
        ...building,
        category: catalog?.category ?? "kitermeles",
        description: catalog?.description ?? "Nincs leírás.",
        requiredLevel: catalog?.requiredLevel ?? 1,
        passiveProduction: catalog?.passiveProduction ?? [],
      };
    }),
    activities: gameState.activities,
    auditLogs,
  };
}
