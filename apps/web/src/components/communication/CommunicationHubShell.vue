<script setup lang="ts">
import type { CommunicationMenuItem, CommunicationSection } from "../../lib/communication-hub";

defineProps<{
  activeSection: CommunicationSection;
  menuItems: CommunicationMenuItem[];
}>();

defineEmits<{
  (event: "select-section", section: CommunicationSection): void;
}>();
</script>

<template>
  <aside class="communication-nav panel">
    <div class="communication-nav__profile">
      <img alt="Neural Link" class="communication-nav__avatar" src="/communication/neural-link-01.png" />
      <div>
        <div class="communication-nav__title">Neural_Link_01</div>
        <div class="communication-nav__status">
          <span class="communication-nav__status-dot"></span>
          Connected
        </div>
      </div>
    </div>

    <nav class="communication-nav__menu">
      <button
        v-for="item in menuItems"
        :key="item.key"
        class="communication-nav__item"
        :class="[{ 'is-active': activeSection === item.key }, item.tone ? `tone-${item.tone}` : '']"
        type="button"
        @click="$emit('select-section', item.key)"
      >
        <div class="communication-nav__item-copy">
          <span class="material-symbols-outlined">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </div>
        <span v-if="item.count" class="communication-nav__item-badge">{{ item.count }}</span>
      </button>
    </nav>

    <button class="secondary-button communication-nav__cta" type="button">
      <span class="material-symbols-outlined">add_comment</span>
      Új átadás
    </button>
  </aside>
</template>
