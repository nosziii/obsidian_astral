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

export interface TeamStatusMember {
  key: string;
  name: string;
  role: string;
  integrity: number;
  energy: number;
  tone: Tone;
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
    { label: "Távolság a célpontig", value: `${distanceLy.toFixed(2)} LY`, tone: "primary" },
    { label: "Aktuális sebesség", value: `${currentSpeed.toFixed(2)} c`, tone: "secondary" },
    { label: "Becsült érkezés", value: missionProgress.arrivalLabel, tone: "danger" },
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
  const signals: ThreatSignal[] = [];

  if (expedition.risk === "magas") {
    signals.push({
      title: "Void Wraith raj",
      detail: "Elit kontakt a futam végszakaszában. Rejtett közelítés és agresszív becsapódás várható.",
      level: "ELIT",
      tone: "danger",
    });
  }

  signals.push(
    {
      title: "Ionvihar",
      detail: `A(z) ${zone?.label ?? "szektor"} területén nagy intenzitású zavarás észlelhető.`,
      level: expedition.risk === "magas" ? "Magas" : "Közepes",
      tone: expedition.risk === "magas" ? "danger" : "primary",
    },
    {
      title: "Semleges hajó",
      detail: "Passzív jel közelíti a kijelölt útvonalat. Jelenleg nincs közvetlen fenyegetés.",
      level: "Nincs fenyegetés",
      tone: "secondary",
    },
    {
      title: "Vészjelzés",
      detail: "Ismeretlen forrásból érkező jel, lehetséges bónuszjutalommal vagy csapdával.",
      level: "2k Cr",
      tone: "secondary",
    },
  );

  return signals;
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
      source: "VANGUARD-01",
      message: `Perem biztosítva. Belépés a(z) ${zone?.label ?? "ismeretlen"} szektor irányába.`,
      tone: "primary",
    },
    {
      timestamp: new Date(startTime.getTime() + expedition.durationMinutes * 20_000).toLocaleTimeString("hu-HU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      source: "Rendszer",
      message: `Kockázati szint: ${expedition.risk}. Jutalomszorzó: x${(zone?.rewardMultiplier ?? 1).toFixed(2)}.`,
      tone: "secondary",
    },
    {
      timestamp: new Date(now).toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" }),
      source: "WRAITH-09",
      message: `${missionProgress.statusLabel}. Előrehaladás: ${missionProgress.progressPercent}%.`,
      tone: run?.status === "befejezve" ? "primary" : expedition.risk === "magas" ? "danger" : "secondary",
    },
  ];
}

export function buildTeamStatus(expedition: ExpeditionDefinition, run: ExpeditionSnapshot | null): TeamStatusMember[] {
  const progress = calculateMissionProgress(run, expedition, Date.now()).progressPercent;
  const wearBase = Math.max(8, Math.round(progress * 0.32));
  const energyBase = Math.max(10, 100 - Math.round(progress * 0.78));

  return [
    {
      key: "vanguard-01",
      name: "VANGUARD-01",
      role: "Assault Specialist",
      integrity: Math.max(52, 96 - wearBase),
      energy: Math.max(18, energyBase - 12),
      tone: "primary",
    },
    {
      key: "kinetic-04",
      name: "KINETIC-04",
      role: "Data Breacher",
      integrity: Math.max(48, 84 - Math.round(wearBase * 1.2)),
      energy: Math.min(98, energyBase + 18),
      tone: "secondary",
    },
    {
      key: "wraith-09",
      name: "WRAITH-09",
      role: "Recon Sniper",
      integrity: Math.max(60, 100 - Math.round(wearBase * 0.6)),
      energy: Math.max(12, energyBase - 36),
      tone: "danger",
    },
  ];
}
