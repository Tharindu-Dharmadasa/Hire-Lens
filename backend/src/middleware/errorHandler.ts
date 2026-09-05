/**
 * Error Handling Middleware
 */

import { Request, Response, NextFunction } from "express";
import { ApiError } from "@/types/index.js";

export function errorHandler(
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  console.error("Unexpected error:", err);

  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    status: "error",
    message: "Not found",
  });
}
