import type { AdminActionResult, NotificationListInput, NotificationSnapshot, NotificationTone } from "@obsidian-astral/shared";

import { prisma } from "../db.js";
import { expeditionMap } from "../lib/catalog.js";
import { GameRuleError } from "../lib/errors.js";

interface NotificationInput {
  playerId: string;
  kind: NotificationSnapshot["kind"];
  title: string;
  body: string;
  tone: NotificationTone;
  actionLabel: string;
  referenceKey?: string;
}

function toNotificationSnapshot(notification: {
  id: string;
  kind: string;
  title: string;
  body: string;
  tone: string;
  actionLabel: string;
  createdAt: Date;
  readAt: Date | null;
}): NotificationSnapshot {
  return {
    id: notification.id,
    kind: notification.kind as NotificationSnapshot["kind"],
    title: notification.title,
    body: notification.body,
    tone: notification.tone as NotificationTone,
    actionLabel: notification.actionLabel,
    createdAt: notification.createdAt.toISOString(),
    readAt: notification.readAt?.toISOString() ?? null,
  };
}

export async function createNotification(input: NotificationInput) {
  const notification = input.referenceKey
    ? await prisma.notification.upsert({
        where: {
          playerId_referenceKey: {
            playerId: input.playerId,
            referenceKey: input.referenceKey,
          },
        },
        update: {
          kind: input.kind,
          title: input.title,
          body: input.body,
          tone: input.tone,
          actionLabel: input.actionLabel,
        },
        create: {
          playerId: input.playerId,
          referenceKey: input.referenceKey,
          kind: input.kind,
          title: input.title,
          body: input.body,
          tone: input.tone,
          actionLabel: input.actionLabel,
        },
      })
    : await prisma.notification.create({
        data: {
          playerId: input.playerId,
          kind: input.kind,
          title: input.title,
          body: input.body,
          tone: input.tone,
          actionLabel: input.actionLabel,
        },
      });

  return toNotificationSnapshot(notification);
}

async function ensureExpeditionReadyNotifications(playerId: string) {
  const completedExpeditions = await prisma.expeditionRun.findMany({
    where: {
      playerId,
      claimedAt: null,
      endsAt: {
        lte: new Date(),
      },
    },
  });

  await Promise.all(
    completedExpeditions.map((expedition) => {
      const definition = expeditionMap.get(expedition.expeditionKey);

      return createNotification({
        playerId,
        kind: "expedicio",
        title: `${definition?.label ?? expedition.expeditionKey} befejeződött`,
        body: "Az expedíció visszatért. A jutalmak készen állnak az átvételre.",
        tone: "primary",
        actionLabel: "Átvétel",
        referenceKey: `expedition-ready:${expedition.id}`,
      });
    }),
  );
}

export async function listNotifications(playerId: string, filters: NotificationListInput = {}): Promise<NotificationSnapshot[]> {
  await ensureExpeditionReadyNotifications(playerId);

  const notifications = await prisma.notification.findMany({
    where: {
      playerId,
      kind: filters.kind && filters.kind !== "osszes" ? filters.kind : undefined,
      readAt: filters.unreadOnly ? null : undefined,
    },
    orderBy: [{ readAt: "asc" }, { createdAt: "desc" }],
    take: 12,
  });

  return notifications.map(toNotificationSnapshot);
}

export async function markNotificationRead(playerId: string, notificationId: string): Promise<AdminActionResult> {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      playerId,
    },
  });

  if (!notification) {
    throw new GameRuleError("Az értesítés nem található.", 404);
  }

  await prisma.notification.update({
    where: { id: notificationId },
    data: {
      readAt: notification.readAt ?? new Date(),
    },
  });

  return {
    message: "Az értesítés olvasottra lett jelölve.",
  };
}

export async function markAllNotificationsRead(playerId: string, filters: NotificationListInput = {}): Promise<AdminActionResult> {
  await prisma.notification.updateMany({
    where: {
      playerId,
      kind: filters.kind && filters.kind !== "osszes" ? filters.kind : undefined,
      readAt: null,
    },
    data: {
      readAt: new Date(),
    },
  });

  return {
    message: "Az összes szűrt értesítés olvasottra lett jelölve.",
  };
}
