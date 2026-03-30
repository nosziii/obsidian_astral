import type { ActivityKind, RecipeIngredient } from "@obsidian-astral/shared";
import type { Prisma } from "@prisma/client";

import { prisma } from "../db.js";
import { buildingMap, gatheringMap, recipeMap } from "../lib/catalog.js";
import { GameRuleError } from "../lib/errors.js";
import { changeInventory } from "./inventory-service.js";
import { createNotification } from "./notification-service.js";
import { applyPlayerProgress } from "./progress-service.js";

interface TimedActionPayload {
  rewards?: RecipeIngredient[];
  xp?: number;
  buildingLevel?: number;
}

interface TimedActionInput {
  playerId: string;
  kind: Exclude<ActivityKind, "expedition">;
  targetKey: string;
  durationSeconds: number;
  payload: TimedActionPayload;
}

export async function ensureNoActiveTimedAction(playerId: string, kind: Exclude<ActivityKind, "expedition">, targetKey: string) {
  const activeAction = await prisma.timedAction.findFirst({
    where: {
      playerId,
      kind,
      targetKey,
      status: "folyamatban",
      endsAt: {
        gt: new Date(),
      },
    },
  });

  if (activeAction) {
    throw new GameRuleError("Ez a művelet már folyamatban van.");
  }
}

export async function createTimedAction({ durationSeconds, kind, payload, playerId, targetKey }: TimedActionInput) {
  const startedAt = new Date();
  const endsAt = new Date(startedAt.getTime() + durationSeconds * 1_000);

  await prisma.timedAction.create({
    data: {
      playerId,
      kind,
      targetKey,
      payload: payload as Prisma.InputJsonValue,
      startedAt,
      endsAt,
    },
  });
}

async function finishTimedAction(actionId: string) {
  const action = await prisma.timedAction.findUnique({
    where: { id: actionId },
  });

  if (!action || action.status !== "folyamatban" || action.endsAt.getTime() > Date.now()) {
    return false;
  }

  const payload = action.payload as unknown as TimedActionPayload;

  if (payload.rewards?.length) {
    await changeInventory(action.playerId, payload.rewards, "add");
  }

  if (action.kind === "building" && typeof payload.buildingLevel === "number") {
    await prisma.buildingState.update({
      where: {
        playerId_buildingKey: {
          playerId: action.playerId,
          buildingKey: action.targetKey,
        },
      },
      data: {
        level: payload.buildingLevel,
      },
    });
  }

  if (typeof payload.xp === "number" && payload.xp > 0) {
    await applyPlayerProgress(action.playerId, 0, payload.xp);
  }

  const actionLabel =
    action.kind === "gathering"
      ? gatheringMap.get(action.targetKey)?.label
      : action.kind === "craft"
        ? recipeMap.get(action.targetKey)?.label
        : buildingMap.get(action.targetKey)?.label;

  const completionBody =
    action.kind === "building"
      ? `Az épületfejlesztés lezárult, az új szint aktív.`
      : action.kind === "craft"
        ? "A gyártási ciklus lefutott, a jutalmak bekerültek a készletbe."
        : "A gyűjtési művelet lezárult, a zsákmány bekerült a készletbe.";

  await createNotification({
    playerId: action.playerId,
    kind: action.kind === "building" ? "rendszer" : "gazdasag",
    title: `${actionLabel ?? action.targetKey} befejeződött`,
    body: completionBody,
    tone: "primary",
    actionLabel: action.kind === "building" ? "Bázisnézet" : "Készlet",
    referenceKey: `timed-action:${action.id}`,
  });

  await prisma.timedAction.update({
    where: { id: actionId },
    data: {
      status: "befejezve",
    },
  });

  await prisma.timedAction.delete({
    where: { id: actionId },
  });

  return true;
}

export async function syncTimedActions(playerId: string) {
  const dueActions = await prisma.timedAction.findMany({
    where: {
      playerId,
      status: "folyamatban",
      endsAt: {
        lte: new Date(),
      },
    },
    orderBy: {
      endsAt: "asc",
    },
  });

  let changed = false;

  for (const action of dueActions) {
    const applied = await finishTimedAction(action.id);
    changed ||= applied;
  }

  return changed;
}
