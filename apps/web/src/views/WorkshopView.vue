<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { RecipeCategory } from "@obsidian-astral/shared";

import BuildingPanel from "../components/gameplay/BuildingPanel.vue";
import CraftingPanel from "../components/gameplay/CraftingPanel.vue";
import ActivityTimeline from "../components/gameplay/ActivityTimeline.vue";
import BasePanel from "../components/ui/BasePanel.vue";
import WorkshopCommandHeader from "../components/workshop/WorkshopCommandHeader.vue";
import { useGameState } from "../composables/use-game-state";

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
    if (!recipes.length) {
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

const selectedRecipeActivity = computed(() => {
  if (!gameState.value || !selectedRecipe.value) {
    return null;
  }

  return gameState.value.activities.find(
    (item) => item.kind === "craft" && item.targetKey === selectedRecipe.value?.key,
  ) ?? null;
});

function resourceLabel(resourceKey: string) {
  return gameState.value?.resources.find((item) => item.key === resourceKey)?.label ?? resourceKey;
}
</script>

<template>
  <div v-if="gameState" class="view-stack">
    <WorkshopCommandHeader
      :active-category="activeCategory"
      :categories="categoryTabs"
      @select-category="activeCategory = $event"
    />

    <div class="workshop-layout">
      <div class="view-stack">
        <BasePanel title="Gyártási sor" subtitle="Crafting">
          <CraftingPanel
            :activities="gameState.activities"
            :recipes="visibleRecipes"
            :resources="gameState.resources"
            :selected-recipe-key="selectedRecipeKey"
            :player-level="gameState.player.level"
            @select="selectedRecipeKey = $event"
          />
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

      <BasePanel v-if="selectedRecipe" title="Kiemelt séma" subtitle="Részletek">
        <div class="workshop-detail-panel">
          <div class="workshop-detail-visual"></div>

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
            <div class="workshop-component-list">
              <div v-for="ingredient in selectedRecipe.ingredients" :key="ingredient.resourceKey" class="workshop-component-item">
                <span>{{ resourceLabel(ingredient.resourceKey) }}</span>
                <strong>{{ ingredient.amount }}</strong>
              </div>
            </div>
          </div>

          <button
            class="primary-button workshop-detail-cta"
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
                  ? "Gyártás folyamatban..."
                  : "Gyártás indítása"
            }}
          </button>
        </div>
      </BasePanel>
    </div>
  </div>
</template>
