<script setup lang="ts">
import type { RecipeDefinition, ResourceDefinition } from "@obsidian-astral/shared";

import BasePanel from "../ui/BasePanel.vue";

const props = defineProps<{
  recipes: RecipeDefinition[];
  resources: ResourceDefinition[];
  pendingAction: string | null;
}>();

const emit = defineEmits<{
  craft: [recipeKey: string];
}>();

function resourceLabel(resourceKey: string) {
  return props.resources.find((item) => item.key === resourceKey)?.label ?? resourceKey;
}
</script>

<template>
  <BasePanel title="Astrál műhely" subtitle="Crafting">
    <div class="card-list">
      <article v-for="recipe in recipes" :key="recipe.key" class="action-card">
        <div>
          <div class="tag-row">
            <p class="eyebrow">{{ recipe.category }}</p>
            <span class="chip">Szint {{ recipe.requiredLevel }}</span>
          </div>
          <h4>{{ recipe.label }}</h4>
          <p class="muted">{{ recipe.description }}</p>
        </div>
        <div class="recipe-line">
          <span>Kell:</span>
          <strong>{{ recipe.ingredients.map((item) => `${item.amount} ${resourceLabel(item.resourceKey)}`).join(", ") }}</strong>
        </div>
        <div class="recipe-line">
          <span>Ad:</span>
          <strong>{{ recipe.produces.map((item) => `${item.amount} ${resourceLabel(item.resourceKey)}`).join(", ") }}</strong>
        </div>
        <button
          class="primary-button"
          type="button"
          :disabled="pendingAction === `craft:${recipe.key}`"
          @click="emit('craft', recipe.key)"
        >
          {{ pendingAction === `craft:${recipe.key}` ? "Craftolás…" : "Legyártás" }}
        </button>
      </article>
    </div>
  </BasePanel>
</template>
