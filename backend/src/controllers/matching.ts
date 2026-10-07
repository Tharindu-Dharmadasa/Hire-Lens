/**
 * Matching Controller
 *
 * Handles HTTP requests for AI-powered job matching.
 */

import { Request, Response, NextFunction } from "express";
import { MatchingService } from "@/services/matching/index.js";
import { ApiError } from "@/types/index.js";

const matchingService = new MatchingService();

/**
 * POST /api/jobs/:id/match
 *
 * Match a user's CV against a specific job.
 *
 * Query:
 *   userId - required
 *
 * Body:
 *   cvId - optional
 *
 * If cvId is omitted, the user's latest CV is used.
 */
export async function matchJob(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id: jobId } = req.params;
    const userId = req.query.userId as string;

    if (!userId) {
      throw new ApiError(400, "userId query parameter is required");
    }

    const cvId =
      req.body && typeof req.body.cvId === "string" ? req.body.cvId : undefined;

    const result = await matchingService.matchJob({
      userId,
      jobId,
      cvId,
    });

    res.status(200).json({
      status: "ok",
      message: "Job matched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/matches
 *
 * Get all job matches belonging to a user.
 */
export async function listMatches(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      throw new ApiError(400, "userId query parameter is required");
    }

    const matches = await matchingService.listMatches(userId);

    res.status(200).json({
      status: "ok",
      data: matches,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/matches/:id
 *
 * Get one job match belonging to a user.
 */
export async function getMatch(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.query.userId as string;

    if (!userId) {
      throw new ApiError(400, "userId query parameter is required");
    }

    const match = await matchingService.getMatch(id, userId);

    res.status(200).json({
      status: "ok",
      data: match,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/matches/:id
 *
 * Delete one job match belonging to a user.
 */
export async function deleteMatch(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.query.userId as string;

    if (!userId) {
      throw new ApiError(400, "userId query parameter is required");
    }

    const result = await matchingService.deleteMatch(id, userId);

    res.status(200).json({
      status: "ok",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
