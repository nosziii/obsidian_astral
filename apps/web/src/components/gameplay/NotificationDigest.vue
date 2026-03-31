<script setup lang="ts">
import { computed } from "vue";
import type { NotificationSnapshot } from "@obsidian-astral/shared";

import BasePanel from "../ui/BasePanel.vue";

const props = defineProps<{
  notifications: NotificationSnapshot[];
  pendingAction?: string | null;
}>();

const emit = defineEmits<{
  markRead: [notificationId: string];
  markAllRead: [];
}>();

const visibleNotifications = computed(() => props.notifications.slice(0, 3));

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
  <BasePanel title="Értesítések" subtitle="Rendszerfigyelés">
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

    <div v-if="visibleNotifications.length" class="notification-digest-list">
      <article
        v-for="notification in visibleNotifications"
        :key="notification.id"
        class="notification-digest-card"
        :class="[notification.tone, { 'is-read': notification.readAt }]"
      >
        <div class="notification-digest-card__header">
          <span class="compact-label">{{ formatTimestamp(notification.createdAt) }}</span>
          <span class="tag-pill" :class="notification.tone">{{ notification.actionLabel }}</span>
        </div>

        <h4 class="card-title">{{ notification.title }}</h4>
        <p class="muted">{{ notification.body }}</p>

        <button
          v-if="!notification.readAt"
          class="ghost-button notification-digest-card__button"
          type="button"
          :disabled="pendingAction === `notification:${notification.id}`"
          @click="emit('markRead', notification.id)"
        >
          Jelölés olvasottnak
        </button>
      </article>
    </div>

    <p v-else class="muted">Nincs új értesítés.</p>
  </BasePanel>
</template>
