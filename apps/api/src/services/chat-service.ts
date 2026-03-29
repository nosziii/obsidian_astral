import type { ChatChannel, ChatMessageSnapshot } from "@obsidian-astral/shared";

import { prisma } from "../db.js";

function toChatMessageSnapshot(message: {
  id: string;
  channel: string;
  authorName: string;
  content: string;
  createdAt: Date;
}): ChatMessageSnapshot {
  return {
    id: message.id,
    channel: message.channel as ChatChannel,
    authorName: message.authorName,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
  };
}

export async function listChatMessages(channel: ChatChannel): Promise<ChatMessageSnapshot[]> {
  const messages = await prisma.chatMessage.findMany({
    where: { channel },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return messages.reverse().map(toChatMessageSnapshot);
}

export async function createChatMessage(playerId: string, channel: ChatChannel, content: string): Promise<ChatMessageSnapshot[]> {
  const player = await prisma.player.findUniqueOrThrow({
    where: { id: playerId },
    select: {
      name: true,
    },
  });

  await prisma.chatMessage.create({
    data: {
      playerId,
      channel,
      authorName: player.name,
      content,
    },
  });

  return listChatMessages(channel);
}
