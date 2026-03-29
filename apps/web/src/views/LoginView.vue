<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { clearGameState } from "../composables/use-game-state";
import { useAuth } from "../composables/use-auth";

const router = useRouter();
const { login } = useAuth();

const email = ref("");
const password = ref("");
const rememberMe = ref(true);
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
  <section class="auth-card panel">
    <div class="auth-brand">
      <p class="eyebrow">System intelligence v21.44.0</p>
      <h1 class="brand auth-title">Obsidian Astral</h1>
      <p class="muted">Terminal Access a Sector 7 parancsnoki hálózathoz.</p>
    </div>

    <form class="auth-form" @submit.prevent="submit">
      <label class="field-label" for="login-email">Parancsnoki e-mail</label>
      <input id="login-email" v-model="email" class="auth-input" type="email" placeholder="commander@astral.hu" />

      <label class="field-label" for="login-password">Hozzáférési kulcs</label>
      <input id="login-password" v-model="password" class="auth-input" type="password" placeholder="••••••••" />

      <div class="auth-meta">
        <label class="checkbox-line">
          <input v-model="rememberMe" type="checkbox" />
          <span>Kapcsolat megtartása</span>
        </label>
        <RouterLink class="support-link" to="/auth/register">Új belépő?</RouterLink>
      </div>

      <p v-if="errorMessage" class="status-banner error">{{ errorMessage }}</p>

      <button class="primary-button auth-submit" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? "Kapcsolódás…" : "Belépés az állomásra" }}
      </button>
    </form>

    <div class="auth-footer">
      <p class="compact-label">Demo fiókok seed után</p>
      <p class="muted">`player@obsidianastral.local` / `Player1234` és `admin@obsidianastral.local` / `Admin1234`</p>
    </div>
  </section>
</template>
