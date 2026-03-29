import type {
  BuildingSnapshot,
  EquipmentSnapshot,
  ExpeditionSnapshot,
  GameState,
  InventorySnapshot,
  PassiveProductionSnapshot,
  PlayerSnapshot,
  ProfessionKey,
  ProfessionSnapshot,
  ZoneSnapshot,
} from "@obsidian-astral/shared";
import {
  buildings,
  expeditions,
  gatherings,
  professionLabels,
  recipes,
  resources,
  zones,
} from "@obsidian-astral/shared";

import { prisma } from "../db.js";
import { buildingMap, resourceMap } from "../lib/catalog.js";
import { xpToNextLevel } from "../lib/leveling.js";
import { syncPassiveProduction } from "./passive-service.js";

async function loadPlayerState() {
  return prisma.player.findFirst({
    include: {
      inventory: true,
      buildings: true,
      expeditions: {
        where: {
          claimedAt: null,
        },
        orderBy: {
          endsAt: "asc",
        },
      },
    },
  });
}

export type PlayerState = NonNullable<Awaited<ReturnType<typeof loadPlayerState>>>;

async function syncCatalogState(player: PlayerState) {
  const knownBuildings = new Set(player.buildings.map((item: PlayerState["buildings"][number]) => item.buildingKey));
  const missingBuildings = buildings.filter((building) => !knownBuildings.has(building.key));

  if (missingBuildings.length === 0) {
    return false;
  }

  await prisma.buildingState.createMany({
    data: missingBuildings.map((building) => ({
      playerId: player.id,
      buildingKey: building.key,
      level: 1,
    })),
    skipDuplicates: true,
  });

  return true;
}

function calculateProfessionProgress(player: PlayerState): ProfessionSnapshot[] {
  const scores = new Map<ProfessionKey, number>();

  (Object.keys(professionLabels) as ProfessionKey[]).forEach((key) => scores.set(key, 0));

  gatherings.forEach((gathering) => {
    if (player.level >= gathering.requiredLevel) {
      scores.set(gathering.profession, (scores.get(gathering.profession) ?? 0) + 14 + gathering.rewardXp);
    }
  });

  recipes.forEach((recipe) => {
    if (player.level >= recipe.requiredLevel) {
      const professionKey: ProfessionKey =
        recipe.category === "fogyoeszkoz"
          ? "alkimia"
          : recipe.category === "anyag"
            ? "mernokseg"
            : recipe.category === "pancel"
              ? "kereskedelem"
              : "favagas";
      scores.set(professionKey, (scores.get(professionKey) ?? 0) + 10 + recipe.rewardXp);
    }
  });

  player.buildings.forEach((building: PlayerState["buildings"][number]) => {
    const definition = buildingMap.get(building.buildingKey);

    if (!definition) {
      return;
    }

    const targetProfession: ProfessionKey =
      definition.category === "kitermeles"
        ? "banyaszat"
        : definition.category === "feldolgozas"
          ? "mernokseg"
          : "alkimia";
    scores.set(targetProfession, (scores.get(targetProfession) ?? 0) + building.level * 18);
  });

  scores.set("felderites", (scores.get("felderites") ?? 0) + player.expeditions.length * 24 + player.level * 8);
  scores.set("kereskedelem", (scores.get("kereskedelem") ?? 0) + Math.floor(player.credits / 20));
  scores.set(
    "vadaszat",
    (scores.get("vadaszat") ?? 0) +
      Math.floor((player.inventory.find((item: PlayerState["inventory"][number]) => item.resourceKey === "bor")?.quantity ?? 0) / 2),
  );

  return (Object.entries(professionLabels) as Array<[ProfessionKey, (typeof professionLabels)[ProfessionKey]]>).map(
    ([key, definition]) => {
      const score = scores.get(key) ?? 0;
      const level = 1 + Math.floor(score / 70);

      return {
        key,
        label: definition.label,
        focus: definition.focus,
        level,
        progressPercent: score % 70 === 0 ? 100 : Math.round(((score % 70) / 70) * 100),
      };
    },
  );
}

function createPassiveProductionSnapshots(player: PlayerState): PassiveProductionSnapshot[] {
  return player.buildings
    .map((buildingState: PlayerState["buildings"][number]) => {
      const definition = buildingMap.get(buildingState.buildingKey);

      if (!definition || definition.passiveProduction.length === 0) {
        return null;
      }

      return {
        buildingKey: buildingState.buildingKey,
        label: definition.label,
        level: buildingState.level,
        outputs: definition.passiveProduction.map((item) => ({
          ...item,
          label: resourceMap.get(item.resourceKey)?.label ?? item.resourceKey,
          amountPerHour: item.amount * buildingState.level,
        })),
      };
    })
    .filter((item: PassiveProductionSnapshot | null): item is PassiveProductionSnapshot => item !== null);
}

function createZoneSnapshots(player: PlayerState): ZoneSnapshot[] {
  return zones.map((zone) => ({
    ...zone,
    status:
      player.level >= zone.recommendedLevel
        ? "elérhető"
        : player.level + 1 >= zone.recommendedLevel
          ? "hamarosan"
          : "zárolt",
  }));
}

function createEquipmentSnapshots(player: PlayerState): EquipmentSnapshot[] {
  const equippedResource = player.equippedResourceKey ? resourceMap.get(player.equippedResourceKey) : null;

  return [
    {
      slot: "fofegyver",
      label: "Főfegyver",
      resourceKey: player.equippedResourceKey,
      resourceLabel: equippedResource?.label ?? null,
      bonusText: equippedResource
        ? `Támadási fókusz +${Math.max(4, player.level * 2)} a(z) ${equippedResource.label} alapján`
        : "Nincs aktív fegyvermag kiválasztva",
    },
  ];
}

export async function ensurePlayer(sync = true): Promise<PlayerState> {
  let player = await loadPlayerState();

  if (!player) {
    throw new Error("Nincs inicializált játékos. Futtasd a seed scriptet.");
  }

  if (sync) {
    const catalogChanged = await syncCatalogState(player);

    if (catalogChanged) {
      player = await loadPlayerState();

      if (!player) {
        throw new Error("A játékos állapot nem tölthető be a katalógus szinkron után.");
      }
    }

    const changed = await syncPassiveProduction(player);

    if (changed) {
      player = await loadPlayerState();

      if (!player) {
        throw new Error("A játékos állapot nem tölthető be a passzív szinkron után.");
      }
    }
  }

  return player;
}

export async function ensurePlayerById(playerId: string, sync = true): Promise<PlayerState> {
  let player = await prisma.player.findUnique({
    where: { id: playerId },
    include: {
      inventory: true,
      buildings: true,
      expeditions: {
        where: {
          claimedAt: null,
        },
        orderBy: {
          endsAt: "asc",
        },
      },
    },
  });

  if (!player) {
    throw new Error("A játékos nem található.");
  }

  if (sync) {
    const catalogChanged = await syncCatalogState(player);

    if (catalogChanged) {
      player = await prisma.player.findUnique({
        where: { id: playerId },
        include: {
          inventory: true,
          buildings: true,
          expeditions: {
            where: { claimedAt: null },
            orderBy: { endsAt: "asc" },
          },
        },
      });
    }

    if (!player) {
      throw new Error("A játékos állapot nem tölthető be a katalógus szinkron után.");
    }

    const changed = await syncPassiveProduction(player);

    if (changed) {
      player = await prisma.player.findUnique({
        where: { id: playerId },
        include: {
          inventory: true,
          buildings: true,
          expeditions: {
            where: { claimedAt: null },
            orderBy: { endsAt: "asc" },
          },
        },
      });
    }

    if (!player) {
      throw new Error("A játékos állapot nem tölthető be a passzív szinkron után.");
    }
  }

  return player;
}

export async function getGameState(playerId?: string): Promise<GameState> {
  const player = playerId ? await ensurePlayerById(playerId) : await ensurePlayer();

  const playerSnapshot: PlayerSnapshot = {
    id: player.id,
    name: player.name,
    level: player.level,
    xp: player.xp,
    xpToNextLevel: xpToNextLevel(player.level),
    energy: player.energy,
    energyMax: player.energyMax,
    credits: player.credits,
    astralite: player.astralite,
  };

  const inventory: InventorySnapshot[] = player.inventory
    .map((entry: PlayerState["inventory"][number]) => ({
      resourceKey: entry.resourceKey,
      quantity: entry.quantity,
    }))
    .sort((left: InventorySnapshot, right: InventorySnapshot) => right.quantity - left.quantity);

  const buildingSnapshots: BuildingSnapshot[] = player.buildings.map((entry: PlayerState["buildings"][number]) => {
    const definition = buildings.find((item) => item.key === entry.buildingKey);

    return {
      key: entry.buildingKey,
      level: entry.level,
      label: definition?.label ?? entry.buildingKey,
    };
  });

  const now = Date.now();
  const expeditionSnapshots: ExpeditionSnapshot[] = player.expeditions.map((entry: PlayerState["expeditions"][number]) => {
    const definition = expeditions.find((item) => item.key === entry.expeditionKey);

    return {
      id: entry.id,
      key: entry.expeditionKey,
      label: definition?.label ?? entry.expeditionKey,
      status: entry.endsAt.getTime() <= now ? "befejezve" : "folyamatban",
      startedAt: entry.startedAt.toISOString(),
      endsAt: entry.endsAt.toISOString(),
    };
  });

  return {
    player: playerSnapshot,
    inventory,
    buildings: buildingSnapshots,
    expeditions: expeditionSnapshots,
    resources,
    recipes,
    gatherings,
    buildingCatalog: buildings,
    expeditionsCatalog: expeditions,
    professions: calculateProfessionProgress(player),
    passiveProduction: createPassiveProductionSnapshots(player),
    zones: createZoneSnapshots(player),
    equipment: createEquipmentSnapshots(player),
  };
}
