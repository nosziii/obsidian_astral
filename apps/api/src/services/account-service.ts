import type { Player } from "@prisma/client";
import { buildings, resources } from "@obsidian-astral/shared";

import { prisma } from "../db.js";

const starterInventory: Record<string, number> = {
  fa: 120,
  ko: 90,
  vaserc: 70,
  viz: 80,
  elelem: 65,
  textil: 30,
  rez: 35,
  szen: 24,
  kristaly: 16,
  gyogynoveny: 18,
  bor: 10,
  ezusterc: 8,
  vegyi_anyag: 6,
};

export async function bootstrapPlayerState(player: Player) {
  await prisma.inventoryEntry.createMany({
    data: resources.map((resource) => ({
      playerId: player.id,
      resourceKey: resource.key,
      quantity: starterInventory[resource.key] ?? 0,
    })),
    skipDuplicates: true,
  });

  await prisma.buildingState.createMany({
    data: buildings.map((building) => ({
      playerId: player.id,
      buildingKey: building.key,
      level: 1,
    })),
    skipDuplicates: true,
  });
}
