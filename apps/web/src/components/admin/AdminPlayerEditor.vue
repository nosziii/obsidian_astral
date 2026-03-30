<script setup lang="ts">
import { ref, watchEffect } from "vue";
import type { AdminPlayerDetail } from "@obsidian-astral/shared";

const props = defineProps<{
  detail: AdminPlayerDetail;
}>();

const emit = defineEmits<{
  save: [payload: { level: number; energy: number; energyMax: number; credits: number; astralite: number }];
  cancelActivity: [activityId: string];
}>();

const level = ref(1);
const energy = ref(0);
const energyMax = ref(0);
const credits = ref(0);
const astralite = ref(0);

watchEffect(() => {
  level.value = props.detail.player.level;
  energy.value = props.detail.player.energy;
  energyMax.value = props.detail.player.energyMax;
  credits.value = props.detail.player.credits;
  astralite.value = props.detail.player.astralite;
});

function submit() {
  emit("save", {
    level: level.value,
    energy: energy.value,
    energyMax: energyMax.value,
    credits: credits.value,
    astralite: astralite.value,
  });
}
</script>

<template>
  <article class="action-card">
    <h4 class="card-title">Admin szerkesztés</h4>
    <form class="admin-edit-grid" @submit.prevent="submit">
      <label class="field-label">
        Szint
        <input v-model.number="level" class="auth-input" type="number" min="1" max="100" />
      </label>
      <label class="field-label">
        Energia
        <input v-model.number="energy" class="auth-input" type="number" min="0" max="1000" />
      </label>
      <label class="field-label">
        Energia max
        <input v-model.number="energyMax" class="auth-input" type="number" min="1" max="1000" />
      </label>
      <label class="field-label">
        Kredit
        <input v-model.number="credits" class="auth-input" type="number" min="0" />
      </label>
      <label class="field-label">
        Asztralit
        <input v-model.number="astralite" class="auth-input" type="number" min="0" />
      </label>
      <button class="primary-button" type="submit">Mentés</button>
    </form>

    <div>
      <h5 class="section-title">Aktivitások kezelése</h5>
      <div v-if="detail.activities.length" class="detail-list">
        <div v-for="activity in detail.activities" :key="activity.id" class="detail-row">
          <span>{{ activity.label }}</span>
          <button class="ghost-button admin-inline-button" type="button" @click="emit('cancelActivity', activity.id)">
            Leállítás
          </button>
        </div>
      </div>
      <p v-else class="muted">Nincs megszakítható aktivitás.</p>
    </div>
  </article>
</template>
