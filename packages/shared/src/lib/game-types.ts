export type ResourceTier = "alap" | "kozepes" | "halado" | "esemeny";
export type RecipeCategory = "fegyver" | "pancel" | "fogyoeszkoz" | "anyag";
export type BuildingCategory = "kitermeles" | "feldolgozas" | "tamogatas";
export type ExpeditionRisk = "alacsony" | "kozepes" | "magas";
export type UserRole = "jatekos" | "admin";
export type ActivityKind = "gathering" | "craft" | "building" | "expedition";
export type ActivityStatus = "folyamatban" | "befejezve";
export type ChatChannel = "global" | "workshop";
export type NotificationTone = "primary" | "secondary" | "danger";
export type NotificationKind = "rendszer" | "gazdasag" | "expedicio" | "admin";
export type NotificationFilterValue = "osszes" | NotificationKind;
export type ProfessionKey =
  | "favagas"
  | "banyaszat"
  | "vadaszat"
  | "alkimia"
  | "mernokseg"
  | "kereskedelem"
  | "felderites";
export type ZoneStatus = "elerheto" | "hamarosan" | "zarolt";
export type EquipmentSlotKey =
  | "fofegyver"
  | "mellekfegyver"
  | "sisak"
  | "pancel"
  | "kesztyu"
  | "csizma"
  | "relikvia";
export type EquipmentItemCategory = "fegyver" | "pancel" | "kiegeszito";

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
  zoneKey: string;
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

export interface EquipmentStatLine {
  tamadas?: number;
  vedelem?: number;
  kritikus?: number;
  gyujtesiSebesseg?: number;
  craftBonus?: number;
  energiaRegeneralas?: number;
}

export interface EquipmentItemDefinition {
  key: string;
  label: string;
  description: string;
  slot: EquipmentSlotKey;
  category: EquipmentItemCategory;
  rarity: "gyakori" | "ritka" | "epikus";
  requiredLevel: number;
  statLine: EquipmentStatLine;
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

export interface EquipmentInventorySnapshot {
  itemKey: string;
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
  status: ActivityStatus;
  endsAt: string;
  startedAt: string;
}

export interface ExpeditionHistorySnapshot {
  id: string;
  key: string;
  label: string;
  claimedAt: string | null;
  startedAt: string;
  endedAt: string;
  rewards: RecipeIngredient[];
}

export interface ActivitySnapshot {
  id: string;
  kind: ActivityKind;
  targetKey: string;
  label: string;
  status: ActivityStatus;
  startedAt: string;
  endsAt: string;
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
  rewardMultiplier: number;
  status: ZoneStatus;
}

export interface ChatMessageSnapshot {
  id: string;
  channel: ChatChannel;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface NotificationSnapshot {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  tone: NotificationTone;
  actionLabel: string;
  createdAt: string;
  readAt: string | null;
}

export interface NotificationListInput {
  kind?: NotificationFilterValue;
  unreadOnly?: boolean;
}

export interface AdminAuditLogSnapshot {
  id: string;
  actorName: string;
  targetName: string;
  actionKind: string;
  summary: string;
  createdAt: string;
}

export interface GameState {
  player: PlayerSnapshot;
  inventory: InventorySnapshot[];
  buildings: BuildingSnapshot[];
  expeditions: ExpeditionSnapshot[];
  activities: ActivitySnapshot[];
  resources: ResourceDefinition[];
  recipes: RecipeDefinition[];
  gatherings: GatheringDefinition[];
  buildingCatalog: BuildingDefinition[];
  expeditionsCatalog: ExpeditionDefinition[];
  professions: ProfessionSnapshot[];
  passiveProduction: PassiveProductionSnapshot[];
  zones: ZoneSnapshot[];
  equipment: EquipmentSnapshot[];
  equipmentInventory: EquipmentInventorySnapshot[];
  equipmentCatalog: EquipmentItemDefinition[];
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
  isSuspended: boolean;
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

export interface AdminPlayerDetail {
  player: AdminPlayerSummary & {
    bio: string;
    fleet: string;
    energy: number;
    energyMax: number;
  };
  inventory: InventorySnapshot[];
  buildings: AdminBuildingDetail[];
  activities: ActivitySnapshot[];
  auditLogs: AdminAuditLogSnapshot[];
}

export interface AdminPlayerUpdateInput {
  level?: number;
  energy?: number;
  energyMax?: number;
  credits?: number;
  astralite?: number;
  role?: UserRole;
  isSuspended?: boolean;
}

export interface AdminInventoryMutationInput {
  resourceKey: string;
  amount: number;
  mode: "add" | "remove";
}

export interface AdminBuildingDetail extends BuildingSnapshot {
  category: BuildingCategory;
  description: string;
  requiredLevel: number;
  passiveProduction: RecipeIngredient[];
}

export interface AdminBuildingMutationInput {
  buildingKey: string;
  level: number;
}

export interface EquipmentSnapshot {
  slot: EquipmentSlotKey;
  label: string;
  itemKey: string | null;
  itemLabel: string | null;
  rarity: EquipmentItemDefinition["rarity"] | null;
  bonusText: string;
}

export interface AdminActionResult {
  message: string;
}
