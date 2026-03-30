import type { EquipmentSlotKey } from "@obsidian-astral/shared";
import { equipmentSlotLabels } from "@obsidian-astral/shared";

import { prisma } from "../db.js";
import { equipmentItemMap } from "../lib/catalog.js";
import { GameRuleError } from "../lib/errors.js";

async function ensureOwnedItem(playerId: string, itemKey: string) {
  const inventoryEntry = await prisma.equipmentInventoryEntry.findUnique({
    where: {
      playerId_itemKey: {
        playerId,
        itemKey,
      },
    },
  });

  if (!inventoryEntry || inventoryEntry.quantity <= 0) {
    throw new GameRuleError("Ez a tárgy nem érhető el a felszereléskészletben.");
  }
}

async function clearDuplicateSlots(playerId: string, itemKey: string, slot: EquipmentSlotKey) {
  await prisma.equippedItem.updateMany({
    where: {
      playerId,
      itemKey,
      slot: {
        not: slot,
      },
    },
    data: {
      itemKey: null,
    },
  });
}

export async function equipItem(playerId: string, slot: EquipmentSlotKey, itemKey: string | null) {
  if (!(slot in equipmentSlotLabels)) {
    throw new GameRuleError("Ismeretlen felszerelési slot.");
  }

  if (itemKey === null) {
    await prisma.equippedItem.upsert({
      where: {
        playerId_slot: {
          playerId,
          slot,
        },
      },
      create: {
        playerId,
        slot,
        itemKey: null,
      },
      update: {
        itemKey: null,
      },
    });

    return;
  }

  const itemDefinition = equipmentItemMap.get(itemKey);

  if (!itemDefinition) {
    throw new GameRuleError("Ismeretlen felszerelési tárgy.");
  }

  if (itemDefinition.slot !== slot) {
    throw new GameRuleError("A tárgy nem ebbe a slotba szerelhető.");
  }

  const player = await prisma.player.findUniqueOrThrow({
    where: { id: playerId },
    select: { level: true },
  });

  if (player.level < itemDefinition.requiredLevel) {
    throw new GameRuleError("A tárgy használatához magasabb szint szükséges.");
  }

  await ensureOwnedItem(playerId, itemKey);
  await clearDuplicateSlots(playerId, itemKey, slot);

  await prisma.equippedItem.upsert({
    where: {
      playerId_slot: {
        playerId,
        slot,
      },
    },
    create: {
      playerId,
      slot,
      itemKey,
    },
    update: {
      itemKey,
    },
  });
}
