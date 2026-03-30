import type {
  ActivitySnapshot,
  BuildingSnapshot,
  EquipmentInventorySnapshot,
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
  equipmentItems,
  equipmentSlotLabels,
  expeditions,
  gatherings,
  professionLabels,
  recipes,
  resources,
  zones,
} from "@obsidian-astral/shared";

import { prisma } from "../db.js";
import { buildingMap, equipmentItemMap, expeditionMap, gatheringMap, recipeMap, resourceMap } from "../lib/catalog.js";
import { xpToNextLevel } from "../lib/leveling.js";
import { syncTimedActions } from "./activity-service.js";
import { syncPassiveProduction } from "./passive-service.js";

async function loadPlayerState() {
  return prisma.player.findFirst({
    include: {
      inventory: true,
      equipmentInventory: true,
      equippedItems: true,
      buildings: true,
      expeditions: {
        where: {
          claimedAt: null,
        },
        orderBy: {
          endsAt: "asc",
        },
      },
      timedActions: {
        where: {
          status: "folyamatban",
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
  const knownEquipmentItems = new Set(player.equipmentInventory.map((item) => item.itemKey));
  const missingEquipmentItems = equipmentItems.filter((item) => !knownEquipmentItems.has(item.key));
  const knownSlots = new Set(player.equippedItems.map((item) => item.slot));
  const missingSlots = Object.keys(equipmentSlotLabels).filter((slot) => !knownSlots.has(slot));

  if (missingBuildings.length === 0 && missingEquipmentItems.length === 0 && missingSlots.length === 0) {
    return false;
  }

  if (missingBuildings.length > 0) {
    await prisma.buildingState.createMany({
      data: missingBuildings.map((building) => ({
        playerId: player.id,
        buildingKey: building.key,
        level: 1,
      })),
      skipDuplicates: true,
    });
  }

  if (missingEquipmentItems.length > 0) {
    await prisma.equipmentInventoryEntry.createMany({
      data: missingEquipmentItems.map((item) => ({
        playerId: player.id,
        itemKey: item.key,
        quantity: 0,
      })),
      skipDuplicates: true,
    });
  }

  if (missingSlots.length > 0) {
    await prisma.equippedItem.createMany({
      data: missingSlots.map((slot) => ({
        playerId: player.id,
        slot,
        itemKey: null,
      })),
      skipDuplicates: true,
    });
  }

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
        ? "elerheto"
        : player.level + 1 >= zone.recommendedLevel
          ? "hamarosan"
          : "zarolt",
  }));
}

function createEquipmentSnapshots(player: PlayerState): EquipmentSnapshot[] {
  return (Object.entries(equipmentSlotLabels) as Array<[keyof typeof equipmentSlotLabels, string]>).map(([slot, label]) => {
    const equippedEntry = player.equippedItems.find((item) => item.slot === slot);
    const equipmentItem = equippedEntry?.itemKey ? equipmentItemMap.get(equippedEntry.itemKey) : null;
    const statLine = equipmentItem?.statLine;
    const bonusParts = [
      statLine?.tamadas ? `Támadás +${statLine.tamadas}` : null,
      statLine?.vedelem ? `Védelem +${statLine.vedelem}` : null,
      statLine?.kritikus ? `Kritikus +${statLine.kritikus}%` : null,
      statLine?.gyujtesiSebesseg ? `Gyűjtés +${statLine.gyujtesiSebesseg}%` : null,
      statLine?.craftBonus ? `Craft +${statLine.craftBonus}%` : null,
      statLine?.energiaRegeneralas ? `Energia +${statLine.energiaRegeneralas}/kör` : null,
    ].filter((item): item is string => item !== null);

    return {
      slot,
      label,
      itemKey: equipmentItem?.key ?? null,
      itemLabel: equipmentItem?.label ?? null,
      rarity: equipmentItem?.rarity ?? null,
      bonusText: bonusParts.join(", ") || "Nincs aktív tárgy ebben a slotban",
    };
  });
}

function createActivitySnapshots(player: PlayerState): ActivitySnapshot[] {
  const timedActivities: ActivitySnapshot[] = player.timedActions.map((entry: PlayerState["timedActions"][number]) => {
    const label =
      entry.kind === "gathering"
        ? gatheringMap.get(entry.targetKey)?.label
        : entry.kind === "craft"
          ? recipeMap.get(entry.targetKey)?.label
          : buildingMap.get(entry.targetKey)?.label;

    return {
      id: entry.id,
      kind: entry.kind as ActivitySnapshot["kind"],
      targetKey: entry.targetKey,
      label: label ?? entry.targetKey,
      status: "folyamatban",
      startedAt: entry.startedAt.toISOString(),
      endsAt: entry.endsAt.toISOString(),
    };
  });

  const expeditionActivities: ActivitySnapshot[] = player.expeditions.map((entry: PlayerState["expeditions"][number]) => ({
    id: entry.id,
    kind: "expedition",
    targetKey: entry.expeditionKey,
    label: expeditionMap.get(entry.expeditionKey)?.label ?? entry.expeditionKey,
    status: entry.endsAt.getTime() <= Date.now() ? "befejezve" : "folyamatban",
    startedAt: entry.startedAt.toISOString(),
    endsAt: entry.endsAt.toISOString(),
  }));

  return [...timedActivities, ...expeditionActivities].sort(
    (left, right) => new Date(left.endsAt).getTime() - new Date(right.endsAt).getTime(),
  );
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

    const timedActionsChanged = await syncTimedActions(player.id);

    if (timedActionsChanged) {
      player = await loadPlayerState();

      if (!player) {
        throw new Error("A játékos állapot nem tölthető be az eseményszinkron után.");
      }
    }

    const passiveChanged = await syncPassiveProduction(player);

    if (passiveChanged) {
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
      equipmentInventory: true,
      equippedItems: true,
      buildings: true,
      expeditions: {
        where: {
          claimedAt: null,
        },
        orderBy: {
          endsAt: "asc",
        },
      },
      timedActions: {
        where: {
          status: "folyamatban",
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
          equipmentInventory: true,
          equippedItems: true,
          buildings: true,
          expeditions: {
            where: { claimedAt: null },
            orderBy: { endsAt: "asc" },
          },
          timedActions: {
            where: { status: "folyamatban" },
            orderBy: { endsAt: "asc" },
          },
        },
      });
    }

    if (!player) {
      throw new Error("A játékos állapot nem tölthető be a katalógus szinkron után.");
    }

    const timedActionsChanged = await syncTimedActions(player.id);

    if (timedActionsChanged) {
      player = await prisma.player.findUnique({
        where: { id: playerId },
        include: {
          inventory: true,
          equipmentInventory: true,
          equippedItems: true,
          buildings: true,
          expeditions: {
            where: { claimedAt: null },
            orderBy: { endsAt: "asc" },
          },
          timedActions: {
            where: { status: "folyamatban" },
            orderBy: { endsAt: "asc" },
          },
        },
      });
    }

    if (!player) {
      throw new Error("A játékos állapot nem tölthető be az eseményszinkron után.");
    }

    const changed = await syncPassiveProduction(player);

    if (changed) {
      player = await prisma.player.findUnique({
        where: { id: playerId },
        include: {
          inventory: true,
          equipmentInventory: true,
          equippedItems: true,
          buildings: true,
          expeditions: {
            where: { claimedAt: null },
            orderBy: { endsAt: "asc" },
          },
          timedActions: {
            where: { status: "folyamatban" },
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

  const equipmentInventory: EquipmentInventorySnapshot[] = player.equipmentInventory
    .filter((entry) => entry.quantity > 0)
    .map((entry) => ({
      itemKey: entry.itemKey,
      quantity: entry.quantity,
    }))
    .sort((left, right) => right.quantity - left.quantity);

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
    activities: createActivitySnapshots(player),
    resources,
    recipes,
    gatherings,
    buildingCatalog: buildings,
    expeditionsCatalog: expeditions,
    professions: calculateProfessionProgress(player),
    passiveProduction: createPassiveProductionSnapshots(player),
    zones: createZoneSnapshots(player),
    equipment: createEquipmentSnapshots(player),
    equipmentInventory,
    equipmentCatalog: equipmentItems,
  };
}
