<script setup lang="ts">
import type { BuildingDefinition, BuildingSnapshot, ResourceDefinition } from "@obsidian-astral/shared";

import { formatCategoryLabel } from "../../lib/formatters";
import BasePanel from "../ui/BasePanel.vue";

const props = defineProps<{
  catalog: BuildingDefinition[];
  states: BuildingSnapshot[];
  resources: ResourceDefinition[];
  pendingAction: string | null;
  playerLevel: number;
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
          <span class="tag-pill" :class="categoryTone(building.category)">{{ formatCategoryLabel(building.category) }}</span>
          <span class="chip">szint {{ stateFor(building.key)?.level ?? 1 }}</span>
        </div>
        <h4 class="card-title">{{ building.label }}</h4>
        <p class="muted">{{ building.description }}</p>
        <div class="detail-list">
          <div class="detail-row">
            <span class="compact-label">Költség</span>
            <strong>{{ building.baseCost.map((item) => `${item.amount} ${resourceLabel(item.resourceKey)}`).join(", ") }}</strong>
          </div>
          <div class="detail-row">
            <span class="compact-label">Feloldás</span>
            <strong>{{ building.requiredLevel }}. szint</strong>
          </div>
        </div>
        <button
          class="secondary-button"
          type="button"
          :disabled="playerLevel < building.requiredLevel || pendingAction === `building:${building.key}`"
          @click="emit('upgrade', building.key)"
        >
          {{
            playerLevel < building.requiredLevel
              ? `${building.requiredLevel}. szint kell`
              : pendingAction === `building:${building.key}`
                ? "Fejlesztés…"
                : "Szintlépés"
          }}
        </button>
      </article>
    </div>
  </BasePanel>
</template>
