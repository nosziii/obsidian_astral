<script setup lang="ts">
import type { ExpeditionDefinition, ExpeditionSnapshot, ZoneSnapshot } from "@obsidian-astral/shared";

import BasePanel from "../ui/BasePanel.vue";
import { calculateMissionProgress, type MissionMetric } from "../../lib/expedition-overview";
import { formatCategoryLabel } from "../../lib/formatters";

const props = defineProps<{
  expedition: ExpeditionDefinition;
  run: ExpeditionSnapshot | null;
  zone: ZoneSnapshot | null;
  metrics: MissionMetric[];
  now: number;
}>();

const missionProgress = calculateMissionProgress(props.run, props.expedition, props.now);
</script>

<template>
  <BasePanel :title="expedition.label" subtitle="Részletes expedíciós run">
    <section class="mission-hero">
      <div class="mission-hero-copy">
        <div class="tag-row">
          <span class="tag-pill" :class="expedition.risk === 'magas' ? 'danger' : expedition.risk === 'kozepes' ? 'secondary' : 'success'">
            {{ formatCategoryLabel(expedition.risk) }}
          </span>
          <span class="compact-label">{{ zone?.label ?? "Nincs zóna" }}</span>
        </div>

        <h2 class="mission-hero-title">{{ expedition.label }}</h2>
        <p class="muted">{{ expedition.description }}</p>

        <div class="detail-list">
          <div class="detail-row">
            <span class="compact-label">Állapot</span>
            <strong>{{ missionProgress.statusLabel }}</strong>
          </div>
          <div class="detail-row">
            <span class="compact-label">Ajánlott szint</span>
            <strong>{{ expedition.requiredLevel }}. szint</strong>
          </div>
          <div class="detail-row">
            <span class="compact-label">Időtartam</span>
            <strong>{{ expedition.durationMinutes }} perc</strong>
          </div>
        </div>
      </div>

      <div class="mission-track-shell">
        <div class="mission-track-labels">
          <span>Belépés</span>
          <span>Futás</span>
          <span>Kiemelés</span>
        </div>
        <div class="mission-track">
          <div class="mission-track-progress" :style="{ width: `${missionProgress.progressPercent}%` }" />
          <div class="mission-track-node is-complete" />
          <div class="mission-track-node" :class="{ 'is-complete': missionProgress.progressPercent >= 50 }" />
          <div class="mission-track-node" :class="{ 'is-complete': missionProgress.progressPercent >= 100 }" />
          <div class="mission-track-cursor" :style="{ left: `${missionProgress.progressPercent}%` }" />
        </div>
      </div>
    </section>

    <div class="mission-metric-grid">
      <article v-for="metric in metrics" :key="metric.label" class="mission-metric-card" :class="metric.tone">
        <span class="compact-label">{{ metric.label }}</span>
        <strong class="value-strong">{{ metric.value }}</strong>
      </article>
    </div>
  </BasePanel>
</template>
