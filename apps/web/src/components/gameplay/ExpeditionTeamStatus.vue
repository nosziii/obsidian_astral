<script setup lang="ts">
import type { TeamStatusMember } from "../../lib/expedition-overview";

defineProps<{
  members: TeamStatusMember[];
}>();
</script>

<template>
  <section class="expedition-column">
    <div class="expedition-section-heading">
      <span class="material-symbols-outlined">group</span>
      <h2>Csapatstátusz</h2>
    </div>

    <article v-for="member in members" :key="member.key" class="team-status-card" :class="member.tone">
      <div class="team-status-card__header">
        <div class="team-status-card__avatar" :class="member.tone">
          <span class="material-symbols-outlined micro-float">deployed_code</span>
        </div>
        <div>
          <h4 class="card-title">{{ member.name }}</h4>
          <p class="compact-label">{{ member.role }}</p>
        </div>
      </div>

      <div class="team-status-card__metric">
        <div class="detail-row">
          <span class="compact-label">Integritás</span>
          <strong>{{ member.integrity }}%</strong>
        </div>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: `${member.integrity}%` }" />
        </div>
      </div>

      <div class="team-status-card__metric">
        <div class="detail-row">
          <span class="compact-label">Energia</span>
          <strong>{{ member.energy }}%</strong>
        </div>
        <div class="progress-track">
          <div class="progress-fill secondary" :style="{ width: `${member.energy}%` }" />
        </div>
      </div>
    </article>
  </section>
</template>
