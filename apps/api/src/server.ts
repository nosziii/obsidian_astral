import cors from "cors";
import express from "express";
import {
  adminCancelActivitySchema,
  adminBuildingMutationSchema,
  adminInventoryMutationSchema,
  chatMessageCreateSchema,
  adminGrantPackSchema,
  adminPlayerUpdateSchema,
  loginSchema,
  equipmentUpdateSchema,
  profileUpdateSchema,
  registerSchema,
  craftActionSchema,
  expeditionClaimSchema,
  expeditionStartSchema,
  gatherActionSchema,
  upgradeBuildingSchema,
} from "@obsidian-astral/shared";

import { config } from "./config.js";
import { GameRuleError } from "./lib/errors.js";
import { attachAuthSession, requireAuth, requireRole } from "./lib/request-auth.js";
import { getAdminPlayerDetail } from "./services/admin-player-service.js";
import { mutateAdminPlayerInventory } from "./services/admin-player-inventory-service.js";
import { updateAdminPlayerBuilding } from "./services/admin-player-building-service.js";
import { cancelAdminPlayerActivity, updateAdminPlayer } from "./services/admin-player-mutation-service.js";
import { createChatMessage, listChatMessages } from "./services/chat-service.js";
import { listExpeditionHistory } from "./services/expedition-history-service.js";
import { getAdminOverview, grantStarterPack, triggerSystemPulse } from "./services/admin-service.js";
import { getSessionByToken, loginAccount, logoutAccount, registerAccount, updateProfile } from "./services/auth-service.js";
import { equipItem } from "./services/equipment-service.js";
import { claimExpedition, craftRecipe, gatherResources, startExpedition, upgradeBuilding } from "./services/game-service.js";
import { getGameState } from "./services/player-service.js";

export function createServer() {
  const app = express();

  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json());
  app.use(attachAuthSession);

  app.get("/health", (_request, response) => {
    response.json({ ok: true });
  });

  app.post("/api/auth/register", async (request, response, next) => {
    try {
      const body = registerSchema.parse(request.body);
      response.status(201).json(await registerAccount(body.email, body.password, body.name));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/login", async (request, response, next) => {
    try {
      const body = loginSchema.parse(request.body);
      response.json(await loginAccount(body.email, body.password));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/auth/session", async (request, response, next) => {
    try {
      const token = request.authSession?.token ?? null;
      response.json(await getSessionByToken(token));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/logout", async (request, response, next) => {
    try {
      await logoutAccount(request.authSession?.token ?? null);
      response.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/profile", async (request, response, next) => {
    try {
      const body = profileUpdateSchema.parse(request.body);
      response.json(await updateProfile(requireAuth(request).player.id, body));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/profile/equipment", async (request, response, next) => {
    try {
      const body = equipmentUpdateSchema.parse(request.body);
      const session = requireAuth(request);
      await equipItem(session.player.id, body.slot, body.itemKey);
      response.json(await getGameState(session.player.id));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/game-state", async (_request, response, next) => {
    try {
      response.json(await getGameState(requireAuth(_request).player.id));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/chat", async (request, response, next) => {
    try {
      requireAuth(request);
      const channel = request.query.channel;

      if (channel !== "global" && channel !== "workshop") {
        throw new GameRuleError("Ismeretlen chat csatorna.", 400);
      }

      response.json(await listChatMessages(channel));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/chat", async (request, response, next) => {
    try {
      const body = chatMessageCreateSchema.parse(request.body);
      response.status(201).json(await createChatMessage(requireAuth(request).player.id, body.channel, body.content));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/expeditions/history", async (request, response, next) => {
    try {
      response.json(await listExpeditionHistory(requireAuth(request).player.id));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/actions/gather", async (request, response, next) => {
    try {
      const body = gatherActionSchema.parse(request.body);
      response.json(await gatherResources(requireAuth(request).player.id, body.actionKey));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/actions/craft", async (request, response, next) => {
    try {
      const body = craftActionSchema.parse(request.body);
      response.json(await craftRecipe(requireAuth(request).player.id, body.recipeKey));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/actions/buildings/upgrade", async (request, response, next) => {
    try {
      const body = upgradeBuildingSchema.parse(request.body);
      response.json(await upgradeBuilding(requireAuth(request).player.id, body.buildingKey));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/actions/expeditions/start", async (request, response, next) => {
    try {
      const body = expeditionStartSchema.parse(request.body);
      response.json(await startExpedition(requireAuth(request).player.id, body.expeditionKey));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/actions/expeditions/claim", async (request, response, next) => {
    try {
      const body = expeditionClaimSchema.parse(request.body);
      response.json(await claimExpedition(requireAuth(request).player.id, body.expeditionId));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/overview", async (request, response, next) => {
    try {
      requireRole(request, "admin");
      response.json(await getAdminOverview());
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/players/:playerId", async (request, response, next) => {
    try {
      requireRole(request, "admin");
      response.json(await getAdminPlayerDetail(request.params.playerId));
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/admin/players/:playerId", async (request, response, next) => {
    try {
      requireRole(request, "admin");
      const body = adminPlayerUpdateSchema.parse(request.body);
      response.json(await updateAdminPlayer(request.params.playerId, body));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/admin/players/:playerId/cancel-activity", async (request, response, next) => {
    try {
      requireRole(request, "admin");
      const body = adminCancelActivitySchema.parse(request.body);
      response.json(await cancelAdminPlayerActivity(request.params.playerId, body.activityId));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/admin/players/:playerId/inventory", async (request, response, next) => {
    try {
      requireRole(request, "admin");
      const body = adminInventoryMutationSchema.parse(request.body);
      response.json(await mutateAdminPlayerInventory(request.params.playerId, body));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/admin/players/:playerId/buildings", async (request, response, next) => {
    try {
      requireRole(request, "admin");
      const body = adminBuildingMutationSchema.parse(request.body);
      response.json(await updateAdminPlayerBuilding(request.params.playerId, body));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/admin/system-pulse", async (request, response, next) => {
    try {
      requireRole(request, "admin");
      response.json(await triggerSystemPulse());
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/admin/grant-pack", async (request, response, next) => {
    try {
      requireRole(request, "admin");
      const body = adminGrantPackSchema.parse(request.body);
      response.json(await grantStarterPack(body.playerId));
    } catch (error) {
      next(error);
    }
  });

  app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
    if (error instanceof GameRuleError) {
      response.status(error.status).json({ message: error.message });
      return;
    }

    if (error instanceof Error) {
      response.status(500).json({ message: error.message });
      return;
    }

    response.status(500).json({ message: "Ismeretlen hiba történt." });
  });

  return app;
}
