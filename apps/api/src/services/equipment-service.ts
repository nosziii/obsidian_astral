import { resourceMap } from "../lib/catalog.js";
import { GameRuleError } from "../lib/errors.js";
import { prisma } from "../db.js";

export async function equipResource(playerId: string, resourceKey: string) {
  const inventoryEntry = await prisma.inventoryEntry.findUnique({
    where: {
      playerId_resourceKey: {
        playerId,
        resourceKey,
      },
    },
  });

  if (!inventoryEntry || inventoryEntry.quantity <= 0) {
    throw new GameRuleError("Ez az erőforrás nem érhető el a készletben.");
  }

  if (!resourceMap.has(resourceKey)) {
    throw new GameRuleError("Ismeretlen felszerelési alapanyag.");
  }

  await prisma.player.update({
    where: { id: playerId },
    data: {
      equippedResourceKey: resourceKey,
    },
  });
}
