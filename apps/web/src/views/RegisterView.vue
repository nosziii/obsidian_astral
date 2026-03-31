<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import AuthPanelCard from "../components/auth/AuthPanelCard.vue";
import { useAuth } from "../composables/use-auth";
import { clearGameState } from "../composables/use-game-state";

const router = useRouter();
const { register } = useAuth();

const name = ref("");
const fleet = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const acceptProtocol = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const errorMessage = ref("");
const isSubmitting = ref(false);

const isFormInvalid = computed(() => {
  if (!name.value.trim() || !email.value.trim() || !password.value) {
    return true;
  }

  if (password.value.length < 8 || password.value !== confirmPassword.value) {
    return true;
  }

  return !acceptProtocol.value;
});

async function submit() {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "A két jelszó nem egyezik.";
    return;
  }

  if (!acceptProtocol.value) {
    errorMessage.value = "A folytatáshoz el kell fogadni a belépési protokollt.";
    return;
  }

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

  void fleet.value;
}
</script>

<template>
  <AuthPanelCard
    title="Fleet Onboarding"
    subtitle="Open a new command identity inside the Obsidian Astral network"
    secondary-label="Access Briefing"
  >
    <form class="auth-panel-form" @submit.prevent="submit">
      <label class="auth-panel-field">
        <span class="auth-panel-field__label">Commander Name</span>
        <span class="auth-panel-field__control">
          <span class="material-symbols-outlined auth-panel-field__icon">badge</span>
          <input
            id="register-name"
            v-model="name"
            class="auth-panel-field__input"
            type="text"
            autocomplete="name"
            placeholder="Nebula Captain"
          />
        </span>
      </label>

      <label class="auth-panel-field">
        <span class="auth-panel-field__label">Fleet Signature</span>
        <span class="auth-panel-field__control">
          <span class="material-symbols-outlined auth-panel-field__icon">deployed_code</span>
          <input
            id="register-fleet"
            v-model="fleet"
            class="auth-panel-field__input"
            type="text"
            placeholder="Sector 7 Vanguard"
          />
        </span>
      </label>

      <label class="auth-panel-field">
        <span class="auth-panel-field__label">Command E-mail</span>
        <span class="auth-panel-field__control">
          <span class="material-symbols-outlined auth-panel-field__icon">alternate_email</span>
          <input
            id="register-email"
            v-model="email"
            class="auth-panel-field__input"
            type="email"
            autocomplete="email"
            placeholder="fleet@obsidianastral.local"
          />
        </span>
      </label>

      <div class="auth-panel-grid">
        <label class="auth-panel-field">
          <span class="auth-panel-field__label">Access Code</span>
          <span class="auth-panel-field__control">
            <span class="material-symbols-outlined auth-panel-field__icon">key</span>
            <input
              id="register-password"
              v-model="password"
              class="auth-panel-field__input auth-panel-field__input--password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="minimum 8 karakter"
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

        <label class="auth-panel-field">
          <span class="auth-panel-field__label">Confirm Code</span>
          <span class="auth-panel-field__control">
            <span class="material-symbols-outlined auth-panel-field__icon">verified_user</span>
            <input
              id="register-password-confirm"
              v-model="confirmPassword"
              class="auth-panel-field__input auth-panel-field__input--password"
              :type="showConfirmPassword ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="ismételd meg"
            />
            <button
              class="auth-panel-field__toggle"
              type="button"
              :aria-label="showConfirmPassword ? 'Jelszó elrejtése' : 'Jelszó megjelenítése'"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <span class="material-symbols-outlined">{{ showConfirmPassword ? "visibility" : "visibility_off" }}</span>
            </button>
          </span>
        </label>
      </div>

      <div class="auth-panel-meta">
        <label class="auth-panel-checkbox">
          <input v-model="acceptProtocol" type="checkbox" />
          <span>Elfogadom a belépési protokollt</span>
        </label>
        <RouterLink class="auth-panel-link" to="/auth/login">Terminal Access</RouterLink>
      </div>

      <p v-if="errorMessage" class="status-banner error">{{ errorMessage }}</p>

      <button class="auth-panel-submit" type="submit" :disabled="isSubmitting || isFormInvalid">
        <span>{{ isSubmitting ? "Provisioning..." : "Join the Fleet" }}</span>
        <span class="material-symbols-outlined">arrow_forward</span>
      </button>
    </form>

    <template #auxiliary>
      <div class="auth-briefing">
        <article class="auth-briefing__card">
          <span class="material-symbols-outlined">savings</span>
          <div>
            <h3>Starter Cache</h3>
            <p>Kezdő nyersanyagok és alap felszerelés vár az első belépés után.</p>
          </div>
        </article>
        <article class="auth-briefing__card">
          <span class="material-symbols-outlined">travel_explore</span>
          <div>
            <h3>Sector Access</h3>
            <p>Azonnali dashboard, műhely és expedíciós hozzáférés az új profilhoz.</p>
          </div>
        </article>
      </div>
    </template>

    <template #secondary>
      <div class="auth-panel-secondary">
        <p>Already have a command link?</p>
        <RouterLink class="auth-panel-secondary__button" to="/auth/login">
          <span>Return to Login</span>
          <span class="material-symbols-outlined">login</span>
        </RouterLink>
      </div>
    </template>
  </AuthPanelCard>
</template>
