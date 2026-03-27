<script setup lang="ts">
import BasePanel from "../components/ui/BasePanel.vue";
import { useGameState } from "../composables/use-game-state";

const { gameState } = useGameState();
</script>

<template>
  <div v-if="gameState" class="view-grid">
    <BasePanel title="Karakterprofil" subtitle="Fejlődés">
      <div class="profile-grid">
        <article class="profile-card">
          <span class="compact-label">Név</span>
          <strong>{{ gameState.player.name }}</strong>
        </article>
        <article class="profile-card">
          <span class="compact-label">Szint</span>
          <strong>{{ gameState.player.level }}</strong>
        </article>
        <article class="profile-card">
          <span class="compact-label">XP</span>
          <strong>{{ gameState.player.xp }}/{{ gameState.player.xpToNextLevel }}</strong>
        </article>
        <article class="profile-card">
          <span class="compact-label">Energia</span>
          <strong>{{ gameState.player.energy }}/{{ gameState.player.energyMax }}</strong>
        </article>
      </div>
    </BasePanel>

    <BasePanel title="Aktív épületek" subtitle="Bázis">
      <div class="card-list">
        <article v-for="building in gameState.buildings" :key="building.key" class="action-card">
          <p class="eyebrow">{{ building.key }}</p>
          <h4>{{ building.label }}</h4>
          <p class="muted">Jelenlegi szint: {{ building.level }}</p>
        </article>
      </div>
    </BasePanel>
  </div>
</template>
