import type express from "express";
import type { AuthSession, UserRole } from "@obsidian-astral/shared";

import { getSessionByToken } from "../services/auth-service.js";
import { GameRuleError } from "./errors.js";

declare global {
  namespace Express {
    interface Request {
      authSession: AuthSession | null;
    }
  }
}

function readBearerToken(request: express.Request) {
  const authorization = request.header("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
}

export async function attachAuthSession(
  request: express.Request,
  _response: express.Response,
  next: express.NextFunction,
) {
  request.authSession = await getSessionByToken(readBearerToken(request));
  next();
}

export function requireAuth(request: express.Request) {
  if (!request.authSession) {
    throw new GameRuleError("Bejelentkezés szükséges.", 401);
  }

  return request.authSession;
}

export function requireRole(request: express.Request, role: UserRole) {
  const session = requireAuth(request);

  if (session.player.role !== role) {
    throw new GameRuleError("Nincs jogosultságod ehhez a művelethez.", 403);
  }

  return session;
}
