<script setup lang="ts">
import type { ActivitySnapshot, ExpeditionDefinition, ExpeditionSnapshot } from "@obsidian-astral/shared";

import { formatCategoryLabel } from "../../lib/formatters";
import ActivityTimeline from "./ActivityTimeline.vue";
import BasePanel from "../ui/BasePanel.vue";

const props = defineProps<{
  activities: ActivitySnapshot[];
  catalog: ExpeditionDefinition[];
  activeRuns: ExpeditionSnapshot[];
  now: number;
  pendingAction: string | null;
  playerLevel: number;
}>();

const emit = defineEmits<{
  start: [expeditionKey: string];
  claim: [expeditionId: string];
}>();

function riskTone(risk: ExpeditionDefinition["risk"]) {
  if (risk === "magas") {
    return "danger";
  }

  if (risk === "kozepes") {
    return "secondary";
  }

  return "success";
}

function activityForRun(expeditionId: string) {
  return props.activities.find((item) => item.kind === "expedition" && item.id === expeditionId) ?? null;
}
</script>

<template>
  <BasePanel title="Expedíciók" subtitle="Aktív műveletek">
    <div class="expedition-sidebar">
      <article v-for="expedition in catalog" :key="expedition.key" class="action-card expedition-card">
        <div class="tag-row">
          <span class="compact-label">Célpont</span>
          <span class="tag-pill" :class="riskTone(expedition.risk)">{{ formatCategoryLabel(expedition.risk) }}</span>
        </div>
        <div>
          <h4 class="card-title">{{ expedition.label }}</h4>
          <p class="muted">{{ expedition.description }}</p>
        </div>
        <div class="detail-row">
          <span class="compact-label">Időtartam</span>
          <strong>{{ expedition.durationMinutes }} perc</strong>
        </div>
        <div class="detail-row">
          <span class="compact-label">Energia</span>
          <strong>{{ expedition.energyCost }}</strong>
        </div>
        <div class="detail-row">
          <span class="compact-label">Feloldás</span>
          <strong>{{ expedition.requiredLevel }}. szint</strong>
        </div>
        <button
          class="primary-button"
          type="button"
          :disabled="playerLevel < expedition.requiredLevel || pendingAction === `expedition:${expedition.key}`"
          @click="emit('start', expedition.key)"
        >
          {{
            playerLevel < expedition.requiredLevel
              ? `${expedition.requiredLevel}. szint kell`
              : pendingAction === `expedition:${expedition.key}`
                ? "Indítás…"
                : "Expedíció küldése"
          }}
        </button>
      </article>

      <div class="divider" />

      <article v-for="run in activeRuns" :key="run.id" class="action-card expedition-card">
        <div class="tag-row">
          <span class="compact-label">{{ run.label }}</span>
          <span class="tag-pill" :class="run.status === 'befejezve' ? 'success' : ''">{{ run.status }}</span>
        </div>
        <div>
          <h4 class="card-title">
            {{ run.status === "befejezve" ? "Jutalom átvehető" : "Művelet folyamatban" }}
          </h4>
          <p class="muted">Kezdés: {{ new Date(run.startedAt).toLocaleString("hu-HU") }}</p>
        </div>
        <ActivityTimeline :activity="activityForRun(run.id)" :now="now" idle-text="Lezárva" />
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
