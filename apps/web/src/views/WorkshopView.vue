<script setup lang="ts">
import { computed, ref, watch } from "vue";

import BuildingPanel from "../components/gameplay/BuildingPanel.vue";
import CraftingPanel from "../components/gameplay/CraftingPanel.vue";
import BasePanel from "../components/ui/BasePanel.vue";
import { useGameState } from "../composables/use-game-state";

const { craft, gameState, pendingAction, upgradeBuilding } = useGameState();
const selectedRecipeKey = ref<string | null>(null);

watch(
  () => gameState.value?.recipes,
  (recipes) => {
    if (!recipes?.length) {
      selectedRecipeKey.value = null;
      return;
    }

    if (!selectedRecipeKey.value || !recipes.some((item) => item.key === selectedRecipeKey.value)) {
      selectedRecipeKey.value = recipes[0].key;
    }
  },
  { immediate: true },
);

const selectedRecipe = computed(() =>
  gameState.value?.recipes.find((item) => item.key === selectedRecipeKey.value) ?? null,
);

function resourceLabel(resourceKey: string) {
  return gameState.value?.resources.find((item) => item.key === resourceKey)?.label ?? resourceKey;
}
</script>

<template>
  <div v-if="gameState" class="workshop-layout">
    <div class="view-stack">
      <BasePanel title="Astrál kohó" subtitle="Műhely">
        <div class="view-stack">
          <div class="workshop-head">
            <div>
              <h3 class="section-title">Astral Forge</h3>
              <p class="muted">
                Finomított alapanyagok és nagyfrekvenciás felszerelések gyártása a terv szerint
                visszaépített szerkezetben.
              </p>
            </div>
            <div class="data-card">
              <span class="compact-label">Forge energia</span>
              <strong class="value-strong">{{ gameState.player.energy }}/{{ gameState.player.energyMax }}</strong>
            </div>
          </div>

          <div class="workshop-tabs">
            <span class="workshop-tab is-active">Fegyverek</span>
            <span class="workshop-tab">Páncél</span>
            <span class="workshop-tab">Fogyóeszközök</span>
            <span class="workshop-tab">Anyagok</span>
          </div>

          <CraftingPanel
            :recipes="gameState.recipes"
            :resources="gameState.resources"
            :selected-recipe-key="selectedRecipeKey"
            @select="selectedRecipeKey = $event"
          />
        </div>
      </BasePanel>

      <BuildingPanel
        :catalog="gameState.buildingCatalog"
        :states="gameState.buildings"
        :resources="gameState.resources"
        :pending-action="pendingAction"
        @upgrade="upgradeBuilding"
      />
    </div>

    <BasePanel v-if="selectedRecipe" title="Gyártási részletek" subtitle="Schematic">
      <div class="detail-panel">
        <div class="detail-visual panel" />

        <div>
          <h3 class="section-title">{{ selectedRecipe.label }}</h3>
          <p class="muted">{{ selectedRecipe.description }}</p>
        </div>

        <div class="detail-list">
          <div class="detail-row">
            <span class="compact-label">Szükséges szint</span>
            <strong>{{ selectedRecipe.requiredLevel }}</strong>
          </div>
          <div class="detail-row">
            <span class="compact-label">Gyártási idő</span>
            <strong>{{ selectedRecipe.craftSeconds }} mp</strong>
          </div>
          <div class="detail-row">
            <span class="compact-label">XP jutalom</span>
            <strong>{{ selectedRecipe.rewardXp }}</strong>
          </div>
        </div>

        <div>
          <p class="eyebrow">Szükséges komponensek</p>
          <div class="component-list">
            <div v-for="ingredient in selectedRecipe.ingredients" :key="ingredient.resourceKey" class="component-item">
              <span>{{ resourceLabel(ingredient.resourceKey) }}</span>
              <strong>{{ ingredient.amount }}</strong>
            </div>
          </div>
        </div>

        <div class="chat-card">
          <div class="chat-tabs">
            <span class="chat-tab is-active">Műhely chat</span>
            <span class="chat-tab">Klán chat</span>
          </div>
          <div class="chat-messages">
            <p class="chat-line"><strong>[Xenon]:</strong> Van fölös sztár-vas trading logic core-ért.</p>
            <p class="chat-line"><strong>[Nova_01]:</strong> Új raidhoz még több gyógyító csomag kell.</p>
            <p class="chat-line"><strong>[Shadow]:</strong> T7 pajzsot adok a déli szektorban.</p>
          </div>
        </div>

        <button
          class="primary-button"
          type="button"
          :disabled="pendingAction === `craft:${selectedRecipe.key}`"
          @click="craft(selectedRecipe.key)"
        >
          {{ pendingAction === `craft:${selectedRecipe.key}` ? "Craftolás…" : "Gyártás indítása" }}
        </button>
      </div>
    </BasePanel>
  </div>
</template>
