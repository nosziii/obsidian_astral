<script setup lang="ts">
import { ref } from "vue";
import type { ChatChannel } from "@obsidian-astral/shared";

import { useChat } from "../../composables/use-chat";
import BasePanel from "../ui/BasePanel.vue";

const props = defineProps<{
  channel: ChatChannel;
  subtitle: string;
  title: string;
}>();

const draft = ref("");
const { errorMessage, isSending, messages, sendMessage } = useChat(props.channel);

async function submit() {
  const nextMessage = draft.value.trim();

  if (!nextMessage) {
    return;
  }

  await sendMessage(nextMessage);
  draft.value = "";
}
</script>

<template>
  <BasePanel :title="title" :subtitle="subtitle">
    <div class="chat-card">
      <div class="chat-tabs">
        <span class="chat-tab is-active">{{ channel === "global" ? "Globál chat" : "Műhely chat" }}</span>
      </div>
      <div class="chat-messages">
        <p v-for="message in messages" :key="message.id" class="chat-line">
          <strong>[{{ message.authorName }}]:</strong> {{ message.content }}
        </p>
      </div>
      <p v-if="errorMessage" class="status-banner error">{{ errorMessage }}</p>
      <form class="chat-form" @submit.prevent="submit">
        <input v-model="draft" class="chat-input" type="text" placeholder="Írj üzenetet…" />
        <button class="primary-button" type="submit" :disabled="isSending || !draft.trim()">
          {{ isSending ? "Küldés…" : "Küldés" }}
        </button>
      </form>
    </div>
  </BasePanel>
</template>
