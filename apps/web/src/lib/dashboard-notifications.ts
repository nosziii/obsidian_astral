import type { ActivitySnapshot, PassiveProductionSnapshot, ZoneSnapshot } from "@obsidian-astral/shared";

type NotificationTone = "primary" | "secondary" | "danger";

export interface DashboardNotification {
  id: string;
  title: string;
  body: string;
  tone: NotificationTone;
  actionLabel: string;
  timestampLabel: string;
}

export function buildDashboardNotifications(input: {
  activities: ActivitySnapshot[];
  zones: ZoneSnapshot[];
  passiveProduction: PassiveProductionSnapshot[];
}): DashboardNotification[] {
  const notifications: DashboardNotification[] = [];

  for (const activity of input.activities.slice(0, 2)) {
    notifications.push({
      id: `activity-${activity.id}`,
      title: `${activity.label} művelet`,
      body:
        activity.status === "befejezve"
          ? "Az időzített művelet lezárult, a következő lépés végrehajtható."
          : "Az időzített művelet aktívan fut, élő állapotkövetéssel.",
      tone: activity.status === "befejezve" ? "primary" : "secondary",
      actionLabel: activity.status === "befejezve" ? "Átvétel" : "Megnyitás",
      timestampLabel: new Date(activity.startedAt).toLocaleTimeString("hu-HU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  }

  const lockedZone = input.zones.find((zone) => zone.status === "hamarosan" || zone.status === "zarolt");
  if (lockedZone) {
    notifications.push({
      id: `zone-${lockedZone.key}`,
      title: `${lockedZone.label} zónajelzés`,
      body: `A zóna státusza: ${lockedZone.status}. További fejlődés szükséges a teljes hozzáféréshez.`,
      tone: lockedZone.status === "zarolt" ? "danger" : "secondary",
      actionLabel: "Zónanézet",
      timestampLabel: "Most",
    });
  }

  const strongestProduction = input.passiveProduction
    .flatMap((entry) => entry.outputs.map((output) => ({ label: output.label, rate: output.amountPerHour, building: entry.label })))
    .sort((left, right) => right.rate - left.rate)[0];

  if (strongestProduction) {
    notifications.push({
      id: `production-${strongestProduction.label}`,
      title: `${strongestProduction.building} termelés`,
      body: `${strongestProduction.label} jelenleg ${strongestProduction.rate}/óra kimenettel fut.`,
      tone: "primary",
      actionLabel: "Bázisnézet",
      timestampLabel: "Passzív",
    });
  }

  return notifications.slice(0, 4);
}
