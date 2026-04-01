<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();

const isLanding = computed(() => route.path === "/");
const isRules = computed(() => route.path === "/rules");
const isGuide = computed(() => route.path === "/guide");
</script>

<template>
  <nav class="public-topnav">
    <RouterLink class="public-topnav__brand" to="/">Obsidian Astral</RouterLink>

    <div class="public-topnav__links">
      <a class="public-topnav__link" :class="{ 'is-active': isLanding }" href="/#features">Funkciók</a>
      <a class="public-topnav__link" :class="{ 'is-active': isLanding }" href="/#clans">Klánok</a>
      <RouterLink class="public-topnav__link" :class="{ 'is-active': isRules }" to="/rules">Szabályzat</RouterLink>
      <RouterLink class="public-topnav__link" :class="{ 'is-active': isGuide }" to="/guide">Leírás</RouterLink>
    </div>

    <div class="public-topnav__actions">
      <RouterLink class="public-topnav__ghost" to="/auth/login">Belépés</RouterLink>
      <RouterLink class="public-topnav__primary" to="/auth/register">Regisztráció</RouterLink>
    </div>
  </nav>
</template>
