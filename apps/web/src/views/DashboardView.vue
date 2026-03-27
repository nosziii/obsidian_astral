<script setup lang="ts">
import PlayerHero from "../components/dashboard/PlayerHero.vue";
import ResourceGrid from "../components/dashboard/ResourceGrid.vue";
import GatheringPanel from "../components/gameplay/GatheringPanel.vue";
import BasePanel from "../components/ui/BasePanel.vue";
import { useGameState } from "../composables/use-game-state";

const { gameState, pendingAction, gather } = useGameState();
</script>

<template>
  <div v-if="gameState" class="view-stack">
    <PlayerHero :player="gameState.player" />

    <BasePanel title="Készletek" subtitle="Erőforrások">
      <ResourceGrid :inventory="gameState.inventory" :resources="gameState.resources" />
    </BasePanel>

    <GatheringPanel :items="gameState.gatherings" :pending-action="pendingAction" @gather="gather" />
  </div>
</template>
