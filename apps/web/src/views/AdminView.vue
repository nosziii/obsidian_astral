<script setup lang="ts">
import { onMounted } from "vue";

import BasePanel from "../components/ui/BasePanel.vue";
import { useAuth } from "../composables/use-auth";

const { adminOverview, adminStatus, loadAdminOverview, grantPack, runSystemPulse } = useAuth();

onMounted(() => {
  if (!adminOverview.value) {
    void loadAdminOverview();
  }
});
</script>

<template>
  <div class="view-stack" v-if="adminOverview">
    <section class="admin-hero panel">
      <div>
        <p class="eyebrow">System node: admin-01</p>
        <h1 class="profile-headline">Admin Control Center</h1>
        <p class="muted">Operatív áttekintés a játékosokról, az aktivitásról és a gazdasági állapotról.</p>
      </div>
      <div class="admin-actions">
        <button class="secondary-button" type="button" @click="runSystemPulse">Rendszerimpulzus</button>
        <button class="primary-button" type="button" @click="loadAdminOverview">Frissítés</button>
      </div>
    </section>

    <p v-if="adminStatus" class="status-banner">{{ adminStatus.message }}</p>

    <div class="admin-grid">
      <article class="data-card">
        <span class="compact-label">Játékosok</span>
        <strong class="value-strong">{{ adminOverview.totalPlayers }}</strong>
      </article>
      <article class="data-card">
        <span class="compact-label">Aktív expedíciók</span>
        <strong class="value-strong">{{ adminOverview.activeExpeditions }}</strong>
      </article>
      <article class="data-card">
        <span class="compact-label">Össz kredit</span>
        <strong class="value-strong">{{ new Intl.NumberFormat("hu-HU").format(adminOverview.totalCredits) }}</strong>
      </article>
      <article class="data-card">
        <span class="compact-label">Átlag szint</span>
        <strong class="value-strong">{{ adminOverview.averageLevel }}</strong>
      </article>
    </div>

    <BasePanel title="Új játékosok" subtitle="Commander roster">
      <div class="admin-table">
        <div class="admin-row admin-row--head">
          <span>Név</span>
          <span>E-mail</span>
          <span>Szerep</span>
          <span>Szint</span>
          <span>Kreditek</span>
          <span>Művelet</span>
        </div>
        <div v-for="player in adminOverview.newestPlayers" :key="player.id" class="admin-row">
          <span>{{ player.name }}</span>
          <span>{{ player.email }}</span>
          <span>{{ player.role }}</span>
          <span>{{ player.level }}</span>
          <span>{{ new Intl.NumberFormat("hu-HU").format(player.credits) }}</span>
          <button class="ghost-button admin-inline-button" type="button" @click="grantPack(player.id)">
            Segélycsomag
          </button>
        </div>
      </div>
    </BasePanel>
  </div>
</template>
