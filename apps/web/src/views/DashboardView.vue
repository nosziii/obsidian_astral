<script setup lang="ts">
import ActivityFeed from "../components/gameplay/ActivityFeed.vue";
import ChatPanel from "../components/gameplay/ChatPanel.vue";
import GatheringPanel from "../components/gameplay/GatheringPanel.vue";
import NotificationCenter from "../components/gameplay/NotificationCenter.vue";
import PlayerHero from "../components/dashboard/PlayerHero.vue";
import ResourceGrid from "../components/dashboard/ResourceGrid.vue";
import BasePanel from "../components/ui/BasePanel.vue";
import { useGameState } from "../composables/use-game-state";
import { buildDashboardNotifications } from "../lib/dashboard-notifications";
import { formatCategoryLabel } from "../lib/formatters";

const { activityNow, gameState, gather, pendingAction } = useGameState();

function zoneStatusClass(status: string) {
  if (status === "zarolt") {
    return "danger";
  }

  if (status === "hamarosan") {
    return "secondary";
  }

  return "success";
}
</script>

<template>
  <div v-if="gameState" class="view-stack">
    <div class="dashboard-grid">
      <PlayerHero :player="gameState.player" />
      <ResourceGrid :inventory="gameState.inventory" :resources="gameState.resources" />
    </div>

    <div class="dashboard-operations">
      <GatheringPanel
        :activities="gameState.activities"
        :items="gameState.gatherings"
        :now="activityNow"
        :pending-action="pendingAction"
        :player-level="gameState.player.level"
        @gather="gather"
      />

      <div class="dashboard-sidebar-stack">
        <ActivityFeed :activities="gameState.activities" :now="activityNow" />
        <NotificationCenter
          :notifications="
            buildDashboardNotifications({
              activities: gameState.activities,
              zones: gameState.zones,
              passiveProduction: gameState.passiveProduction,
            })
          "
        />
      </div>
    </div>

    <div class="view-grid">
      <ChatPanel channel="global" subtitle="Global chat" title="Belső kommunikáció" />

      <BasePanel title="Passzív termelés" subtitle="Bázis output">
        <div class="card-list">
          <article v-for="entry in gameState.passiveProduction" :key="entry.buildingKey" class="action-card">
            <div class="tag-row">
              <span class="tag-pill">{{ entry.label }}</span>
              <span class="chip">szint {{ entry.level }}</span>
            </div>
            <div class="detail-list">
              <div v-for="output in entry.outputs" :key="`${entry.buildingKey}-${output.resourceKey}`" class="detail-row">
                <span>{{ output.label }}</span>
                <strong>{{ output.amountPerHour }}/óra</strong>
              </div>
            </div>
          </article>
        </div>
      </BasePanel>
    </div>

    <BasePanel title="Zónastátusz" subtitle="Előrehaladás">
      <div class="card-list">
        <article v-for="zone in gameState.zones" :key="zone.key" class="action-card">
          <div class="tag-row">
            <span class="tag-pill" :class="zoneStatusClass(zone.status)">
              {{ formatCategoryLabel(zone.status) }}
            </span>
            <span class="compact-label">ajánlott {{ zone.recommendedLevel }}. szint</span>
          </div>
          <h4 class="card-title">{{ zone.label }}</h4>
          <p class="muted">{{ zone.description }}</p>
        </article>
      </div>
    </BasePanel>
  </div>
</template>
