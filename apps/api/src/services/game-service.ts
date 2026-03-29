import type { RecipeIngredient } from "@obsidian-astral/shared";

import { prisma } from "../db.js";
import { buildingMap, expeditionMap, gatheringMap, recipeMap } from "../lib/catalog.js";
import { GameRuleError } from "../lib/errors.js";
import { applyXp } from "../lib/leveling.js";
import { changeInventory, scaledRewards } from "./inventory-service.js";
import type { PlayerState } from "./player-service.js";
import { ensurePlayerById, getGameState } from "./player-service.js";

async function applyPlayerProgress(playerId: string, energyDelta: number, gainedXp: number) {
  const player = await prisma.player.findUniqueOrThrow({ where: { id: playerId } });
  const nextEnergy = player.energy + energyDelta;

  if (nextEnergy < 0) {
    throw new GameRuleError("Nincs elég energia a művelethez.");
  }

  const progressed = applyXp(player.level, player.xp, gainedXp);

  return prisma.player.update({
    where: { id: playerId },
    data: {
      energy: Math.min(nextEnergy, player.energyMax),
      level: progressed.level,
      xp: progressed.xp,
      energyMax: progressed.level > player.level ? player.energyMax + 10 * (progressed.level - player.level) : player.energyMax,
    },
  });
}

function getBuildingBonus(buildingKey: string, resourceKeys: string[], level: number): number {
  const definition = buildingMap.get(buildingKey);

  if (!definition) {
    return 0;
  }

  return resourceKeys.reduce((sum, resourceKey) => sum + (definition.productionBonus[resourceKey] ?? 0), 0) * level;
}

function ensureLevelRequirement(playerLevel: number, requiredLevel: number, label: string) {
  if (playerLevel < requiredLevel) {
    throw new GameRuleError(`${label} csak ${requiredLevel}. szinttől érhető el.`);
  }
}

export async function gatherResources(playerId: string, actionKey: string) {
  const action = gatheringMap.get(actionKey);

  if (!action) {
    throw new GameRuleError("Ismeretlen gyűjtési művelet.", 404);
  }

  const player = await ensurePlayerById(playerId);
  ensureLevelRequirement(player.level, action.requiredLevel, action.label);

  const sawmillLevel = player.buildings.find((item: PlayerState["buildings"][number]) => item.buildingKey === "furesztelep")?.level ?? 1;
  const furnaceLevel = player.buildings.find((item: PlayerState["buildings"][number]) => item.buildingKey === "koho")?.level ?? 1;
  const labLevel = player.buildings.find((item: PlayerState["buildings"][number]) => item.buildingKey === "labor")?.level ?? 1;
  const mineLevel = player.buildings.find((item: PlayerState["buildings"][number]) => item.buildingKey === "banya")?.level ?? 0;
  const greenhouseLevel = player.buildings.find((item: PlayerState["buildings"][number]) => item.buildingKey === "uveghaz")?.level ?? 0;

  const resourceKeys = action.yields.map((item) => item.resourceKey);
  const bonusMultiplier =
    getBuildingBonus("furesztelep", resourceKeys, sawmillLevel) +
    getBuildingBonus("koho", resourceKeys, furnaceLevel) +
    getBuildingBonus("labor", resourceKeys, labLevel) +
    getBuildingBonus("banya", resourceKeys, mineLevel) +
    getBuildingBonus("uveghaz", resourceKeys, greenhouseLevel);

  await applyPlayerProgress(player.id, -action.energyCost, action.rewardXp);
  await changeInventory(player.id, scaledRewards(action.yields, bonusMultiplier), "add");

  return getGameState(playerId);
}

export async function craftRecipe(playerId: string, recipeKey: string) {
  const recipe = recipeMap.get(recipeKey);

  if (!recipe) {
    throw new GameRuleError("Ismeretlen recept.", 404);
  }

  const player = await ensurePlayerById(playerId);
  ensureLevelRequirement(player.level, recipe.requiredLevel, recipe.label);

  const furnaceLevel = player.buildings.find((item: PlayerState["buildings"][number]) => item.buildingKey === "koho")?.level ?? 1;
  const labLevel = player.buildings.find((item: PlayerState["buildings"][number]) => item.buildingKey === "labor")?.level ?? 1;
  const refineryLevel = player.buildings.find((item: PlayerState["buildings"][number]) => item.buildingKey === "finomito")?.level ?? 0;
  const bonusMultiplier =
    getBuildingBonus("koho", recipe.produces.map((item) => item.resourceKey), furnaceLevel) +
    getBuildingBonus("labor", recipe.produces.map((item) => item.resourceKey), labLevel) +
    getBuildingBonus("finomito", recipe.produces.map((item) => item.resourceKey), refineryLevel);

  await changeInventory(player.id, recipe.ingredients, "remove");
  await changeInventory(player.id, scaledRewards(recipe.produces, bonusMultiplier), "add");
  await applyPlayerProgress(player.id, -6, recipe.rewardXp);

  return getGameState(playerId);
}

function buildUpgradeCost(level: number, baseCost: RecipeIngredient[]): RecipeIngredient[] {
  return baseCost.map((item) => ({
    ...item,
    amount: Math.ceil(item.amount * (1 + (level - 1) * 0.65)),
  }));
}

export async function upgradeBuilding(playerId: string, buildingKey: string) {
  const definition = buildingMap.get(buildingKey);

  if (!definition) {
    throw new GameRuleError("Ismeretlen épület.", 404);
  }

  const player = await ensurePlayerById(playerId);
  ensureLevelRequirement(player.level, definition.requiredLevel, definition.label);

  const building = player.buildings.find((item: PlayerState["buildings"][number]) => item.buildingKey === buildingKey);

  if (!building) {
    throw new GameRuleError("Az épület állapota nem található.");
  }

  const targetLevel = building.level + 1;
  const upgradeCost = buildUpgradeCost(targetLevel, definition.baseCost);

  await changeInventory(player.id, upgradeCost, "remove");
  await prisma.buildingState.update({
    where: {
      playerId_buildingKey: {
        playerId: player.id,
        buildingKey,
      },
    },
    data: {
      level: targetLevel,
    },
  });

  await applyPlayerProgress(player.id, -8, 28 + targetLevel * 6);

  return getGameState(playerId);
}

function createExpeditionRewards(expeditionKey: string) {
  const definition = expeditionMap.get(expeditionKey);

  if (!definition) {
    throw new GameRuleError("Ismeretlen expedíció.", 404);
  }

  const rewards = [...definition.guaranteedRewards];

  for (const bonusReward of definition.bonusRewards) {
    if (Math.random() > 0.45) {
      rewards.push(bonusReward);
    }
  }

  return rewards;
}

export async function startExpedition(playerId: string, expeditionKey: string) {
  const definition = expeditionMap.get(expeditionKey);

  if (!definition) {
    throw new GameRuleError("Ismeretlen expedíció.", 404);
  }

  const player = await ensurePlayerById(playerId);
  ensureLevelRequirement(player.level, definition.requiredLevel, definition.label);

  const activeRuns = player.expeditions.filter(
    (item: PlayerState["expeditions"][number]) => item.claimedAt === null && item.endsAt.getTime() > Date.now(),
  );

  if (activeRuns.length >= 2) {
    throw new GameRuleError("Egyszerre legfeljebb két aktív expedíció lehet.");
  }

  await applyPlayerProgress(player.id, -definition.energyCost, 0);

  const startedAt = new Date();
  const endsAt = new Date(startedAt.getTime() + definition.durationMinutes * 60_000);

  await prisma.expeditionRun.create({
    data: {
      playerId: player.id,
      expeditionKey,
      status: "folyamatban",
      rewardPayload: createExpeditionRewards(expeditionKey) as unknown as object,
      startedAt,
      endsAt,
    },
  });

  return getGameState(playerId);
}

export async function claimExpedition(playerId: string, expeditionId: string) {
  const player = await ensurePlayerById(playerId);
  const expedition = await prisma.expeditionRun.findUnique({
    where: { id: expeditionId },
  });

  if (!expedition || expedition.playerId !== player.id) {
    throw new GameRuleError("Az expedíció nem található.", 404);
  }

  if (expedition.claimedAt) {
    throw new GameRuleError("Az expedíció jutalma már át lett véve.");
  }

  if (expedition.endsAt.getTime() > Date.now()) {
    throw new GameRuleError("Az expedíció még tart.");
  }

  const definition = expeditionMap.get(expedition.expeditionKey);
  const rewards = expedition.rewardPayload as unknown as RecipeIngredient[];

  await changeInventory(player.id, rewards, "add");
  await prisma.expeditionRun.update({
    where: { id: expeditionId },
    data: {
      status: "befejezve",
      claimedAt: new Date(),
    },
  });
  await applyPlayerProgress(player.id, 0, definition?.rewardXp ?? 0);

  return getGameState(playerId);
}
