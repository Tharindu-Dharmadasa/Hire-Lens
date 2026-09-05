/**
 * Health Service
 */

import { HealthResponse, IHealthService } from "@/types/index.js";

export class HealthService implements IHealthService {
  async getHealth(): Promise<HealthResponse> {
    return {
      status: "ok",
      service: "HireLens API",
    };
  }
}
