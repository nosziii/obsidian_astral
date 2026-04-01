import type { RouteLocationRaw, RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

import AppShell from "./components/layout/AppShell.vue";
import AuthLayout from "./components/layout/AuthLayout.vue";
import PublicLayout from "./components/layout/PublicLayout.vue";
import { loadAuthSession, useAuth } from "./composables/use-auth";
import AdminView from "./views/AdminView.vue";
import CharacterView from "./views/CharacterView.vue";
import CommunicationView from "./views/CommunicationView.vue";
import DashboardView from "./views/DashboardView.vue";
import ExpeditionsView from "./views/ExpeditionsView.vue";
import GuideView from "./views/GuideView.vue";
import LandingView from "./views/LandingView.vue";
import LoginView from "./views/LoginView.vue";
import MapView from "./views/MapView.vue";
import MarketplaceView from "./views/MarketplaceView.vue";
import ProfileView from "./views/ProfileView.vue";
import RegisterView from "./views/RegisterView.vue";
import RulesView from "./views/RulesView.vue";
import WorkshopView from "./views/WorkshopView.vue";

export interface NavigationChild {
  label: string;
  icon: string;
  to: RouteLocationRaw;
}

export interface NavigationMeta {
  label: string;
  icon: string;
  adminOnly?: boolean;
  navChildren?: NavigationChild[];
}

export type ProtectedRouteRecord = RouteRecordRaw & {
  path: string;
  meta: NavigationMeta;
};

export const protectedRoutes: ProtectedRouteRecord[] = [
  { path: "dashboard", component: DashboardView, meta: { label: "Dashboard", icon: "dashboard" } },
  {
    path: "communication",
    component: CommunicationView,
    meta: {
      label: "Communication",
      icon: "hub",
      navChildren: [
        { label: "Hub", icon: "neurology", to: { path: "/communication", query: { section: "mails" } } },
        { label: "Globál chat", icon: "public", to: { path: "/communication", query: { section: "global" } } },
        { label: "Műhely chat", icon: "handyman", to: { path: "/communication", query: { section: "workshop" } } },
        { label: "Riasztások", icon: "warning", to: { path: "/communication", query: { section: "alerts" } } },
      ],
    },
  },
  { path: "marketplace", component: MarketplaceView, meta: { label: "Piactér", icon: "storefront" } },
  { path: "map", component: MapView, meta: { label: "Térkép", icon: "public" } },
  { path: "workshop", component: WorkshopView, meta: { label: "Műhely", icon: "handyman" } },
  { path: "expeditions", component: ExpeditionsView, meta: { label: "Expedíciók", icon: "map" } },
  { path: "character", component: CharacterView, meta: { label: "Karakter", icon: "person" } },
  { path: "profile", component: ProfileView, meta: { label: "Profil", icon: "badge" } },
  {
    path: "admin",
    component: AdminView,
    meta: {
      label: "Admin",
      adminOnly: true,
      icon: "shield_person",
      navChildren: [
        { label: "Áttekintés", icon: "grid_view", to: { path: "/admin", query: { section: "overview" } } },
        { label: "Moderáció", icon: "admin_panel_settings", to: { path: "/admin", query: { section: "moderation" } } },
        { label: "Épületek", icon: "apartment", to: { path: "/admin", query: { section: "buildings" } } },
        { label: "Audit", icon: "fact_check", to: { path: "/admin", query: { section: "audit" } } },
      ],
    },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: PublicLayout,
      children: [
        { path: "", component: LandingView, meta: { publicLanding: true } },
        { path: "rules", component: RulesView, meta: { publicDocs: true } },
        { path: "guide", component: GuideView, meta: { publicDocs: true } },
      ],
    },
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
      children: [{ path: "dashboard", redirect: "/dashboard" }, ...protectedRoutes],
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

  if (to.meta.publicLanding && currentSession) {
    return "/dashboard";
  }

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
