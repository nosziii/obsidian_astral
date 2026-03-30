<script setup lang="ts">
import type { CommEntry, RewardPreviewItem, ThreatSignal } from "../../lib/expedition-overview";

import BasePanel from "../ui/BasePanel.vue";

defineProps<{
  rewards: RewardPreviewItem[];
  threats: ThreatSignal[];
  comms: CommEntry[];
}>();
</script>

<template>
  <div class="mission-sidebar-grid">
    <BasePanel title="Kinyerhető jutalmak" subtitle="Loot secured">
      <div class="loot-list">
        <article v-for="reward in rewards" :key="reward.key" class="loot-card">
          <div>
            <p class="card-title">{{ reward.label }}</p>
            <p class="muted">{{ reward.category }}</p>
          </div>
          <strong>{{ reward.amount }}</strong>
        </article>
      </div>
    </BasePanel>

    <BasePanel title="Fenyegetési radar" subtitle="Threat board">
      <div class="threat-grid">
        <article v-for="threat in threats" :key="threat.title" class="signal-card" :class="threat.tone">
          <div class="tag-row">
            <span class="compact-label">{{ threat.title }}</span>
            <span class="tag-pill" :class="threat.tone">{{ threat.level }}</span>
          </div>
          <p class="muted">{{ threat.detail }}</p>
        </article>
      </div>
    </BasePanel>

    <BasePanel title="Műveleti csatorna" subtitle="Mission comms">
      <div class="comm-log">
        <article v-for="entry in comms" :key="`${entry.timestamp}-${entry.source}`" class="comm-entry">
          <span class="comm-timestamp">{{ entry.timestamp }}</span>
          <div>
            <p class="comm-source" :class="entry.tone">{{ entry.source }}</p>
            <p class="muted">{{ entry.message }}</p>
          </div>
        </article>
      </div>
    </BasePanel>
  </div>
</template>
