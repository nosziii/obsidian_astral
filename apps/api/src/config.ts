import "dotenv/config";

const fallbackDatabaseUrl = process.env.DATABASE_URL_LOCAL;

if (!process.env.DATABASE_URL && fallbackDatabaseUrl) {
  process.env.DATABASE_URL = fallbackDatabaseUrl;
}

function normalizeOrigins(value: string | undefined) {
  if (!value) {
    return ["*"];
  }

  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export const config = {
  apiPort: Number(process.env.API_PORT ?? 4000),
  corsOrigins: normalizeOrigins(process.env.CORS_ORIGIN),
  defaultPlayerName: process.env.DEFAULT_PLAYER_NAME ?? "Parancsnok",
};
