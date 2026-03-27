export type ResourceTier = "alap" | "kozepes" | "halado" | "esemeny";
export type RecipeCategory = "fegyver" | "pancel" | "fogyoeszkoz" | "anyag";
export type BuildingCategory = "kitermeles" | "feldolgozas" | "tamogatas";
export type ExpeditionRisk = "alacsony" | "kozepes" | "magas";

export interface ResourceDefinition {
  key: string;
  label: string;
  tier: ResourceTier;
  description: string;
}

export interface RecipeIngredient {
  resourceKey: string;
  amount: number;
}

export interface RecipeDefinition {
  key: string;
  label: string;
  category: RecipeCategory;
  description: string;
  craftSeconds: number;
  requiredLevel: number;
  rewardXp: number;
  produces: RecipeIngredient[];
  ingredients: RecipeIngredient[];
}

export interface BuildingDefinition {
  key: string;
  label: string;
  category: BuildingCategory;
  description: string;
  baseCost: RecipeIngredient[];
  productionBonus: Partial<Record<string, number>>;
}

export interface GatheringDefinition {
  key: string;
  label: string;
  description: string;
  energyCost: number;
  durationSeconds: number;
  rewardXp: number;
  yields: RecipeIngredient[];
}

export interface ExpeditionDefinition {
  key: string;
  label: string;
  description: string;
  durationMinutes: number;
  energyCost: number;
  risk: ExpeditionRisk;
  rewardXp: number;
  guaranteedRewards: RecipeIngredient[];
  bonusRewards: RecipeIngredient[];
}

export interface PlayerSnapshot {
  id: string;
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  energy: number;
  energyMax: number;
  credits: number;
  astralite: number;
}

export interface InventorySnapshot {
  resourceKey: string;
  quantity: number;
}

export interface BuildingSnapshot {
  key: string;
  level: number;
  label: string;
}

export interface ExpeditionSnapshot {
  id: string;
  key: string;
  label: string;
  status: "folyamatban" | "befejezve";
  endsAt: string;
  startedAt: string;
}

export interface GameState {
  player: PlayerSnapshot;
  inventory: InventorySnapshot[];
  buildings: BuildingSnapshot[];
  expeditions: ExpeditionSnapshot[];
  resources: ResourceDefinition[];
  recipes: RecipeDefinition[];
  gatherings: GatheringDefinition[];
  buildingCatalog: BuildingDefinition[];
  expeditionsCatalog: ExpeditionDefinition[];
}
