import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";

function normalizeAllowedHosts(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const hosts = value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      if (entry === "true") {
        return entry;
      }

      try {
        return new URL(entry).hostname;
      } catch {
        return entry.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
      }
    });

  if (hosts.length === 0) {
    return undefined;
  }

  if (hosts.includes("true")) {
    return true;
  }

  return hosts;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const allowedHosts = normalizeAllowedHosts(env.VITE_ALLOWED_HOSTS);

  return {
    plugins: [vue()],
    server: {
      port: Number(env.VITE_DEV_SERVER_PORT ?? env.WEB_PORT ?? 4173),
      host: env.WEB_HOST ?? "0.0.0.0",
      allowedHosts,
    },
  };
});
