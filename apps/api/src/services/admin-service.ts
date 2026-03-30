import type { AdminActionResult, AdminOverview, AdminPlayerSummary, UserRole } from "@obsidian-astral/shared";

import { prisma } from "../db.js";
import { changeInventory } from "./inventory-service.js";
import { createNotification } from "./notification-service.js";

function toAdminPlayerSummary(player: {
  id: string;
  email: string | null;
  name: string;
  role: string;
  isSuspended: boolean;
  level: number;
  credits: number;
  astralite: number;
  createdAt: Date;
}): AdminPlayerSummary {
  return {
    id: player.id,
    email: player.email ?? "nincs@beallitva.local",
    name: player.name,
    role: player.role as UserRole,
    isSuspended: player.isSuspended,
    level: player.level,
    credits: player.credits,
    astralite: player.astralite,
    createdAt: player.createdAt.toISOString(),
  };
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const [players, activeExpeditions, aggregate] = await Promise.all([
    prisma.player.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.expeditionRun.count({
      where: {
        claimedAt: null,
        endsAt: { gt: new Date() },
      },
    }),
    prisma.player.aggregate({
      _count: { id: true },
      _avg: { level: true },
      _sum: { credits: true, astralite: true },
    }),
  ]);

  return {
    totalPlayers: aggregate._count.id,
    activeExpeditions,
    totalCredits: aggregate._sum.credits ?? 0,
    totalAstralite: aggregate._sum.astralite ?? 0,
    averageLevel: Math.round((aggregate._avg.level ?? 0) * 10) / 10,
    newestPlayers: players.map(toAdminPlayerSummary),
  };
}

export async function triggerSystemPulse(): Promise<AdminActionResult> {
  const players = await prisma.player.findMany({
    select: {
      id: true,
      energyMax: true,
    },
  });

  await Promise.all(
    players.map((player) =>
      prisma.player.update({
        where: { id: player.id },
        data: {
          energy: player.energyMax,
        },
      }),
    ),
  );

  await Promise.all(
    players.map((player) =>
      createNotification({
        playerId: player.id,
        kind: "admin",
        title: "Rendszerimpulzus végrehajtva",
        body: "Az admin központ teljesen visszatöltötte az energiaállapotodat.",
        tone: "secondary",
        actionLabel: "Dashboard",
      }),
    ),
  );

  return {
    message: `${players.length} játékos energiaállapota feltöltve lett.`,
  };
}

export async function grantStarterPack(playerId: string): Promise<AdminActionResult> {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
  });

  if (!player) {
    throw new Error("A játékos nem található.");
  }

  await prisma.player.update({
    where: { id: playerId },
    data: {
      credits: { increment: 250 },
      astralite: { increment: 35 },
      energy: Math.min(player.energyMax, player.energy + 20),
    },
  });

  await changeInventory(
    playerId,
    [
      { resourceKey: "fa", amount: 20 },
      { resourceKey: "vaserc", amount: 10 },
      { resourceKey: "gyogynoveny", amount: 6 },
    ],
    "add",
  );

  await createNotification({
    playerId,
    kind: "admin",
    title: "Segélycsomag érkezett",
    body: "Az admin központ kreditekkel, asztralittal és alapanyagokkal töltötte fel a készletedet.",
    tone: "primary",
    actionLabel: "Készlet",
  });

  return {
    message: `${player.name} segélycsomagot kapott.`,
  };
}
