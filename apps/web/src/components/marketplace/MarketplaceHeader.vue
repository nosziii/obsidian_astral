<script setup lang="ts">
import type { MarketplaceMode } from "../../lib/marketplace-overview";

defineProps<{
  credits: string;
  astralite: string;
  mode: MarketplaceMode;
  query: string;
}>();

defineEmits<{
  (event: "update:mode", value: MarketplaceMode): void;
  (event: "update:query", value: string): void;
}>();
</script>

<template>
  <header class="marketplace-header">
    <div>
      <p class="eyebrow">Player exchange</p>
      <h1 class="marketplace-header__title">Piactér</h1>
      <p class="muted">Aktív ajánlatok és saját készlet egy közös, taktikai kereskedelmi nézetben.</p>
    </div>

    <div class="marketplace-header__controls">
      <div class="marketplace-balance">
        <div class="marketplace-balance__pill">
          <span class="material-symbols-outlined">monetization_on</span>
          <strong>{{ credits }}</strong>
        </div>
        <div class="marketplace-balance__pill secondary">
          <span class="material-symbols-outlined">diamond</span>
          <strong>{{ astralite }}</strong>
        </div>
      </div>

      <div class="marketplace-header__toolbar">
        <div class="marketplace-tabs">
          <button
            class="marketplace-tabs__button"
            :class="{ 'is-active': mode === 'buy' }"
            type="button"
            @click="$emit('update:mode', 'buy')"
          >
            Vásárlás
          </button>
          <button
            class="marketplace-tabs__button"
            :class="{ 'is-active': mode === 'sell' }"
            type="button"
            @click="$emit('update:mode', 'sell')"
          >
            Eladás
          </button>
        </div>

        <label class="marketplace-search">
          <span class="material-symbols-outlined">search</span>
          <input
            :value="query"
            type="text"
            placeholder="Keresés tárgyra, eladóra vagy tulajdonságra..."
            @input="$emit('update:query', ($event.target as HTMLInputElement).value)"
          />
        </label>
      </div>
    </div>
  </header>
</template>
