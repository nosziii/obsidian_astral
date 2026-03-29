export type ResourceTier = "alap" | "kozepes" | "halado" | "esemeny";
export type RecipeCategory = "fegyver" | "pancel" | "fogyoeszkoz" | "anyag";
export type BuildingCategory = "kitermeles" | "feldolgozas" | "tamogatas";
export type ExpeditionRisk = "alacsony" | "kozepes" | "magas";
export type UserRole = "jatekos" | "admin";
export type ProfessionKey =
  | "favagas"
  | "banyaszat"
  | "vadaszat"
  | "alkimia"
  | "mernokseg"
  | "kereskedelem"
  | "felderites";
export type ZoneStatus = "elérhető" | "hamarosan" | "zárolt";

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
  station: string;
}

export interface BuildingDefinition {
  key: string;
  label: string;
  category: BuildingCategory;
  description: string;
  requiredLevel: number;
  baseCost: RecipeIngredient[];
  productionBonus: Partial<Record<string, number>>;
  passiveProduction: RecipeIngredient[];
}

export interface GatheringDefinition {
  key: string;
  label: string;
  description: string;
  energyCost: number;
  durationSeconds: number;
  rewardXp: number;
  requiredLevel: number;
  profession: ProfessionKey;
  yields: RecipeIngredient[];
}

export interface ExpeditionDefinition {
  key: string;
  label: string;
  description: string;
  durationMinutes: number;
  energyCost: number;
  requiredLevel: number;
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

export interface ProfessionSnapshot {
  key: ProfessionKey;
  label: string;
  level: number;
  focus: string;
  progressPercent: number;
}

export interface PassiveProductionSnapshot {
  buildingKey: string;
  label: string;
  level: number;
  outputs: Array<RecipeIngredient & { label: string; amountPerHour: number }>;
}

export interface ZoneSnapshot {
  key: string;
  label: string;
  description: string;
  recommendedLevel: number;
  risk: ExpeditionRisk;
  status: ZoneStatus;
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
  professions: ProfessionSnapshot[];
  passiveProduction: PassiveProductionSnapshot[];
  zones: ZoneSnapshot[];
}

export interface SessionPlayer {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  level: number;
  bio: string;
  fleet: string;
}

export interface AuthSession {
  token: string;
  player: SessionPlayer;
}

export interface AdminPlayerSummary {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  level: number;
  credits: number;
  astralite: number;
  createdAt: string;
}

export interface AdminOverview {
  totalPlayers: number;
  activeExpeditions: number;
  totalCredits: number;
  totalAstralite: number;
  averageLevel: number;
  newestPlayers: AdminPlayerSummary[];
}
