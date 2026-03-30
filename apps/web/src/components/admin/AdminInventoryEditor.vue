<script setup lang="ts">
import { ref } from "vue";
import { resources } from "@obsidian-astral/shared";

const emit = defineEmits<{
  mutate: [payload: { resourceKey: string; amount: number; mode: "add" | "remove" }];
}>();

const resourceKey = ref(resources[0]?.key ?? "fa");
const amount = ref(10);
const mode = ref<"add" | "remove">("add");

function submit() {
  emit("mutate", {
    resourceKey: resourceKey.value,
    amount: amount.value,
    mode: mode.value,
  });
}
</script>

<template>
  <article class="action-card">
    <h4 class="card-title">Készletmódosítás</h4>
    <form class="admin-edit-grid" @submit.prevent="submit">
      <label class="field-label">
        Erőforrás
        <select v-model="resourceKey" class="auth-input">
          <option v-for="resource in resources" :key="resource.key" :value="resource.key">{{ resource.label }}</option>
        </select>
      </label>
      <label class="field-label">
        Mennyiség
        <input v-model.number="amount" class="auth-input" type="number" min="1" max="10000" />
      </label>
      <label class="field-label">
        Művelet
        <select v-model="mode" class="auth-input">
          <option value="add">Hozzáadás</option>
          <option value="remove">Elvétel</option>
        </select>
      </label>
      <button class="secondary-button" type="submit">Készlet frissítése</button>
    </form>
  </article>
</template>
