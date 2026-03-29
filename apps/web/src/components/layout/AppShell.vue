<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";

import { useAuth } from "../../composables/use-auth";
import { useGameState } from "../../composables/use-game-state";
import { protectedRoutes } from "../../router";

const route = useRoute();
const router = useRouter();
const { errorMessage, gameState, isLoading, refresh } = useGameState();
const { logout, session } = useAuth();

const navigationItems = computed(() =>
  protectedRoutes.filter((item) => !(item.meta?.adminOnly && session.value?.player.role !== "admin")),
);
const activeLabel = computed(() => route.meta.label ?? "Dashboard");

const initials = computed(() =>
  gameState.value?.player.name
    .split(" ")
    .map((segment) => segment[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "OA",
);

const topbarMetrics = computed(() => {
  if (!gameState.value) {
    return [];
  }

  return [
    { label: "Kreditek", value: new Intl.NumberFormat("hu-HU").format(gameState.value.player.credits), tone: "" },
    { label: "Asztralit", value: new Intl.NumberFormat("hu-HU").format(gameState.value.player.astralite), tone: "secondary" },
    {
      label: "Energia",
      value: `${gameState.value.player.energy}/${gameState.value.player.energyMax}`,
      tone: "warning",
    },
  ];
});

async function handleLogout() {
  await logout();
  await router.push("/auth/login");
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="sidebar-header">
        <p class="eyebrow">Obsidian Astral</p>
        <h1 class="brand">Parancsnoki hálózat</h1>
      </div>

        <div v-if="gameState" class="sidebar-profile">
        <div class="profile-avatar">{{ initials }}</div>
        <div>
          <p class="profile-name">{{ session?.player.name ?? gameState.player.name }}</p>
          <p class="profile-meta">
            {{ session?.player.role === "admin" ? "Admin hozzáférés" : `Szint ${gameState.player.level}` }}
          </p>
        </div>
      </div>

      <nav class="nav-list">
        <RouterLink
          v-for="item in navigationItems"
          :key="item.path"
          :to="`/${item.path}`"
          class="nav-link"
          active-class="is-active"
        >
          {{ item.meta?.label }}
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <RouterLink class="support-link" to="/profile">Profil</RouterLink>
        <button class="support-link sidebar-button" type="button" @click="handleLogout">Kijelentkezés</button>
      </div>
    </aside>

    <div class="main-column">
      <header class="topbar">
        <div>
          <p class="eyebrow">Aktív nézet</p>
          <h2 class="page-title">{{ activeLabel }}</h2>
        </div>

        <div class="topbar-stats">
          <div v-for="metric in topbarMetrics" :key="metric.label" class="topbar-pill">
            <span class="pill-dot" :class="metric.tone" />
            <div>
              <div class="compact-label">{{ metric.label }}</div>
              <strong>{{ metric.value }}</strong>
            </div>
          </div>

          <div v-if="gameState" class="topbar-user">
            <div>
              <p class="eyebrow">{{ session?.player.role === "admin" ? "Admin" : "Commander" }}</p>
              <p class="profile-meta">LVL {{ gameState.player.level }}</p>
            </div>
            <div class="topbar-avatar">{{ initials }}</div>
          </div>

          <button class="ghost-button" type="button" @click="refresh">Frissítés</button>
        </div>
      </header>

      <p v-if="errorMessage" class="status-banner error">{{ errorMessage }}</p>
      <p v-else-if="isLoading" class="status-banner">Játékállapot betöltése…</p>

      <main class="content-area">
        <RouterView />
      </main>
    </div>
  </div>
</template>
