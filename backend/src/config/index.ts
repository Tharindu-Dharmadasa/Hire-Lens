/**
 * Application Configuration
 */

export const config = {
  port: process.env.BACKEND_PORT
    ? parseInt(process.env.BACKEND_PORT, 10)
    : 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  apiPrefix: "/api",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
};

export const isDevelopment = config.nodeEnv === "development";
export const isProduction = config.nodeEnv === "production";
export const isTest = config.nodeEnv === "test";
