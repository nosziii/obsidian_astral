<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { AdminBuildingDetail } from "@obsidian-astral/shared";

import { formatCategoryLabel } from "../../lib/formatters";

const props = defineProps<{
  buildings: AdminBuildingDetail[];
}>();

const emit = defineEmits<{
  save: [payload: { buildingKey: string; level: number }];
}>();

const selectedBuildingKey = ref<string | null>(null);
const level = ref(1);

watch(
  () => props.buildings,
  (buildings) => {
    if (!buildings.length) {
      selectedBuildingKey.value = null;
      level.value = 1;
      return;
    }

    const current = buildings.find((building) => building.key === selectedBuildingKey.value) ?? buildings[0];
    selectedBuildingKey.value = current.key;
    level.value = current.level;
  },
  { immediate: true },
);

const selectedBuilding = computed(
  () => props.buildings.find((building) => building.key === selectedBuildingKey.value) ?? null,
);

watch(selectedBuilding, (building) => {
  if (building) {
    level.value = building.level;
  }
});

function submit() {
  if (!selectedBuilding.value) {
    return;
  }

  emit("save", {
    buildingKey: selectedBuilding.value.key,
    level: level.value,
  });
}
</script>

<template>
  <article class="action-card admin-building-editor">
    <div class="admin-building-header">
      <div>
        <p class="eyebrow">Structural override</p>
        <h4 class="card-title">Épület editor</h4>
      </div>
      <span v-if="selectedBuilding" class="tag-pill secondary">{{ formatCategoryLabel(selectedBuilding.category) }}</span>
    </div>

    <div class="admin-building-layout">
      <div class="admin-building-list">
        <button
          v-for="building in buildings"
          :key="building.key"
          class="admin-building-tile"
          :class="{ 'is-active': selectedBuildingKey === building.key }"
          type="button"
          @click="selectedBuildingKey = building.key"
        >
          <div class="tag-row">
            <strong>{{ building.label }}</strong>
            <span class="compact-label">Lv. {{ building.level }}</span>
          </div>
          <p class="muted">{{ building.description }}</p>
        </button>
      </div>

      <form v-if="selectedBuilding" class="admin-building-form" @submit.prevent="submit">
        <div class="admin-building-preview">
          <div>
            <p class="eyebrow">Konfiguráció</p>
            <h5 class="section-title">{{ selectedBuilding.label }}</h5>
          </div>
          <p class="muted">{{ selectedBuilding.description }}</p>
        </div>

        <div class="detail-list">
          <div class="detail-row">
            <span class="compact-label">Jelenlegi szint</span>
            <strong>{{ selectedBuilding.level }}</strong>
          </div>
          <div class="detail-row">
            <span class="compact-label">Feloldás</span>
            <strong>{{ selectedBuilding.requiredLevel }}. szint</strong>
          </div>
          <div class="detail-row">
            <span class="compact-label">Passzív output</span>
            <strong>{{ selectedBuilding.passiveProduction.length }} tétel</strong>
          </div>
        </div>

        <label class="field-label">
          Cél szint
          <input v-model.number="level" class="auth-input" type="number" min="1" max="50" />
        </label>

        <div v-if="selectedBuilding.passiveProduction.length" class="component-list">
          <div
            v-for="output in selectedBuilding.passiveProduction"
            :key="`${selectedBuilding.key}-${output.resourceKey}`"
            class="component-item"
          >
            <span>{{ output.resourceKey }}</span>
            <strong>{{ output.amount }}</strong>
          </div>
        </div>

        <button class="primary-button" type="submit">Épületszint mentése</button>
      </form>
    </div>
  </article>
</template>
