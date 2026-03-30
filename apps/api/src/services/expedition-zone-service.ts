import { zones } from "@obsidian-astral/shared";

export function getZoneRewardMultiplier(zoneKey: string) {
  return zones.find((zone) => zone.key === zoneKey)?.rewardMultiplier ?? 1;
}
