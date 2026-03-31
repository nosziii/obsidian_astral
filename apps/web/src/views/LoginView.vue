<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

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
  <section class="login-scene">
    <div class="login-scene__backdrop" aria-hidden="true">
      <div class="login-scene__gradient"></div>
      <img class="login-scene__nebula" src="/auth/nebula-bg.webp" alt="" />
      <div class="login-scene__shard login-scene__shard--left"></div>
      <div class="login-scene__shard login-scene__shard--right"></div>
      <div class="login-scene__shard login-scene__shard--top"></div>
      <div class="login-scene__texture"></div>
      <div class="login-scene__vignette"></div>
    </div>

    <div class="login-brand">
      <div class="login-brand__row">
        <span class="material-symbols-outlined login-brand__icon">rocket_launch</span>
        <h1 class="login-brand__title">Obsidian Astral</h1>
      </div>
      <p class="login-brand__version">System Intelligence v21.44.0</p>
    </div>

    <section class="login-panel" aria-label="Terminal Access">
      <div class="login-panel__line"></div>

      <header class="login-panel__header">
        <h2 class="login-panel__title">Terminal Access</h2>
        <p class="login-panel__subtitle">Establish a secure link with Sector 7 Command</p>
      </header>

      <form class="login-form" @submit.prevent="submit">
        <label class="login-field">
          <span class="login-field__label">Commander E-mail</span>
          <span class="login-field__control">
            <span class="material-symbols-outlined login-field__icon">alternate_email</span>
            <input
              id="login-email"
              v-model="email"
              class="login-field__input"
              type="email"
              autocomplete="email"
              placeholder="admin@obsidianastral.local"
            />
          </span>
        </label>

        <label class="login-field">
          <span class="login-field__label">Access Code</span>
          <span class="login-field__control">
            <span class="material-symbols-outlined login-field__icon">key</span>
            <input
              id="login-password"
              v-model="password"
              class="login-field__input login-field__input--password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="••••••••••••"
            />
            <button
              class="login-field__toggle"
              type="button"
              :aria-label="showPassword ? 'Jelszó elrejtése' : 'Jelszó megjelenítése'"
              @click="showPassword = !showPassword"
            >
              <span class="material-symbols-outlined">{{ showPassword ? "visibility" : "visibility_off" }}</span>
            </button>
          </span>
        </label>

        <div class="login-form__meta">
          <label class="login-checkbox">
            <input v-model="rememberMe" type="checkbox" />
            <span>Stay Connected</span>
          </label>
          <RouterLink class="login-form__link" to="/auth/register">Frequency Lost?</RouterLink>
        </div>

        <p v-if="errorMessage" class="status-banner error">{{ errorMessage }}</p>

        <button class="login-submit" type="submit" :disabled="isSubmitting">
          <span>{{ isSubmitting ? "Connecting..." : "Enter the Void" }}</span>
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      </form>

      <div class="login-panel__divider">
        <span></span>
        <p>External Uplinks</p>
        <span></span>
      </div>

      <div class="login-uplinks">
        <button class="login-uplink login-uplink--discord" type="button">
          <span class="material-symbols-outlined">chat</span>
          <span>Discord</span>
        </button>
        <button class="login-uplink login-uplink--google" type="button">
          <span class="material-symbols-outlined">cloud</span>
          <span>Google</span>
        </button>
      </div>
    </section>

    <div class="login-secondary">
      <p>New to the Sector?</p>
      <RouterLink class="login-secondary__button" to="/auth/register">
        <span>Join the Fleet</span>
        <span class="material-symbols-outlined">person_add</span>
      </RouterLink>
    </div>

    <footer class="login-footer">
      <nav class="login-footer__links" aria-label="Segédlinkek">
        <a href="#" @click.prevent>Privacy Protocol</a>
        <a href="#" @click.prevent>Terms of Engagement</a>
      </nav>
      <p class="login-footer__copy">© 2144 Obsidian Astral Holdings. All frequencies encrypted.</p>
      <div class="login-footer__actions" aria-hidden="true">
        <span class="material-symbols-outlined">language</span>
        <span class="material-symbols-outlined">contact_support</span>
      </div>
    </footer>
  </section>
</template>
