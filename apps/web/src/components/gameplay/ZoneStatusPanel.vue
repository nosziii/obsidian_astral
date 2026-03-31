<script setup lang="ts">
import type { ZoneSnapshot } from "@obsidian-astral/shared";

import { formatCategoryLabel } from "../../lib/formatters";
import BasePanel from "../ui/BasePanel.vue";

defineProps<{
  zones: ZoneSnapshot[];
}>();

function zoneStatusClass(status: string) {
  if (status === "zarolt") {
    return "danger";
  }

  if (status === "hamarosan") {
    return "secondary";
  }

  return "success";
}
</script>

<template>
  <BasePanel title="Zónastátusz" subtitle="Előrehaladás">
    <div class="zone-status-list">
      <article v-for="zone in zones" :key="zone.key" class="zone-status-card">
        <div class="tag-row">
          <span class="tag-pill" :class="zoneStatusClass(zone.status)">
            {{ formatCategoryLabel(zone.status) }}
          </span>
          <span class="compact-label">ajánlott {{ zone.recommendedLevel }}. szint</span>
        </div>
        <h4 class="card-title">{{ zone.label }}</h4>
        <p class="muted">{{ zone.description }}</p>
      </article>
    </div>
  </BasePanel>
</template>
