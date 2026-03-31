<script setup lang="ts">
import type { AdminAuditLogSnapshot } from "@obsidian-astral/shared";

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("hu-HU", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

defineProps<{
  logs: AdminAuditLogSnapshot[];
}>();
</script>

<template>
  <article class="action-card admin-audit-card">
    <div class="tag-row">
      <span class="tag-pill">Audit trail</span>
      <span class="compact-label">admin moderation napló</span>
    </div>

    <div v-if="logs.length" class="admin-audit-list">
      <article v-for="log in logs" :key="log.id" class="admin-audit-entry">
        <div class="tag-row">
          <span class="compact-label">{{ formatTimestamp(log.createdAt) }}</span>
          <span class="chip">{{ log.actionKind }}</span>
        </div>
        <h4 class="card-title">{{ log.summary }}</h4>
        <p class="muted">{{ log.actorName }} -> {{ log.targetName }}</p>
      </article>
    </div>

    <p v-else class="muted">Ehhez a játékoshoz még nincs rögzített admin naplóbejegyzés.</p>
  </article>
</template>
