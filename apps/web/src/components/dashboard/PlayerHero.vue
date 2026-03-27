<script setup lang="ts">
import type { PlayerSnapshot } from "@obsidian-astral/shared";

defineProps<{
  player: PlayerSnapshot;
}>();
</script>

<template>
  <section class="hero panel">
    <div>
      <p class="eyebrow">Parancsnok</p>
      <h2 class="hero-title">{{ player.name }}</h2>
      <p class="muted">
        Hosszú távú stratégiai túlélő és craft központ. A fejlődés nyersanyag-gyűjtésre,
        finomításra és expedíciókra épül.
      </p>
    </div>

    <div class="hero-grid">
      <div class="hero-metric">
        <span class="compact-label">Szint</span>
        <strong>{{ player.level }}</strong>
      </div>
      <div class="hero-metric">
        <span class="compact-label">XP</span>
        <strong>{{ player.xp }}/{{ player.xpToNextLevel }}</strong>
      </div>
      <div class="hero-metric">
        <span class="compact-label">Energia</span>
        <strong>{{ player.energy }}/{{ player.energyMax }}</strong>
      </div>
      <div class="hero-metric">
        <span class="compact-label">Astralit</span>
        <strong>{{ player.astralite }}</strong>
      </div>
    </div>
  </section>
</template>
