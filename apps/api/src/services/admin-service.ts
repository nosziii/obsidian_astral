import type { AdminOverview, AdminPlayerSummary, UserRole } from "@obsidian-astral/shared";
import { prisma } from "../db.js";

function toAdminPlayerSummary(player: {
  id: string;
  email: string | null;
  name: string;
  role: string;
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
