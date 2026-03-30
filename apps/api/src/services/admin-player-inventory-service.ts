import type { AdminActionResult, AdminInventoryMutationInput } from "@obsidian-astral/shared";

import { prisma } from "../db.js";
import { GameRuleError } from "../lib/errors.js";
import { changeInventory } from "./inventory-service.js";

export async function mutateAdminPlayerInventory(
  playerId: string,
  input: AdminInventoryMutationInput,
): Promise<AdminActionResult> {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: {
      id: true,
      name: true,
    },
  });

  if (!player) {
    throw new GameRuleError("A játékos nem található.", 404);
  }

  await changeInventory(
    player.id,
    [
      {
        resourceKey: input.resourceKey,
        amount: input.amount,
      },
    ],
    input.mode,
  );

  return {
    message: `${player.name} készlete frissítve lett.`,
  };
}
