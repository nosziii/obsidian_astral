import type { RecipeIngredient } from "@obsidian-astral/shared";

import { prisma } from "../db.js";
import { GameRuleError } from "../lib/errors.js";

export async function changeInventory(playerId: string, items: RecipeIngredient[], direction: "add" | "remove") {
  for (const item of items) {
    const entry = await prisma.inventoryEntry.findUnique({
      where: {
        playerId_resourceKey: {
          playerId,
          resourceKey: item.resourceKey,
        },
      },
    });

    const currentQuantity = entry?.quantity ?? 0;
    const nextQuantity = direction === "add" ? currentQuantity + item.amount : currentQuantity - item.amount;

    if (nextQuantity < 0) {
      throw new GameRuleError(`Nincs elegendő készlet: ${item.resourceKey}`);
    }

    await prisma.inventoryEntry.upsert({
      where: {
        playerId_resourceKey: {
          playerId,
          resourceKey: item.resourceKey,
        },
      },
      create: {
        playerId,
        resourceKey: item.resourceKey,
        quantity: nextQuantity,
      },
      update: {
        quantity: nextQuantity,
      },
    });
  }
}

export function scaledRewards(baseRewards: RecipeIngredient[], bonusMultiplier: number): RecipeIngredient[] {
  return baseRewards.map((reward) => ({
    ...reward,
    amount: Math.max(1, Math.round(reward.amount * (1 + bonusMultiplier))),
  }));
}
