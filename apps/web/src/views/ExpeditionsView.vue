<script setup lang="ts">
import BasePanel from "../components/ui/BasePanel.vue";
import ExpeditionPanel from "../components/gameplay/ExpeditionPanel.vue";
import { useGameState } from "../composables/use-game-state";

const { claimExpedition, gameState, pendingAction, startExpedition } = useGameState();
</script>

<template>
  <div v-if="gameState" class="map-layout">
    <section class="panel map-stage">
      <div class="sector-title">
        <p class="eyebrow">Cartography</p>
        <h2 class="sector-heading">Asztrál szektor VII</h2>
        <p class="muted">Állapot: törésstabilizáció folyamatban.</p>
      </div>

      <div class="map-stats">
        <div class="map-stat">
          <span class="compact-label">Felderítés</span>
          <strong class="value-strong">64%</strong>
        </div>
        <div class="map-stat">
          <span class="compact-label">Fenyegetés</span>
          <strong class="value-strong" style="color: var(--tertiary)">Magas</strong>
        </div>
      </div>

      <div class="map-node" style="top: 185px; left: 160px">
        <div class="node-diamond"><span>⛰</span></div>
        <div>
          <p class="eyebrow">Vashegyek</p>
          <p class="muted">Felderítve</p>
        </div>
      </div>

      <div class="map-node" style="top: 135px; left: 48%">
        <div class="node-diamond secondary"><span>◇</span></div>
        <div>
          <p class="eyebrow" style="color: var(--secondary)">Vortex-cluster</p>
          <p class="muted">Void-rift zóna</p>
        </div>
      </div>

      <div class="map-node" style="top: 330px; right: 120px">
        <div class="node-diamond danger"><span>⌖</span></div>
        <div>
          <p class="eyebrow" style="color: var(--danger)">Vulkáni zóna</p>
          <p class="muted">Zárolva, szint 50</p>
        </div>
      </div>

      <div class="map-node" style="bottom: 110px; left: 42%">
        <div class="node-diamond"><span>✦</span></div>
        <div>
          <p class="eyebrow">Kristálymezők</p>
          <p class="muted">Aktív expedíció</p>
        </div>
      </div>

      <div class="map-footer">
        <div class="data-card">
          <span class="compact-label">Koordináták</span>
          <strong class="value-strong">A-24 // Z-992</strong>
        </div>
        <div class="map-controls">
          <div class="control-button">+</div>
          <div class="control-button">−</div>
          <div class="control-button">⌖</div>
        </div>
      </div>
    </section>

    <div class="expedition-sidebar">
      <ExpeditionPanel
        :catalog="gameState.expeditionsCatalog"
        :active-runs="gameState.expeditions"
        :pending-action="pendingAction"
        :player-level="gameState.player.level"
        @claim="claimExpedition"
        @start="startExpedition"
      />

      <BasePanel title="Műveleti napló" subtitle="Operation logs">
        <ul class="log-bullets">
          <li v-for="run in gameState.expeditions" :key="run.id">
            {{ run.label }} {{ run.status === "befejezve" ? "lezárult" : "folyamatban van" }}.
          </li>
          <li>Új nyersanyagforrás azonosítva a kristálymezőkön.</li>
        </ul>
      </BasePanel>
    </div>
  </div>
</template>
