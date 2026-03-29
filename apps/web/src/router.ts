import { createRouter, createWebHistory } from "vue-router";

import AppShell from "./components/layout/AppShell.vue";
import AuthLayout from "./components/layout/AuthLayout.vue";
import { loadAuthSession, useAuth } from "./composables/use-auth";
import AdminView from "./views/AdminView.vue";
import CharacterView from "./views/CharacterView.vue";
import DashboardView from "./views/DashboardView.vue";
import ExpeditionsView from "./views/ExpeditionsView.vue";
import LoginView from "./views/LoginView.vue";
import ProfileView from "./views/ProfileView.vue";
import RegisterView from "./views/RegisterView.vue";
import WorkshopView from "./views/WorkshopView.vue";

export const protectedRoutes = [
  { path: "dashboard", component: DashboardView, meta: { label: "Dashboard" } },
  { path: "workshop", component: WorkshopView, meta: { label: "Műhely" } },
  { path: "expeditions", component: ExpeditionsView, meta: { label: "Expedíciók" } },
  { path: "character", component: CharacterView, meta: { label: "Karakter" } },
  { path: "profile", component: ProfileView, meta: { label: "Profil" } },
  { path: "admin", component: AdminView, meta: { label: "Admin", adminOnly: true } },
];

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/auth",
      component: AuthLayout,
      meta: { guestOnly: true },
      children: [
        { path: "login", component: LoginView, meta: { label: "Belépés", guestOnly: true } },
        { path: "register", component: RegisterView, meta: { label: "Regisztráció", guestOnly: true } },
      ],
    },
    {
      path: "/",
      component: AppShell,
      meta: { requiresAuth: true },
      children: [
        { path: "", redirect: "/dashboard" },
        ...protectedRoutes,
      ],
    },
  ],
});

let authInitialization: Promise<unknown> | null = null;

router.beforeEach(async (to) => {
  if (!authInitialization) {
    authInitialization = loadAuthSession();
  }

  await authInitialization;

  const { session } = useAuth();
  const currentSession = session.value;

  if (to.meta.requiresAuth && !currentSession) {
    return "/auth/login";
  }

  if (to.meta.guestOnly && currentSession) {
    return "/dashboard";
  }

  if (to.meta.adminOnly && currentSession?.player.role !== "admin") {
    return "/dashboard";
  }

  return true;
});
