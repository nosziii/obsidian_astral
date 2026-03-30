import { computed, onMounted, onUnmounted, ref } from "vue";
import type { NotificationSnapshot } from "@obsidian-astral/shared";

import { gameApi } from "../api/game-api";

const notifications = ref<NotificationSnapshot[]>([]);
const notificationsLoaded = ref(false);
const notificationsError = ref("");
const notificationsPending = ref<string | null>(null);

let consumerCount = 0;
let refreshHandle: number | null = null;

export function clearNotifications() {
  notifications.value = [];
  notificationsLoaded.value = false;
  notificationsError.value = "";
  notificationsPending.value = null;
}

async function loadNotifications() {
  try {
    notificationsError.value = "";
    notifications.value = await gameApi.listNotifications();
  } catch (error) {
    notificationsError.value = error instanceof Error ? error.message : "Nem sikerült betölteni az értesítéseket.";
  } finally {
    notificationsLoaded.value = true;
  }
}

async function runNotificationAction(actionKey: string, operation: () => Promise<void | unknown>) {
  notificationsPending.value = actionKey;

  try {
    notificationsError.value = "";
    await operation();
    notifications.value = await gameApi.listNotifications();
  } catch (error) {
    notificationsError.value = error instanceof Error ? error.message : "Az értesítés művelet nem sikerült.";
  } finally {
    notificationsPending.value = null;
  }
}

export function useNotifications() {
  onMounted(() => {
    consumerCount += 1;

    if (!notificationsLoaded.value) {
      void loadNotifications();
    }

    if (refreshHandle === null) {
      refreshHandle = window.setInterval(() => {
        void loadNotifications();
      }, 15_000);
    }
  });

  onUnmounted(() => {
    consumerCount -= 1;

    if (consumerCount <= 0 && refreshHandle !== null) {
      window.clearInterval(refreshHandle);
      refreshHandle = null;
    }
  });

  return {
    notifications: computed(() => notifications.value),
    notificationsError: computed(() => notificationsError.value),
    notificationsLoaded: computed(() => notificationsLoaded.value),
    unreadCount: computed(() => notifications.value.filter((item) => !item.readAt).length),
    pendingNotificationAction: computed(() => notificationsPending.value),
    refreshNotifications: loadNotifications,
    markNotificationRead: (notificationId: string) =>
      runNotificationAction(`notification:${notificationId}`, () => gameApi.markNotificationRead(notificationId)),
    markAllNotificationsRead: () => runNotificationAction("notification:all", () => gameApi.markAllNotificationsRead()),
  };
}
