<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import AdminBuildingEditor from "../components/admin/AdminBuildingEditor.vue";
import AdminInventoryEditor from "../components/admin/AdminInventoryEditor.vue";
import AdminPlayerEditor from "../components/admin/AdminPlayerEditor.vue";
import BasePanel from "../components/ui/BasePanel.vue";
import { useAuth } from "../composables/use-auth";

const {
  adminOverview,
  adminPlayerDetail,
  adminStatus,
  loadAdminOverview,
  loadAdminPlayerDetail,
  saveAdminPlayer,
  cancelAdminActivity,
  mutateAdminInventory,
  mutateAdminBuilding,
  grantPack,
  runSystemPulse,
} = useAuth();

const query = ref("");
const activeRole = ref<"mind" | "jatekos" | "admin">("mind");
const selectedPlayerId = ref<string | null>(null);

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

async function selectPlayer(playerId: string) {
  selectedPlayerId.value = playerId;
  await loadAdminPlayerDetail(playerId);
}

async function submitPlayerUpdate(payload: { level: number; energy: number; energyMax: number; credits: number; astralite: number }) {
  if (!selectedPlayerId.value) {
    return;
  }

  await saveAdminPlayer(selectedPlayerId.value, payload);
}

async function stopSelectedActivity(activityId: string) {
  if (!selectedPlayerId.value) {
    return;
  }

  await cancelAdminActivity(selectedPlayerId.value, activityId);
}

async function updateInventory(payload: { resourceKey: string; amount: number; mode: "add" | "remove" }) {
  if (!selectedPlayerId.value) {
    return;
  }

  await mutateAdminInventory(selectedPlayerId.value, payload);
}

async function updateBuilding(payload: { buildingKey: string; level: number }) {
  if (!selectedPlayerId.value) {
    return;
  }

  await mutateAdminBuilding(selectedPlayerId.value, payload);
}
</script>

<template>
  <div v-if="adminOverview" class="view-stack">
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
        <div
          v-for="player in visiblePlayers"
          :key="player.id"
          class="admin-row"
          :class="{ 'admin-row--active': selectedPlayerId === player.id }"
        >
          <span>{{ player.name }}</span>
          <span>{{ player.email }}</span>
          <span>{{ player.role }}</span>
          <span>{{ player.level }}</span>
          <span>{{ new Intl.NumberFormat("hu-HU").format(player.credits) }}</span>
          <div class="admin-row-actions">
            <button class="ghost-button admin-inline-button" type="button" @click="selectPlayer(player.id)">Részletek</button>
            <button class="ghost-button admin-inline-button" type="button" @click="grantPack(player.id)">Segélycsomag</button>
          </div>
        </div>
      </div>
      <p v-if="!visiblePlayers.length" class="muted">Nincs a szűrésnek megfelelő játékos.</p>
    </BasePanel>

    <BasePanel v-if="adminPlayerDetail" title="Játékos részletei" subtitle="Admin inspect">
      <div class="admin-detail-grid">
        <article class="action-card">
          <div class="detail-list">
            <div class="detail-row">
              <span class="compact-label">Név</span>
              <strong>{{ adminPlayerDetail.player.name }}</strong>
            </div>
            <div class="detail-row">
              <span class="compact-label">Flotta</span>
              <strong>{{ adminPlayerDetail.player.fleet }}</strong>
            </div>
            <div class="detail-row">
              <span class="compact-label">E-mail</span>
              <strong>{{ adminPlayerDetail.player.email }}</strong>
            </div>
            <div class="detail-row">
              <span class="compact-label">Asztralit</span>
              <strong>{{ new Intl.NumberFormat("hu-HU").format(adminPlayerDetail.player.astralite) }}</strong>
            </div>
          </div>
          <p class="muted">{{ adminPlayerDetail.player.bio }}</p>
        </article>

        <AdminPlayerEditor :detail="adminPlayerDetail" @save="submitPlayerUpdate" @cancel-activity="stopSelectedActivity" />

        <AdminInventoryEditor @mutate="updateInventory" />

        <article class="action-card">
          <h4 class="card-title">Aktív események</h4>
          <div v-if="adminPlayerDetail.activities.length" class="detail-list">
            <div v-for="activity in adminPlayerDetail.activities" :key="activity.id" class="detail-row">
              <span>{{ activity.label }}</span>
              <strong>{{ activity.status }}</strong>
            </div>
          </div>
          <p v-else class="muted">Nincs aktív esemény.</p>
        </article>

        <article class="action-card">
          <h4 class="card-title">Fő készlet</h4>
          <div v-if="adminPlayerDetail.inventory.length" class="detail-list">
            <div v-for="item in adminPlayerDetail.inventory" :key="item.resourceKey" class="detail-row">
              <span>{{ item.resourceKey }}</span>
              <strong>{{ item.quantity }}</strong>
            </div>
          </div>
          <p v-else class="muted">Nincs készlet.</p>
        </article>
      </div>

      <AdminBuildingEditor :buildings="adminPlayerDetail.buildings" @save="updateBuilding" />
    </BasePanel>
  </div>
</template>
