<script setup lang="ts">
import PlayerHero from "../components/dashboard/PlayerHero.vue";
import ResourceGrid from "../components/dashboard/ResourceGrid.vue";
import ActivityFeed from "../components/gameplay/ActivityFeed.vue";
import ChatDock from "../components/gameplay/ChatDock.vue";
import GatheringPanel from "../components/gameplay/GatheringPanel.vue";
import NotificationDigest from "../components/gameplay/NotificationDigest.vue";
import ZoneStatusPanel from "../components/gameplay/ZoneStatusPanel.vue";
import BasePanel from "../components/ui/BasePanel.vue";
import { useGameState } from "../composables/use-game-state";
import { useNotifications } from "../composables/use-notifications";

const { activityNow, gameState, gather, pendingAction } = useGameState();
const { notifications, notificationsError, pendingNotificationAction, markNotificationRead, markAllNotificationsRead } =
  useNotifications();
</script>

<template>
  <div v-if="gameState" class="view-stack dashboard-view">
    <div class="dashboard-grid">
      <PlayerHero :player="gameState.player" />
      <ResourceGrid :inventory="gameState.inventory" :resources="gameState.resources" />
    </div>

    <div class="dashboard-command-grid">
      <GatheringPanel
        :activities="gameState.activities"
        :items="gameState.gatherings"
        :now="activityNow"
        :pending-action="pendingAction"
        :player-level="gameState.player.level"
        @gather="gather"
      />

      <div class="dashboard-command-sidebar">
        <ActivityFeed :activities="gameState.activities" :now="activityNow" />
        <ZoneStatusPanel :zones="gameState.zones" />
      </div>
    </div>

    <div class="dashboard-insights-grid">
      <NotificationDigest
        :notifications="notifications"
        :pending-action="pendingNotificationAction"
        @mark-read="markNotificationRead"
        @mark-all-read="markAllNotificationsRead"
      />

      <BasePanel title="Passzív termelés" subtitle="Bázis output">
        <div class="card-list passive-production-grid">
          <article v-for="entry in gameState.passiveProduction" :key="entry.buildingKey" class="action-card passive-production-card">
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

    <p v-if="notificationsError" class="muted">{{ notificationsError }}</p>

    <ChatDock />
  </div>
</template>
