<script setup lang="ts">
import { ref, watchEffect } from "vue";

import ProfileCommandHero from "../components/profile/ProfileCommandHero.vue";
import ProfileIdentityForm from "../components/profile/ProfileIdentityForm.vue";
import { useAuth } from "../composables/use-auth";
import { useGameState } from "../composables/use-game-state";
import { buildProfileSignals, buildProfileStrands } from "../lib/character-overview";

const { saveProfile, session } = useAuth();
const { gameState } = useGameState();

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
  <div class="profile-layout">
    <ProfileCommandHero :game-state="gameState" :session="session?.player ?? null" :signals="buildProfileSignals(gameState, gameState?.zones ?? [])" />

    <div class="profile-layout__grid">
      <section class="profile-strands panel section-panel">
        <header class="section-header">
          <div>
            <p class="eyebrow">Unlocked Data Strands</p>
            <h3 class="section-title">Aktív fejlődési csatornák</h3>
          </div>
        </header>

        <div class="profile-strands__list">
          <article v-for="strand in buildProfileStrands(gameState)" :key="strand.key" class="profile-strand">
            <strong>{{ strand.label }}</strong>
            <span>{{ strand.detail }}</span>
          </article>
          <p v-if="!buildProfileStrands(gameState).length" class="muted">A parancsnoki profilhoz még nem tartozik kibontott szál.</p>
        </div>
      </section>

      <ProfileIdentityForm
        :bio="bio"
        :error-message="errorMessage"
        :fleet="fleet"
        :is-saving="isSaving"
        :name="name"
        :status-message="statusMessage"
        @submit="submit"
        @update:bio="bio = $event"
        @update:fleet="fleet = $event"
        @update:name="name = $event"
      />
    </div>
  </div>
</template>
