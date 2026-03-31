<template>
  <main class="auth-layout">
    <section class="auth-scene">
      <div class="auth-scene__backdrop" aria-hidden="true">
        <div class="auth-scene__gradient"></div>
        <img class="auth-scene__nebula" src="/auth/nebula-bg.webp" alt="" />
        <div class="auth-scene__shard auth-scene__shard--left"></div>
        <div class="auth-scene__shard auth-scene__shard--right"></div>
        <div class="auth-scene__shard auth-scene__shard--top"></div>
        <div class="auth-scene__texture"></div>
        <div class="auth-scene__vignette"></div>
      </div>

      <div class="auth-brandmark">
        <div class="auth-brandmark__row">
          <span class="material-symbols-outlined auth-brandmark__icon">rocket_launch</span>
          <h1 class="auth-brandmark__title">Obsidian Astral</h1>
        </div>
        <p class="auth-brandmark__version">System Intelligence v21.44.0</p>
      </div>

      <RouterView v-slot="{ Component, route }">
        <Transition name="auth-panel-transition" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </RouterView>

      <footer class="auth-footer-bar">
        <nav class="auth-footer-bar__links" aria-label="Segédlinkek">
          <a href="#" @click.prevent>Privacy Protocol</a>
          <a href="#" @click.prevent>Terms of Engagement</a>
        </nav>
        <p class="auth-footer-bar__copy">© 2144 Obsidian Astral Holdings. All frequencies encrypted.</p>
        <div class="auth-footer-bar__actions" aria-hidden="true">
          <span class="material-symbols-outlined">language</span>
          <span class="material-symbols-outlined">contact_support</span>
        </div>
      </footer>
    </section>
  </main>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
</script>
