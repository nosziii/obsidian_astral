import { computed, onMounted, onUnmounted, ref } from "vue";
import type { ChatChannel, ChatMessageSnapshot } from "@obsidian-astral/shared";

import { gameApi } from "../api/game-api";

const messagesByChannel = ref<Record<ChatChannel, ChatMessageSnapshot[]>>({
  global: [],
  workshop: [],
});
const pendingByChannel = ref<Record<ChatChannel, boolean>>({
  global: false,
  workshop: false,
});
const errorByChannel = ref<Record<ChatChannel, string>>({
  global: "",
  workshop: "",
});

export function useChat(channel: ChatChannel) {
  let pollHandle: number | null = null;

  async function loadMessages() {
    try {
      errorByChannel.value[channel] = "";
      messagesByChannel.value[channel] = await gameApi.listChatMessages(channel);
    } catch (error) {
      errorByChannel.value[channel] = error instanceof Error ? error.message : "Nem sikerült betölteni az üzeneteket.";
    }
  }

  async function sendMessage(content: string) {
    pendingByChannel.value[channel] = true;

    try {
      errorByChannel.value[channel] = "";
      messagesByChannel.value[channel] = await gameApi.sendChatMessage(channel, content);
    } catch (error) {
      errorByChannel.value[channel] = error instanceof Error ? error.message : "Nem sikerült elküldeni az üzenetet.";
      throw error;
    } finally {
      pendingByChannel.value[channel] = false;
    }
  }

  onMounted(() => {
    if (!messagesByChannel.value[channel].length) {
      void loadMessages();
    }

    pollHandle = window.setInterval(() => {
      void loadMessages();
    }, 8_000);
  });

  onUnmounted(() => {
    if (pollHandle !== null) {
      window.clearInterval(pollHandle);
      pollHandle = null;
    }
  });

  return {
    messages: computed(() => messagesByChannel.value[channel]),
    isSending: computed(() => pendingByChannel.value[channel]),
    errorMessage: computed(() => errorByChannel.value[channel]),
    loadMessages,
    sendMessage,
  };
}
