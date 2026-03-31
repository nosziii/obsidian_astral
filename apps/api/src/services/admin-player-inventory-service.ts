import type { AdminActionResult, AdminInventoryMutationInput } from "@obsidian-astral/shared";

import { prisma } from "../db.js";
import { GameRuleError } from "../lib/errors.js";
import { createAdminAuditLog } from "./admin-audit-service.js";
import { changeInventory } from "./inventory-service.js";

interface AdminActor {
  id: string;
  name: string;
}

export async function mutateAdminPlayerInventory(
  actor: AdminActor,
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

  await createAdminAuditLog({
    actorPlayerId: actor.id,
    actorName: actor.name,
    targetPlayerId: player.id,
    targetName: player.name,
    actionKind: "inventory_update",
    summary: `${actor.name} ${input.mode === "add" ? "hozzáadott" : "eltávolított"} ${input.amount} egységet ebből: ${input.resourceKey}.`,
    metadata: {
      resourceKey: input.resourceKey,
      amount: input.amount,
      mode: input.mode,
    },
  });

  return {
    message: `${player.name} készlete frissítve lett.`,
  };
}
