<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

import { routes } from "../../router";
import { useGameState } from "../../composables/use-game-state";

const route = useRoute();
const { gameState, errorMessage, isLoading, refresh } = useGameState();

const navigationItems = routes.filter((item) => item.path && item.path !== "/");
const activeLabel = computed(() => route.meta.label ?? "Dashboard");
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar panel">
      <div>
        <p class="eyebrow">Obsidian Astral</p>
        <h1 class="brand">Parancsnoki hálózat</h1>
      </div>

      <nav class="nav-list">
        <RouterLink
          v-for="item in navigationItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          active-class="is-active"
        >
          {{ item.meta?.label }}
        </RouterLink>
      </nav>

      <div class="sidebar-footer panel inset">
        <p class="eyebrow">Rendszer</p>
        <p class="muted">Az UI a meglévő dashboard, műhely és térkép tervekre épül.</p>
      </div>
    </aside>

    <div class="main-column">
      <header class="topbar panel">
        <div>
          <p class="eyebrow">Aktív nézet</p>
          <h2 class="page-title">{{ activeLabel }}</h2>
        </div>

        <div class="topbar-stats" v-if="gameState">
          <div class="compact-stat">
            <span class="compact-label">Kreditek</span>
            <strong>{{ gameState.player.credits }}</strong>
          </div>
          <div class="compact-stat">
            <span class="compact-label">Astralit</span>
            <strong>{{ gameState.player.astralite }}</strong>
          </div>
          <div class="compact-stat">
            <span class="compact-label">Energia</span>
            <strong>{{ gameState.player.energy }}/{{ gameState.player.energyMax }}</strong>
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
