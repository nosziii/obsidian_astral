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
  const hmrEnabled = env.VITE_HMR_ENABLED?.trim().toLowerCase() !== "false";

  if (!hmrEnabled) {
    return false;
  }

  const host = env.VITE_HMR_HOST?.trim();
  const protocol = env.VITE_HMR_PROTOCOL?.trim();
  const port = env.VITE_HMR_PORT ? Number(env.VITE_HMR_PORT) : undefined;
  const clientPort = env.VITE_HMR_CLIENT_PORT ? Number(env.VITE_HMR_CLIENT_PORT) : undefined;
  const path = env.VITE_HMR_PATH?.trim();

  if (!host && !protocol && port === undefined && clientPort === undefined && !path) {
    return undefined;
  }

  return {
    host,
    protocol,
    port,
    clientPort,
    path,
  };
}

function normalizeApiProxyTarget(env: Record<string, string>) {
  const target = env.VITE_PROXY_API_TARGET?.trim();
  return target || undefined;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const allowedHosts = normalizeAllowedHosts(env.VITE_ALLOWED_HOSTS);
  const hmr = normalizeHmrConfig(env);
  const apiProxyTarget = normalizeApiProxyTarget(env);

  return {
    plugins: [vue()],
    server: {
      port: Number(env.VITE_DEV_SERVER_PORT ?? env.WEB_PORT ?? 4173),
      host: env.WEB_HOST ?? "0.0.0.0",
      allowedHosts,
      hmr,
      proxy: apiProxyTarget
        ? {
            "/api": {
              target: apiProxyTarget,
              changeOrigin: true,
            },
            "/health": {
              target: apiProxyTarget,
              changeOrigin: true,
            },
          }
        : undefined,
    },
  };
});
