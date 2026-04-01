<script setup lang="ts">
import type { NotificationSnapshot } from "@obsidian-astral/shared";

defineProps<{
  items: NotificationSnapshot[];
  selectedId: string | null;
}>();

defineEmits<{
  (event: "select", notificationId: string): void;
}>();
</script>

<template>
  <div class="communication-feed-list">
    <button
      v-for="item in items"
      :key="item.id"
      class="communication-feed-item"
      :class="{ 'is-active': selectedId === item.id, 'is-read': Boolean(item.readAt) }"
      type="button"
      @click="$emit('select', item.id)"
    >
      <div class="detail-row">
        <span class="compact-label">{{ new Intl.DateTimeFormat("hu-HU", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(item.createdAt)) }}</span>
        <span class="chip">{{ item.actionLabel }}</span>
      </div>
      <strong>{{ item.title }}</strong>
      <p>{{ item.body }}</p>
    </button>
  </div>
</template>
