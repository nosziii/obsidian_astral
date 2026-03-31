<script setup lang="ts">
import type { NotificationFilterValue, NotificationSnapshot } from "@obsidian-astral/shared";

import BasePanel from "../ui/BasePanel.vue";

const props = defineProps<{
  notifications: NotificationSnapshot[];
  selectedNotification: NotificationSnapshot | null;
  activeKind: NotificationFilterValue;
  unreadOnly: boolean;
  pendingAction?: string | null;
}>();

const emit = defineEmits<{
  markRead: [notificationId: string];
  markAllRead: [];
  selectNotification: [notificationId: string];
  setKindFilter: [kind: NotificationFilterValue];
  setUnreadFilter: [value: boolean];
}>();

const notificationKinds: Array<{ value: NotificationFilterValue; label: string }> = [
  { value: "osszes", label: "Összes" },
  { value: "rendszer", label: "Rendszer" },
  { value: "gazdasag", label: "Gazdaság" },
  { value: "expedicio", label: "Expedíció" },
  { value: "admin", label: "Admin" },
];

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

    <div class="notification-toolbar">
      <div class="chip-row">
        <button
          v-for="kind in notificationKinds"
          :key="kind.value"
          class="ghost-button"
          :class="{ 'is-active': activeKind === kind.value }"
          type="button"
          @click="emit('setKindFilter', kind.value)"
        >
          {{ kind.label }}
        </button>
      </div>

      <label class="notification-toggle">
        <input :checked="unreadOnly" type="checkbox" @change="emit('setUnreadFilter', !unreadOnly)" />
        <span>Csak olvasatlan</span>
      </label>
    </div>

    <div v-if="notifications.length" class="notification-layout">
      <div class="notification-list">
        <button
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-card notification-card-button-reset"
          :class="[notification.tone, { 'is-read': notification.readAt, 'is-active': selectedNotification?.id === notification.id }]"
          type="button"
          @click="emit('selectNotification', notification.id)"
        >
          <div class="notification-card-header">
            <span class="compact-label">{{ formatTimestamp(notification.createdAt) }}</span>
            <span class="tag-pill" :class="notification.tone">{{ notification.actionLabel }}</span>
          </div>

          <div class="notification-card-copy">
            <h4 class="card-title">{{ notification.title }}</h4>
            <p class="muted">{{ notification.body }}</p>
          </div>
        </button>
      </div>

      <article v-if="selectedNotification" class="notification-detail-card">
        <div class="tag-row">
          <span class="tag-pill" :class="selectedNotification.tone">{{ selectedNotification.actionLabel }}</span>
          <span class="compact-label">{{ formatTimestamp(selectedNotification.createdAt) }}</span>
        </div>
        <h4 class="card-title">{{ selectedNotification.title }}</h4>
        <p class="muted">{{ selectedNotification.body }}</p>
        <button
          v-if="!selectedNotification.readAt"
          class="ghost-button notification-card-button"
          type="button"
          :disabled="pendingAction === `notification:${selectedNotification.id}`"
          @click="emit('markRead', selectedNotification.id)"
        >
          Olvasott
        </button>
      </article>
    </div>

    <p v-else class="muted">Jelenleg nincs új értesítés a kiválasztott szűrőhöz.</p>
  </BasePanel>
</template>
