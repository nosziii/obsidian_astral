<script setup lang="ts">
import type { ChatMessageSnapshot, NotificationSnapshot } from "@obsidian-astral/shared";

import { formatMailMeta, getChannelLabel } from "../../lib/communication-hub";

defineProps<{
  mode: "chat" | "mail";
  title: string;
  breadcrumb: string;
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
      <span>{{ breadcrumb }}</span>
      <span class="material-symbols-outlined">chevron_right</span>
      <strong>{{ breadcrumbLabel }}</strong>
    </div>

    <div v-if="mode === 'mail' && notification" class="communication-mail">
      <header class="communication-mail__header">
        <div class="communication-mail__identity">
          <img alt="Commander Vane" class="communication-mail__avatar" src="/communication/commander-vane.png" />
          <div>
            <h2 class="communication-mail__title">Commander_Vane</h2>
            <p class="communication-mail__meta">TACTICAL_OPS_DIVISION • {{ formatMailMeta(notification) }}</p>
          </div>
        </div>

        <div class="communication-mail__actions">
          <button class="communication-mail__icon-button" type="button" @click="$emit('mark-read')">
            <span class="material-symbols-outlined">reply</span>
          </button>
          <button class="communication-mail__icon-button danger" type="button">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </header>

      <article class="communication-mail__body">
        <div class="communication-mail__glow"></div>
        <p class="communication-mail__tag">// ENCRYPTED_TRANSMISSION_START</p>
        <div class="communication-mail__body-copy">
          <p class="communication-mail__lead">{{ notification.title }}</p>
          <p>{{ notification.body }}</p>
        </div>

        <div class="communication-mail__data">
          <div class="detail-row">
            <span>Koordináta</span>
            <strong>44° 12' 33" N, 102° 4' 1" E</strong>
          </div>
          <div class="detail-row">
            <span>Fényesség</span>
            <strong>8.24e26 WATTS</strong>
          </div>
          <div class="detail-row">
            <span>Void-index</span>
            <strong class="text-danger">KRITIKUS</strong>
          </div>
        </div>

        <p class="communication-mail__paragraph">
          A tartalom a jelenlegi játékrendszerhez igazodva van megjelenítve. A részletes művelet és a jutalmazási
          lépések a kapcsolódó játékfunkciókkal együtt hajthatók végre.
        </p>

        <div class="communication-mail__cta-row">
          <button class="primary-button" type="button">Művelet elfogadása</button>
          <button class="ghost-button" type="button">Feladat delegálása</button>
        </div>

        <p class="communication-mail__tag communication-mail__tag--end">// END_OF_LINE</p>
      </article>
    </div>

    <div v-else class="communication-chat">
      <header class="communication-chat__header">
        <div>
          <p class="eyebrow">{{ channel ? getChannelLabel(channel) : "Chat" }}</p>
          <h2 class="communication-mail__title">{{ title }}</h2>
        </div>
        <div class="communication-chat__status">
          <span class="communication-chat__status-dot"></span>
          Élő átviteli csatorna
        </div>
      </header>

      <div class="communication-chat__messages">
        <article v-for="message in messages" :key="message.id" class="communication-chat__line">
          <div class="communication-chat__line-meta">
            <strong>{{ message.authorName }}</strong>
            <time>{{
              new Intl.DateTimeFormat("hu-HU", { hour: "2-digit", minute: "2-digit" }).format(new Date(message.createdAt))
            }}</time>
          </div>
          <p>{{ message.content }}</p>
        </article>
      </div>

      <form class="communication-chat__composer" @submit.prevent="$emit('submit')">
        <textarea
          :value="draft"
          class="communication-chat__input"
          placeholder="Neural válasz összeállítása..."
          @input="$emit('update:draft', ($event.target as HTMLTextAreaElement).value)"
        />
        <div class="communication-chat__composer-actions">
          <button class="communication-chat__tool" type="button">
            <span class="material-symbols-outlined">attach_file</span>
          </button>
          <button class="communication-chat__tool" type="button">
            <span class="material-symbols-outlined">mood</span>
          </button>
          <button class="primary-button" type="submit" :disabled="isSending || !draft?.trim()">Küldés</button>
        </div>
      </form>
    </div>
  </section>
</template>
