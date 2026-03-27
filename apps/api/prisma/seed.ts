import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { buildings, resources } from "@obsidian-astral/shared";

const prisma = new PrismaClient();

const starterInventory: Record<string, number> = {
  fa: 120,
  ko: 90,
  vaserc: 70,
  viz: 80,
  elelem: 65,
  textil: 30,
  rez: 35,
  szen: 24,
  kristaly: 16,
  gyogynoveny: 18,
};

async function main() {
  const playerName = process.env.DEFAULT_PLAYER_NAME ?? "Parancsnok";

  const existingPlayer = await prisma.player.findFirst();

  if (existingPlayer) {
    return;
  }

  const player = await prisma.player.create({
    data: {
      name: playerName,
      level: 1,
      xp: 0,
      energy: 100,
      energyMax: 100,
      credits: 250,
      astralite: 40,
    },
  });

  await prisma.inventoryEntry.createMany({
    data: resources.map((resource) => ({
      playerId: player.id,
      resourceKey: resource.key,
      quantity: starterInventory[resource.key] ?? 0,
    })),
  });

  await prisma.buildingState.createMany({
    data: buildings.map((building) => ({
      playerId: player.id,
      buildingKey: building.key,
      level: 1,
    })),
  });
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
