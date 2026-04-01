import type { EquipmentItemDefinition, GameState, ResourceDefinition } from "@obsidian-astral/shared";

export type MarketplaceMode = "buy" | "sell";
export type MarketplaceCategory = "all" | "weapons" | "materials" | "relics";
export type MarketplaceRarity = "all" | "common" | "rare" | "epic";

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  sellerName: string;
  sellerAvatarUrl: string;
  quantity: number;
  price: number;
  currency: "credits" | "astralite";
  rarity: Exclude<MarketplaceRarity, "all">;
  category: Exclude<MarketplaceCategory, "all">;
  timeLeftLabel: string;
  buyoutOnly: boolean;
  verifiedSeller: boolean;
  icon: string;
}

export interface MarketplaceSellCard {
  id: string;
  title: string;
  description: string;
  quantity: number;
  source: "inventory" | "equipment";
  icon: string;
  suggestedPrice: number;
}

export interface MarketplaceTrend {
  label: string;
  tone: "primary" | "secondary" | "tertiary";
}

const marketplaceSellers = [
  { name: "VoidWalker_77", avatarUrl: "/marketplace/void-walker-77.png", verified: true },
  { name: "GhostInShell", avatarUrl: "/marketplace/ghost-in-shell.png", verified: true },
  { name: "ScrapMerchant_X", avatarUrl: "/marketplace/scrap-merchant-x.png", verified: false },
  { name: "AlchemistPrime", avatarUrl: "/marketplace/alchemist-prime.png", verified: true },
  { name: "TankMain_01", avatarUrl: "/marketplace/tank-main-01.png", verified: false },
  { name: "Overlord_Z", avatarUrl: "/marketplace/overlord-z.png", verified: true },
];

const resourceIconMap: Record<string, string> = {
  fa: "forest",
  ko: "landscape",
  vaserc: "construction",
  viz: "water_drop",
  elelem: "lunch_dining",
  textil: "styler",
  rez: "cable",
  szen: "local_fire_department",
  kristaly: "diamond",
  gyogynoveny: "psychiatry",
  bor: "shield",
  ezusterc: "radio_button_checked",
  vegyi_anyag: "experiment",
  obszidian: "flare",
  energiamag: "bolt",
  titan: "precision_manufacturing",
  eterkristaly: "auto_awesome",
  vasrud: "hardware",
  deszka: "view_in_ar",
  alapkivonat: "science",
  energiacella: "battery_charging_full",
  finomitott_fem: "token",
  megerositett_szovet: "layers",
};

const equipmentIconMap: Record<EquipmentItemDefinition["category"], string> = {
  fegyver: "swords",
  pancel: "shield",
  kiegeszito: "auto_awesome",
};

export function buildMarketplaceListings(gameState: GameState): MarketplaceListing[] {
  const resourceListings = gameState.resources.slice(0, 6).map((resource, index) =>
    createResourceListing(resource, index),
  );
  const equipmentListings = gameState.equipmentCatalog.map((item, index) =>
    createEquipmentListing(item, index + resourceListings.length),
  );

  return [...equipmentListings, ...resourceListings];
}

export function buildMarketplaceSellCards(gameState: GameState): MarketplaceSellCard[] {
  const resourceCards = gameState.inventory
    .filter((item) => item.quantity > 0)
    .slice(0, 6)
    .map((item) => {
      const resource = gameState.resources.find((entry) => entry.key === item.resourceKey);

      return {
        id: `resource:${item.resourceKey}`,
        title: resource?.label ?? item.resourceKey,
        description: resource?.description ?? "Kereskedelmi készlet.",
        quantity: item.quantity,
        source: "inventory" as const,
        icon: resource ? getResourceIcon(resource.key) : "inventory_2",
        suggestedPrice: item.quantity * getResourceUnitPrice(item.resourceKey),
      };
    });

  const equipmentCards = gameState.equipmentInventory
    .filter((item) => item.quantity > 0)
    .map((item) => {
      const equipment = gameState.equipmentCatalog.find((entry) => entry.key === item.itemKey);

      return {
        id: `equipment:${item.itemKey}`,
        title: equipment?.label ?? item.itemKey,
        description: equipment?.description ?? "Kereskedelmi tárgy.",
        quantity: item.quantity,
        source: "equipment" as const,
        icon: equipment ? equipmentIconMap[equipment.category] : "inventory_2",
        suggestedPrice: (equipment?.requiredLevel ?? 1) * 2_200,
      };
    });

  return [...equipmentCards, ...resourceCards];
}

export function buildMarketplaceTrends(listings: MarketplaceListing[]): MarketplaceTrend[] {
  return listings.slice(0, 3).map((listing, index) => ({
    label: listing.title,
    tone: index === 0 ? "primary" : index === 1 ? "secondary" : "tertiary",
  }));
}

export function filterMarketplaceListings(
  listings: MarketplaceListing[],
  input: {
    category: MarketplaceCategory;
    query: string;
    rarity: MarketplaceRarity;
    buyoutOnly: boolean;
    verifiedOnly: boolean;
  },
) {
  const normalizedQuery = input.query.trim().toLowerCase();

  return listings.filter((listing) => {
    const matchesCategory = input.category === "all" || listing.category === input.category;
    const matchesRarity = input.rarity === "all" || listing.rarity === input.rarity;
    const matchesBuyout = !input.buyoutOnly || listing.buyoutOnly;
    const matchesVerified = !input.verifiedOnly || listing.verifiedSeller;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      `${listing.title} ${listing.description} ${listing.sellerName}`.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesRarity && matchesBuyout && matchesVerified && matchesQuery;
  });
}

function createResourceListing(resource: ResourceDefinition, index: number): MarketplaceListing {
  const seller = marketplaceSellers[index % marketplaceSellers.length];
  const price = getResourceUnitPrice(resource.key);
  const rarity = getResourceRarity(resource.tier);

  return {
    id: `resource:${resource.key}`,
    title: resource.label,
    description: resource.description,
    sellerName: seller.name,
    sellerAvatarUrl: seller.avatarUrl,
    quantity: 30 + index * 20,
    price,
    currency: "credits",
    rarity,
    category: resource.key === "obszidian" || resource.key === "eterkristaly" ? "relics" : "materials",
    timeLeftLabel: `${(index + 1).toString().padStart(2, "0")}h ${(12 + index * 3).toString().padStart(2, "0")}m`,
    buyoutOnly: index % 2 === 0,
    verifiedSeller: seller.verified,
    icon: getResourceIcon(resource.key),
  };
}

function createEquipmentListing(item: EquipmentItemDefinition, index: number): MarketplaceListing {
  const seller = marketplaceSellers[index % marketplaceSellers.length];

  return {
    id: `equipment:${item.key}`,
    title: item.label,
    description: item.description,
    sellerName: seller.name,
    sellerAvatarUrl: seller.avatarUrl,
    quantity: 1,
    price: item.requiredLevel * (item.rarity === "epikus" ? 250 : item.rarity === "ritka" ? 90 : 45),
    currency: item.rarity === "epikus" ? "astralite" : "credits",
    rarity: mapEquipmentRarity(item.rarity),
    category: item.slot === "relikvia" ? "relics" : "weapons",
    timeLeftLabel: `${(index + 2).toString().padStart(2, "0")}h ${(8 + index * 2).toString().padStart(2, "0")}m`,
    buyoutOnly: item.rarity !== "epikus",
    verifiedSeller: seller.verified,
    icon: equipmentIconMap[item.category],
  };
}

function mapEquipmentRarity(rarity: EquipmentItemDefinition["rarity"]): Exclude<MarketplaceRarity, "all"> {
  if (rarity === "epikus") {
    return "epic";
  }

  if (rarity === "ritka") {
    return "rare";
  }

  return "common";
}

function getResourceRarity(tier: ResourceDefinition["tier"]): Exclude<MarketplaceRarity, "all"> {
  if (tier === "halado") {
    return "epic";
  }

  if (tier === "kozepes") {
    return "rare";
  }

  return "common";
}

function getResourceUnitPrice(resourceKey: string) {
  const priceMap: Record<string, number> = {
    obszidian: 2_400,
    eterkristaly: 1_900,
    energiamag: 1_250,
    kristaly: 860,
    ezusterc: 540,
    vaserc: 210,
    fa: 90,
    ko: 75,
  };

  return priceMap[resourceKey] ?? 140;
}

function getResourceIcon(resourceKey: string) {
  return resourceIconMap[resourceKey] ?? "deployed_code";
}
