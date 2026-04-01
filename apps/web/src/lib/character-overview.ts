import type {
  EquipmentInventorySnapshot,
  EquipmentItemDefinition,
  EquipmentSnapshot,
  GameState,
  ZoneSnapshot,
} from "@obsidian-astral/shared";

import { formatCategoryLabel, formatEquipmentSlotLabel } from "./formatters";

export interface CharacterInventoryEntry extends EquipmentInventorySnapshot {
  definition: EquipmentItemDefinition | null;
  isEquipped: boolean;
}

export interface CharacterStatCard {
  label: string;
  value: string;
  icon: string;
  tone: "primary" | "secondary" | "tertiary" | "danger";
}

export interface ProfileSignalCard {
  label: string;
  value: string;
  hint: string;
}

const slotIcons: Record<string, string> = {
  fofegyver: "swords",
  mellekfegyver: "deployed_code",
  sisak: "shield",
  pancel: "apparel",
  kesztyu: "front_hand",
  csizma: "footprint",
  relikvia: "diamond",
};

const rarityTones: Record<string, "primary" | "secondary" | "tertiary" | "neutral"> = {
  gyakori: "neutral",
  ritka: "primary",
  epikus: "secondary",
};

export function getEquipmentSlotIcon(slotKey: string) {
  return slotIcons[slotKey] ?? "deployed_code";
}

export function getEquipmentTone(rarity: string | null | undefined) {
  return rarity ? rarityTones[rarity] ?? "neutral" : "neutral";
}

export function buildCharacterInventory(gameState: GameState | null): CharacterInventoryEntry[] {
  if (!gameState) {
    return [];
  }

  const equippedItems = new Set(gameState.equipment.map((slot) => slot.itemKey).filter(Boolean));

  return gameState.equipmentInventory
    .map((entry) => ({
      ...entry,
      definition: gameState.equipmentCatalog.find((item) => item.key === entry.itemKey) ?? null,
      isEquipped: equippedItems.has(entry.itemKey),
    }))
    .sort((left, right) => {
      const rarityRank = (value: string | null | undefined) => {
        if (value === "epikus") {
          return 3;
        }

        if (value === "ritka") {
          return 2;
        }

        return 1;
      };

      return rarityRank(right.definition?.rarity) - rarityRank(left.definition?.rarity) || right.quantity - left.quantity;
    });
}

export function buildCharacterStats(gameState: GameState | null): CharacterStatCard[] {
  if (!gameState) {
    return [];
  }

  const statLine = gameState.equipment.reduce(
    (aggregate, slot) => {
      const definition = gameState.equipmentCatalog.find((item) => item.key === slot.itemKey);

      if (!definition) {
        return aggregate;
      }

      aggregate.tamadas += definition.statLine.tamadas ?? 0;
      aggregate.vedelem += definition.statLine.vedelem ?? 0;
      aggregate.kritikus += definition.statLine.kritikus ?? 0;
      aggregate.gyujtesiSebesseg += definition.statLine.gyujtesiSebesseg ?? 0;
      aggregate.craftBonus += definition.statLine.craftBonus ?? 0;
      aggregate.energiaRegeneralas += definition.statLine.energiaRegeneralas ?? 0;
      return aggregate;
    },
    {
      tamadas: 0,
      vedelem: 0,
      kritikus: 0,
      gyujtesiSebesseg: 0,
      craftBonus: 0,
      energiaRegeneralas: 0,
    },
  );

  return [
    { label: "Támadás", value: statLine.tamadas.toString(), icon: "bolt", tone: "primary" },
    { label: "Védelem", value: statLine.vedelem.toString(), icon: "shield", tone: "secondary" },
    { label: "Kritikus", value: `${statLine.kritikus}%`, icon: "flare", tone: "tertiary" },
    { label: "Gyűjtés", value: `${statLine.gyujtesiSebesseg}%`, icon: "diamond", tone: "primary" },
    { label: "Craft", value: `${statLine.craftBonus}%`, icon: "construction", tone: "secondary" },
    { label: "Regen", value: `${statLine.energiaRegeneralas}%`, icon: "autorenew", tone: "danger" },
  ];
}

export function formatEquipmentBonus(definition: EquipmentItemDefinition | null) {
  if (!definition) {
    return "Válassz egy felszerelést a részletes taktikai bontáshoz.";
  }

  const parts = [
    definition.statLine.tamadas ? `+${definition.statLine.tamadas} támadás` : null,
    definition.statLine.vedelem ? `+${definition.statLine.vedelem} védelem` : null,
    definition.statLine.kritikus ? `+${definition.statLine.kritikus}% kritikus` : null,
    definition.statLine.gyujtesiSebesseg ? `+${definition.statLine.gyujtesiSebesseg}% gyűjtés` : null,
    definition.statLine.craftBonus ? `+${definition.statLine.craftBonus}% craft` : null,
    definition.statLine.energiaRegeneralas ? `+${definition.statLine.energiaRegeneralas}% energia regen` : null,
  ].filter(Boolean);

  return parts.length ? parts.join(" • ") : "Passzív taktikai finomhangolás.";
}

export function buildProfileSignals(gameState: GameState | null, zones: ZoneSnapshot[] = []): ProfileSignalCard[] {
  if (!gameState) {
    return [];
  }

  const activeBuildings = gameState.buildings.filter((building) => building.level > 0).length;
  const unlockedZones = zones.filter((zone) => zone.status === "elerheto").length;
  const activeProfessions = gameState.professions.filter((profession) => profession.level > 1).length;

  return [
    { label: "Parancsnoki szint", value: gameState.player.level.toString(), hint: `${gameState.player.xp}/${gameState.player.xpToNextLevel} XP` },
    { label: "Aktív szakmák", value: activeProfessions.toString(), hint: "specializált működési ág" },
    { label: "Kibontott zónák", value: unlockedZones.toString(), hint: "elérhető szektor" },
    { label: "Bázismodulok", value: activeBuildings.toString(), hint: "üzemelő fejlesztés" },
  ];
}

export function buildProfileStrands(gameState: GameState | null) {
  if (!gameState) {
    return [];
  }

  const professionStrands = gameState.professions
    .slice()
    .sort((left, right) => right.level - left.level)
    .slice(0, 3)
    .map((profession) => ({
      key: `profession:${profession.key}`,
      label: profession.label,
      detail: `${profession.level}. szint • ${profession.focus}`,
    }));

  const buildingStrands = gameState.buildings
    .filter((building) => building.level > 0)
    .slice(0, 3)
    .map((building) => ({
      key: `building:${building.key}`,
      label: building.label,
      detail: `${building.level}. szintű modul`,
    }));

  return [...professionStrands, ...buildingStrands];
}

export function buildZoneMetrics(gameState: GameState | null) {
  if (!gameState) {
    return [];
  }

  const accessibleZones = gameState.zones.filter((zone) => zone.status === "elerheto").length;
  const highRiskZones = gameState.zones.filter((zone) => zone.risk === "magas").length;

  return [
    { label: "Felderítés", value: `${Math.round((accessibleZones / Math.max(gameState.zones.length, 1)) * 100)}%` },
    { label: "Kockázat", value: highRiskZones ? `${highRiskZones} magas` : "stabil" },
  ];
}

export function buildZoneNodeLayout(zones: ZoneSnapshot[]) {
  const positions = [
    { top: "18%", left: "26%" },
    { top: "46%", left: "54%" },
    { top: "22%", left: "68%" },
    { top: "68%", left: "24%" },
    { top: "72%", left: "74%" },
    { top: "34%", left: "40%" },
  ];

  return zones.map((zone, index) => ({
    zone,
    position: positions[index % positions.length],
    icon: zone.risk === "magas" ? "local_fire_department" : zone.rewardMultiplier >= 1.4 ? "diamond" : "landscape",
    label: formatCategoryLabel(zone.status),
  }));
}

export function formatEquipmentDetailMeta(loadoutSlot: EquipmentSnapshot | null, definition: EquipmentItemDefinition | null) {
  if (!loadoutSlot || !definition) {
    return null;
  }

  return `${formatEquipmentSlotLabel(loadoutSlot.slot)} • ${formatCategoryLabel(definition.category)} • ${formatCategoryLabel(definition.rarity)}`;
}
