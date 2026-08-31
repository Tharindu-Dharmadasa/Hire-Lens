/**
 * Server Startup
 */

import { createApp } from "@/app.js";
import { config } from "@/config/index.js";

const app = createApp();

app.listen(config.port, () => {
  console.log(
    `🚀 HireLens API server running on port ${config.port} (${config.nodeEnv})`,
  );
  console.log(
    `📊 Health check: GET http://localhost:${config.port}/api/health`,
  );
});
