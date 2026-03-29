<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { RecipeCategory } from "@obsidian-astral/shared";

import BuildingPanel from "../components/gameplay/BuildingPanel.vue";
import CraftingPanel from "../components/gameplay/CraftingPanel.vue";
import ActivityTimeline from "../components/gameplay/ActivityTimeline.vue";
import ChatPanel from "../components/gameplay/ChatPanel.vue";
import BasePanel from "../components/ui/BasePanel.vue";
import { useGameState } from "../composables/use-game-state";
import { formatCategoryLabel } from "../lib/formatters";

const { activityNow, craft, gameState, pendingAction, upgradeBuilding } = useGameState();
const selectedRecipeKey = ref<string | null>(null);
const activeCategory = ref<RecipeCategory | "mind">("mind");

const categoryTabs: Array<RecipeCategory | "mind"> = ["mind", "fegyver", "pancel", "fogyoeszkoz", "anyag"];

const visibleRecipes = computed(() => {
  if (!gameState.value) {
    return [];
  }

  return activeCategory.value === "mind"
    ? gameState.value.recipes
    : gameState.value.recipes.filter((item) => item.category === activeCategory.value);
});

watch(
  () => visibleRecipes.value,
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
  visibleRecipes.value.find((item) => item.key === selectedRecipeKey.value) ?? visibleRecipes.value[0] ?? null,
);

function resourceLabel(resourceKey: string) {
  return gameState.value?.resources.find((item) => item.key === resourceKey)?.label ?? resourceKey;
}

function selectCategory(category: RecipeCategory | "mind") {
  activeCategory.value = category;
}

const selectedRecipeActivity = computed(() => {
  if (!gameState.value || !selectedRecipe.value) {
    return null;
  }

  return gameState.value.activities.find(
    (item) => item.kind === "craft" && item.targetKey === selectedRecipe.value?.key,
  ) ?? null;
});
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
            <button
              v-for="category in categoryTabs"
              :key="category"
              class="workshop-tab"
              :class="{ 'is-active': activeCategory === category }"
              type="button"
              @click="selectCategory(category)"
            >
              {{ category === "mind" ? "Minden" : formatCategoryLabel(category) }}
            </button>
          </div>

          <CraftingPanel
            :activities="gameState.activities"
            :recipes="visibleRecipes"
            :resources="gameState.resources"
            :selected-recipe-key="selectedRecipeKey"
            :player-level="gameState.player.level"
            @select="selectedRecipeKey = $event"
          />
        </div>
      </BasePanel>

      <BuildingPanel
        :activities="gameState.activities"
        :catalog="gameState.buildingCatalog"
        :now="activityNow"
        :states="gameState.buildings"
        :resources="gameState.resources"
        :pending-action="pendingAction"
        :player-level="gameState.player.level"
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
          <div class="detail-row">
            <span class="compact-label">Állomás</span>
            <strong>{{ selectedRecipe.station }}</strong>
          </div>
        </div>

        <ActivityTimeline :activity="selectedRecipeActivity" :now="activityNow" idle-text="Nincs aktív gyártás" />

        <div>
          <p class="eyebrow">Szükséges komponensek</p>
          <div class="component-list">
            <div v-for="ingredient in selectedRecipe.ingredients" :key="ingredient.resourceKey" class="component-item">
              <span>{{ resourceLabel(ingredient.resourceKey) }}</span>
              <strong>{{ ingredient.amount }}</strong>
            </div>
          </div>
        </div>

        <ChatPanel channel="workshop" subtitle="Workshop chat" title="Műhely kommunikáció" />

        <button
          class="primary-button"
          type="button"
          :disabled="
            gameState.player.level < selectedRecipe.requiredLevel ||
            pendingAction === `craft:${selectedRecipe.key}` ||
            !!selectedRecipeActivity
          "
          @click="craft(selectedRecipe.key)"
        >
          {{
            gameState.player.level < selectedRecipe.requiredLevel
              ? `${selectedRecipe.requiredLevel}. szint szükséges`
              : pendingAction === `craft:${selectedRecipe.key}` || selectedRecipeActivity
                ? "Craftolás…"
                : "Gyártás indítása"
          }}
        </button>
      </div>
    </BasePanel>
  </div>
</template>
