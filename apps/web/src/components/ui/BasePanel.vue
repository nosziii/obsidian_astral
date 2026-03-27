<script setup lang="ts">
defineProps<{
  title?: string;
  subtitle?: string;
}>();
</script>

<template>
  <section class="panel section-panel">
    <header v-if="title || subtitle" class="section-header">
      <div>
        <p v-if="subtitle" class="eyebrow">{{ subtitle }}</p>
        <h3 v-if="title" class="section-title">{{ title }}</h3>
      </div>
      <slot name="header" />
    </header>
    <slot />
  </section>
</template>
