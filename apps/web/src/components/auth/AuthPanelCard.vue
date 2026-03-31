<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
  secondaryLabel: string;
}>();
</script>

<template>
  <div class="auth-stage">
    <section class="auth-panel-card" :aria-label="title">
      <div class="auth-panel-card__line"></div>

      <header class="auth-panel-card__header">
        <h2 class="auth-panel-card__title">{{ title }}</h2>
        <p class="auth-panel-card__subtitle">{{ subtitle }}</p>
      </header>

      <slot></slot>

      <div class="auth-panel-card__divider">
        <span></span>
        <p>{{ secondaryLabel }}</p>
        <span></span>
      </div>

      <slot name="auxiliary"></slot>
    </section>

    <slot name="secondary"></slot>
  </div>
</template>
