import { createRouter, createWebHistory } from "vue-router";

import CharacterView from "./views/CharacterView.vue";
import DashboardView from "./views/DashboardView.vue";
import ExpeditionsView from "./views/ExpeditionsView.vue";
import WorkshopView from "./views/WorkshopView.vue";

export const routes = [
  { path: "/", redirect: "/dashboard" },
  { path: "/dashboard", component: DashboardView, meta: { label: "Dashboard" } },
  { path: "/workshop", component: WorkshopView, meta: { label: "Műhely" } },
  { path: "/expeditions", component: ExpeditionsView, meta: { label: "Expedíciók" } },
  { path: "/character", component: CharacterView, meta: { label: "Karakter" } },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
