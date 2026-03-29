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
  const icons = {
    fegyver: "⚔",
    pancel: "🛡",
    fogyoeszkoz: "✚",
    anyag: "⬡",
  };

  return icons[category];
}

function recipeTone(category: RecipeDefinition["category"]) {
  if (category === "fegyver") {
    return "";
  }

  if (category === "pancel") {
    return "tertiary";
  }

  if (category === "fogyoeszkoz") {
    return "secondary";
  }

  return "";
}

function activityFor(recipeKey: string) {
  return props.activities.find((item) => item.kind === "craft" && item.targetKey === recipeKey) ?? null;
}
</script>

<template>
  <div class="card-list">
    <article
      v-for="recipe in recipes"
      :key="recipe.key"
      class="action-card recipe-card"
      :class="{ 'is-active': selectedRecipeKey === recipe.key }"
      @click="emit('select', recipe.key)"
    >
      <div class="recipe-card-top">
        <div class="recipe-icon" :class="recipeTone(recipe.category)">{{ recipeIcon(recipe.category) }}</div>
        <div>
          <div class="tag-row">
            <span class="tag-pill">{{ formatCategoryLabel(recipe.category) }}</span>
            <span class="tag-pill tertiary recipe-status">szint {{ recipe.requiredLevel }}</span>
            <span v-if="activityFor(recipe.key)" class="tag-pill success">Folyamatban</span>
          </div>
          <h4 class="card-title">{{ recipe.label }}</h4>
          <p class="muted">{{ recipe.description }}</p>
          <p class="compact-label">Állomás: {{ recipe.station }}</p>
        </div>
      </div>

      <div class="detail-list">
        <div class="detail-row">
          <span class="compact-label">Kell</span>
          <strong>{{ recipe.ingredients.map((item) => `${item.amount} ${resourceLabel(item.resourceKey)}`).join(", ") }}</strong>
        </div>
        <div class="detail-row">
          <span class="compact-label">Ad</span>
          <strong>{{ recipe.produces.map((item) => `${item.amount} ${resourceLabel(item.resourceKey)}`).join(", ") }}</strong>
        </div>
        <div class="detail-row" v-if="playerLevel < recipe.requiredLevel">
          <span class="compact-label">Zárolás</span>
          <strong>{{ recipe.requiredLevel }}. szinttől</strong>
        </div>
      </div>
    </article>
  </div>
</template>
