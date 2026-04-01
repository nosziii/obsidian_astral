<script setup lang="ts">
import type { CommunicationRosterEntry } from "../../lib/communication-hub";

defineProps<{
  entries: CommunicationRosterEntry[];
}>();
</script>

<template>
  <aside class="communication-roster panel">
    <div class="communication-roster__header">
      <h2>Neural roster</h2>
      <p>Aktív klántagok [{{ entries.length }}/42]</p>
    </div>

    <div class="communication-roster__list">
      <article v-for="entry in entries" :key="entry.key" class="communication-roster__entry">
        <div class="communication-roster__avatar-wrap">
          <img :alt="entry.label" :src="entry.avatarUrl" class="communication-roster__avatar" />
          <span class="communication-roster__indicator" :class="`tone-${entry.tone}`"></span>
        </div>
        <div>
          <strong>{{ entry.label }}</strong>
          <span :class="`tone-${entry.tone}`">{{ entry.status }}</span>
        </div>
        <span class="material-symbols-outlined communication-roster__chat">chat_bubble</span>
      </article>
    </div>

    <div class="communication-roster__sync">
      <div class="detail-row">
        <span class="compact-label">Sync status</span>
        <strong>1.2 GB/S</strong>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width: 88%"></div>
      </div>
      <div class="detail-row">
        <span class="compact-label">Neural bit rate</span>
        <strong>Stabil</strong>
      </div>
    </div>
  </aside>
</template>
