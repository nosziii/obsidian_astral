<script setup lang="ts">
import type { MarketplaceListing, MarketplaceTrend } from "../../lib/marketplace-overview";

defineProps<{
  listings: MarketplaceListing[];
  trends: MarketplaceTrend[];
}>();
</script>

<template>
  <aside class="marketplace-side">
    <section class="marketplace-stats panel">
      <h2 class="eyebrow">Piaci statisztika</h2>
      <div class="marketplace-stats__grid">
        <article class="data-card">
          <span class="compact-label">Ajánlatok</span>
          <strong class="value-strong">{{ listings.length }}</strong>
        </article>
        <article class="data-card">
          <span class="compact-label">Azonnali vétel</span>
          <strong class="value-strong">{{ listings.filter((item) => item.buyoutOnly).length }}</strong>
        </article>
      </div>

      <div class="marketplace-stats__block">
        <h3 class="compact-label">Trendek</h3>
        <div class="tag-row">
          <span v-for="trend in trends" :key="trend.label" class="tag-pill" :class="trend.tone">{{ trend.label }}</span>
        </div>
      </div>
    </section>

    <section class="marketplace-activity panel">
      <h2 class="eyebrow">Élő aktivitás</h2>
      <div class="marketplace-activity__list">
        <article v-for="listing in listings.slice(0, 4)" :key="listing.id" class="marketplace-activity__item">
          <span class="marketplace-activity__dot" :class="`tone-${listing.rarity}`"></span>
          <div>
            <strong>{{ listing.sellerName }}</strong>
            <p>{{ listing.title }} listázva</p>
          </div>
        </article>
      </div>
    </section>
  </aside>
</template>
