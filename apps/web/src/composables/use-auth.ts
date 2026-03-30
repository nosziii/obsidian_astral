import { computed, ref } from "vue";
import type { AdminActionResult, AdminOverview, AdminPlayerDetail, AuthSession } from "@obsidian-astral/shared";

import { gameApi, setApiAuthToken } from "../api/game-api";

const STORAGE_KEY = "obsidian-astral-token";

const session = ref<AuthSession | null>(null);
const authLoaded = ref(false);
const authError = ref("");
const adminOverview = ref<AdminOverview | null>(null);
const adminStatus = ref<AdminActionResult | null>(null);
const adminPlayerDetail = ref<AdminPlayerDetail | null>(null);

function syncToken(token: string | null) {
  setApiAuthToken(token);

  if (token) {
    localStorage.setItem(STORAGE_KEY, token);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function applySession(nextSession: AuthSession | null) {
  session.value = nextSession;
  syncToken(nextSession?.token ?? null);
}

export async function loadAuthSession() {
  const token = localStorage.getItem(STORAGE_KEY);
  syncToken(token);

  if (!token) {
    session.value = null;
    authLoaded.value = true;
    return null;
  }

  try {
    session.value = await gameApi.session();
    syncToken(session.value?.token ?? null);
    authError.value = "";
  } catch (error) {
    session.value = null;
    syncToken(null);
    authError.value = error instanceof Error ? error.message : "Nem sikerült helyreállítani a munkamenetet.";
  } finally {
    authLoaded.value = true;
  }

  return session.value;
}

export function useAuth() {
  async function login(email: string, password: string) {
    const nextSession = await gameApi.login({ email, password });
    applySession(nextSession);
    authLoaded.value = true;
    authError.value = "";
    return nextSession;
  }

  async function register(name: string, email: string, password: string) {
    const nextSession = await gameApi.register({ name, email, password });
    applySession(nextSession);
    authLoaded.value = true;
    authError.value = "";
    return nextSession;
  }

  async function logout() {
    try {
      await gameApi.logout();
    } finally {
      applySession(null);
      adminOverview.value = null;
      adminPlayerDetail.value = null;
    }
  }

  async function saveProfile(input: { name: string; bio: string; fleet: string }) {
    const player = await gameApi.updateProfile(input);

    if (session.value) {
      session.value = {
        ...session.value,
        player,
      };
    }

    return player;
  }

  async function loadAdminOverview() {
    adminOverview.value = await gameApi.adminOverview();
    return adminOverview.value;
  }

  async function runSystemPulse() {
    adminStatus.value = await gameApi.triggerSystemPulse();
    adminOverview.value = await gameApi.adminOverview();
    return adminStatus.value;
  }

  async function grantPack(playerId: string) {
    adminStatus.value = await gameApi.grantStarterPack(playerId);
    adminOverview.value = await gameApi.adminOverview();
    if (adminPlayerDetail.value?.player.id === playerId) {
      adminPlayerDetail.value = await gameApi.adminPlayerDetail(playerId);
    }
    return adminStatus.value;
  }

  async function loadAdminPlayerDetail(playerId: string) {
    adminPlayerDetail.value = await gameApi.adminPlayerDetail(playerId);
    return adminPlayerDetail.value;
  }

  async function saveAdminPlayer(playerId: string, input: { level?: number; energy?: number; energyMax?: number; credits?: number; astralite?: number }) {
    adminStatus.value = await gameApi.updateAdminPlayer(playerId, input);
    adminOverview.value = await gameApi.adminOverview();
    adminPlayerDetail.value = await gameApi.adminPlayerDetail(playerId);
    return adminStatus.value;
  }

  async function cancelAdminActivity(playerId: string, activityId: string) {
    adminStatus.value = await gameApi.cancelAdminActivity(playerId, activityId);
    adminOverview.value = await gameApi.adminOverview();
    adminPlayerDetail.value = await gameApi.adminPlayerDetail(playerId);
    return adminStatus.value;
  }

  return {
    session: computed(() => session.value),
    authLoaded: computed(() => authLoaded.value),
    authError: computed(() => authError.value),
    adminOverview: computed(() => adminOverview.value),
    adminPlayerDetail: computed(() => adminPlayerDetail.value),
    adminStatus: computed(() => adminStatus.value),
    login,
    register,
    logout,
    saveProfile,
    loadAdminOverview,
    loadAdminPlayerDetail,
    saveAdminPlayer,
    cancelAdminActivity,
    runSystemPulse,
    grantPack,
  };
}
