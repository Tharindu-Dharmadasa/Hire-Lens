/**
 * Jobs Controller
 */

import { Request, Response, NextFunction } from "express";
import { JobsService } from "@/services/jobs/index.js";
import { validateCreateJob } from "@/validators/index.js";

const jobsService = new JobsService();

/**
 * Create a job
 */
export async function createJob(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = validateCreateJob(req.body);

    const job = await jobsService.createJob(data);

    res.status(201).json({
      status: "ok",
      data: job,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * List jobs
 */
export async function listJobs(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      res.status(400).json({
        status: "error",
        message: "userId query parameter is required",
      });
      return;
    }

    const jobs = await jobsService.listJobs(userId);

    res.status(200).json({
      status: "ok",
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get a job by ID
 */
export async function getJob(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.query.userId as string;

    if (!userId) {
      res.status(400).json({
        status: "error",
        message: "userId query parameter is required",
      });
      return;
    }

    const job = await jobsService.getJob(id, userId);

    res.status(200).json({
      status: "ok",
      data: job,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a job
 */
export async function deleteJob(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.query.userId as string;

    if (!userId) {
      res.status(400).json({
        status: "error",
        message: "userId query parameter is required",
      });
      return;
    }

    const result = await jobsService.deleteJob(id, userId);

    res.status(200).json({
      status: "ok",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
