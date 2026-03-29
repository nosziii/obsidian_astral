<script setup lang="ts">
import type { ExpeditionDefinition, ExpeditionSnapshot } from "@obsidian-astral/shared";

import { formatCategoryLabel } from "../../lib/formatters";
import BasePanel from "../ui/BasePanel.vue";

const props = defineProps<{
  catalog: ExpeditionDefinition[];
  activeRuns: ExpeditionSnapshot[];
  pendingAction: string | null;
  playerLevel: number;
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

  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.ceil((diff % 3_600_000) / 60_000);

  return hours > 0 ? `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}` : `${minutes} perc`;
}

function riskTone(risk: ExpeditionDefinition["risk"]) {
  if (risk === "magas") {
    return "danger";
  }

  if (risk === "kozepes") {
    return "secondary";
  }

  return "success";
}

function progressWidth(expedition: ExpeditionDefinition) {
  return `${Math.min(92, expedition.rewardXp + expedition.energyCost * 2)}%`;
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
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progressWidth(expedition) }" />
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
          <span class="tag-pill" :class="run.status === 'befejezve' ? 'success' : ''">
            {{ remainingText(run.endsAt) }}
          </span>
        </div>
        <div>
          <h4 class="card-title">
            {{ run.status === "befejezve" ? "Jutalom átvehető" : "Művelet folyamatban" }}
          </h4>
          <p class="muted">Kezdés: {{ new Date(run.startedAt).toLocaleString("hu-HU") }}</p>
        </div>
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
