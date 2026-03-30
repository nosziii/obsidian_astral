<script setup lang="ts">
import type { DashboardNotification } from "../../lib/dashboard-notifications";

import BasePanel from "../ui/BasePanel.vue";

defineProps<{
  notifications: DashboardNotification[];
}>();
</script>

<template>
  <BasePanel title="Értesítési központ" subtitle="Notification center">
    <div v-if="notifications.length" class="notification-list">
      <article v-for="notification in notifications" :key="notification.id" class="notification-card" :class="notification.tone">
        <div class="tag-row">
          <span class="compact-label">{{ notification.timestampLabel }}</span>
          <span class="tag-pill" :class="notification.tone">{{ notification.actionLabel }}</span>
        </div>
        <div>
          <h4 class="card-title">{{ notification.title }}</h4>
          <p class="muted">{{ notification.body }}</p>
        </div>
      </article>
    </div>

    <p v-else class="muted">Jelenleg nincs új rendszerértesítés.</p>
  </BasePanel>
</template>
