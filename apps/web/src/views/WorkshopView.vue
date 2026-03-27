<script setup lang="ts">
import BuildingPanel from "../components/gameplay/BuildingPanel.vue";
import CraftingPanel from "../components/gameplay/CraftingPanel.vue";
import { useGameState } from "../composables/use-game-state";

const { gameState, pendingAction, craft, upgradeBuilding } = useGameState();
</script>

<template>
  <div v-if="gameState" class="view-grid">
    <CraftingPanel
      :recipes="gameState.recipes"
      :resources="gameState.resources"
      :pending-action="pendingAction"
      @craft="craft"
    />

    <BuildingPanel
      :catalog="gameState.buildingCatalog"
      :states="gameState.buildings"
      :resources="gameState.resources"
      :pending-action="pendingAction"
      @upgrade="upgradeBuilding"
    />
  </div>
</template>
