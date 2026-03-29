<script setup lang="ts">
import type { GatheringDefinition } from "@obsidian-astral/shared";

import BasePanel from "../ui/BasePanel.vue";

defineProps<{
  items: GatheringDefinition[];
  pendingAction: string | null;
}>();

const emit = defineEmits<{
  gather: [actionKey: string];
}>();
</script>

<template>
  <BasePanel title="Folyamatban lévő műveletek" subtitle="Queue nézet">
    <div class="card-list">
      <article v-for="item in items" :key="item.key" class="action-card progress-card">
        <div class="progress-icon">⚒</div>
        <div>
          <h4 class="card-title">{{ item.label }}</h4>
          <p class="muted">{{ item.description }}</p>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: `${Math.min(96, item.rewardXp * 4)}%` }" />
          </div>
          <div class="chip-row">
            <span class="compact-label">Állapot: aktív kitermelési fázis</span>
            <span class="compact-label">{{ item.durationSeconds }} mp</span>
          </div>
        </div>
        <button
          class="primary-button"
          type="button"
          :disabled="pendingAction === `gather:${item.key}`"
          @click="emit('gather', item.key)"
        >
          {{ pendingAction === `gather:${item.key}` ? "Folyamatban…" : "Indítás" }}
        </button>
      </article>
    </div>
  </BasePanel>
</template>
