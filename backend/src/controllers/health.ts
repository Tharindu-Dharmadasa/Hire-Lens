/**
 * Health Controller
 */

import { Request, Response, NextFunction } from "express";
import { HealthService } from "@/services/health.js";

const healthService = new HealthService();

export async function getHealth(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const health = await healthService.getHealth();

    res.status(200).json({
      status: "ok",
      data: health,
    });
  } catch (error) {
    next(error);
  }
}
