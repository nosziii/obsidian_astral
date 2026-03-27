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
  <BasePanel title="Gyűjtési műveletek" subtitle="Erőforrás kör">
    <div class="card-list">
      <article v-for="item in items" :key="item.key" class="action-card">
        <div>
          <h4>{{ item.label }}</h4>
          <p class="muted">{{ item.description }}</p>
        </div>
        <div class="action-meta">
          <span>{{ item.energyCost }} energia</span>
          <span>{{ item.rewardXp }} XP</span>
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
