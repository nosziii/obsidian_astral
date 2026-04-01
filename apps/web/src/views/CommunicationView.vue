<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { NotificationSnapshot } from "@obsidian-astral/shared";

import CommunicationAttachments from "../components/communication/CommunicationAttachments.vue";
import CommunicationFeedList from "../components/communication/CommunicationFeedList.vue";
import CommunicationHubShell from "../components/communication/CommunicationHubShell.vue";
import CommunicationRosterPanel from "../components/communication/CommunicationRosterPanel.vue";
import CommunicationThreadView from "../components/communication/CommunicationThreadView.vue";
import { gameApi } from "../api/game-api";
import { useChat } from "../composables/use-chat";
import {
  buildAttachmentCards,
  buildCommunicationMenu,
  buildCommunicationRoster,
  getCommunicationTitle,
  sortMessages,
  sortNotifications,
  type CommunicationSection,
} from "../lib/communication-hub";

const route = useRoute();
const router = useRouter();
const globalChat = useChat("global");
const workshopChat = useChat("workshop");

const section = computed<CommunicationSection>(() => {
  const value = route.query.section;
  return value === "global" || value === "workshop" || value === "alerts" || value === "mails" ? value : "mails";
});

const searchQuery = ref("");
const draft = ref("");
const notifications = ref<NotificationSnapshot[]>([]);
const selectedNotificationId = ref<string | null>(null);
const notificationsError = ref("");
const isNotificationLoading = ref(false);

const rosterEntries = buildCommunicationRoster();

const filteredNotifications = computed(() =>
  sortNotifications(notifications.value, searchQuery.value, section.value === "alerts" ? "alerts" : "mails"),
);
const selectedNotification = computed(() =>
  filteredNotifications.value.find((item) => item.id === selectedNotificationId.value) ?? filteredNotifications.value[0] ?? null,
);
const activeMessages = computed(() =>
  section.value === "global"
    ? sortMessages(globalChat.messages.value, searchQuery.value)
    : sortMessages(workshopChat.messages.value, searchQuery.value),
);
const unreadCount = computed(() => notifications.value.filter((item) => !item.readAt).length);
const attachmentCards = computed(() => buildAttachmentCards(selectedNotification.value));

watch(
  section,
  async () => {
    if (section.value === "global") {
      await globalChat.loadMessages();
      return;
    }

    if (section.value === "workshop") {
      await workshopChat.loadMessages();
      return;
    }

    await loadNotifications();
  },
  { immediate: true },
);

watch(filteredNotifications, (items) => {
  if (!items.some((item) => item.id === selectedNotificationId.value)) {
    selectedNotificationId.value = items[0]?.id ?? null;
  }
});

async function loadNotifications() {
  isNotificationLoading.value = true;

  try {
    notificationsError.value = "";
    notifications.value = await gameApi.listNotifications();
  } catch (error) {
    notificationsError.value = error instanceof Error ? error.message : "Nem sikerült betölteni a kommunikációs adatokat.";
  } finally {
    isNotificationLoading.value = false;
  }
}

async function markSelectedNotificationRead() {
  if (!selectedNotification.value || selectedNotification.value.readAt) {
    return;
  }

  await gameApi.markNotificationRead(selectedNotification.value.id);
  await loadNotifications();
}

async function submitMessage() {
  const content = draft.value.trim();

  if (!content) {
    return;
  }

  if (section.value === "global") {
    await globalChat.sendMessage(content);
  } else {
    await workshopChat.sendMessage(content);
  }

  draft.value = "";
}

async function selectSection(nextSection: CommunicationSection) {
  await router.push({ path: "/communication", query: { section: nextSection } });
}
</script>

<template>
  <div class="communication-layout">
    <CommunicationHubShell
      :active-section="section"
      :menu-items="buildCommunicationMenu(unreadCount)"
      @select-section="selectSection"
    />

    <section class="communication-main">
      <header class="communication-topbar panel">
        <div>
          <p class="eyebrow">Neural hub</p>
          <h1 class="communication-topbar__title">{{ getCommunicationTitle(section) }}</h1>
        </div>
        <label class="communication-topbar__search">
          <span class="material-symbols-outlined">search</span>
          <input v-model="searchQuery" type="text" placeholder="Lekérdezés a hálózatban..." />
        </label>
      </header>

      <CommunicationThreadView
        v-if="section === 'global' || section === 'workshop'"
        :breadcrumb-label="getCommunicationTitle(section)"
        :channel="section"
        :draft="draft"
        :is-sending="section === 'global' ? globalChat.isSending.value : workshopChat.isSending.value"
        :messages="activeMessages"
        mode="chat"
        :title="getCommunicationTitle(section)"
        @submit="submitMessage"
        @update:draft="draft = $event"
      />

      <CommunicationThreadView
        v-else
        :breadcrumb-label="selectedNotification?.title ?? 'Neural feed'"
        mode="mail"
        :notification="selectedNotification"
        :title="selectedNotification?.title ?? getCommunicationTitle(section)"
        @mark-read="markSelectedNotificationRead"
      />

      <CommunicationFeedList
        v-if="section === 'mails' || section === 'alerts'"
        :items="filteredNotifications"
        :selected-id="selectedNotification?.id ?? null"
        @select="selectedNotificationId = $event"
      />

      <p v-if="notificationsError" class="status-banner error">{{ notificationsError }}</p>
      <p v-else-if="isNotificationLoading && section !== 'global' && section !== 'workshop'" class="status-banner">Kommunikációs feed betöltése...</p>

      <CommunicationAttachments :items="attachmentCards" />
    </section>

    <CommunicationRosterPanel :entries="rosterEntries" />
  </div>
</template>
