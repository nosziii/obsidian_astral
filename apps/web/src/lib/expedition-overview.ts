import type {
  ExpeditionDefinition,
  ExpeditionHistorySnapshot,
  ExpeditionSnapshot,
  ResourceDefinition,
  ZoneSnapshot,
} from "@obsidian-astral/shared";

type Tone = "primary" | "secondary" | "danger";

export interface MissionMetric {
  label: string;
  value: string;
  tone: Tone;
}

export interface ThreatSignal {
  title: string;
  detail: string;
  level: string;
  tone: Tone;
}

export interface CommEntry {
  timestamp: string;
  source: string;
  message: string;
  tone: Tone;
}

export interface RewardPreviewItem {
  key: string;
  label: string;
  amount: number;
  category: string;
}

export function calculateMissionProgress(run: ExpeditionSnapshot | null, expedition: ExpeditionDefinition, now: number) {
  if (!run) {
    return {
      progressPercent: 0,
      arrivalLabel: `${expedition.durationMinutes} perc`,
      statusLabel: "Készen áll",
    };
  }

  const start = new Date(run.startedAt).getTime();
  const end = new Date(run.endsAt).getTime();
  const total = Math.max(1, end - start);
  const elapsed = Math.min(total, Math.max(0, now - start));
  const remainingMs = Math.max(0, end - now);
  const remainingMinutes = Math.ceil(remainingMs / 60_000);

  return {
    progressPercent: Math.round((elapsed / total) * 100),
    arrivalLabel: remainingMinutes > 0 ? `${remainingMinutes} perc` : "Megérkezett",
    statusLabel: run.status === "befejezve" ? "Jutalom átvehető" : "Művelet folyamatban",
  };
}

export function buildMissionMetrics(
  expedition: ExpeditionDefinition,
  zone: ZoneSnapshot | null,
  run: ExpeditionSnapshot | null,
  now: number,
): MissionMetric[] {
  const missionProgress = calculateMissionProgress(run, expedition, now);
  const distanceLy = (expedition.durationMinutes * (zone?.rewardMultiplier ?? 1)) / 3.2;
  const currentSpeed = Math.max(0.42, 1.08 - expedition.energyCost / 100);

  return [
    { label: "Hátralévő út", value: `${distanceLy.toFixed(2)} LY`, tone: "primary" },
    { label: "Aktuális sebesség", value: `${currentSpeed.toFixed(2)} c`, tone: "secondary" },
    { label: "Érkezés", value: missionProgress.arrivalLabel, tone: "danger" },
  ];
}

export function buildRewardPreview(
  expedition: ExpeditionDefinition,
  resources: ResourceDefinition[],
  zone: ZoneSnapshot | null,
  historyEntry: ExpeditionHistorySnapshot | null,
): RewardPreviewItem[] {
  if (historyEntry) {
    return historyEntry.rewards.map((reward) => ({
      key: `${historyEntry.id}-${reward.resourceKey}`,
      label: resources.find((item) => item.key === reward.resourceKey)?.label ?? reward.resourceKey,
      amount: reward.amount,
      category: "Naplózott jutalom",
    }));
  }

  const multiplier = zone?.rewardMultiplier ?? 1;
  const guaranteed = expedition.guaranteedRewards.map((reward) => ({
    key: `${expedition.key}-${reward.resourceKey}-guaranteed`,
    label: resources.find((item) => item.key === reward.resourceKey)?.label ?? reward.resourceKey,
    amount: Math.max(1, Math.round(reward.amount * multiplier)),
    category: "Biztos jutalom",
  }));
  const bonus = expedition.bonusRewards.map((reward) => ({
    key: `${expedition.key}-${reward.resourceKey}-bonus`,
    label: resources.find((item) => item.key === reward.resourceKey)?.label ?? reward.resourceKey,
    amount: Math.max(1, Math.round(reward.amount * multiplier)),
    category: "Bónusz esély",
  }));

  return [...guaranteed, ...bonus];
}

export function buildThreatSignals(expedition: ExpeditionDefinition, zone: ZoneSnapshot | null): ThreatSignal[] {
  const common: ThreatSignal[] = [
    {
      title: "Zóna stabilitás",
      detail: zone ? `${zone.label} térsége ${zone.status} állapotban van.` : "Nincs kiválasztott zóna.",
      level: zone?.risk ?? "alacsony",
      tone: zone?.risk === "magas" ? "danger" : zone?.risk === "kozepes" ? "secondary" : "primary",
    },
    {
      title: "Energiaigény",
      detail: `${expedition.energyCost} energia szükséges a teljes futamhoz.`,
      level: expedition.energyCost > 20 ? "magas" : expedition.energyCost > 12 ? "közepes" : "alacsony",
      tone: expedition.energyCost > 20 ? "danger" : expedition.energyCost > 12 ? "secondary" : "primary",
    },
  ];

  if (expedition.risk === "magas") {
    common.push({
      title: "Fenyegetési radar",
      detail: "Az érzékelők elit kontaktot és instabil környezeti zónákat jeleznek.",
      level: "kritikus",
      tone: "danger",
    });
  } else if (expedition.risk === "kozepes") {
    common.push({
      title: "Fenyegetési radar",
      detail: "Mozgó kontaktok és közepes intenzitású zavarás várható.",
      level: "emelt",
      tone: "secondary",
    });
  } else {
    common.push({
      title: "Fenyegetési radar",
      detail: "Alacsony fenyegetettségű pálya, gyors kitermelési ablakokkal.",
      level: "stabil",
      tone: "primary",
    });
  }

  return common;
}

export function buildCommEntries(
  expedition: ExpeditionDefinition,
  zone: ZoneSnapshot | null,
  run: ExpeditionSnapshot | null,
  now: number,
): CommEntry[] {
  const missionProgress = calculateMissionProgress(run, expedition, now);
  const startTime = run ? new Date(run.startedAt) : new Date(now);

  return [
    {
      timestamp: startTime.toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" }),
      source: "Parancs",
      message: `${expedition.label} indításra kijelölve a(z) ${zone?.label ?? "ismeretlen"} zónába.`,
      tone: "primary",
    },
    {
      timestamp: new Date(startTime.getTime() + expedition.durationMinutes * 20_000).toLocaleTimeString("hu-HU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      source: "Szenzorháló",
      message: `Kockázati szint: ${expedition.risk}. Jutalomszorzó: x${(zone?.rewardMultiplier ?? 1).toFixed(2)}.`,
      tone: "secondary",
    },
    {
      timestamp: new Date(now).toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" }),
      source: "Taktikai mag",
      message: `${missionProgress.statusLabel}. Előrehaladás: ${missionProgress.progressPercent}%.`,
      tone: run?.status === "befejezve" ? "primary" : expedition.risk === "magas" ? "danger" : "secondary",
    },
  ];
}
