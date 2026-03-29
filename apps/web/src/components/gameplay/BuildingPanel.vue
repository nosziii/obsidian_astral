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

function categoryTone(category: BuildingDefinition["category"]) {
  if (category === "feldolgozas") {
    return "secondary";
  }

  if (category === "tamogatas") {
    return "tertiary";
  }

  return "";
}
</script>

<template>
  <BasePanel title="Bázisfejlesztések" subtitle="Műhely modulok">
    <div class="card-list">
      <article v-for="building in catalog" :key="building.key" class="action-card">
        <div class="tag-row">
          <span class="tag-pill" :class="categoryTone(building.category)">{{ building.category }}</span>
          <span class="chip">szint {{ stateFor(building.key)?.level ?? 1 }}</span>
        </div>
        <h4 class="card-title">{{ building.label }}</h4>
        <p class="muted">{{ building.description }}</p>
        <div class="detail-list">
          <div class="detail-row">
            <span class="compact-label">Költség</span>
            <strong>{{ building.baseCost.map((item) => `${item.amount} ${resourceLabel(item.resourceKey)}`).join(", ") }}</strong>
          </div>
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
