<script setup lang="ts">
defineProps<{
  name: string;
  bio: string;
  fleet: string;
  statusMessage: string;
  errorMessage: string;
  isSaving: boolean;
}>();

defineEmits<{
  (event: "update:name", value: string): void;
  (event: "update:bio", value: string): void;
  (event: "update:fleet", value: string): void;
  (event: "submit"): void;
}>();
</script>

<template>
  <section class="profile-form-panel panel section-panel">
    <header class="section-header">
      <div>
        <p class="eyebrow">Commander Identity</p>
        <h3 class="section-title">Profil szinkronizálása</h3>
      </div>
    </header>

    <form class="profile-form-panel__form" @submit.prevent="$emit('submit')">
      <label class="field-label" for="profile-name">Parancsnoki név</label>
      <input id="profile-name" :value="name" class="auth-input" type="text" @input="$emit('update:name', ($event.target as HTMLInputElement).value)" />

      <label class="field-label" for="profile-fleet">Flotta-aláírás</label>
      <input id="profile-fleet" :value="fleet" class="auth-input" type="text" @input="$emit('update:fleet', ($event.target as HTMLInputElement).value)" />

      <label class="field-label" for="profile-bio">Parancsnoki kivonat</label>
      <textarea
        id="profile-bio"
        :value="bio"
        class="auth-textarea"
        rows="6"
        @input="$emit('update:bio', ($event.target as HTMLTextAreaElement).value)"
      />

      <p v-if="statusMessage" class="status-banner">{{ statusMessage }}</p>
      <p v-if="errorMessage" class="status-banner error">{{ errorMessage }}</p>

      <button class="primary-button" type="submit" :disabled="isSaving">
        {{ isSaving ? "Mentés..." : "Profil mentése" }}
      </button>
    </form>
  </section>
</template>
