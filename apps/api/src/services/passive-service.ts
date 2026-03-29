import type { RecipeIngredient } from "@obsidian-astral/shared";

import { prisma } from "../db.js";
import { buildingMap } from "../lib/catalog.js";
import { changeInventory } from "./inventory-service.js";

const PASSIVE_SYNC_WINDOW_MS = 8 * 60 * 60 * 1000;
const PASSIVE_MIN_ELAPSED_MS = 5 * 60 * 1000;

interface PassivePlayerState {
  id: string;
  updatedAt: Date;
  buildings: Array<{
    buildingKey: string;
    level: number;
  }>;
}

function calculatePassiveRewards(
  passiveProduction: RecipeIngredient[],
  level: number,
  elapsedHours: number,
): RecipeIngredient[] {
  return passiveProduction
    .map((item) => ({
      resourceKey: item.resourceKey,
      amount: Math.floor(item.amount * level * elapsedHours),
    }))
    .filter((item) => item.amount > 0);
}

export async function syncPassiveProduction(player: PassivePlayerState) {
  const elapsedMs = Date.now() - player.updatedAt.getTime();

  if (elapsedMs < PASSIVE_MIN_ELAPSED_MS) {
    return false;
  }

  const effectiveElapsedHours = Math.min(elapsedMs, PASSIVE_SYNC_WINDOW_MS) / 3_600_000;
  const rewards = player.buildings.flatMap((buildingState) => {
    const definition = buildingMap.get(buildingState.buildingKey);

    if (!definition || definition.passiveProduction.length === 0) {
      return [];
    }

    return calculatePassiveRewards(definition.passiveProduction, buildingState.level, effectiveElapsedHours);
  });

  if (rewards.length === 0) {
    return false;
  }

  await changeInventory(player.id, rewards, "add");
  await prisma.player.update({
    where: { id: player.id },
    data: {
      updatedAt: new Date(),
    },
  });

  return true;
}
