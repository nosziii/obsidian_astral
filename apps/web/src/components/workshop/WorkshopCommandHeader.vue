<script setup lang="ts">
import type { RecipeCategory } from "@obsidian-astral/shared";

import { formatCategoryLabel } from "../../lib/formatters";

defineProps<{
  activeCategory: RecipeCategory | "mind";
  categories: Array<RecipeCategory | "mind">;
}>();

const emit = defineEmits<{
  selectCategory: [category: RecipeCategory | "mind"];
}>();
</script>

<template>
  <section class="workshop-command-header">
    <div>
      <h1 class="workshop-command-header__title">Műhelymag</h1>
      <p class="workshop-command-header__copy">
        Felügyeld a craftolási és fejlesztési ciklusokat. A panelek a terv vizuális irányához igazodnak,
        miközben a meglévő játékmechanika változatlanul működik tovább.
      </p>
    </div>

    <div class="workshop-command-header__filters">
      <button
        v-for="category in categories"
        :key="category"
        class="workshop-filter"
        :class="{ 'is-active': activeCategory === category }"
        type="button"
        @click="emit('selectCategory', category)"
      >
        {{ category === "mind" ? "Mind" : formatCategoryLabel(category) }}
      </button>
    </div>
  </section>
</template>
