/**
 * Matching Service
 *
 * Handles AI-powered job matching for HireLens.
 *
 * Flow:
 * User
 *   ↓
 * Selected/latest CV
 *   ↓
 * CandidateProfile
 *   +
 * Job
 *   ↓
 * AIService
 *   ↓
 * JobMatch
 */

import { prisma } from "@/database/prisma.js";
import { AIService, JobMatchResult } from "@/services/ai/index.js";
import { ApiError } from "@/types/index.js";

export interface MatchJobData {
  userId: string;
  jobId: string;
  cvId?: string;
}

export class MatchingService {
  private readonly aiService?: AIService;

  constructor(aiService?: AIService) {
    this.aiService = aiService;
  }

  /**
   * Match a user's CV against a job.
   *
   * If cvId is provided, that CV is used.
   * Otherwise, the user's most recently created CV is used.
   */
  async matchJob(data: MatchJobData) {
    // --------------------------------------------------
    // 1. Verify user
    // --------------------------------------------------

    const user = await prisma.user.findUnique({
      where: {
        id: data.userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // --------------------------------------------------
    // 2. Find the job
    // --------------------------------------------------

    const job = await prisma.job.findUnique({
      where: {
        id: data.jobId,
      },
    });

    if (!job) {
      throw new ApiError(404, "Job not found");
    }

    // --------------------------------------------------
    // 3. Find the CV
    // --------------------------------------------------

    const cv = data.cvId
      ? await prisma.cV.findFirst({
          where: {
            id: data.cvId,
            userId: data.userId,
          },
          include: {
            candidateProfile: true,
          },
        })
      : await prisma.cV.findFirst({
          where: {
            userId: data.userId,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            candidateProfile: true,
          },
        });

    if (!cv) {
      throw new ApiError(
        404,
        data.cvId
          ? "CV not found or does not belong to the user"
          : "No CV found for this user",
      );
    }

    // --------------------------------------------------
    // 4. Verify CandidateProfile
    // --------------------------------------------------

    if (!cv.candidateProfile) {
      throw new ApiError(
        400,
        "Candidate profile has not been created for this CV",
      );
    }

    // --------------------------------------------------
    // 5. Run AI matching
    // --------------------------------------------------

    const aiService = this.aiService ?? new AIService();

    const result: JobMatchResult = await aiService.matchJob(
      cv.candidateProfile,
      {
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        requirements: job.requirements,
      },
    );

    // --------------------------------------------------
    // 6. Save / update JobMatch
    // --------------------------------------------------

    const jobMatch = await prisma.jobMatch.upsert({
      where: {
        userId_jobId: {
          userId: data.userId,
          jobId: data.jobId,
        },
      },
      update: {
        matchScore: result.matchScore,
        explanation: result.explanation,
        matchedSkills: result.matchedSkills,
        missingSkills: result.missingSkills,
      },
      create: {
        userId: data.userId,
        jobId: data.jobId,
        matchScore: result.matchScore,
        explanation: result.explanation,
        matchedSkills: result.matchedSkills,
        missingSkills: result.missingSkills,
      },
    });

    // --------------------------------------------------
    // 7. Return useful information to the API
    // --------------------------------------------------

    return {
      match: jobMatch,
      job,
      cv: {
        id: cv.id,
        fileName: cv.fileName,
        uploadedAt: cv.uploadedAt,
      },
      candidateProfile: cv.candidateProfile,
    };
  }

  /**
   * Get all job matches belonging to a user.
   */
  async listMatches(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return prisma.jobMatch.findMany({
      where: {
        userId,
      },
      include: {
        job: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Get one job match belonging to a user.
   */
  async getMatch(matchId: string, userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const match = await prisma.jobMatch.findFirst({
      where: {
        id: matchId,
        userId,
      },
      include: {
        job: true,
      },
    });

    if (!match) {
      throw new ApiError(404, "Job match not found");
    }

    return match;
  }

  /**
   * Delete a saved job match.
   */
  async deleteMatch(matchId: string, userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const match = await prisma.jobMatch.findFirst({
      where: {
        id: matchId,
        userId,
      },
    });

    if (!match) {
      throw new ApiError(404, "Job match not found");
    }

    await prisma.jobMatch.delete({
      where: {
        id: matchId,
      },
    });

    return {
      success: true,
      message: "Job match deleted successfully",
    };
  }
}
