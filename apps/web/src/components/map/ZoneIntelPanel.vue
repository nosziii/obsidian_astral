<script setup lang="ts">
import type { ExpeditionDefinition, ExpeditionSnapshot, ZoneSnapshot } from "@obsidian-astral/shared";
import { RouterLink } from "vue-router";

import { formatCategoryLabel } from "../../lib/formatters";

defineProps<{
  zone: ZoneSnapshot | null;
  expeditions: ExpeditionDefinition[];
  activeRuns: ExpeditionSnapshot[];
  metrics: Array<{ label: string; value: string }>;
}>();
</script>

<template>
  <aside class="zone-intel">
    <section class="zone-intel__hero panel section-panel">
      <p class="eyebrow">Sector Readout</p>
      <h2 class="section-title">{{ zone?.label ?? "Válassz zónát" }}</h2>
      <p class="muted">{{ zone?.description ?? "A zónaadatok a kiválasztás után jelennek meg." }}</p>

      <div v-if="zone" class="tag-row">
        <span class="tag-pill">{{ formatCategoryLabel(zone.status) }}</span>
        <span class="tag-pill secondary">{{ formatCategoryLabel(zone.risk) }}</span>
      </div>
    </section>

    <section class="zone-intel__metrics panel section-panel">
      <article v-for="metric in metrics" :key="metric.label" class="zone-intel__metric">
        <span class="compact-label">{{ metric.label }}</span>
        <strong class="value-strong">{{ metric.value }}</strong>
      </article>
    </section>

    <section class="zone-intel__missions panel section-panel">
      <header class="section-header">
        <div>
          <p class="eyebrow">Mission Feed</p>
          <h3 class="section-title">Kapcsolódó expedíciók</h3>
        </div>
        <RouterLink class="ghost-button" to="/expeditions">Részletek</RouterLink>
      </header>

      <div class="zone-intel__mission-list">
        <article v-for="expedition in expeditions" :key="expedition.key" class="zone-intel__mission-card">
          <div class="detail-row">
            <strong>{{ expedition.label }}</strong>
            <span class="compact-label">{{ expedition.requiredLevel }}. szint</span>
          </div>
          <p class="muted">{{ expedition.description }}</p>
          <div class="detail-row">
            <span class="compact-label">{{ expedition.durationMinutes }} perc</span>
            <span class="chip">{{ formatCategoryLabel(expedition.risk) }}</span>
          </div>
        </article>
        <p v-if="!expeditions.length" class="muted">Ehhez a zónához még nincs kijelölt expedíciós terv.</p>
      </div>
    </section>

    <section class="zone-intel__missions panel section-panel">
      <header class="section-header">
        <div>
          <p class="eyebrow">Live Signal</p>
          <h3 class="section-title">Folyamatban lévő futamok</h3>
        </div>
      </header>
      <div class="zone-intel__mission-list">
        <article v-for="run in activeRuns" :key="run.id" class="zone-intel__mission-card">
          <div class="detail-row">
            <strong>{{ run.label }}</strong>
            <span class="tag-pill success">{{ formatCategoryLabel(run.status) }}</span>
          </div>
          <div class="detail-row">
            <span class="compact-label">Indult</span>
            <span>{{ new Intl.DateTimeFormat("hu-HU", { hour: "2-digit", minute: "2-digit" }).format(new Date(run.startedAt)) }}</span>
          </div>
        </article>
        <p v-if="!activeRuns.length" class="muted">Nincs aktív futam a kiválasztott zónában.</p>
      </div>
    </section>
  </aside>
</template>
