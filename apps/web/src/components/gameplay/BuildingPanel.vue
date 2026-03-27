<script setup lang="ts">
import type { BuildingDefinition, BuildingSnapshot, ResourceDefinition } from "@obsidian-astral/shared";

import BasePanel from "../ui/BasePanel.vue";

const props = defineProps<{
  catalog: BuildingDefinition[];
  states: BuildingSnapshot[];
  resources: ResourceDefinition[];
  pendingAction: string | null;
}>();

const emit = defineEmits<{
  upgrade: [buildingKey: string];
}>();

function stateFor(buildingKey: string) {
  return props.states.find((item) => item.key === buildingKey);
}

function resourceLabel(resourceKey: string) {
  return props.resources.find((item) => item.key === resourceKey)?.label ?? resourceKey;
}
</script>

<template>
  <BasePanel title="Bázisfejlesztések" subtitle="Épületek">
    <div class="card-list">
      <article v-for="building in catalog" :key="building.key" class="action-card">
        <div class="tag-row">
          <p class="eyebrow">{{ building.category }}</p>
          <span class="chip">Szint {{ stateFor(building.key)?.level ?? 1 }}</span>
        </div>
        <h4>{{ building.label }}</h4>
        <p class="muted">{{ building.description }}</p>
        <div class="recipe-line">
          <span>Következő költség:</span>
          <strong>{{ building.baseCost.map((item) => `${item.amount} ${resourceLabel(item.resourceKey)}`).join(", ") }}</strong>
        </div>
        <button
          class="secondary-button"
          type="button"
          :disabled="pendingAction === `building:${building.key}`"
          @click="emit('upgrade', building.key)"
        >
          {{ pendingAction === `building:${building.key}` ? "Fejlesztés…" : "Szintlépés" }}
        </button>
      </article>
    </div>
  </BasePanel>
</template>
