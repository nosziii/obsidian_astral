<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <footer class="public-footer">
    <div class="public-footer__content">
      <div class="public-footer__brand">
        <span class="public-footer__title">Obsidian Astral</span>
        <p class="public-footer__copy">© 2144 Obsidian Astral. Minden frekvencia titkosított.</p>
      </div>

      <div class="public-footer__links">
        <RouterLink to="/rules">Szabályzat</RouterLink>
        <RouterLink to="/guide">Leírás</RouterLink>
        <RouterLink to="/auth/login">Belépés</RouterLink>
        <RouterLink to="/auth/register">Regisztráció</RouterLink>
      </div>

      <div class="public-footer__icons" aria-hidden="true">
        <span class="material-symbols-outlined">public</span>
        <span class="material-symbols-outlined">terminal</span>
      </div>
    </div>
  </footer>
</template>
