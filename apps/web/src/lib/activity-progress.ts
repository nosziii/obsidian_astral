import type { ActivitySnapshot } from "@obsidian-astral/shared";

export function calculateActivityProgress(activity: ActivitySnapshot, now: number) {
  const start = new Date(activity.startedAt).getTime();
  const end = new Date(activity.endsAt).getTime();
  const total = Math.max(1, end - start);
  const elapsed = Math.min(total, Math.max(0, now - start));

  return Math.round((elapsed / total) * 100);
}

export function calculateRemainingSeconds(activity: ActivitySnapshot, now: number) {
  const end = new Date(activity.endsAt).getTime();
  return Math.max(0, Math.ceil((end - now) / 1_000));
}

export function formatRemainingSeconds(seconds: number) {
  if (seconds <= 0) {
    return "Befejezve";
  }

  const hours = Math.floor(seconds / 3_600);
  const minutes = Math.floor((seconds % 3_600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}
