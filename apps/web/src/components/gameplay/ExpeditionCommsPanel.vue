<script setup lang="ts">
import type { CommEntry } from "../../lib/expedition-overview";

defineProps<{
  comms: CommEntry[];
}>();
</script>

<template>
  <section class="comms-panel">
    <h3 class="compact-label">Mission comms</h3>

    <div class="comms-panel__log">
      <article v-for="entry in comms" :key="`${entry.timestamp}-${entry.source}`" class="comms-panel__entry">
        <span class="comms-panel__timestamp">{{ entry.timestamp }}</span>
        <p class="comms-panel__message">
          <span :class="`comms-panel__source ${entry.tone}`">{{ entry.source }}:</span>
          {{ entry.message }}
        </p>
      </article>
    </div>
  </section>
</template>
