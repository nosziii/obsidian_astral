import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [vue()],
    server: {
      port: Number(env.VITE_DEV_SERVER_PORT ?? env.WEB_PORT ?? 4173),
      host: env.WEB_HOST ?? "0.0.0.0",
    },
  };
});
