import { computed, onMounted, ref } from "vue";
import type { ExpeditionHistorySnapshot } from "@obsidian-astral/shared";

import { gameApi } from "../api/game-api";

const historyEntries = ref<ExpeditionHistorySnapshot[]>([]);
const historyError = ref("");
const historyLoaded = ref(false);

export function useExpeditionHistory() {
  async function loadHistory() {
    try {
      historyError.value = "";
      historyEntries.value = await gameApi.expeditionHistory();
    } catch (error) {
      historyError.value = error instanceof Error ? error.message : "Nem sikerült betölteni az expedíciós naplót.";
    } finally {
      historyLoaded.value = true;
    }
  }

  onMounted(() => {
    if (!historyLoaded.value) {
      void loadHistory();
    }
  });

  return {
    historyEntries: computed(() => historyEntries.value),
    historyError: computed(() => historyError.value),
    historyLoaded: computed(() => historyLoaded.value),
    loadHistory,
  };
}
