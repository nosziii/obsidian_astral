<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();

const isLanding = computed(() => route.path === "/" || route.path === "/landing");
const isRules = computed(() => route.path === "/rules");
const isGuide = computed(() => route.path === "/guide");
</script>

<template>
  <nav class="public-topnav">
    <RouterLink class="public-topnav__brand" to="/landing">Obsidian Astral</RouterLink>

    <div class="public-topnav__links">
      <a class="public-topnav__link" :class="{ 'is-active': isLanding }" href="/landing#features">Funkciók</a>
      <a class="public-topnav__link" :class="{ 'is-active': isLanding }" href="/landing#clans">Klánok</a>
      <RouterLink class="public-topnav__link" :class="{ 'is-active': isRules }" to="/rules">Szabályzat</RouterLink>
      <RouterLink class="public-topnav__link" :class="{ 'is-active': isGuide }" to="/guide">Leírás</RouterLink>
    </div>

    <div class="public-topnav__actions">
      <RouterLink class="public-topnav__ghost" to="/auth/login">Belépés</RouterLink>
      <RouterLink class="public-topnav__primary" to="/auth/register">Regisztráció</RouterLink>
    </div>
  </nav>
</template>
