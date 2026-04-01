<script setup lang="ts">
import type { EquipmentSnapshot, PlayerSnapshot } from "@obsidian-astral/shared";

import { getEquipmentSlotIcon, getEquipmentTone } from "../../lib/character-overview";
import { formatEquipmentSlotLabel } from "../../lib/formatters";

defineProps<{
  player: PlayerSnapshot;
  slots: EquipmentSnapshot[];
  selectedSlot: string | null;
}>();

defineEmits<{
  (event: "select-slot", slot: string): void;
}>();

const slotClassMap: Record<string, string> = {
  fofegyver: "slot-left-top",
  mellekfegyver: "slot-right-top",
  sisak: "slot-center-top",
  pancel: "slot-center-middle",
  kesztyu: "slot-right-middle",
  csizma: "slot-center-bottom",
  relikvia: "slot-left-bottom",
};
</script>

<template>
  <section class="character-stage panel">
    <div class="character-stage__grid" aria-hidden="true"></div>

    <div class="character-stage__figure">
      <div class="character-stage__avatar">
        <span class="material-symbols-outlined micro-float">shield_person</span>
      </div>

      <div class="character-stage__footer">
        <div class="character-stage__level">
          <span class="compact-label">Szint</span>
          <strong>{{ player.level }}</strong>
        </div>
        <div class="character-stage__energy">
          <div class="detail-row">
            <span class="compact-label">Energia</span>
            <strong>{{ player.energy }}/{{ player.energyMax }}</strong>
          </div>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: `${(player.energy / player.energyMax) * 100}%` }"></div>
          </div>
        </div>
      </div>
    </div>

    <button
      v-for="slot in slots"
      :key="slot.slot"
      class="character-slot"
      :class="[slotClassMap[slot.slot], `tone-${getEquipmentTone(slot.rarity)}`, { 'is-selected': selectedSlot === slot.slot }]"
      type="button"
      @click="$emit('select-slot', slot.slot)"
    >
      <span class="material-symbols-outlined micro-float">{{ getEquipmentSlotIcon(slot.slot) }}</span>
      <span class="character-slot__label">{{ formatEquipmentSlotLabel(slot.slot) }}</span>
      <strong class="character-slot__value">{{ slot.itemLabel ?? "Üres" }}</strong>
    </button>
  </section>
</template>
