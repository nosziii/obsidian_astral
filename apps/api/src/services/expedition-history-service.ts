import type { ExpeditionHistorySnapshot, RecipeIngredient } from "@obsidian-astral/shared";

import { prisma } from "../db.js";
import { expeditionMap } from "../lib/catalog.js";

export async function listExpeditionHistory(playerId: string): Promise<ExpeditionHistorySnapshot[]> {
  const runs = await prisma.expeditionRun.findMany({
    where: {
      playerId,
      OR: [
        { claimedAt: { not: null } },
        { endsAt: { lte: new Date() } },
      ],
    },
    orderBy: {
      endsAt: "desc",
    },
    take: 12,
  });

  return runs.map((run) => ({
    id: run.id,
    key: run.expeditionKey,
    label: expeditionMap.get(run.expeditionKey)?.label ?? run.expeditionKey,
    claimedAt: run.claimedAt?.toISOString() ?? null,
    startedAt: run.startedAt.toISOString(),
    endedAt: run.endsAt.toISOString(),
    rewards: run.rewardPayload as unknown as RecipeIngredient[],
  }));
}
