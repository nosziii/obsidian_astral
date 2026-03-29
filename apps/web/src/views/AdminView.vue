<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import BasePanel from "../components/ui/BasePanel.vue";
import { useAuth } from "../composables/use-auth";

const { adminOverview, adminStatus, loadAdminOverview, grantPack, runSystemPulse } = useAuth();
const query = ref("");
const activeRole = ref<"mind" | "jatekos" | "admin">("mind");

onMounted(() => {
  if (!adminOverview.value) {
    void loadAdminOverview();
  }
});

const visiblePlayers = computed(() => {
  if (!adminOverview.value) {
    return [];
  }

  return adminOverview.value.newestPlayers.filter((player) => {
    const matchesRole = activeRole.value === "mind" || player.role === activeRole.value;
    const normalizedQuery = query.value.trim().toLowerCase();
    const matchesQuery =
      normalizedQuery.length === 0 ||
      player.name.toLowerCase().includes(normalizedQuery) ||
      player.email.toLowerCase().includes(normalizedQuery);

    return matchesRole && matchesQuery;
  });
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
      <div class="admin-toolbar">
        <input v-model="query" class="auth-input admin-search" type="text" placeholder="Keresés név vagy e-mail alapján" />
        <div class="chip-row">
          <button class="ghost-button" :class="{ 'is-active': activeRole === 'mind' }" type="button" @click="activeRole = 'mind'">Mind</button>
          <button class="ghost-button" :class="{ 'is-active': activeRole === 'jatekos' }" type="button" @click="activeRole = 'jatekos'">Játékos</button>
          <button class="ghost-button" :class="{ 'is-active': activeRole === 'admin' }" type="button" @click="activeRole = 'admin'">Admin</button>
        </div>
      </div>

      <div class="admin-table">
        <div class="admin-row admin-row--head">
          <span>Név</span>
          <span>E-mail</span>
          <span>Szerep</span>
          <span>Szint</span>
          <span>Kreditek</span>
          <span>Művelet</span>
        </div>
        <div v-for="player in visiblePlayers" :key="player.id" class="admin-row">
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
      <p v-if="!visiblePlayers.length" class="muted">Nincs a szűrésnek megfelelő játékos.</p>
    </BasePanel>
  </div>
</template>
