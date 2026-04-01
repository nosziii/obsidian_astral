<script setup lang="ts">
import type { ThreatSignal } from "../../lib/expedition-overview";

defineProps<{
  threats: ThreatSignal[];
}>();
</script>

<template>
  <section class="expedition-radar">
    <div class="expedition-section-heading">
      <span class="material-symbols-outlined">radar</span>
      <h2>Threat radar</h2>
    </div>

    <div class="expedition-radar__grid">
      <article v-for="threat in threats" :key="threat.title" class="expedition-radar__card" :class="threat.tone">
        <div class="expedition-radar__icon" :class="threat.tone">
          <span class="material-symbols-outlined">
            {{ threat.tone === "danger" ? "skull" : threat.tone === "secondary" ? "sensors" : "storm" }}
          </span>
        </div>
        <div>
          <div class="detail-row">
            <h4 class="card-title">{{ threat.title }}</h4>
            <span class="tag-pill" :class="threat.tone">{{ threat.level }}</span>
          </div>
          <p class="muted">{{ threat.detail }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
