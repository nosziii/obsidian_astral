import { computed, onMounted, onUnmounted, ref } from "vue";
import type { NotificationFilterValue, NotificationListInput, NotificationSnapshot } from "@obsidian-astral/shared";

import { gameApi } from "../api/game-api";

const notifications = ref<NotificationSnapshot[]>([]);
const selectedNotificationId = ref<string | null>(null);
const notificationsLoaded = ref(false);
const notificationsError = ref("");
const notificationsPending = ref<string | null>(null);
const activeKind = ref<NotificationFilterValue>("osszes");
const unreadOnly = ref(false);

let consumerCount = 0;
let refreshHandle: number | null = null;

export function clearNotifications() {
  notifications.value = [];
  selectedNotificationId.value = null;
  notificationsLoaded.value = false;
  notificationsError.value = "";
  notificationsPending.value = null;
  activeKind.value = "osszes";
  unreadOnly.value = false;
}

function currentFilters(): NotificationListInput {
  return {
    kind: activeKind.value,
    unreadOnly: unreadOnly.value,
  };
}

async function loadNotifications() {
  try {
    notificationsError.value = "";
    notifications.value = await gameApi.listNotifications(currentFilters());

    if (!notifications.value.some((item) => item.id === selectedNotificationId.value)) {
      selectedNotificationId.value = notifications.value[0]?.id ?? null;
    }
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
    await loadNotifications();
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
    activeKind: computed(() => activeKind.value),
    unreadOnly: computed(() => unreadOnly.value),
    selectedNotification: computed(() => notifications.value.find((item) => item.id === selectedNotificationId.value) ?? null),
    pendingNotificationAction: computed(() => notificationsPending.value),
    refreshNotifications: loadNotifications,
    selectNotification: (notificationId: string) => {
      selectedNotificationId.value = notificationId;
    },
    setNotificationKindFilter: async (kind: NotificationFilterValue) => {
      activeKind.value = kind;
      await loadNotifications();
    },
    setNotificationUnreadFilter: async (nextValue: boolean) => {
      unreadOnly.value = nextValue;
      await loadNotifications();
    },
    markNotificationRead: (notificationId: string) =>
      runNotificationAction(`notification:${notificationId}`, () => gameApi.markNotificationRead(notificationId)),
    markAllNotificationsRead: () =>
      runNotificationAction("notification:all", () => gameApi.markAllNotificationsRead(currentFilters())),
  };
}
