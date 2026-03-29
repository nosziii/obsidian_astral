import "dotenv/config";

import { PrismaClient } from "@prisma/client";

import { hashPassword } from "../src/lib/auth.js";
import { bootstrapPlayerState } from "../src/services/account-service.js";

const prisma = new PrismaClient();

async function main() {
  const playerName = process.env.DEFAULT_PLAYER_NAME ?? "Parancsnok";
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL ?? "admin@obsidianastral.local";
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD ?? "Admin1234";
  const playerEmail = process.env.DEFAULT_PLAYER_EMAIL ?? "player@obsidianastral.local";
  const playerPassword = process.env.DEFAULT_PLAYER_PASSWORD ?? "Player1234";

  const player = await prisma.player.upsert({
    where: { email: playerEmail },
    create: {
      email: playerEmail,
      passwordHash: await hashPassword(playerPassword),
      name: playerName,
      role: "jatekos",
      level: 1,
      xp: 0,
      energy: 100,
      energyMax: 100,
      credits: 250,
      astralite: 40,
    },
    update: {
      passwordHash: await hashPassword(playerPassword),
      name: playerName,
    },
  });

  const admin = await prisma.player.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      passwordHash: await hashPassword(adminPassword),
      name: "Admin Parancsnok",
      role: "admin",
      bio: "Rendszerfelügyeleti hozzáféréssel rendelkező admin fiók.",
      fleet: "System Node Admin",
      level: 42,
      xp: 0,
      energy: 140,
      energyMax: 140,
      credits: 2500,
      astralite: 400,
    },
    update: {
      passwordHash: await hashPassword(adminPassword),
      name: "Admin Parancsnok",
      role: "admin",
      bio: "Rendszerfelügyeleti hozzáféréssel rendelkező admin fiók.",
      fleet: "System Node Admin",
    },
  });

  await bootstrapPlayerState(player);
  await bootstrapPlayerState(admin);

  const existingMessageCount = await prisma.chatMessage.count();

  if (existingMessageCount === 0) {
    await prisma.chatMessage.createMany({
      data: [
        {
          playerId: admin.id,
          channel: "global",
          authorName: "Admin Parancsnok",
          content: "Üdv az Obsidian Astral szektorban. A kommunikációs csatorna aktív.",
        },
        {
          playerId: player.id,
          channel: "global",
          authorName: playerName,
          content: "Első műveleti napló bejegyzés rögzítve.",
        },
        {
          playerId: admin.id,
          channel: "workshop",
          authorName: "Admin Parancsnok",
          content: "A műhelycsatornán megoszthatók a craftolási igények és ritka alapanyagok.",
        },
      ],
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exitCode = 1;
  });
