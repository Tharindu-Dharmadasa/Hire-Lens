/**
 * Express Application Setup
 *
 * This file creates and configures the Express application without starting the server.
 * It's separated from server startup to enable easier testing with Supertest.
 */

import express, { Express } from "express";
import cors from "cors";
import { config } from "./config/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { healthRouter } from "./routes/health.js";
import { databaseRouter } from "@/routes/database.js";
import { cvRouter } from "./routes/cv.js";
import { jobsRouter } from "./routes/jobs.js";
import { matchingRouter } from "./routes/matching.js";
import { interviewRouter } from "./routes/interview.js";
import { clerkMiddleware } from "@clerk/express";
import { userRouter } from "./routes/user.js";
import { requireCurrentUser } from "./middleware/currentUser.js";

export function createApp(): Express {
  const app = express();

  const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: allowedOrigins,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
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

  app.use(
    clerkMiddleware({
      authorizedParties: allowedOrigins,
    }),
  );

  app.use(config.apiPrefix, healthRouter);

  app.use(config.apiPrefix, userRouter);

  if (config.nodeEnv !== "production") {
    app.use(config.apiPrefix, requireCurrentUser, databaseRouter);
  }

  app.use(config.apiPrefix, requireCurrentUser, cvRouter);
  app.use(config.apiPrefix, requireCurrentUser, jobsRouter);
  app.use(config.apiPrefix, requireCurrentUser, matchingRouter);
  app.use(config.apiPrefix, requireCurrentUser, interviewRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
