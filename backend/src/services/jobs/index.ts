/**
 * Jobs Service
 *
 * Handles job opportunities and job-related operations.
 */

import { prisma } from "@/database/prisma.js";
import { ApiError, JsonValue } from "@/types/index.js";

export interface CreateJobData {
  userId: string;
  title: string;
  company: string;
  location?: string;
  description?: string;
  requirements?: JsonValue;
  sourceUrl?: string;
  source?: string;
  postedAt?: Date;
}

export class JobsService {
  /**
   * Create a new job opportunity.
   */
  async createJob(data: CreateJobData) {
    const user = await prisma.user.findUnique({
      where: {
        id: data.userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return prisma.job.create({
      data: {
        title: data.title,
        company: data.company,
        location: data.location,
        description: data.description,
        requirements: data.requirements,
        sourceUrl: data.sourceUrl,
        source: data.source,
        postedAt: data.postedAt,
      },
    });
  }

  /**
   * List available jobs and include the current user's match if available.
   */
  async listJobs(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return prisma.job.findMany({
      include: {
        jobMatches: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Get a job and the current user's match if available.
   */
  async getJob(jobId: string, userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
      include: {
        jobMatches: {
          where: {
            userId,
          },
        },
      },
    });

    if (!job) {
      throw new ApiError(404, "Job not found");
    }

    return job;
  }

  /**
   * Delete a job.
   *
   * Related JobMatch records are removed through the database
   * cascade defined in the Prisma schema.
   */
  async deleteJob(jobId: string, userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!job) {
      throw new ApiError(404, "Job not found");
    }

    await prisma.job.delete({
      where: {
        id: jobId,
      },
    });

    return {
      success: true,
      message: "Job deleted successfully",
    };
  }
}