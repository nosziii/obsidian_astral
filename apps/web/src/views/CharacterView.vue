<script setup lang="ts">
import { computed } from "vue";

import BasePanel from "../components/ui/BasePanel.vue";
import { useGameState } from "../composables/use-game-state";
import { formatCategoryLabel, formatEquipmentSlotLabel } from "../lib/formatters";

const { equipItem, gameState, pendingAction } = useGameState();

const equipmentLoadout = computed(() => gameState.value?.equipment ?? []);
const ownedEquipment = computed(() =>
  (gameState.value?.equipmentInventory ?? []).map((entry) => {
    const definition = gameState.value?.equipmentCatalog.find((item) => item.key === entry.itemKey);

    return {
      ...entry,
      definition,
    };
  }),
);

const derivedStats = computed(() => {
  const statLine = equipmentLoadout.value.reduce(
    (aggregate, slot) => {
      const definition = gameState.value?.equipmentCatalog.find((item) => item.key === slot.itemKey);

      if (!definition) {
        return aggregate;
      }

      aggregate.tamadas += definition.statLine.tamadas ?? 0;
      aggregate.vedelem += definition.statLine.vedelem ?? 0;
      aggregate.kritikus += definition.statLine.kritikus ?? 0;
      aggregate.gyujtesiSebesseg += definition.statLine.gyujtesiSebesseg ?? 0;
      aggregate.craftBonus += definition.statLine.craftBonus ?? 0;
      return aggregate;
    },
    {
      tamadas: 0,
      vedelem: 0,
      kritikus: 0,
      gyujtesiSebesseg: 0,
      craftBonus: 0,
    },
  );

  return [
    { label: "Támadás", value: statLine.tamadas },
    { label: "Védelem", value: statLine.vedelem },
    { label: "Kritikus", value: `${statLine.kritikus}%` },
    { label: "Gyűjtés", value: `${statLine.gyujtesiSebesseg}%` },
    { label: "Craft", value: `${statLine.craftBonus}%` },
  ];
});

function itemsForSlot(slot: string) {
  return ownedEquipment.value.filter((entry) => entry.definition?.slot === slot && entry.quantity > 0);
}

async function handleEquip(slot: string, itemKey: string | null) {
  await equipItem(slot, itemKey);
}
</script>

<template>
  <div v-if="gameState" class="view-grid">
    <BasePanel title="Karakterprofil" subtitle="Loadout">
      <div class="profile-grid">
        <article class="profile-card">
          <span class="compact-label">Név</span>
          <strong>{{ gameState.player.name }}</strong>
        </article>
        <article class="profile-card">
          <span class="compact-label">Szint</span>
          <strong>{{ gameState.player.level }}</strong>
        </article>
        <article class="profile-card">
          <span class="compact-label">Energia</span>
          <strong>{{ gameState.player.energy }}/{{ gameState.player.energyMax }}</strong>
        </article>
        <article class="profile-card">
          <span class="compact-label">Asztralit</span>
          <strong>{{ gameState.player.astralite }}</strong>
        </article>
      </div>

      <div class="card-list">
        <article v-for="stat in derivedStats" :key="stat.label" class="action-card">
          <p class="eyebrow">{{ stat.label }}</p>
          <h4>{{ stat.value }}</h4>
        </article>
      </div>
    </BasePanel>

    <BasePanel title="Aktív felszerelés" subtitle="Slotok">
      <div class="card-list">
        <article v-for="slot in equipmentLoadout" :key="slot.slot" class="action-card">
          <div class="tag-row">
            <p class="eyebrow">{{ formatEquipmentSlotLabel(slot.slot) }}</p>
            <span v-if="slot.rarity" class="chip">{{ formatCategoryLabel(slot.rarity) }}</span>
          </div>
          <h4>{{ slot.itemLabel ?? "Üres slot" }}</h4>
          <p class="muted">{{ slot.bonusText }}</p>

          <div class="card-list">
            <button
              v-for="item in itemsForSlot(slot.slot)"
              :key="item.itemKey"
              class="ghost-button"
              type="button"
              :disabled="pendingAction === `equip:${slot.slot}:${item.itemKey}`"
              @click="handleEquip(slot.slot, item.itemKey)"
            >
              {{ item.definition?.label }} x{{ item.quantity }}
            </button>
          </div>

          <button
            class="secondary-button"
            type="button"
            :disabled="pendingAction === `equip:${slot.slot}:none` || !slot.itemKey"
            @click="handleEquip(slot.slot, null)"
          >
            {{ pendingAction === `equip:${slot.slot}:none` ? "Levétel..." : "Levétel" }}
          </button>
        </article>
      </div>
    </BasePanel>

    <BasePanel title="Tárgykatalógus" subtitle="Owned equipment">
      <div class="card-list">
        <article v-for="entry in ownedEquipment" :key="entry.itemKey" class="action-card">
          <div class="tag-row">
            <p class="eyebrow">{{ formatEquipmentSlotLabel(entry.definition?.slot ?? "fofegyver") }}</p>
            <span class="chip">{{ formatCategoryLabel(entry.definition?.rarity ?? "gyakori") }}</span>
          </div>
          <h4>{{ entry.definition?.label ?? entry.itemKey }}</h4>
          <p class="muted">{{ entry.definition?.description ?? "Nincs leírás." }}</p>
          <div class="detail-row">
            <span class="compact-label">Darab</span>
            <strong>{{ entry.quantity }}</strong>
          </div>
        </article>
      </div>
    </BasePanel>
  </div>
</template>
