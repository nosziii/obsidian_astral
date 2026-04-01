<script setup lang="ts">
import { computed, ref, watch } from "vue";

import CharacterFocusPanel from "../components/character/CharacterFocusPanel.vue";
import CharacterInventoryGrid from "../components/character/CharacterInventoryGrid.vue";
import CharacterPaperdoll from "../components/character/CharacterPaperdoll.vue";
import { useGameState } from "../composables/use-game-state";
import { buildCharacterInventory, buildCharacterStats } from "../lib/character-overview";

const { equipItem, gameState, pendingAction } = useGameState();

const selectedSlot = ref<string | null>(null);
const selectedItemKey = ref<string | null>(null);

const inventoryEntries = computed(() => buildCharacterInventory(gameState.value));
const statCards = computed(() => buildCharacterStats(gameState.value));
const activeSlot = computed(() => gameState.value?.equipment.find((slot) => slot.slot === selectedSlot.value) ?? null);
const selectedEntry = computed(() => inventoryEntries.value.find((entry) => entry.itemKey === selectedItemKey.value) ?? null);

watch(
  () => gameState.value,
  (state) => {
    if (!state) {
      return;
    }

    if (!selectedSlot.value) {
      selectedSlot.value = state.equipment[0]?.slot ?? null;
    }

    if (!selectedItemKey.value) {
      selectedItemKey.value = inventoryEntries.value[0]?.itemKey ?? null;
    }
  },
  { immediate: true },
);

function handleSelectSlot(slot: string) {
  selectedSlot.value = slot;
  const matchingEntry = inventoryEntries.value.find((entry) => entry.definition?.slot === slot);
  selectedItemKey.value = matchingEntry?.itemKey ?? null;
}
</script>

<template>
  <div v-if="gameState" class="character-layout">
    <section class="character-panel">
      <CharacterPaperdoll :player="gameState.player" :selected-slot="selectedSlot" :slots="gameState.equipment" @select-slot="handleSelectSlot" />

      <section class="character-stat-grid">
        <article v-for="stat in statCards" :key="stat.label" class="character-stat-card" :class="`tone-${stat.tone}`">
          <div class="character-stat-card__icon">
            <span class="material-symbols-outlined">{{ stat.icon }}</span>
          </div>
          <div>
            <span class="compact-label">{{ stat.label }}</span>
            <strong class="value-strong">{{ stat.value }}</strong>
          </div>
        </article>
      </section>
    </section>

    <aside class="character-sidebar">
      <CharacterFocusPanel
        :active-slot="activeSlot"
        :pending-action="pendingAction"
        :selected-entry="selectedEntry"
        @equip="equipItem"
        @unequip="(slot) => equipItem(slot, null)"
      />
      <CharacterInventoryGrid :entries="inventoryEntries" :selected-item-key="selectedItemKey" @select-item="selectedItemKey = $event" />
    </aside>
  </div>
</template>
