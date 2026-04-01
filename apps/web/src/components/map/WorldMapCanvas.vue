<script setup lang="ts">
import type { ExpeditionDefinition, ExpeditionSnapshot, ZoneSnapshot } from "@obsidian-astral/shared";

defineProps<{
  nodes: Array<{
    zone: ZoneSnapshot;
    position: { top: string; left: string };
    icon: string;
    label: string;
  }>;
  selectedZoneKey: string | null;
  activeRuns: ExpeditionSnapshot[];
  expeditions: ExpeditionDefinition[];
}>();

defineEmits<{
  (event: "select-zone", zoneKey: string): void;
}>();
</script>

<template>
  <section class="world-map panel">
    <div class="world-map__grid" aria-hidden="true"></div>
    <div class="world-map__aura" aria-hidden="true"></div>

    <div
      v-for="node in nodes"
      :key="node.zone.key"
      class="world-map__node"
      :class="{
        'is-selected': selectedZoneKey === node.zone.key,
        'is-locked': node.zone.status === 'zarolt',
        'is-warning': node.zone.risk === 'magas',
      }"
      :style="node.position"
    >
      <button class="world-map__node-trigger" type="button" @click="$emit('select-zone', node.zone.key)">
        <span class="material-symbols-outlined micro-float">{{ node.icon }}</span>
      </button>
      <div class="world-map__node-copy">
        <strong>{{ node.zone.label }}</strong>
        <span>{{ node.label }}</span>
      </div>
    </div>

    <div class="world-map__footer">
      <div class="world-map__readout">
        <span class="compact-label">Aktív futamok</span>
        <strong>{{ activeRuns.length }}</strong>
      </div>
      <div class="world-map__readout">
        <span class="compact-label">Expedíciós terv</span>
        <strong>{{ expeditions.length }}</strong>
      </div>
    </div>
  </section>
</template>
