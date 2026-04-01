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
  <BasePanel :title="expedition.label" subtitle="Részletes expedíciós futam">
    <section class="mission-command-board">
      <header class="mission-command-board__header">
        <div class="tag-row">
          <span class="tag-pill" :class="expedition.risk === 'magas' ? 'danger' : expedition.risk === 'kozepes' ? 'secondary' : 'success'">
            {{ formatCategoryLabel(expedition.risk) }}
          </span>
          <span class="compact-label">{{ zone?.label ?? "Ismeretlen zóna" }}</span>
        </div>

        <h2 class="mission-hero-title">{{ expedition.label }}</h2>
        <p class="muted">{{ expedition.description }}</p>

        <div class="mission-command-board__meta">
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
      </header>

      <div class="mission-map-shell">
        <div class="mission-map-shell__labels">
          <span>Belépés</span>
          <span>Vault A</span>
          <span>Station Delta</span>
          <span>Kinyerés</span>
        </div>

        <div class="mission-map-shell__timeline">
          <div class="mission-map-shell__track"></div>
          <div class="mission-map-shell__progress" :style="{ width: `${missionProgress.progressPercent}%` }"></div>

          <div class="mission-map-shell__node is-complete"></div>
          <div class="mission-map-shell__node" :class="{ 'is-complete': missionProgress.progressPercent >= 40 }"></div>
          <div class="mission-map-shell__cursor" :style="{ left: `${Math.max(10, missionProgress.progressPercent)}%` }">
            <span class="material-symbols-outlined">navigation</span>
          </div>
          <div class="mission-map-shell__node" :class="{ 'is-complete': missionProgress.progressPercent >= 100 }"></div>
        </div>

        <div class="mission-map-shell__rings" aria-hidden="true">
          <div></div>
          <div></div>
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
