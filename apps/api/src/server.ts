import cors from "cors";
import express from "express";
import {
  craftActionSchema,
  expeditionClaimSchema,
  expeditionStartSchema,
  gatherActionSchema,
  upgradeBuildingSchema,
} from "@obsidian-astral/shared";

import { config } from "./config.js";
import { GameRuleError } from "./lib/errors.js";
import { claimExpedition, craftRecipe, gatherResources, startExpedition, upgradeBuilding } from "./services/game-service.js";
import { getGameState } from "./services/player-service.js";

export function createServer() {
  const app = express();

  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.json({ ok: true });
  });

  app.get("/api/game-state", async (_request, response, next) => {
    try {
      response.json(await getGameState());
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/actions/gather", async (request, response, next) => {
    try {
      const body = gatherActionSchema.parse(request.body);
      response.json(await gatherResources(body.actionKey));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/actions/craft", async (request, response, next) => {
    try {
      const body = craftActionSchema.parse(request.body);
      response.json(await craftRecipe(body.recipeKey));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/actions/buildings/upgrade", async (request, response, next) => {
    try {
      const body = upgradeBuildingSchema.parse(request.body);
      response.json(await upgradeBuilding(body.buildingKey));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/actions/expeditions/start", async (request, response, next) => {
    try {
      const body = expeditionStartSchema.parse(request.body);
      response.json(await startExpedition(body.expeditionKey));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/actions/expeditions/claim", async (request, response, next) => {
    try {
      const body = expeditionClaimSchema.parse(request.body);
      response.json(await claimExpedition(body.expeditionId));
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
