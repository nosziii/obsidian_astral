import type { AdminAuditLogSnapshot } from "@obsidian-astral/shared";
import type { Prisma } from "@prisma/client";

import { prisma } from "../db.js";

interface AdminAuditLogInput {
  actorPlayerId: string;
  actorName: string;
  targetPlayerId: string;
  targetName: string;
  actionKind: string;
  summary: string;
  metadata?: Prisma.InputJsonValue;
}

function toAdminAuditLogSnapshot(log: {
  id: string;
  actorName: string;
  targetName: string;
  actionKind: string;
  summary: string;
  createdAt: Date;
}): AdminAuditLogSnapshot {
  return {
    id: log.id,
    actorName: log.actorName,
    targetName: log.targetName,
    actionKind: log.actionKind,
    summary: log.summary,
    createdAt: log.createdAt.toISOString(),
  };
}

export async function createAdminAuditLog(input: AdminAuditLogInput) {
  await prisma.adminAuditLog.create({
    data: {
      actorPlayerId: input.actorPlayerId,
      actorName: input.actorName,
      targetPlayerId: input.targetPlayerId,
      targetName: input.targetName,
      actionKind: input.actionKind,
      summary: input.summary,
      metadata: input.metadata ?? {},
    },
  });
}

export async function listAdminAuditLogs(targetPlayerId: string): Promise<AdminAuditLogSnapshot[]> {
  const logs = await prisma.adminAuditLog.findMany({
    where: { targetPlayerId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return logs.map(toAdminAuditLogSnapshot);
}
