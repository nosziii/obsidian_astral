<script setup lang="ts">
import type { GameState, SessionPlayer } from "@obsidian-astral/shared";

import type { ProfileSignalCard } from "../../lib/character-overview";

defineProps<{
  session: SessionPlayer | null;
  gameState: GameState | null;
  signals: ProfileSignalCard[];
}>();
</script>

<template>
  <section class="profile-command panel">
    <div class="profile-command__identity">
      <div class="profile-command__avatar">
        {{ session?.name.slice(0, 2).toUpperCase() ?? "OA" }}
      </div>

      <div class="profile-command__copy">
        <p class="eyebrow">{{ session?.fleet || "Obsidian flotta" }}</p>
        <h1 class="profile-command__title">{{ session?.name ?? "Parancsnok" }}</h1>
        <p class="muted">{{ session?.bio || "A profil még várja a teljes hírszerzési kivonatot." }}</p>
      </div>
    </div>

    <div class="profile-command__stats">
      <article v-for="signal in signals" :key="signal.label" class="profile-command__metric">
        <span class="compact-label">{{ signal.label }}</span>
        <strong class="value-strong">{{ signal.value }}</strong>
        <span class="text-dim">{{ signal.hint }}</span>
      </article>
      <article v-if="gameState" class="profile-command__metric profile-command__metric--wide">
        <span class="compact-label">Erőforrás-hálózat</span>
        <strong class="value-strong">{{ new Intl.NumberFormat("hu-HU").format(gameState.player.credits) }} Cr</strong>
        <span class="text-dim">{{ new Intl.NumberFormat("hu-HU").format(gameState.player.astralite) }} asztralit tartalék</span>
      </article>
    </div>
  </section>
</template>
