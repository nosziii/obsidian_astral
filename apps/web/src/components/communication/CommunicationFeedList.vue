<script setup lang="ts">
import type { CommunicationFeedEntry } from "../../lib/communication-hub";

defineProps<{
  emptyLabel: string;
  items: CommunicationFeedEntry[];
  selectedId: string | null;
  title: string;
}>();

defineEmits<{
  (event: "select", notificationId: string): void;
}>();
</script>

<template>
  <section class="communication-feed panel">
    <header class="communication-feed__header">
      <div>
        <p class="eyebrow">Comm-links</p>
        <h2 class="communication-feed__title">{{ title }}</h2>
      </div>

      <div class="communication-feed__actions">
        <button class="communication-feed__action" type="button">
          <span class="material-symbols-outlined">filter_list</span>
        </button>
        <button class="communication-feed__compose" type="button">
          <span class="material-symbols-outlined">add</span>
          Új kapcsolat
        </button>
      </div>
    </header>

    <div v-if="items.length" class="communication-feed__list">
      <button
        v-for="item in items"
        :key="item.id"
        class="communication-feed-item"
        :class="[
          { 'is-active': selectedId === item.id, 'is-read': !item.unread },
          `tone-${item.tone}`,
        ]"
        type="button"
        @click="$emit('select', item.id)"
      >
        <div class="communication-feed-item__avatar-wrap">
          <img :alt="item.title" :src="item.avatarUrl" class="communication-feed-item__avatar" />
          <span v-if="item.unread" class="communication-feed-item__pulse"></span>
        </div>

        <div class="communication-feed-item__copy">
          <div class="communication-feed-item__meta">
            <strong>{{ item.subtitle }}</strong>
            <span>{{ item.stamp }}</span>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.preview }}</p>
        </div>
      </button>
    </div>

    <p v-else class="communication-feed__empty">{{ emptyLabel }}</p>
  </section>
</template>
