import cors from "cors";
import express from "express";
import {
  loginSchema,
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
import { getAdminOverview } from "./services/admin-service.js";
import { getSessionByToken, loginAccount, logoutAccount, registerAccount, updateProfile } from "./services/auth-service.js";
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

  app.get("/api/game-state", async (_request, response, next) => {
    try {
      response.json(await getGameState(requireAuth(_request).player.id));
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
