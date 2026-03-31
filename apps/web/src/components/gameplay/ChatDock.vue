<script setup lang="ts">
import { computed, ref } from "vue";
import type { ChatChannel } from "@obsidian-astral/shared";

import { useChat } from "../../composables/use-chat";

const activeChannel = ref<ChatChannel>("global");
const isOpen = ref(true);
const draft = ref("");

const channelOptions: Array<{ key: ChatChannel; label: string; icon: string }> = [
  { key: "global", label: "Globál", icon: "forum" },
  { key: "workshop", label: "Műhely", icon: "handyman" },
];

const globalChat = useChat("global");
const workshopChat = useChat("workshop");

const activeChat = computed(() => (activeChannel.value === "global" ? globalChat : workshopChat));

async function submit() {
  const content = draft.value.trim();

  if (!content) {
    return;
  }

  await activeChat.value.sendMessage(content);
  draft.value = "";
}
</script>

<template>
  <section class="chat-dock" :class="{ 'is-open': isOpen }">
    <button class="chat-dock__toggle" type="button" @click="isOpen = !isOpen">
      <span class="material-symbols-outlined">{{ isOpen ? "close" : "forum" }}</span>
    </button>

    <div v-if="isOpen" class="chat-dock__panel">
      <div class="chat-dock__tabs">
        <button
          v-for="channel in channelOptions"
          :key="channel.key"
          class="chat-dock__tab"
          :class="{ 'is-active': activeChannel === channel.key }"
          type="button"
          @click="activeChannel = channel.key"
        >
          <span class="material-symbols-outlined">{{ channel.icon }}</span>
          <span>{{ channel.label }}</span>
        </button>
      </div>

      <div class="chat-dock__messages">
        <p v-for="message in activeChat.messages.value" :key="message.id" class="chat-dock__line">
          <strong>[{{ message.authorName }}]</strong>
          <span>{{ message.content }}</span>
        </p>
      </div>

      <p v-if="activeChat.errorMessage.value" class="status-banner error">{{ activeChat.errorMessage.value }}</p>

      <form class="chat-dock__form" @submit.prevent="submit">
        <input v-model="draft" class="chat-dock__input" type="text" placeholder="Írj üzenetet..." />
        <button class="chat-dock__send" type="submit" :disabled="activeChat.isSending.value || !draft.trim()">
          <span class="material-symbols-outlined">send</span>
        </button>
      </form>
    </div>
  </section>
</template>
