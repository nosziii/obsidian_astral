import type { Player } from "@prisma/client";
import { buildings, equipmentItems, equipmentSlotLabels, resources } from "@obsidian-astral/shared";

import { prisma } from "../db.js";

const starterInventory: Record<string, number> = {
  fa: 120,
  ko: 90,
  vaserc: 70,
  viz: 80,
  elelem: 65,
  textil: 30,
  rez: 35,
  szen: 24,
  kristaly: 16,
  gyogynoveny: 18,
  bor: 10,
  ezusterc: 8,
  vegyi_anyag: 6,
};

const starterEquipmentInventory: Record<string, number> = {
  obszidian_penge_proto: 1,
  rez_oldalfegyver: 1,
  felderito_sisak: 1,
  megerositett_mellvert: 1,
};

export async function bootstrapPlayerState(player: Player) {
  await prisma.inventoryEntry.createMany({
    data: resources.map((resource) => ({
      playerId: player.id,
      resourceKey: resource.key,
      quantity: starterInventory[resource.key] ?? 0,
    })),
    skipDuplicates: true,
  });

  await prisma.buildingState.createMany({
    data: buildings.map((building) => ({
      playerId: player.id,
      buildingKey: building.key,
      level: 1,
    })),
    skipDuplicates: true,
  });

  await prisma.equipmentInventoryEntry.createMany({
    data: equipmentItems.map((item) => ({
      playerId: player.id,
      itemKey: item.key,
      quantity: starterEquipmentInventory[item.key] ?? 0,
    })),
    skipDuplicates: true,
  });

  await prisma.equippedItem.createMany({
    data: Object.keys(equipmentSlotLabels).map((slot) => ({
      playerId: player.id,
      slot,
      itemKey: null,
    })),
    skipDuplicates: true,
  });
}
