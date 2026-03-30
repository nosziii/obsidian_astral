<script setup lang="ts">
import { computed, ref, watch } from "vue";

import ExpeditionHistoryPanel from "../components/gameplay/ExpeditionHistoryPanel.vue";
import ExpeditionIntelPanel from "../components/gameplay/ExpeditionIntelPanel.vue";
import ExpeditionMissionOverview from "../components/gameplay/ExpeditionMissionOverview.vue";
import ExpeditionPanel from "../components/gameplay/ExpeditionPanel.vue";
import BasePanel from "../components/ui/BasePanel.vue";
import { useExpeditionHistory } from "../composables/use-expedition-history";
import { useGameState } from "../composables/use-game-state";
import { buildCommEntries, buildMissionMetrics, buildRewardPreview, buildThreatSignals } from "../lib/expedition-overview";
import { formatCategoryLabel } from "../lib/formatters";

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

async function claimRun(expeditionId: string) {
  await claimExpedition(expeditionId);
  await loadHistory();
}
</script>

<template>
  <div v-if="gameState && selectedExpedition" class="operations-layout">
    <div class="view-stack">
      <ExpeditionMissionOverview
        :expedition="selectedExpedition"
        :metrics="missionMetrics"
        :now="activityNow"
        :run="selectedRun"
        :zone="selectedZone"
      />

      <div class="view-grid">
        <ExpeditionIntelPanel :comms="commEntries" :rewards="rewardPreview" :threats="threatSignals" />

        <BasePanel title="Zónajelentés" subtitle="Taktikai kivonat">
          <div class="detail-list">
            <div class="detail-row">
              <span class="compact-label">Kijelölt zóna</span>
              <strong>{{ selectedZone?.label ?? "Nincs kijelölve" }}</strong>
            </div>
            <div class="detail-row">
              <span class="compact-label">Zónaállapot</span>
              <strong>{{ selectedZone ? formatCategoryLabel(selectedZone.status) : "Ismeretlen" }}</strong>
            </div>
            <div class="detail-row">
              <span class="compact-label">Jutalomszorzó</span>
              <strong>x{{ selectedZone?.rewardMultiplier.toFixed(2) ?? "1.00" }}</strong>
            </div>
            <div class="detail-row">
              <span class="compact-label">Ajánlott szint</span>
              <strong>{{ selectedZone?.recommendedLevel ?? selectedExpedition.requiredLevel }}</strong>
            </div>
          </div>
          <p class="muted">
            {{ selectedZone?.description ?? "Válassz expedíciót a kapcsolódó zónarészletekhez." }}
          </p>
        </BasePanel>
      </div>
    </div>

    <div class="expedition-sidebar">
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
