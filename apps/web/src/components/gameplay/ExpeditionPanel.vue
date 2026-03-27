<script setup lang="ts">
import type { ExpeditionDefinition, ExpeditionSnapshot } from "@obsidian-astral/shared";

import BasePanel from "../ui/BasePanel.vue";

defineProps<{
  catalog: ExpeditionDefinition[];
  activeRuns: ExpeditionSnapshot[];
  pendingAction: string | null;
}>();

const emit = defineEmits<{
  start: [expeditionKey: string];
  claim: [expeditionId: string];
}>();

function remainingText(endsAt: string) {
  const diff = new Date(endsAt).getTime() - Date.now();

  if (diff <= 0) {
    return "Befejezve";
  }

  return `${Math.ceil(diff / 60000)} perc`;
}
</script>

<template>
  <BasePanel title="Expedíciók" subtitle="Térképasztal">
    <div class="card-list">
      <article v-for="expedition in catalog" :key="expedition.key" class="action-card">
        <div class="tag-row">
          <p class="eyebrow">{{ expedition.risk }}</p>
          <span class="chip">{{ expedition.durationMinutes }} perc</span>
        </div>
        <h4>{{ expedition.label }}</h4>
        <p class="muted">{{ expedition.description }}</p>
        <div class="action-meta">
          <span>{{ expedition.energyCost }} energia</span>
          <span>{{ expedition.rewardXp }} XP</span>
        </div>
        <button
          class="primary-button"
          type="button"
          :disabled="pendingAction === `expedition:${expedition.key}`"
          @click="emit('start', expedition.key)"
        >
          {{ pendingAction === `expedition:${expedition.key}` ? "Indítás…" : "Kiküldés" }}
        </button>
      </article>
    </div>

    <div class="divider" />

    <div class="card-list">
      <article v-for="run in activeRuns" :key="run.id" class="action-card">
        <div class="tag-row">
          <p class="eyebrow">{{ run.label }}</p>
          <span class="chip">{{ remainingText(run.endsAt) }}</span>
        </div>
        <h4>{{ run.status === "befejezve" ? "Jutalom átvehető" : "Művelet folyamatban" }}</h4>
        <p class="muted">Kezdés: {{ new Date(run.startedAt).toLocaleString("hu-HU") }}</p>
        <button
          class="secondary-button"
          type="button"
          :disabled="run.status !== 'befejezve' || pendingAction === `claim:${run.id}`"
          @click="emit('claim', run.id)"
        >
          {{ pendingAction === `claim:${run.id}` ? "Átvétel…" : "Jutalom felvétele" }}
        </button>
      </article>
    </div>
  </BasePanel>
</template>
