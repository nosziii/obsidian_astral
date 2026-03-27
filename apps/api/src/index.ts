import { config } from "./config.js";
import { createServer } from "./server.js";

const app = createServer();

app.listen(config.apiPort, () => {
  console.log(`Obsidian Astral API listening on port ${config.apiPort}`);
});
