import type { GameState } from "@obsidian-astral/shared";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...init,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? "A kérés sikertelen volt.");
  }

  return response.json() as Promise<T>;
}

export const gameApi = {
  getState: () => request<GameState>("/api/game-state"),
  gather: (actionKey: string) =>
    request<GameState>("/api/actions/gather", {
      method: "POST",
      body: JSON.stringify({ actionKey }),
    }),
  craft: (recipeKey: string) =>
    request<GameState>("/api/actions/craft", {
      method: "POST",
      body: JSON.stringify({ recipeKey }),
    }),
  upgradeBuilding: (buildingKey: string) =>
    request<GameState>("/api/actions/buildings/upgrade", {
      method: "POST",
      body: JSON.stringify({ buildingKey }),
    }),
  startExpedition: (expeditionKey: string) =>
    request<GameState>("/api/actions/expeditions/start", {
      method: "POST",
      body: JSON.stringify({ expeditionKey }),
    }),
  claimExpedition: (expeditionId: string) =>
    request<GameState>("/api/actions/expeditions/claim", {
      method: "POST",
      body: JSON.stringify({ expeditionId }),
    }),
};
