<script setup lang="ts">
import { computed } from "vue";
import type { PlayerSnapshot } from "@obsidian-astral/shared";

const props = defineProps<{
  player: PlayerSnapshot;
}>();

const metrics = computed(() => [
  {
    label: "Harci rang",
    value: `Vanguard ${Math.max(1, Math.ceil(props.player.level / 10))}`,
    progress: Math.min(100, props.player.level * 2),
    tone: "",
  },
  {
    label: "Mérnökség",
    value: `Expert (${props.player.level * 2})`,
    progress: Math.min(100, Math.round((props.player.xp / props.player.xpToNextLevel) * 100)),
    tone: "secondary",
  },
  {
    label: "Alkímia",
    value: `Master (${props.player.level * 2 + 8})`,
    progress: Math.min(100, Math.round((props.player.astralite / Math.max(props.player.credits, 1)) * 400)),
    tone: "tertiary",
  },
  {
    label: "Asztrál kötelék",
    value: `Tier ${Math.max(1, Math.ceil(props.player.level / 14))}`,
    progress: Math.min(100, Math.round((props.player.energy / props.player.energyMax) * 100)),
    tone: "neutral",
  },
]);
</script>

<template>
  <section class="hero panel">
    <div class="level-ring">
      <span class="level-value">{{ player.level }}</span>
      <span class="level-badge">Szint</span>
    </div>

    <div class="hero-copy">
      <div>
        <p class="eyebrow">Parancsnok</p>
        <h2 class="hero-title">{{ player.name }}</h2>
        <p class="muted">
          Stratégiai irányítópult a túléléshez, craftoláshoz és expedíciós vezényléshez.
          A jelenlegi build most már a terv szerkezetéhez igazodik.
        </p>
      </div>

      <div class="hero-metrics">
        <article v-for="metric in metrics" :key="metric.label" class="hero-metric">
          <span class="metric-label">{{ metric.label }}</span>
          <strong class="metric-value">{{ metric.value }}</strong>
          <div class="metric-track">
            <div class="metric-fill" :class="metric.tone" :style="{ width: `${metric.progress}%` }" />
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
