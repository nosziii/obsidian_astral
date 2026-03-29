import "dotenv/config";

const fallbackDatabaseUrl = process.env.DATABASE_URL_LOCAL;

if (!process.env.DATABASE_URL && fallbackDatabaseUrl) {
  process.env.DATABASE_URL = fallbackDatabaseUrl;
}

export const config = {
  apiPort: Number(process.env.API_PORT ?? 4000),
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  defaultPlayerName: process.env.DEFAULT_PLAYER_NAME ?? "Parancsnok",
};
