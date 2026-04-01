<script setup lang="ts">
import { computed, ref } from "vue";

import MarketplaceFilters from "../components/marketplace/MarketplaceFilters.vue";
import MarketplaceHeader from "../components/marketplace/MarketplaceHeader.vue";
import MarketplaceListingGrid from "../components/marketplace/MarketplaceListingGrid.vue";
import MarketplaceStatsPanel from "../components/marketplace/MarketplaceStatsPanel.vue";
import { useGameState } from "../composables/use-game-state";
import {
  buildMarketplaceListings,
  buildMarketplaceSellCards,
  buildMarketplaceTrends,
  filterMarketplaceListings,
  type MarketplaceCategory,
  type MarketplaceMode,
  type MarketplaceRarity,
} from "../lib/marketplace-overview";

const { gameState } = useGameState();

const mode = ref<MarketplaceMode>("buy");
const activeCategory = ref<MarketplaceCategory>("all");
const rarity = ref<MarketplaceRarity>("all");
const buyoutOnly = ref(false);
const verifiedOnly = ref(false);
const query = ref("");

const listings = computed(() => (gameState.value ? buildMarketplaceListings(gameState.value) : []));
const filteredListings = computed(() =>
  filterMarketplaceListings(listings.value, {
    category: activeCategory.value,
    query: query.value,
    rarity: rarity.value,
    buyoutOnly: buyoutOnly.value,
    verifiedOnly: verifiedOnly.value,
  }),
);
const sellCards = computed(() => (gameState.value ? buildMarketplaceSellCards(gameState.value) : []));
const trends = computed(() => buildMarketplaceTrends(filteredListings.value));
</script>

<template>
  <div v-if="gameState" class="marketplace-layout">
    <MarketplaceHeader
      :astralite="new Intl.NumberFormat('hu-HU').format(gameState.player.astralite)"
      :credits="new Intl.NumberFormat('hu-HU').format(gameState.player.credits)"
      :mode="mode"
      :query="query"
      @update:mode="mode = $event"
      @update:query="query = $event"
    />

    <div class="marketplace-canvas">
      <MarketplaceFilters
        :active-category="activeCategory"
        :buyout-only="buyoutOnly"
        :rarity="rarity"
        :verified-only="verifiedOnly"
        @update:buyout-only="buyoutOnly = $event"
        @update:category="activeCategory = $event"
        @update:rarity="rarity = $event"
        @update:verified-only="verifiedOnly = $event"
      />

      <MarketplaceListingGrid :listings="filteredListings" :mode="mode" :sell-cards="sellCards" />

      <MarketplaceStatsPanel :listings="filteredListings" :trends="trends" />
    </div>
  </div>
</template>
