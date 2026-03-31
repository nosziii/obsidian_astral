<script setup lang="ts">
import { computed } from "vue";
import type { InventorySnapshot, ResourceDefinition } from "@obsidian-astral/shared";

const props = defineProps<{
  inventory: InventorySnapshot[];
  resources: ResourceDefinition[];
}>();

const tileMeta = [
  { icon: "forest", tone: "", fallbackRate: "+12/óra" },
  { icon: "architecture", tone: "secondary", fallbackRate: "+4/óra" },
  { icon: "precision_manufacturing", tone: "tertiary", fallbackRate: "+22/óra" },
  { icon: "savings", tone: "warning", fallbackRate: "+1/óra" },
];

const tiles = computed(() =>
  props.inventory.slice(0, 4).map((entry, index) => ({
    ...entry,
    label: props.resources.find((item) => item.key === entry.resourceKey)?.label ?? entry.resourceKey,
    icon: tileMeta[index]?.icon ?? "deployed_code",
    tone: tileMeta[index]?.tone ?? "",
    rate: tileMeta[index]?.fallbackRate ?? "+0/óra",
  })),
);
</script>

<template>
  <div class="resource-grid">
    <article v-for="tile in tiles" :key="tile.resourceKey" class="data-card resource-card">
      <div class="resource-card-header">
        <div class="resource-icon" :class="tile.tone">
          <span class="material-symbols-outlined">{{ tile.icon }}</span>
        </div>
        <span class="resource-rate">{{ tile.rate }}</span>
      </div>
      <div>
        <p class="compact-label">{{ tile.label }}</p>
        <strong class="resource-amount">{{ new Intl.NumberFormat("hu-HU").format(tile.quantity) }}</strong>
      </div>
    </article>
  </div>
</template>
