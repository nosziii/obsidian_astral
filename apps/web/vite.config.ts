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

function normalizeHmrConfig(env: Record<string, string>) {
  const host = env.VITE_HMR_HOST?.trim();
  const protocol = env.VITE_HMR_PROTOCOL?.trim();
  const port = env.VITE_HMR_PORT ? Number(env.VITE_HMR_PORT) : undefined;
  const clientPort = env.VITE_HMR_CLIENT_PORT ? Number(env.VITE_HMR_CLIENT_PORT) : undefined;

  if (!host && !protocol && port === undefined && clientPort === undefined) {
    return undefined;
  }

  return {
    host,
    protocol,
    port,
    clientPort,
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const allowedHosts = normalizeAllowedHosts(env.VITE_ALLOWED_HOSTS);
  const hmr = normalizeHmrConfig(env);

  return {
    plugins: [vue()],
    server: {
      port: Number(env.VITE_DEV_SERVER_PORT ?? env.WEB_PORT ?? 4173),
      host: env.WEB_HOST ?? "0.0.0.0",
      allowedHosts,
      hmr,
    },
  };
});
