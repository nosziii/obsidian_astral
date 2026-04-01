<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";

import { useAuth } from "../../composables/use-auth";
import { useGameState } from "../../composables/use-game-state";
import { protectedRoutes, type NavigationChild } from "../../router";

const route = useRoute();
const router = useRouter();
const { errorMessage, gameState, isLoading, refresh } = useGameState();
const { logout, session } = useAuth();
const isMobileNavOpen = ref(false);
const expandedNavItems = ref<string[]>([]);

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

watch(
  () => route.fullPath,
  () => {
    isMobileNavOpen.value = false;

    for (const item of navigationItems.value) {
      if (isRouteItemActive(item.path) && item.meta.navChildren?.length && !expandedNavItems.value.includes(item.path)) {
        expandedNavItems.value.push(item.path);
      }
    }
  },
  { immediate: true },
);

function isRouteItemActive(path: string) {
  return route.path === `/${path}`;
}

function isChildActive(child: NavigationChild) {
  if (typeof child.to === "string") {
    return route.fullPath === child.to;
  }

  const childPath = typeof child.to.path === "string" ? child.to.path : route.path;
  if (route.path !== childPath) {
    return false;
  }

  const childQuery = child.to.query ?? {};
  return Object.entries(childQuery).every(([key, value]) => String(route.query[key] ?? "") === String(value ?? ""));
}

function toggleNavItem(path: string) {
  if (expandedNavItems.value.includes(path)) {
    expandedNavItems.value = expandedNavItems.value.filter((entry) => entry !== path);
    return;
  }

  expandedNavItems.value = [...expandedNavItems.value, path];
}

async function handleLogout() {
  await logout();
  await router.push("/auth/login");
}
</script>

<template>
  <div class="app-shell">
    <button class="mobile-nav-backdrop" :class="{ 'is-open': isMobileNavOpen }" type="button" @click="isMobileNavOpen = false" />

    <aside class="sidebar" :class="{ 'is-open': isMobileNavOpen }">
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
        <div v-for="item in navigationItems" :key="item.path" class="nav-group">
          <div class="nav-row">
            <RouterLink :to="`/${item.path}`" class="nav-link" :class="{ 'is-active': isRouteItemActive(item.path) }">
              <span class="material-symbols-outlined nav-link__icon">{{ item.meta?.icon }}</span>
              <span>{{ item.meta?.label }}</span>
            </RouterLink>

            <button
              v-if="item.meta.navChildren?.length"
              class="nav-expand-button"
              :class="{ 'is-open': expandedNavItems.includes(item.path) }"
              type="button"
              @click="toggleNavItem(item.path)"
            >
              <span class="material-symbols-outlined">expand_more</span>
            </button>
          </div>

          <div v-if="item.meta.navChildren?.length && expandedNavItems.includes(item.path)" class="nav-submenu">
            <RouterLink
              v-for="child in item.meta.navChildren"
              :key="child.label"
              :to="child.to"
              class="nav-sublink"
              :class="{ 'is-active': isChildActive(child) }"
            >
              <span class="material-symbols-outlined">{{ child.icon }}</span>
              <span>{{ child.label }}</span>
            </RouterLink>
          </div>
        </div>
      </nav>

      <div class="sidebar-footer">
        <RouterLink class="support-link" to="/profile">Profil</RouterLink>
        <button class="support-link sidebar-button" type="button" @click="handleLogout">Kijelentkezés</button>
      </div>
    </aside>

    <div class="main-column">
      <header class="topbar">
        <div class="topbar-leading">
          <button class="mobile-nav-toggle" type="button" @click="isMobileNavOpen = !isMobileNavOpen">
            <span class="material-symbols-outlined">{{ isMobileNavOpen ? "close" : "menu" }}</span>
          </button>

          <div>
            <p class="eyebrow">Aktív nézet</p>
            <h2 class="page-title">{{ activeLabel }}</h2>
          </div>
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
      <p v-else-if="isLoading" class="status-banner">Játékállapot betöltése...</p>

      <main class="content-area">
        <RouterView />
      </main>
    </div>
  </div>
</template>
