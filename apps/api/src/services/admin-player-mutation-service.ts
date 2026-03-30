import type { AdminActionResult, AdminPlayerUpdateInput } from "@obsidian-astral/shared";

import { prisma } from "../db.js";
import { GameRuleError } from "../lib/errors.js";
import { createNotification } from "./notification-service.js";

export async function updateAdminPlayer(playerId: string, input: AdminPlayerUpdateInput): Promise<AdminActionResult> {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
  });

  if (!player) {
    throw new GameRuleError("A játékos nem található.", 404);
  }

  const nextEnergyMax = input.energyMax ?? player.energyMax;
  const nextEnergy = Math.min(input.energy ?? player.energy, nextEnergyMax);
  const nextRole = input.role ?? player.role;
  const nextSuspended = input.isSuspended ?? player.isSuspended;

  await prisma.player.update({
    where: { id: playerId },
    data: {
      level: input.level,
      energy: nextEnergy,
      energyMax: input.energyMax,
      credits: input.credits,
      astralite: input.astralite,
      role: nextRole,
      isSuspended: nextSuspended,
    },
  });

  if (nextSuspended) {
    await prisma.session.deleteMany({
      where: { playerId },
    });
  }

  if (input.role !== undefined || input.isSuspended !== undefined) {
    await createNotification({
      playerId,
      kind: "admin",
      title: "Fiókbeállítások frissültek",
      body: nextSuspended
        ? "Az admin központ korlátozta a hozzáférésedet."
        : `A fiókod jogosultsági szintje frissült: ${nextRole}.`,
      tone: nextSuspended ? "danger" : "secondary",
      actionLabel: "Profil",
    });
  }

  return {
    message: `${player.name} alapértékei frissítve lettek.`,
  };
}

export async function cancelAdminPlayerActivity(playerId: string, activityId: string): Promise<AdminActionResult> {
  const timedAction = await prisma.timedAction.findFirst({
    where: {
      id: activityId,
      playerId,
    },
  });

  if (timedAction) {
    await prisma.timedAction.delete({
      where: { id: activityId },
    });

    return {
      message: "Az időzített művelet leállítva.",
    };
  }

  const expedition = await prisma.expeditionRun.findFirst({
    where: {
      id: activityId,
      playerId,
      claimedAt: null,
    },
  });

  if (!expedition) {
    throw new GameRuleError("Az aktivitás nem található.", 404);
  }

  await prisma.expeditionRun.delete({
    where: { id: activityId },
  });

  return {
    message: "Az expedíció megszakítva.",
  };
}
