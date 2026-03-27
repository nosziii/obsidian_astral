<script setup lang="ts">
import ExpeditionPanel from "../components/gameplay/ExpeditionPanel.vue";
import { useGameState } from "../composables/use-game-state";

const { gameState, pendingAction, startExpedition, claimExpedition } = useGameState();
</script>

<template>
  <div v-if="gameState" class="view-stack">
    <ExpeditionPanel
      :catalog="gameState.expeditionsCatalog"
      :active-runs="gameState.expeditions"
      :pending-action="pendingAction"
      @start="startExpedition"
      @claim="claimExpedition"
    />
  </div>
</template>
