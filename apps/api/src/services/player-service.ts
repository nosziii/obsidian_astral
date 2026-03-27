import type { Prisma } from "@prisma/client";
import type { BuildingSnapshot, ExpeditionSnapshot, GameState, InventorySnapshot, PlayerSnapshot } from "@obsidian-astral/shared";
import { buildings, expeditions, gatherings, recipes, resources } from "@obsidian-astral/shared";

import { prisma } from "../db.js";
import { xpToNextLevel } from "../lib/leveling.js";

export type PlayerState = Prisma.PlayerGetPayload<{
  include: {
    inventory: true;
    buildings: true;
    expeditions: true;
  };
}>;

export async function ensurePlayer(): Promise<PlayerState> {
  const player = await prisma.player.findFirst({
    include: {
      inventory: true,
      buildings: true,
      expeditions: {
        where: {
          claimedAt: null,
        },
        orderBy: {
          endsAt: "asc",
        },
      },
    },
  });

  if (!player) {
    throw new Error("Nincs inicializált játékos. Futtasd a seed scriptet.");
  }

  return player;
}

export async function getGameState(): Promise<GameState> {
  const player = await ensurePlayer();

  const playerSnapshot: PlayerSnapshot = {
    id: player.id,
    name: player.name,
    level: player.level,
    xp: player.xp,
    xpToNextLevel: xpToNextLevel(player.level),
    energy: player.energy,
    energyMax: player.energyMax,
    credits: player.credits,
    astralite: player.astralite,
  };

  const inventory: InventorySnapshot[] = player.inventory
    .map((entry: PlayerState["inventory"][number]) => ({
      resourceKey: entry.resourceKey,
      quantity: entry.quantity,
    }))
    .sort((left: InventorySnapshot, right: InventorySnapshot) => right.quantity - left.quantity);

  const buildingSnapshots: BuildingSnapshot[] = player.buildings.map((entry: PlayerState["buildings"][number]) => {
    const definition = buildings.find((item) => item.key === entry.buildingKey);

    return {
      key: entry.buildingKey,
      level: entry.level,
      label: definition?.label ?? entry.buildingKey,
    };
  });

  const now = Date.now();
  const expeditionSnapshots: ExpeditionSnapshot[] = player.expeditions.map((entry: PlayerState["expeditions"][number]) => {
    const definition = expeditions.find((item) => item.key === entry.expeditionKey);

    return {
      id: entry.id,
      key: entry.expeditionKey,
      label: definition?.label ?? entry.expeditionKey,
      status: entry.endsAt.getTime() <= now ? "befejezve" : "folyamatban",
      startedAt: entry.startedAt.toISOString(),
      endsAt: entry.endsAt.toISOString(),
    };
  });

  return {
    player: playerSnapshot,
    inventory,
    buildings: buildingSnapshots,
    expeditions: expeditionSnapshots,
    resources,
    recipes,
    gatherings,
    buildingCatalog: buildings,
    expeditionsCatalog: expeditions,
  };
}
