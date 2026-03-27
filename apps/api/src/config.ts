import "dotenv/config";

const fallbackDatabaseUrl =
  process.env.DATABASE_URL_LOCAL ?? "postgresql://obsidian:obsidian@localhost:5432/obsidian_astral?schema=public";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = fallbackDatabaseUrl;
}

export const config = {
  apiPort: Number(process.env.API_PORT ?? 4000),
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  defaultPlayerName: process.env.DEFAULT_PLAYER_NAME ?? "Parancsnok",
};
