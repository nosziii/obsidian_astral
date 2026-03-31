<script setup lang="ts">
import type { ActivitySnapshot, GatheringDefinition } from "@obsidian-astral/shared";

import { formatProfessionLabel } from "../../lib/formatters";
import BasePanel from "../ui/BasePanel.vue";
import ActivityTimeline from "./ActivityTimeline.vue";

const props = defineProps<{
  activities: ActivitySnapshot[];
  items: GatheringDefinition[];
  now: number;
  pendingAction: string | null;
  playerLevel: number;
}>();

const emit = defineEmits<{
  gather: [actionKey: string];
}>();

function activityFor(actionKey: string) {
  return props.activities.find((item) => item.kind === "gathering" && item.targetKey === actionKey) ?? null;
}
</script>

<template>
  <BasePanel title="Folyamatban lévő műveletek" subtitle="Queue nézet">
    <div class="card-list gathering-grid">
      <article v-for="item in items" :key="item.key" class="action-card gathering-card">
        <div class="gathering-card-main">
          <div class="progress-icon">
            <span class="material-symbols-outlined">handyman</span>
          </div>

          <div class="gathering-card-copy">
            <div class="gathering-card-head">
              <h4 class="card-title">{{ item.label }}</h4>
              <button
                class="primary-button gathering-card-button"
                type="button"
                :disabled="playerLevel < item.requiredLevel || pendingAction === `gather:${item.key}` || !!activityFor(item.key)"
                @click="emit('gather', item.key)"
              >
                {{
                  playerLevel < item.requiredLevel
                    ? `${item.requiredLevel}. szint kell`
                    : pendingAction === `gather:${item.key}` || activityFor(item.key)
                      ? "Folyamatban..."
                      : "Indítás"
                }}
              </button>
            </div>

            <p class="muted">{{ item.description }}</p>

            <ActivityTimeline :activity="activityFor(item.key)" :now="now" idle-text="Indítható" />

            <div class="gathering-meta">
              <span class="compact-label">{{ item.durationSeconds }} mp</span>
              <span class="compact-label">Szakma: {{ formatProfessionLabel(item.profession) }}</span>
            </div>
          </div>
        </div>
      </article>
    </div>
  </BasePanel>
</template>
