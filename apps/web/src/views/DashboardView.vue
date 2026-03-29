<script setup lang="ts">
import PlayerHero from "../components/dashboard/PlayerHero.vue";
import ResourceGrid from "../components/dashboard/ResourceGrid.vue";
import ActivityFeed from "../components/gameplay/ActivityFeed.vue";
import GatheringPanel from "../components/gameplay/GatheringPanel.vue";
import BasePanel from "../components/ui/BasePanel.vue";
import { useGameState } from "../composables/use-game-state";

const { activityNow, gameState, gather, pendingAction } = useGameState();
</script>

<template>
  <div v-if="gameState" class="view-stack">
    <div class="dashboard-grid">
      <PlayerHero :player="gameState.player" />
      <ResourceGrid :inventory="gameState.inventory" :resources="gameState.resources" />
    </div>

    <div class="dashboard-lower">
      <GatheringPanel
        :activities="gameState.activities"
        :items="gameState.gatherings"
        :now="activityNow"
        :pending-action="pendingAction"
        :player-level="gameState.player.level"
        @gather="gather"
      />

      <ActivityFeed :activities="gameState.activities" :now="activityNow" />
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

    <div class="view-grid">
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

      <BasePanel title="Zónastátusz" subtitle="Előrehaladás">
        <div class="card-list">
          <article v-for="zone in gameState.zones" :key="zone.key" class="action-card">
            <div class="tag-row">
              <span class="tag-pill" :class="zone.status === 'zárolt' ? 'danger' : zone.status === 'hamarosan' ? 'secondary' : 'success'">
                {{ zone.status }}
              </span>
              <span class="compact-label">ajánlott {{ zone.recommendedLevel }}. szint</span>
            </div>
            <h4 class="card-title">{{ zone.label }}</h4>
            <p class="muted">{{ zone.description }}</p>
          </article>
        </div>
      </BasePanel>
    </div>
  </div>
</template>
