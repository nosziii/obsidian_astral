<script setup lang="ts">
import type { ActivitySnapshot, RecipeDefinition, ResourceDefinition } from "@obsidian-astral/shared";

import { formatCategoryLabel } from "../../lib/formatters";

const props = defineProps<{
  activities: ActivitySnapshot[];
  recipes: RecipeDefinition[];
  resources: ResourceDefinition[];
  selectedRecipeKey: string | null;
  playerLevel: number;
}>();

const emit = defineEmits<{
  select: [recipeKey: string];
}>();

function resourceLabel(resourceKey: string) {
  return props.resources.find((item) => item.key === resourceKey)?.label ?? resourceKey;
}

function recipeIcon(category: RecipeDefinition["category"]) {
  const icons: Record<RecipeDefinition["category"], string> = {
    fegyver: "swords",
    pancel: "shield",
    fogyoeszkoz: "healing",
    anyag: "deployed_code",
  };

  return icons[category];
}

function recipeTone(category: RecipeDefinition["category"]) {
  if (category === "fegyver") {
    return "";
  }

  if (category === "pancel") {
    return "secondary";
  }

  if (category === "fogyoeszkoz") {
    return "tertiary";
  }

  return "warning";
}

function activityFor(recipeKey: string) {
  return props.activities.find((item) => item.kind === "craft" && item.targetKey === recipeKey) ?? null;
}
</script>

<template>
  <div class="workshop-card-grid">
    <article
      v-for="recipe in recipes"
      :key="recipe.key"
      class="workshop-resource-card"
      :class="{ 'is-active': selectedRecipeKey === recipe.key }"
      @click="emit('select', recipe.key)"
    >
      <div class="workshop-resource-card__top">
        <div class="workshop-resource-card__icon" :class="recipeTone(recipe.category)">
          <span class="material-symbols-outlined">{{ recipeIcon(recipe.category) }}</span>
        </div>
        <div class="workshop-resource-card__value">
          <strong>{{ recipe.rewardXp }}</strong>
          <span>xp / craft</span>
        </div>
      </div>

      <div class="workshop-resource-card__copy">
        <div class="tag-row">
          <span class="tag-pill" :class="recipeTone(recipe.category)">{{ formatCategoryLabel(recipe.category) }}</span>
          <span v-if="activityFor(recipe.key)" class="tag-pill success">Folyamatban</span>
        </div>
        <h4 class="card-title">{{ recipe.label }}</h4>
        <p class="muted">{{ recipe.description }}</p>
      </div>

      <div class="workshop-resource-card__meta">
        <div class="detail-row">
          <span class="compact-label">Állomás</span>
          <strong>{{ recipe.station }}</strong>
        </div>
        <div class="detail-row">
          <span class="compact-label">Output</span>
          <strong>{{ recipe.produces.map((item) => `${item.amount} ${resourceLabel(item.resourceKey)}`).join(", ") }}</strong>
        </div>
      </div>

      <div class="workshop-resource-card__actions">
        <button class="primary-button workshop-resource-card__button" type="button">
          {{ props.playerLevel < recipe.requiredLevel ? `${recipe.requiredLevel}. szint kell` : "Részletek" }}
        </button>
        <button class="ghost-button workshop-resource-card__icon-button" type="button">
          <span class="material-symbols-outlined">analytics</span>
        </button>
      </div>
    </article>
  </div>
</template>
