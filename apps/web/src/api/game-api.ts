import type {
  AdminActionResult,
  AdminOverview,
  AdminPlayerDetail,
  AuthSession,
  ChatChannel,
  ChatMessageSnapshot,
  GameState,
  SessionPlayer,
} from "@obsidian-astral/shared";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

let authToken: string | null = null;

export function setApiAuthToken(token: string | null) {
  authToken = token;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");

  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? "A kérés sikertelen volt.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const gameApi = {
  getState: () => request<GameState>("/api/game-state"),
  listChatMessages: (channel: ChatChannel) =>
    request<ChatMessageSnapshot[]>(`/api/chat?channel=${channel}`),
  sendChatMessage: (channel: ChatChannel, content: string) =>
    request<ChatMessageSnapshot[]>("/api/chat", {
      method: "POST",
      body: JSON.stringify({ channel, content }),
    }),
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
  register: (input: { email: string; password: string; name: string }) =>
    request<AuthSession>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  login: (input: { email: string; password: string }) =>
    request<AuthSession>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  session: () => request<AuthSession | null>("/api/auth/session"),
  logout: () =>
    request<void>("/api/auth/logout", {
      method: "POST",
    }),
  updateProfile: (input: { name: string; bio: string; fleet: string }) =>
    request<SessionPlayer>("/api/profile", {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  adminOverview: () => request<AdminOverview>("/api/admin/overview"),
  adminPlayerDetail: (playerId: string) => request<AdminPlayerDetail>(`/api/admin/players/${playerId}`),
  updateAdminPlayer: (playerId: string, input: { level?: number; energy?: number; energyMax?: number; credits?: number; astralite?: number }) =>
    request<AdminActionResult>(`/api/admin/players/${playerId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  cancelAdminActivity: (playerId: string, activityId: string) =>
    request<AdminActionResult>(`/api/admin/players/${playerId}/cancel-activity`, {
      method: "POST",
      body: JSON.stringify({ activityId }),
    }),
  equipResource: (resourceKey: string | null) =>
    request<GameState>("/api/profile/equipment", {
      method: "POST",
      body: JSON.stringify({ resourceKey }),
    }),
  triggerSystemPulse: () =>
    request<AdminActionResult>("/api/admin/system-pulse", {
      method: "POST",
    }),
  grantStarterPack: (playerId: string) =>
    request<AdminActionResult>("/api/admin/grant-pack", {
      method: "POST",
      body: JSON.stringify({ playerId }),
    }),
};
