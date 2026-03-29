<script setup lang="ts">
import { computed } from "vue";
import type { ActivitySnapshot } from "@obsidian-astral/shared";

import { calculateActivityProgress, calculateRemainingSeconds, formatRemainingSeconds } from "../../lib/activity-progress";

const props = defineProps<{
  activity: ActivitySnapshot | null;
  now: number;
  idleText: string;
}>();

const progressPercent = computed(() => {
  if (!props.activity) {
    return 0;
  }

  return calculateActivityProgress(props.activity, props.now);
});

const remainingText = computed(() => {
  if (!props.activity) {
    return props.idleText;
  }

  return formatRemainingSeconds(calculateRemainingSeconds(props.activity, props.now));
});
</script>

<template>
  <div class="activity-timeline">
    <div class="detail-row">
      <span class="compact-label">Állapot</span>
      <strong>{{ activity ? activity.status : "készenlét" }}</strong>
    </div>
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: `${progressPercent}%` }" />
    </div>
    <div class="detail-row">
      <span class="compact-label">Hátralévő idő</span>
      <strong>{{ remainingText }}</strong>
    </div>
  </div>
</template>
