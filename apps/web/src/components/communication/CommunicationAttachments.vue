<script setup lang="ts">
defineProps<{
  items: Array<{
    key: string;
    label: string;
    detail: string;
    icon: string;
    tone: string;
  }>;
}>();
</script>

<template>
  <div v-if="items.length" class="communication-attachments">
    <article v-for="item in items" :key="item.key" class="communication-attachment">
      <div class="communication-attachment__icon" :class="`tone-${item.tone}`">
        <span class="material-symbols-outlined">{{ item.icon }}</span>
      </div>
      <div>
        <strong>{{ item.label }}</strong>
        <span>{{ item.detail }}</span>
      </div>
    </article>
  </div>
</template>
