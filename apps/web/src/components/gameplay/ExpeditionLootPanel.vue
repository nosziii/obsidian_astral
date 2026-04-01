<script setup lang="ts">
import type { RewardPreviewItem } from "../../lib/expedition-overview";

defineProps<{
  rewards: RewardPreviewItem[];
}>();
</script>

<template>
  <section class="expedition-column">
    <div class="expedition-section-heading">
      <span class="material-symbols-outlined">inventory_2</span>
      <h2>Loot secured</h2>
    </div>

    <div class="loot-secured-panel">
      <div class="loot-secured-panel__header">
        <span class="compact-label">Aktív kinyerés</span>
        <span class="compact-label">{{ rewards.length }} tétel</span>
      </div>

      <div class="loot-secured-list">
        <article v-for="reward in rewards" :key="reward.key" class="loot-secured-item">
          <div class="loot-secured-item__icon">
            <span class="material-symbols-outlined">deployed_code</span>
          </div>
          <div class="loot-secured-item__copy">
            <h4 class="card-title">{{ reward.label }}</h4>
            <div class="detail-row">
              <span class="compact-label">{{ reward.category }}</span>
              <strong>{{ reward.amount }}</strong>
            </div>
          </div>
        </article>
      </div>

      <div class="loot-secured-panel__footer">
        <span class="compact-label">Becsült érték</span>
        <strong>{{ new Intl.NumberFormat("hu-HU").format(rewards.reduce((sum, reward) => sum + reward.amount * 120, 0)) }} Cr</strong>
      </div>
    </div>
  </section>
</template>
