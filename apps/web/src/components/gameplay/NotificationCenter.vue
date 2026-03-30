<script setup lang="ts">
import type { NotificationSnapshot } from "@obsidian-astral/shared";

import BasePanel from "../ui/BasePanel.vue";

defineProps<{
  notifications: NotificationSnapshot[];
  pendingAction?: string | null;
}>();

const emit = defineEmits<{
  markRead: [notificationId: string];
  markAllRead: [];
}>();

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("hu-HU", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<template>
  <BasePanel title="Értesítési központ" subtitle="Notification center">
    <template #header>
      <button
        v-if="notifications.some((item) => !item.readAt)"
        class="ghost-button admin-inline-button"
        type="button"
        :disabled="pendingAction === 'notification:all'"
        @click="emit('markAllRead')"
      >
        Mind olvasott
      </button>
    </template>

    <div v-if="notifications.length" class="notification-list">
      <article
        v-for="notification in notifications"
        :key="notification.id"
        class="notification-card"
        :class="[notification.tone, { 'is-read': notification.readAt }]"
      >
        <div class="notification-card-header">
          <span class="compact-label">{{ formatTimestamp(notification.createdAt) }}</span>
          <span class="tag-pill" :class="notification.tone">{{ notification.actionLabel }}</span>
        </div>

        <div class="notification-card-copy">
          <h4 class="card-title">{{ notification.title }}</h4>
          <p class="muted">{{ notification.body }}</p>
        </div>

        <button
          v-if="!notification.readAt"
          class="ghost-button notification-card-button"
          type="button"
          :disabled="pendingAction === `notification:${notification.id}`"
          @click="emit('markRead', notification.id)"
        >
          Olvasott
        </button>
      </article>
    </div>

    <p v-else class="muted">Jelenleg nincs új rendszerértesítés.</p>
  </BasePanel>
</template>
