<script setup lang="ts">
import { computed } from "vue";

import BasePanel from "../components/ui/BasePanel.vue";
import { useGameState } from "../composables/use-game-state";

const { gameState } = useGameState();

const stats = computed(() => {
  if (!gameState.value) {
    return [];
  }

  return [
    { label: "Életerő", value: new Intl.NumberFormat("hu-HU").format(gameState.value.player.credits), icon: "♥" },
    { label: "Támadás", value: new Intl.NumberFormat("hu-HU").format(gameState.value.player.level * 91), icon: "ϟ" },
    { label: "Védelem", value: new Intl.NumberFormat("hu-HU").format(gameState.value.player.level * 52), icon: "🛡" },
    { label: "Kritikus", value: `${Math.min(42, gameState.value.player.level)}.5%`, icon: "✦" },
  ];
});

const inventoryPreview = computed(() => gameState.value?.inventory.slice(0, 8) ?? []);
</script>

<template>
  <div v-if="gameState" class="character-layout">
    <div class="character-panel">
      <BasePanel title="Parancsnoki profil" subtitle="Karakter">
        <div class="character-stage">
          <div class="character-grid" />
          <div class="equipment-slot slot-top-left">⚔</div>
          <div class="equipment-slot secondary slot-top-center">☠</div>
          <div class="equipment-slot secondary slot-top-right">✋</div>
          <div class="equipment-slot slot-left">🛡</div>
          <div class="equipment-slot tertiary slot-right">✦</div>
          <div class="equipment-slot slot-bottom-left">42</div>
          <div class="equipment-slot success slot-bottom-center">👣</div>

          <div class="character-figure">
            <div class="silhouette">🕴</div>
            <p class="eyebrow">{{ gameState.player.name }}</p>
            <p class="muted">Szint {{ gameState.player.level }} parancsnok</p>
          </div>
        </div>
      </BasePanel>

      <div class="stat-grid">
        <article v-for="stat in stats" :key="stat.label" class="data-card">
          <span class="compact-label">{{ stat.label }}</span>
          <strong class="value-strong">{{ stat.icon }} {{ stat.value }}</strong>
        </article>
      </div>

      <BasePanel title="Szakmai fejlődés" subtitle="Mastery">
        <div class="card-list">
          <article v-for="profession in gameState.professions" :key="profession.key" class="action-card">
            <div class="tag-row">
              <span class="tag-pill secondary">szint {{ profession.level }}</span>
              <span class="compact-label">{{ profession.focus }}</span>
            </div>
            <h4 class="card-title">{{ profession.label }}</h4>
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: `${profession.progressPercent}%` }" />
            </div>
          </article>
        </div>
      </BasePanel>
    </div>

    <BasePanel title="Inventár" subtitle="Felszerelés és készlet">
      <div class="inventory-shell">
        <div class="inventory-grid">
          <div
            v-for="index in 20"
            :key="index"
            class="inventory-tile"
            :class="{ 'is-filled': index <= inventoryPreview.length }"
          >
            {{ inventoryPreview[index - 1]?.resourceKey?.slice(0, 2).toUpperCase() ?? "·" }}
          </div>
        </div>

        <div v-if="inventoryPreview[0]" class="action-card">
          <div class="item-detail">
            <div class="recipe-icon tertiary">⚔</div>
            <div>
              <h4 class="card-title">{{ inventoryPreview[0].resourceKey }}</h4>
              <p class="muted">Elérhető mennyiség: {{ inventoryPreview[0].quantity }}</p>
            </div>
            <span class="tag-pill secondary">epic</span>
          </div>
          <button class="primary-button" type="button">Felszerelés aktiválása</button>
        </div>
      </div>
    </BasePanel>
  </div>
</template>
