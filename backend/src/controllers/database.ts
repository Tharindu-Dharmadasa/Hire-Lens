/**
 * Database Health Controller
 */

import { Request, Response, NextFunction } from "express";
import { prisma } from "@/database/prisma.js";

export async function getDatabaseHealth(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "ok",
      data: {
        database: "connected",
      },
    });
  } catch (error) {
    next(error);
  }
}
