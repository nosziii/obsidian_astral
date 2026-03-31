<script setup lang="ts">
import type { ActivitySnapshot, BuildingDefinition, BuildingSnapshot, ResourceDefinition } from "@obsidian-astral/shared";

import { formatCategoryLabel } from "../../lib/formatters";
import ActivityTimeline from "./ActivityTimeline.vue";
import BasePanel from "../ui/BasePanel.vue";

const props = defineProps<{
  activities: ActivitySnapshot[];
  catalog: BuildingDefinition[];
  now: number;
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

function activityFor(buildingKey: string) {
  return props.activities.find((item) => item.kind === "building" && item.targetKey === buildingKey) ?? null;
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

function buildingIcon(category: BuildingDefinition["category"]) {
  if (category === "feldolgozas") {
    return "precision_manufacturing";
  }

  if (category === "tamogatas") {
    return "blur_on";
  }

  return "factory";
}
</script>

<template>
  <BasePanel title="Bázisfejlesztések" subtitle="Műhely modulok">
    <div class="workshop-anomaly-grid">
      <article v-for="building in catalog" :key="building.key" class="workshop-anomaly-card" :class="categoryTone(building.category)">
        <div class="workshop-anomaly-card__header">
          <div class="workshop-anomaly-card__title-wrap">
            <div class="workshop-anomaly-card__icon" :class="categoryTone(building.category)">
              <span class="material-symbols-outlined">{{ buildingIcon(building.category) }}</span>
            </div>
            <div>
              <h4 class="card-title">{{ building.label }}</h4>
              <span class="tag-pill" :class="categoryTone(building.category)">{{ formatCategoryLabel(building.category) }}</span>
            </div>
          </div>

          <div class="workshop-anomaly-card__value">
            <strong>{{ stateFor(building.key)?.level ?? 1 }}</strong>
            <span>aktuális szint</span>
          </div>
        </div>

        <p class="muted">{{ building.description }}</p>

        <div class="workshop-anomaly-card__metrics">
          <div class="workshop-anomaly-card__metric">
            <span class="compact-label">Feloldás</span>
            <strong>{{ building.requiredLevel }}. szint</strong>
          </div>
          <div class="workshop-anomaly-card__metric">
            <span class="compact-label">Fejlesztési költség</span>
            <strong>{{ building.baseCost.map((item) => `${item.amount} ${resourceLabel(item.resourceKey)}`).join(", ") }}</strong>
          </div>
        </div>

        <ActivityTimeline :activity="activityFor(building.key)" :now="now" idle-text="Nincs aktív fejlesztés" />

        <div class="workshop-anomaly-card__actions">
          <button
            class="secondary-button workshop-anomaly-card__button"
            type="button"
            :disabled="playerLevel < building.requiredLevel || pendingAction === `building:${building.key}` || !!activityFor(building.key)"
            @click="emit('upgrade', building.key)"
          >
            {{
              playerLevel < building.requiredLevel
                ? `${building.requiredLevel}. szint kell`
                : pendingAction === `building:${building.key}` || activityFor(building.key)
                  ? "Fejlesztés..."
                  : "Szintlépés"
            }}
          </button>
          <button class="ghost-button workshop-anomaly-card__icon-button" type="button">
            <span class="material-symbols-outlined">analytics</span>
          </button>
        </div>
      </article>
    </div>
  </BasePanel>
</template>
