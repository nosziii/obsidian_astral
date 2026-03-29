<script setup lang="ts">
import { ref, watchEffect } from "vue";

import BasePanel from "../components/ui/BasePanel.vue";
import { useAuth } from "../composables/use-auth";

const { saveProfile, session } = useAuth();

const name = ref("");
const bio = ref("");
const fleet = ref("");
const statusMessage = ref("");
const errorMessage = ref("");
const isSaving = ref(false);

watchEffect(() => {
  name.value = session.value?.player.name ?? "";
  bio.value = session.value?.player.bio ?? "";
  fleet.value = session.value?.player.fleet ?? "";
});

async function submit() {
  isSaving.value = true;
  errorMessage.value = "";
  statusMessage.value = "";

  try {
    await saveProfile({ name: name.value, bio: bio.value, fleet: fleet.value });
    statusMessage.value = "A profil frissítve lett.";
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "A profil mentése sikertelen.";
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <div class="view-stack">
    <section class="profile-hero panel">
      <div class="profile-hero-card">
        <div class="profile-hero-avatar">{{ session?.player.name.slice(0, 2).toUpperCase() }}</div>
        <div>
          <p class="eyebrow">{{ session?.player.fleet }}</p>
          <h1 class="profile-headline">{{ session?.player.name }}</h1>
          <p class="muted">{{ session?.player.bio }}</p>
        </div>
      </div>
      <div class="profile-hero-meta">
        <div class="data-card">
          <span class="compact-label">Szerep</span>
          <strong class="value-strong">{{ session?.player.role }}</strong>
        </div>
        <div class="data-card">
          <span class="compact-label">Parancsnoki szint</span>
          <strong class="value-strong">{{ session?.player.level }}</strong>
        </div>
      </div>
    </section>

    <BasePanel title="Fiókprofil" subtitle="Identity">
      <form class="profile-form" @submit.prevent="submit">
        <label class="field-label" for="profile-name">Parancsnoki név</label>
        <input id="profile-name" v-model="name" class="auth-input" type="text" />

        <label class="field-label" for="profile-fleet">Flotta</label>
        <input id="profile-fleet" v-model="fleet" class="auth-input" type="text" />

        <label class="field-label" for="profile-bio">Bemutatkozás</label>
        <textarea id="profile-bio" v-model="bio" class="auth-textarea" rows="5" />

        <p v-if="statusMessage" class="status-banner">{{ statusMessage }}</p>
        <p v-if="errorMessage" class="status-banner error">{{ errorMessage }}</p>

        <button class="primary-button" type="submit" :disabled="isSaving">
          {{ isSaving ? "Mentés…" : "Profil mentése" }}
        </button>
      </form>
    </BasePanel>
  </div>
</template>
