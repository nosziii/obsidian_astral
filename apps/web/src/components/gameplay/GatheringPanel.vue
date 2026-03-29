<script setup lang="ts">
import type { GatheringDefinition } from "@obsidian-astral/shared";

import { formatProfessionLabel } from "../../lib/formatters";
import BasePanel from "../ui/BasePanel.vue";

defineProps<{
  items: GatheringDefinition[];
  pendingAction: string | null;
  playerLevel: number;
}>();

const emit = defineEmits<{
  gather: [actionKey: string];
}>();
</script>

<template>
  <BasePanel title="Folyamatban lévő műveletek" subtitle="Queue nézet">
    <div class="card-list">
      <article v-for="item in items" :key="item.key" class="action-card gathering-card">
        <div class="gathering-card-main">
          <div class="progress-icon">⚒</div>

          <div class="gathering-card-copy">
            <div class="gathering-card-head">
              <h4 class="card-title">{{ item.label }}</h4>
              <button
                class="primary-button gathering-card-button"
                type="button"
                :disabled="playerLevel < item.requiredLevel || pendingAction === `gather:${item.key}`"
                @click="emit('gather', item.key)"
              >
                {{
                  playerLevel < item.requiredLevel
                    ? `${item.requiredLevel}. szint kell`
                    : pendingAction === `gather:${item.key}`
                      ? "Folyamatban…"
                      : "Indítás"
                }}
              </button>
            </div>

            <p class="muted">{{ item.description }}</p>

            <div class="progress-track">
              <div class="progress-fill" :style="{ width: `${Math.min(96, item.rewardXp * 4)}%` }" />
            </div>

            <div class="gathering-meta">
              <span class="compact-label">Állapot: aktív kitermelési fázis</span>
              <span class="compact-label">{{ item.durationSeconds }} mp</span>
              <span class="compact-label">Szakma: {{ formatProfessionLabel(item.profession) }}</span>
            </div>
          </div>
        </div>
      </article>
    </div>
  </BasePanel>
</template>
