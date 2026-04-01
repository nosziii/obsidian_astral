<script setup lang="ts">
import type { ExpeditionHistorySnapshot } from "@obsidian-astral/shared";

import BasePanel from "../ui/BasePanel.vue";

defineProps<{
  entries: ExpeditionHistorySnapshot[];
  errorMessage: string;
}>();
</script>

<template>
  <BasePanel title="Expedíciós napló" subtitle="Előzmények">
    <p v-if="errorMessage" class="status-banner error">{{ errorMessage }}</p>

    <div v-if="entries.length" class="expedition-history-list">
      <article v-for="entry in entries" :key="entry.id" class="expedition-history-card">
        <div class="tag-row">
          <span class="tag-pill" :class="entry.claimedAt ? 'success' : 'secondary'">
            {{ entry.claimedAt ? "Átvéve" : "Lezárt" }}
          </span>
          <span class="compact-label">{{ new Date(entry.endedAt).toLocaleString("hu-HU") }}</span>
        </div>
        <h4 class="card-title">{{ entry.label }}</h4>
        <div class="detail-list">
          <div v-for="reward in entry.rewards" :key="`${entry.id}-${reward.resourceKey}`" class="detail-row">
            <span>{{ reward.resourceKey }}</span>
            <strong>{{ reward.amount }}</strong>
          </div>
        </div>
      </article>
    </div>

    <p v-else class="muted">Még nincs lezárt expedíció az előzményekben.</p>
  </BasePanel>
</template>
