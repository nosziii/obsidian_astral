<script setup lang="ts">
import { computed } from "vue";

import PlayerHero from "../components/dashboard/PlayerHero.vue";
import ResourceGrid from "../components/dashboard/ResourceGrid.vue";
import GatheringPanel from "../components/gameplay/GatheringPanel.vue";
import BasePanel from "../components/ui/BasePanel.vue";
import { useGameState } from "../composables/use-game-state";

const { gameState, gather, pendingAction } = useGameState();

const encounters = computed(() => {
  if (!gameState.value) {
    return [];
  }

  return [
    {
      title: "Győzelem! A Mélységi Őrjárat visszatért.",
      detail: `Zsákmány: ${gameState.value.inventory[0]?.quantity ?? 0} ${gameState.value.resources[0]?.label ?? "nyersanyag"}`,
      ago: "2 perce",
      tone: "",
    },
    {
      title: "Klánvédelem sikeres a keleti szektorban.",
      detail: `Tartósságvesztés: ${Math.max(2, Math.round(gameState.value.player.level / 3))}%`,
      ago: "1 órája",
      tone: "info",
    },
    {
      title: "Felderítés lezárva a Vortex-peremnél.",
      detail: "Új kitermelési pont azonosítva.",
      ago: "4 órája",
      tone: "success",
    },
  ];
});
</script>

<template>
  <div v-if="gameState" class="view-stack">
    <div class="dashboard-grid">
      <PlayerHero :player="gameState.player" />
      <ResourceGrid :inventory="gameState.inventory" :resources="gameState.resources" />
    </div>

    <div class="dashboard-lower">
      <GatheringPanel :items="gameState.gatherings" :pending-action="pendingAction" @gather="gather" />

      <BasePanel title="Legutóbbi események" subtitle="Recent encounters">
        <div class="log-list">
          <article v-for="item in encounters" :key="item.title" class="log-item">
            <span class="log-dot" :class="item.tone" />
            <div>
              <strong>{{ item.title }}</strong>
              <p class="muted">{{ item.detail }}</p>
            </div>
            <span class="compact-label">{{ item.ago }}</span>
          </article>
        </div>
      </BasePanel>
    </div>

    <BasePanel title="Belső kommunikáció" subtitle="Global chat">
      <div class="chat-card">
        <div class="chat-tabs">
          <span class="chat-tab is-active">Globál chat</span>
          <span class="chat-tab">Klán chat</span>
        </div>
        <div class="chat-messages">
          <p class="chat-line"><strong>[Nightstalker]:</strong> Esti bányász runhoz kell még egy healer.</p>
          <p class="chat-line"><strong>[Vortex_7]:</strong> Arra csereérett ritka kőzetet keresek.</p>
          <p class="chat-line"><strong>[Admin]:</strong> Karbantartás 4 órán belül.</p>
        </div>
        <input class="chat-input" type="text" placeholder="Írj üzenetet…" />
      </div>
    </BasePanel>
  </div>
</template>
