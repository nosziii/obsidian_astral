<script setup lang="ts">
import type { ActivitySnapshot } from "@obsidian-astral/shared";

import { calculateActivityProgress, calculateRemainingSeconds, formatRemainingSeconds } from "../../lib/activity-progress";
import { formatCategoryLabel } from "../../lib/formatters";
import BasePanel from "../ui/BasePanel.vue";

defineProps<{
  activities: ActivitySnapshot[];
  now: number;
}>();
</script>

<template>
  <BasePanel title="Aktív események" subtitle="Élő követés">
    <div v-if="activities.length" class="log-list activity-feed-compact">
      <article v-for="activity in activities" :key="activity.id" class="log-item live-log-item">
        <div>
          <strong>{{ activity.label }}</strong>
          <p class="muted">{{ formatCategoryLabel(activity.kind) }}</p>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: `${calculateActivityProgress(activity, now)}%` }" />
          </div>
        </div>
        <span class="tag-pill" :class="activity.status === 'befejezve' ? 'success' : ''">
          {{ formatRemainingSeconds(calculateRemainingSeconds(activity, now)) }}
        </span>
      </article>
    </div>

    <p v-else class="muted">Jelenleg nincs futó időzített esemény.</p>
  </BasePanel>
</template>
