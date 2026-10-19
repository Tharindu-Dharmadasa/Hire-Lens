/**
 * Server Startup
 */

import { createApp } from "@/app.js";
import { config } from "@/config/index.js";

const app = createApp();

const port = Number(process.env.PORT || config.port);

app.listen(port, "0.0.0.0", () => {
  console.log(`HireLens API running on port ${port} (${config.nodeEnv})`);
  console.log(`Health endpoint: /api/health`);
});
