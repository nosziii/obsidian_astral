<script setup lang="ts">
import { computed, ref, watch } from "vue";

import ExpeditionCommsPanel from "../components/gameplay/ExpeditionCommsPanel.vue";
import ExpeditionHistoryPanel from "../components/gameplay/ExpeditionHistoryPanel.vue";
import ExpeditionLootPanel from "../components/gameplay/ExpeditionLootPanel.vue";
import ExpeditionMissionOverview from "../components/gameplay/ExpeditionMissionOverview.vue";
import ExpeditionPanel from "../components/gameplay/ExpeditionPanel.vue";
import ExpeditionTeamStatus from "../components/gameplay/ExpeditionTeamStatus.vue";
import ExpeditionThreatRadar from "../components/gameplay/ExpeditionThreatRadar.vue";
import { useExpeditionHistory } from "../composables/use-expedition-history";
import { useGameState } from "../composables/use-game-state";
import {
  buildCommEntries,
  buildMissionMetrics,
  buildRewardPreview,
  buildTeamStatus,
  buildThreatSignals,
} from "../lib/expedition-overview";

const { activityNow, claimExpedition, gameState, pendingAction, startExpedition } = useGameState();
const { historyEntries, historyError, loadHistory } = useExpeditionHistory();
const selectedExpeditionKey = ref<string | null>(null);

const catalog = computed(() => gameState.value?.expeditionsCatalog ?? []);

watch(
  [catalog, () => gameState.value?.expeditions ?? []],
  ([items, runs]) => {
    if (!items.length) {
      selectedExpeditionKey.value = null;
      return;
    }

    const activeRunKey = runs[0]?.key ?? null;
    const hasCurrent = selectedExpeditionKey.value && items.some((item) => item.key === selectedExpeditionKey.value);

    if (!hasCurrent) {
      selectedExpeditionKey.value = activeRunKey ?? items[0].key;
    }
  },
  { immediate: true },
);

const selectedExpedition = computed(() => catalog.value.find((item) => item.key === selectedExpeditionKey.value) ?? null);
const selectedRun = computed(() => gameState.value?.expeditions.find((item) => item.key === selectedExpeditionKey.value) ?? null);
const selectedZone = computed(() =>
  gameState.value?.zones.find((item) => item.key === selectedExpedition.value?.zoneKey) ?? null,
);
const selectedHistoryEntry = computed(() => historyEntries.value.find((item) => item.key === selectedExpeditionKey.value) ?? null);
const missionMetrics = computed(() =>
  selectedExpedition.value ? buildMissionMetrics(selectedExpedition.value, selectedZone.value, selectedRun.value, activityNow.value) : [],
);
const rewardPreview = computed(() =>
  selectedExpedition.value && gameState.value
    ? buildRewardPreview(selectedExpedition.value, gameState.value.resources, selectedZone.value, selectedHistoryEntry.value)
    : [],
);
const threatSignals = computed(() => (selectedExpedition.value ? buildThreatSignals(selectedExpedition.value, selectedZone.value) : []));
const commEntries = computed(() =>
  selectedExpedition.value ? buildCommEntries(selectedExpedition.value, selectedZone.value, selectedRun.value, activityNow.value) : [],
);
const teamStatus = computed(() => (selectedExpedition.value ? buildTeamStatus(selectedExpedition.value, selectedRun.value) : []));

async function claimRun(expeditionId: string) {
  await claimExpedition(expeditionId);
  await loadHistory();
}
</script>

<template>
  <div v-if="gameState && selectedExpedition" class="expedition-view">
    <div class="expedition-command-grid">
      <ExpeditionTeamStatus :members="teamStatus" />

      <ExpeditionMissionOverview
        :expedition="selectedExpedition"
        :metrics="missionMetrics"
        :now="activityNow"
        :run="selectedRun"
        :zone="selectedZone"
      />

      <div class="expedition-column expedition-column--stack">
        <ExpeditionLootPanel :rewards="rewardPreview" />
        <ExpeditionCommsPanel :comms="commEntries" />
      </div>
    </div>

    <ExpeditionThreatRadar :threats="threatSignals" />

    <div class="expedition-support-grid">
      <ExpeditionPanel
        :activities="gameState.activities"
        :catalog="catalog"
        :active-runs="gameState.expeditions"
        :now="activityNow"
        :pending-action="pendingAction"
        :player-level="gameState.player.level"
        @claim="claimRun"
        @select="selectedExpeditionKey = $event"
        @start="startExpedition"
      />

      <ExpeditionHistoryPanel :entries="historyEntries" :error-message="historyError" />
    </div>
  </div>
</template>
