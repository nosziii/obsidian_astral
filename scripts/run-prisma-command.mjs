import { spawnSync } from "node:child_process";

const command = process.argv[2];
const commandMap = {
  push: ["run", "prisma:push", "--workspace", "@obsidian-astral/api"],
  seed: ["run", "prisma:seed", "--workspace", "@obsidian-astral/api"],
};

if (!command || !(command in commandMap)) {
  console.error("Ismeretlen Prisma parancs. Használd: push vagy seed.");
  process.exit(1);
}

const env = {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL_LOCAL || process.env.DATABASE_URL,
};

const result = spawnSync("npm", commandMap[command], {
  cwd: process.cwd(),
  stdio: "inherit",
  shell: true,
  env,
});

process.exit(result.status ?? 1);
