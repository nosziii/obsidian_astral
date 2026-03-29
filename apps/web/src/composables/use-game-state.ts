import { computed, onMounted, ref } from "vue";
import type { GameState } from "@obsidian-astral/shared";

import { gameApi } from "../api/game-api";

const gameState = ref<GameState | null>(null);
const pendingAction = ref<string | null>(null);
const errorMessage = ref("");
const loaded = ref(false);

export function clearGameState() {
  gameState.value = null;
  pendingAction.value = null;
  errorMessage.value = "";
  loaded.value = false;
}

async function loadGameState() {
  try {
    errorMessage.value = "";
    gameState.value = await gameApi.getState();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "Nem sikerült betölteni a játékállapotot.";
  } finally {
    loaded.value = true;
  }
}

async function runAction(actionKey: string, operation: () => Promise<GameState>) {
  pendingAction.value = actionKey;

  try {
    errorMessage.value = "";
    gameState.value = await operation();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "A művelet nem sikerült.";
  } finally {
    pendingAction.value = null;
  }
}

export function useGameState() {
  onMounted(() => {
    if (!loaded.value) {
      void loadGameState();
    }
  });

  return {
    gameState: computed(() => gameState.value),
    errorMessage: computed(() => errorMessage.value),
    isLoading: computed(() => !loaded.value && !gameState.value),
    pendingAction: computed(() => pendingAction.value),
    refresh: loadGameState,
    gather: (actionKey: string) => runAction(`gather:${actionKey}`, () => gameApi.gather(actionKey)),
    craft: (recipeKey: string) => runAction(`craft:${recipeKey}`, () => gameApi.craft(recipeKey)),
    upgradeBuilding: (buildingKey: string) =>
      runAction(`building:${buildingKey}`, () => gameApi.upgradeBuilding(buildingKey)),
    startExpedition: (expeditionKey: string) =>
      runAction(`expedition:${expeditionKey}`, () => gameApi.startExpedition(expeditionKey)),
    claimExpedition: (expeditionId: string) =>
      runAction(`claim:${expeditionId}`, () => gameApi.claimExpedition(expeditionId)),
    equipResource: (resourceKey: string) =>
      runAction(`equip:${resourceKey}`, () => gameApi.equipResource(resourceKey)),
  };
}
