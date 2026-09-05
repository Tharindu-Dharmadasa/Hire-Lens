/**
 * Application Tests
 *
 * Tests for health endpoints and CORS configuration
 */

import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "@/app.js";

const app = createApp();

describe("Health Check Endpoints", () => {
  it("GET / should return welcome message", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      service: "HireLens API",
      message:
        "Welcome to HireLens API. Use GET /api/health for health status.",
    });
  });

  it("GET /api/health should return health status", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.data.service).toBe("HireLens API");
  });

  it("GET /nonexistent should return 404", async () => {
    const response = await request(app).get("/nonexistent");

    expect(response.status).toBe(404);
    expect(response.body.status).toBe("error");
  });
});

describe("CORS Configuration", () => {
  it("should allow requests from allowed origins", async () => {
    const response = await request(app)
      .get("/")
      .set("Origin", "http://localhost:3000");

    expect(response.status).toBe(200);
    expect(response.headers["access-control-allow-origin"]).toBe(
      "http://localhost:3000",
    );
  });
});
