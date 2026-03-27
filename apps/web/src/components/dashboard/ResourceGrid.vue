<script setup lang="ts">
import type { InventorySnapshot, ResourceDefinition } from "@obsidian-astral/shared";

const props = defineProps<{
  inventory: InventorySnapshot[];
  resources: ResourceDefinition[];
}>();

function labelFor(resourceKey: string) {
  return props.resources.find((item) => item.key === resourceKey)?.label ?? resourceKey;
}
</script>

<template>
  <div class="resource-grid">
    <article v-for="entry in inventory.slice(0, 8)" :key="entry.resourceKey" class="panel resource-card inset">
      <p class="eyebrow">{{ labelFor(entry.resourceKey) }}</p>
      <strong class="resource-amount">{{ entry.quantity }}</strong>
    </article>
  </div>
</template>
