<script setup lang="ts">
import type { EquipmentSnapshot } from "@obsidian-astral/shared";

import type { CharacterInventoryEntry } from "../../lib/character-overview";
import { formatEquipmentBonus, formatEquipmentDetailMeta, getEquipmentSlotIcon, getEquipmentTone } from "../../lib/character-overview";

defineProps<{
  activeSlot: EquipmentSnapshot | null;
  selectedEntry: CharacterInventoryEntry | null;
  pendingAction: string | null;
}>();

defineEmits<{
  (event: "equip", slot: string, itemKey: string): void;
  (event: "unequip", slot: string): void;
}>();
</script>

<template>
  <section class="character-focus panel section-panel">
    <div class="character-focus__preview" :class="`tone-${getEquipmentTone(selectedEntry?.definition?.rarity)}`">
      <span class="material-symbols-outlined micro-pulse">{{ getEquipmentSlotIcon(selectedEntry?.definition?.slot ?? activeSlot?.slot ?? "") }}</span>
    </div>

    <div class="character-focus__copy">
      <p class="eyebrow">Equipment Specialist</p>
      <h3 class="section-title">{{ selectedEntry?.definition?.label ?? activeSlot?.itemLabel ?? "Nincs kijelölt tárgy" }}</h3>
      <p class="muted">{{ selectedEntry?.definition?.description ?? activeSlot?.bonusText ?? "Válassz tárgyat a raktárból a részletekhez." }}</p>
    </div>

    <div v-if="selectedEntry?.definition" class="character-focus__meta">
      <span class="chip">{{ formatEquipmentDetailMeta(activeSlot, selectedEntry.definition) ?? "Felszerelési séma" }}</span>
      <span class="compact-label">Szintkövetelmény: {{ selectedEntry.definition.requiredLevel }}</span>
    </div>

    <div class="data-card character-focus__stats">
      <span class="compact-label">Stat line</span>
      <strong>{{ formatEquipmentBonus(selectedEntry?.definition ?? null) }}</strong>
    </div>

    <div class="character-focus__actions">
      <button
        class="primary-button"
        type="button"
        :disabled="!selectedEntry?.definition || !activeSlot || pendingAction === `equip:${activeSlot.slot}:${selectedEntry.itemKey}`"
        @click="activeSlot && selectedEntry && $emit('equip', activeSlot.slot, selectedEntry.itemKey)"
      >
        {{ activeSlot && pendingAction === `equip:${activeSlot.slot}:${selectedEntry?.itemKey}` ? "Felszerelés..." : "Felszerelés" }}
      </button>
      <button
        class="ghost-button"
        type="button"
        :disabled="!activeSlot?.itemKey || pendingAction === `equip:${activeSlot?.slot}:none`"
        @click="activeSlot && $emit('unequip', activeSlot.slot)"
      >
        {{ activeSlot && pendingAction === `equip:${activeSlot.slot}:none` ? "Levétel..." : "Levétel" }}
      </button>
    </div>
  </section>
</template>
