<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { clearGameState } from "../composables/use-game-state";
import { useAuth } from "../composables/use-auth";

const router = useRouter();
const { register } = useAuth();

const name = ref("");
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isSubmitting = ref(false);

async function submit() {
  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    await register(name.value, email.value, password.value);
    clearGameState();
    await router.push("/dashboard");
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "A regisztráció sikertelen.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <section class="auth-card panel">
    <div class="auth-brand">
      <p class="eyebrow">Fleet onboarding</p>
      <h1 class="brand auth-title">Csatlakozás a flottához</h1>
      <p class="muted">Új parancsnoki fiók létrehozása induló készlettel és saját bázissal.</p>
    </div>

    <form class="auth-form" @submit.prevent="submit">
      <label class="field-label" for="register-name">Parancsnoki név</label>
      <input id="register-name" v-model="name" class="auth-input" type="text" placeholder="Nebula Captain" />

      <label class="field-label" for="register-email">E-mail cím</label>
      <input id="register-email" v-model="email" class="auth-input" type="email" placeholder="fleet@astral.hu" />

      <label class="field-label" for="register-password">Jelszó</label>
      <input id="register-password" v-model="password" class="auth-input" type="password" placeholder="minimum 8 karakter" />

      <p v-if="errorMessage" class="status-banner error">{{ errorMessage }}</p>

      <button class="primary-button auth-submit" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? "Regisztráció…" : "Flottatag létrehozása" }}
      </button>
    </form>

    <div class="auth-footer">
      <p class="muted">Van már hozzáférésed? <RouterLink class="support-link" to="/auth/login">Belépés</RouterLink></p>
    </div>
  </section>
</template>
