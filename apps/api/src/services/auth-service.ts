import type { AuthSession, SessionPlayer, UserRole } from "@obsidian-astral/shared";
import { prisma } from "../db.js";
import { createSessionToken, hashPassword, verifyPassword } from "../lib/auth.js";
import { GameRuleError } from "../lib/errors.js";
import { bootstrapPlayerState } from "./account-service.js";

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

function toSessionPlayer(player: {
  id: string;
  email: string | null;
  name: string;
  role: string;
  level: number;
  bio: string;
  fleet: string;
}): SessionPlayer {
  if (!player.email) {
    throw new GameRuleError("A fiókhoz nincs beállított e-mail cím.");
  }

  return {
    id: player.id,
    email: player.email,
    name: player.name,
    role: player.role as UserRole,
    level: player.level,
    bio: player.bio,
    fleet: player.fleet,
  };
}

async function createSessionForPlayer(playerId: string) {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.session.create({
    data: {
      playerId,
      token,
      expiresAt,
    },
  });

  return token;
}

export async function registerAccount(email: string, password: string, name: string): Promise<AuthSession> {
  const existing = await prisma.player.findUnique({
    where: { email },
  });

  if (existing) {
    throw new GameRuleError("Ez az e-mail cím már használatban van.");
  }

  const passwordHash = await hashPassword(password);
  const player = await prisma.player.create({
    data: {
      email,
      passwordHash,
      name,
      role: "jatekos",
    },
  });

  await bootstrapPlayerState(player);

  const token = await createSessionForPlayer(player.id);

  return {
    token,
    player: toSessionPlayer(player),
  };
}

export async function loginAccount(email: string, password: string): Promise<AuthSession> {
  const player = await prisma.player.findUnique({
    where: { email },
  });

  if (!player?.passwordHash || !(await verifyPassword(password, player.passwordHash))) {
    throw new GameRuleError("Hibás e-mail cím vagy jelszó.", 401);
  }

  const token = await createSessionForPlayer(player.id);

  return {
    token,
    player: toSessionPlayer(player),
  };
}

export async function getSessionByToken(token: string | null): Promise<AuthSession | null> {
  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { player: true },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.session.delete({
      where: { token },
    });
    return null;
  }

  return {
    token: session.token,
    player: toSessionPlayer(session.player),
  };
}

export async function logoutAccount(token: string | null) {
  if (!token) {
    return;
  }

  await prisma.session.deleteMany({
    where: { token },
  });
}

export async function updateProfile(playerId: string, input: { name: string; bio: string; fleet: string }) {
  const player = await prisma.player.update({
    where: { id: playerId },
    data: {
      name: input.name,
      bio: input.bio,
      fleet: input.fleet,
    },
  });

  return toSessionPlayer(player);
}
