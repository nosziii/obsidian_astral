<script setup lang="ts">
import type { MarketplaceCategory, MarketplaceRarity } from "../../lib/marketplace-overview";

defineProps<{
  activeCategory: MarketplaceCategory;
  buyoutOnly: boolean;
  rarity: MarketplaceRarity;
  verifiedOnly: boolean;
}>();

defineEmits<{
  (event: "update:category", value: MarketplaceCategory): void;
  (event: "update:rarity", value: MarketplaceRarity): void;
  (event: "update:buyoutOnly", value: boolean): void;
  (event: "update:verifiedOnly", value: boolean): void;
}>();

const categories: Array<{ key: MarketplaceCategory; label: string }> = [
  { key: "all", label: "Minden kategória" },
  { key: "weapons", label: "Fegyver és felszerelés" },
  { key: "materials", label: "Anyagok" },
  { key: "relics", label: "Relikviák" },
];

const rarities: Array<{ key: MarketplaceRarity; label: string }> = [
  { key: "all", label: "Mind" },
  { key: "common", label: "Gyakori" },
  { key: "rare", label: "Ritka" },
  { key: "epic", label: "Epikus" },
];
</script>

<template>
  <aside class="marketplace-filters panel">
    <section class="marketplace-filters__group">
      <h2 class="compact-label">Kategória</h2>
      <div class="marketplace-filters__options">
        <button
          v-for="category in categories"
          :key="category.key"
          class="marketplace-filters__option"
          :class="{ 'is-active': activeCategory === category.key }"
          type="button"
          @click="$emit('update:category', category.key)"
        >
          {{ category.label }}
        </button>
      </div>
    </section>

    <section class="marketplace-filters__group">
      <h2 class="compact-label">Ritkaság</h2>
      <div class="marketplace-filters__rarities">
        <button
          v-for="entry in rarities"
          :key="entry.key"
          class="marketplace-filters__rarity"
          :class="[`tone-${entry.key}`, { 'is-active': rarity === entry.key }]"
          type="button"
          @click="$emit('update:rarity', entry.key)"
        >
          {{ entry.label }}
        </button>
      </div>
    </section>

    <section class="marketplace-filters__group">
      <h2 class="compact-label">Gyors kapcsolók</h2>
      <label class="marketplace-switch">
        <span>Azonnali vétel</span>
        <button class="marketplace-switch__toggle" :class="{ 'is-active': buyoutOnly }" type="button" @click="$emit('update:buyoutOnly', !buyoutOnly)">
          <span></span>
        </button>
      </label>

      <label class="marketplace-switch">
        <span>Ellenőrzött eladók</span>
        <button class="marketplace-switch__toggle" :class="{ 'is-active': verifiedOnly }" type="button" @click="$emit('update:verifiedOnly', !verifiedOnly)">
          <span></span>
        </button>
      </label>
    </section>
  </aside>
</template>
