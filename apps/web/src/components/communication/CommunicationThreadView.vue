<script setup lang="ts">
import type { ChatMessageSnapshot, NotificationSnapshot } from "@obsidian-astral/shared";

import { getChannelLabel } from "../../lib/communication-hub";

defineProps<{
  mode: "chat" | "mail";
  title: string;
  breadcrumbLabel: string;
  messages?: ChatMessageSnapshot[];
  channel?: "global" | "workshop";
  notification?: NotificationSnapshot | null;
  draft?: string;
  isSending?: boolean;
}>();

defineEmits<{
  (event: "update:draft", value: string): void;
  (event: "submit"): void;
  (event: "mark-read"): void;
}>();
</script>

<template>
  <section class="communication-thread panel">
    <div class="communication-thread__crumbs">
      <span>Inbox</span>
      <span class="material-symbols-outlined">chevron_right</span>
      <strong>{{ breadcrumbLabel }}</strong>
    </div>

    <div v-if="mode === 'mail' && notification" class="communication-mail">
      <header class="communication-mail__header">
        <div class="communication-mail__identity">
          <img alt="Commander Vane" class="communication-mail__avatar" src="/communication/commander-vane.png" />
          <div>
            <h2 class="communication-mail__title">{{ title }}</h2>
            <p class="communication-mail__meta">{{ notification.kind.toUpperCase() }} • {{ new Intl.DateTimeFormat("hu-HU", { hour: "2-digit", minute: "2-digit" }).format(new Date(notification.createdAt)) }}</p>
          </div>
        </div>

        <div class="communication-mail__actions">
          <button class="ghost-button" type="button" @click="$emit('mark-read')">Olvasottnak jelölés</button>
        </div>
      </header>

      <article class="communication-mail__body">
        <p class="communication-mail__tag">// ENCRYPTED_TRANSMISSION_START</p>
        <h3>{{ notification.title }}</h3>
        <p>{{ notification.body }}</p>
        <div class="communication-mail__data">
          <div class="detail-row">
            <span>Kategória</span>
            <strong>{{ notification.kind }}</strong>
          </div>
          <div class="detail-row">
            <span>Hangnem</span>
            <strong>{{ notification.tone }}</strong>
          </div>
          <div class="detail-row">
            <span>Művelet</span>
            <strong>{{ notification.actionLabel }}</strong>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="communication-chat">
      <header class="communication-mail__header">
        <div>
          <p class="eyebrow">{{ channel ? getChannelLabel(channel) : "Chat" }}</p>
          <h2 class="communication-mail__title">{{ title }}</h2>
        </div>
      </header>

      <div class="communication-chat__messages">
        <article v-for="message in messages" :key="message.id" class="communication-chat__line">
          <strong>{{ message.authorName }}</strong>
          <span>{{ message.content }}</span>
          <time>{{ new Intl.DateTimeFormat("hu-HU", { hour: "2-digit", minute: "2-digit" }).format(new Date(message.createdAt)) }}</time>
        </article>
      </div>

      <form class="communication-chat__form" @submit.prevent="$emit('submit')">
        <input
          :value="draft"
          class="communication-chat__input"
          type="text"
          placeholder="Üzenet továbbítása..."
          @input="$emit('update:draft', ($event.target as HTMLInputElement).value)"
        />
        <button class="primary-button" type="submit" :disabled="isSending || !draft?.trim()">Küldés</button>
      </form>
    </div>
  </section>
</template>
