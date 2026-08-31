/**
 * Express Application Setup
 *
 * This file creates and configures the Express application without starting the server.
 * It's separated from server startup to enable easier testing with Supertest.
 */

import express, { Express } from "express";
import cors from "cors";
import { config } from "@/config/index.js";
import { errorHandler, notFoundHandler } from "@/middleware/errorHandler.js";
import { healthRouter } from "@/routes/health.js";
import { databaseRouter } from "@/routes/database.js";
import { cvRouter } from "@/routes/cv.js";

export function createApp(): Express {
  const app = express();

  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (_req, res) => {
    res.json({
      status: "ok",
      service: "HireLens API",
      message:
        "Welcome to HireLens API. Use GET /api/health for health status.",
    });
  });

  app.use(config.apiPrefix, healthRouter);
  app.use(config.apiPrefix, databaseRouter);
  app.use(config.apiPrefix, cvRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
