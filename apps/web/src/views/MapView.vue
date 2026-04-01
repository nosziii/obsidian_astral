<script setup lang="ts">
import { computed, ref, watch } from "vue";

import WorldMapCanvas from "../components/map/WorldMapCanvas.vue";
import ZoneIntelPanel from "../components/map/ZoneIntelPanel.vue";
import { useGameState } from "../composables/use-game-state";
import { buildZoneMetrics, buildZoneNodeLayout } from "../lib/character-overview";

const { gameState } = useGameState();
const selectedZoneKey = ref<string | null>(null);

watch(
  () => gameState.value?.zones,
  (zones) => {
    if (!zones?.length) {
      selectedZoneKey.value = null;
      return;
    }

    if (!selectedZoneKey.value || !zones.some((zone) => zone.key === selectedZoneKey.value)) {
      selectedZoneKey.value = zones[0].key;
    }
  },
  { immediate: true },
);

const selectedZone = computed(() => gameState.value?.zones.find((zone) => zone.key === selectedZoneKey.value) ?? null);
const expeditionsForZone = computed(() =>
  gameState.value?.expeditionsCatalog.filter((expedition) => expedition.zoneKey === selectedZoneKey.value) ?? [],
);
const activeRunsForZone = computed(() =>
  gameState.value?.expeditions.filter((run) => expeditionsForZone.value.some((expedition) => expedition.key === run.key)) ?? [],
);
const zoneNodes = computed(() => buildZoneNodeLayout(gameState.value?.zones ?? []));
</script>

<template>
  <div v-if="gameState" class="map-layout">
    <section class="map-main">
      <header class="map-command">
        <div>
          <p class="eyebrow">Astral Sector</p>
          <h1 class="map-command__title">Világtérkép</h1>
          <p class="muted">A szektorok közötti navigáció és expedíciós előkészítés egyetlen taktikai nézetben.</p>
        </div>

        <div class="map-command__stats">
          <article v-for="metric in buildZoneMetrics(gameState)" :key="metric.label" class="map-command__metric">
            <span class="compact-label">{{ metric.label }}</span>
            <strong>{{ metric.value }}</strong>
          </article>
        </div>
      </header>

      <WorldMapCanvas
        :active-runs="activeRunsForZone"
        :expeditions="expeditionsForZone"
        :nodes="zoneNodes"
        :selected-zone-key="selectedZoneKey"
        @select-zone="selectedZoneKey = $event"
      />
    </section>

    <ZoneIntelPanel
      :active-runs="activeRunsForZone"
      :expeditions="expeditionsForZone"
      :metrics="buildZoneMetrics(gameState)"
      :zone="selectedZone"
    />
  </div>
</template>
