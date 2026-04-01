<script setup lang="ts">
import type { CharacterInventoryEntry } from "../../lib/character-overview";

import { getEquipmentSlotIcon, getEquipmentTone } from "../../lib/character-overview";

defineProps<{
  entries: CharacterInventoryEntry[];
  selectedItemKey: string | null;
}>();

defineEmits<{
  (event: "select-item", itemKey: string): void;
}>();
</script>

<template>
  <section class="character-inventory panel section-panel">
    <header class="section-header">
      <div>
        <p class="eyebrow">Data Vault</p>
        <h3 class="section-title">Felszereléskészlet</h3>
      </div>
    </header>

    <div class="character-inventory__grid">
      <button
        v-for="entry in entries"
        :key="entry.itemKey"
        class="inventory-cell"
        :class="[`tone-${getEquipmentTone(entry.definition?.rarity)}`, { 'is-selected': selectedItemKey === entry.itemKey }]"
        type="button"
        @click="$emit('select-item', entry.itemKey)"
      >
        <span class="material-symbols-outlined">{{ getEquipmentSlotIcon(entry.definition?.slot ?? "") }}</span>
        <span v-if="entry.isEquipped" class="inventory-cell__badge">Aktív</span>
        <span class="inventory-cell__count">x{{ entry.quantity }}</span>
      </button>
    </div>
  </section>
</template>
