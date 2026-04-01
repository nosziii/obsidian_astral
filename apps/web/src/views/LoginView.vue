<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

import AuthPanelCard from "../components/auth/AuthPanelCard.vue";
import { useAuth } from "../composables/use-auth";
import { clearGameState } from "../composables/use-game-state";

const router = useRouter();
const { login } = useAuth();

const email = ref("");
const password = ref("");
const rememberMe = ref(true);
const showPassword = ref(false);
const errorMessage = ref("");
const isSubmitting = ref(false);

async function submit() {
  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    await login(email.value, password.value);
    clearGameState();
    await router.push("/dashboard");
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "A bejelentkezés sikertelen.";
  } finally {
    isSubmitting.value = false;
  }

  void rememberMe.value;
}
</script>

<template>
  <AuthPanelCard
    title="Terminal Access"
    subtitle="Establish a secure link with Sector 7 Command"
    secondary-label="External Uplinks"
  >
    <form class="auth-panel-form" @submit.prevent="submit">
      <label class="auth-panel-field">
        <span class="auth-panel-field__label">Commander E-mail</span>
        <span class="auth-panel-field__control">
          <span class="material-symbols-outlined auth-panel-field__icon">alternate_email</span>
          <input
            id="login-email"
            v-model="email"
            class="auth-panel-field__input"
            type="email"
            autocomplete="email"
            placeholder="admin@obsidianastral.local"
          />
        </span>
      </label>

      <label class="auth-panel-field">
        <span class="auth-panel-field__label">Access Code</span>
        <span class="auth-panel-field__control">
          <span class="material-symbols-outlined auth-panel-field__icon">key</span>
          <input
            id="login-password"
            v-model="password"
            class="auth-panel-field__input auth-panel-field__input--password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="••••••••••••"
          />
          <button
            class="auth-panel-field__toggle"
            type="button"
            :aria-label="showPassword ? 'Jelszó elrejtése' : 'Jelszó megjelenítése'"
            @click="showPassword = !showPassword"
          >
            <span class="material-symbols-outlined">{{ showPassword ? "visibility" : "visibility_off" }}</span>
          </button>
        </span>
      </label>

      <div class="auth-panel-meta">
        <label class="auth-panel-checkbox">
          <input v-model="rememberMe" type="checkbox" />
          <span>Stay Connected</span>
        </label>
        <RouterLink class="auth-panel-link" to="/auth/register">Join the Fleet</RouterLink>
      </div>

      <p v-if="errorMessage" class="status-banner error">{{ errorMessage }}</p>

      <button class="auth-panel-submit" type="submit" :disabled="isSubmitting">
        <span>{{ isSubmitting ? "Connecting..." : "Enter the Void" }}</span>
        <span class="material-symbols-outlined">arrow_forward</span>
      </button>
    </form>

    <template #auxiliary>
      <div class="auth-uplinks">
        <button class="auth-uplink auth-uplink--discord" type="button">
          <span class="material-symbols-outlined">chat</span>
          <span>Discord</span>
        </button>
        <button class="auth-uplink auth-uplink--google" type="button">
          <span class="material-symbols-outlined">cloud</span>
          <span>Google</span>
        </button>
      </div>
    </template>

    <template #secondary>
      <div class="auth-panel-secondary">
        <p>New to the Sector?</p>
        <RouterLink class="auth-panel-secondary__button" to="/auth/register">
          <span>Join the Fleet</span>
          <span class="material-symbols-outlined">person_add</span>
        </RouterLink>
      </div>
    </template>
  </AuthPanelCard>
</template>
