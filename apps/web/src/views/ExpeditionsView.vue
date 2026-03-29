<script setup lang="ts">
import { computed, ref, watch } from "vue";

import ExpeditionPanel from "../components/gameplay/ExpeditionPanel.vue";
import BasePanel from "../components/ui/BasePanel.vue";
import { useGameState } from "../composables/use-game-state";
import { zoneLayout } from "../lib/zone-layout";

const { activityNow, claimExpedition, gameState, pendingAction, startExpedition } = useGameState();
const selectedZoneKey = ref<string | null>(null);
const zoomLevel = ref(1);

const zoneNodes = computed(() => {
  if (!gameState.value) {
    return [];
  }

  return gameState.value.zones.map((zone) => {
    const layout = zoneLayout.find((item) => item.key === zone.key);

    return {
      ...zone,
      x: layout?.x ?? 50,
      y: layout?.y ?? 50,
      icon: layout?.icon ?? "✦",
    };
  });
});

watch(
  zoneNodes,
  (zones) => {
    if (!zones.length) {
      selectedZoneKey.value = null;
      return;
    }

    if (!selectedZoneKey.value || !zones.some((item) => item.key === selectedZoneKey.value)) {
      selectedZoneKey.value = zones[0].key;
    }
  },
  { immediate: true },
);

const selectedZone = computed(() => zoneNodes.value.find((item) => item.key === selectedZoneKey.value) ?? null);

const mapTransform = computed(() => {
  const zone = selectedZone.value;

  if (!zone) {
    return `scale(${zoomLevel.value})`;
  }

  const translateX = 50 - zone.x;
  const translateY = 50 - zone.y;

  return `translate(${translateX}%, ${translateY}%) scale(${zoomLevel.value})`;
});

function increaseZoom() {
  zoomLevel.value = Math.min(1.8, Number((zoomLevel.value + 0.2).toFixed(1)));
}

function decreaseZoom() {
  zoomLevel.value = Math.max(1, Number((zoomLevel.value - 0.2).toFixed(1)));
}

function centerSelectedZone() {
  zoomLevel.value = Math.max(1.2, zoomLevel.value);
}
</script>

<template>
  <div v-if="gameState" class="map-layout">
    <section class="panel map-stage">
      <div class="sector-title">
        <p class="eyebrow">Kartográfia</p>
        <h2 class="sector-heading">Asztrál szektor VII</h2>
        <p class="muted">Kijelölt zóna: {{ selectedZone?.label ?? "nincs kiválasztva" }}</p>
      </div>

      <div class="map-stats">
        <div class="map-stat">
          <span class="compact-label">Felderítés</span>
          <strong class="value-strong">{{ gameState.professions.find((item) => item.key === "felderites")?.progressPercent ?? 0 }}%</strong>
        </div>
        <div class="map-stat">
          <span class="compact-label">Fókusz</span>
          <strong class="value-strong" :style="{ color: selectedZone?.risk === 'magas' ? 'var(--danger)' : selectedZone?.risk === 'kozepes' ? 'var(--secondary)' : 'var(--success)' }">
            {{ selectedZone?.risk ?? "alacsony" }}
          </strong>
        </div>
      </div>

      <div class="map-canvas" :style="{ transform: mapTransform }">
        <button
          v-for="zone in zoneNodes"
          :key="zone.key"
          class="map-node"
          :class="{ 'is-active': selectedZoneKey === zone.key }"
          type="button"
          :style="{ top: `${zone.y}%`, left: `${zone.x}%` }"
          @click="selectedZoneKey = zone.key"
        >
          <div class="node-diamond" :class="zone.risk === 'magas' ? 'danger' : zone.risk === 'kozepes' ? 'secondary' : ''">
            <span>{{ zone.icon }}</span>
          </div>
          <div>
            <p class="eyebrow">{{ zone.label }}</p>
            <p class="muted">{{ zone.status }}</p>
          </div>
        </button>
      </div>

      <div class="map-footer">
        <div class="data-card">
          <span class="compact-label">Zónaleírás</span>
          <strong class="value-strong">{{ selectedZone?.label ?? "Nincs zóna" }}</strong>
          <p class="muted">{{ selectedZone?.description ?? "Válassz egy zónát a részletekhez." }}</p>
        </div>
        <div class="map-controls">
          <button class="control-button" type="button" @click="increaseZoom">+</button>
          <button class="control-button" type="button" @click="decreaseZoom">−</button>
          <button class="control-button" type="button" @click="centerSelectedZone">⌖</button>
        </div>
      </div>
    </section>

    <div class="expedition-sidebar">
      <ExpeditionPanel
        :activities="gameState.activities"
        :catalog="gameState.expeditionsCatalog"
        :active-runs="gameState.expeditions"
        :now="activityNow"
        :pending-action="pendingAction"
        :player-level="gameState.player.level"
        @claim="claimExpedition"
        @start="startExpedition"
      />

      <BasePanel title="Kijelölt zóna" subtitle="Terepjelentés">
        <div v-if="selectedZone" class="detail-list">
          <div class="detail-row">
            <span class="compact-label">Ajánlott szint</span>
            <strong>{{ selectedZone.recommendedLevel }}</strong>
          </div>
          <div class="detail-row">
            <span class="compact-label">Kockázat</span>
            <strong>{{ selectedZone.risk }}</strong>
          </div>
          <div class="detail-row">
            <span class="compact-label">Elérhetőség</span>
            <strong>{{ selectedZone.status }}</strong>
          </div>
        </div>
      </BasePanel>
    </div>
  </div>
</template>
