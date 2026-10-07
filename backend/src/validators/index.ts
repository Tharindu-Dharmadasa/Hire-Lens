/**
 * Request Validators
 */

import { ApiError, JsonValue } from "@/types/index.js";

export function validateCreateCV(data: unknown): {
  userId: string;
  fileName: string;
  rawText: string;
  fileUrl?: string;
} {
  if (!data || typeof data !== "object") {
    throw new ApiError(400, "Request body must be an object");
  }

  const body = data as Record<string, unknown>;

  if (!body.userId || typeof body.userId !== "string") {
    throw new ApiError(400, "userId is required and must be a string");
  }

  if (!body.fileName || typeof body.fileName !== "string") {
    throw new ApiError(400, "fileName is required and must be a string");
  }

  if (!body.rawText || typeof body.rawText !== "string") {
    throw new ApiError(400, "rawText is required and must be a string");
  }

  if (body.fileUrl && typeof body.fileUrl !== "string") {
    throw new ApiError(400, "fileUrl must be a string if provided");
  }

  return {
    userId: body.userId,
    fileName: body.fileName,
    rawText: body.rawText,
    fileUrl: body.fileUrl as string | undefined,
  };
}

export function validateRequest(_data: unknown): boolean {
  return true;
}

export function validateCreateJob(data: unknown): {
  userId: string;
  title: string;
  company: string;
  location?: string;
  description?: string;
  requirements?: JsonValue;
  sourceUrl?: string;
  source?: string;
  postedAt?: Date;
} {
  if (!data || typeof data !== "object") {
    throw new ApiError(400, "Request body must be an object");
  }

  const body = data as Record<string, unknown>;

  if (!body.userId || typeof body.userId !== "string") {
    throw new ApiError(400, "userId is required and must be a string");
  }

  if (!body.title || typeof body.title !== "string") {
    throw new ApiError(400, "title is required and must be a string");
  }

  if (!body.company || typeof body.company !== "string") {
    throw new ApiError(400, "company is required and must be a string");
  }

  if (body.location !== undefined && typeof body.location !== "string") {
    throw new ApiError(400, "location must be a string if provided");
  }

  if (body.description !== undefined && typeof body.description !== "string") {
    throw new ApiError(400, "description must be a string if provided");
  }

  if (body.sourceUrl !== undefined && typeof body.sourceUrl !== "string") {
    throw new ApiError(400, "sourceUrl must be a string if provided");
  }

  if (body.source !== undefined && typeof body.source !== "string") {
    throw new ApiError(400, "source must be a string if provided");
  }

  return {
    userId: body.userId,
    title: body.title,
    company: body.company,
    location: body.location as string | undefined,
    description: body.description as string | undefined,
    requirements: body.requirements as JsonValue | undefined,
    sourceUrl: body.sourceUrl as string | undefined,
    source: body.source as string | undefined,
  };
}

export function validateCreateInterviewSession(data: unknown): {
  userId: string;
  jobTitle?: string;
  company?: string;
  sessionType?: string;
  candidateProfile?: unknown;
  questionCount?: number;
} {
  if (!data || typeof data !== "object") {
    throw new ApiError(400, "Request body must be an object");
  }

  const body = data as Record<string, unknown>;

  if (!body.userId || typeof body.userId !== "string") {
    throw new ApiError(400, "userId is required and must be a string");
  }

  if (body.jobTitle !== undefined && typeof body.jobTitle !== "string") {
    throw new ApiError(400, "jobTitle must be a string if provided");
  }

  if (body.company !== undefined && typeof body.company !== "string") {
    throw new ApiError(400, "company must be a string if provided");
  }

  if (body.sessionType !== undefined && typeof body.sessionType !== "string") {
    throw new ApiError(400, "sessionType must be a string if provided");
  }

  if (
    body.questionCount !== undefined &&
    typeof body.questionCount !== "number"
  ) {
    throw new ApiError(400, "questionCount must be a number if provided");
  }

  return {
    userId: body.userId,
    jobTitle: body.jobTitle as string | undefined,
    company: body.company as string | undefined,
    sessionType: body.sessionType as string | undefined,
    candidateProfile: body.candidateProfile,
    questionCount: body.questionCount as number | undefined,
  };
}

export function validateSubmitInterviewAnswer(data: unknown): {
  answerText: string;
} {
  if (!data || typeof data !== "object") {
    throw new ApiError(400, "Request body must be an object");
  }

  const body = data as Record<string, unknown>;

  if (!body.answerText || typeof body.answerText !== "string") {
    throw new ApiError(400, "answerText is required and must be a string");
  }

  if (!body.answerText.trim()) {
    throw new ApiError(400, "Answer text cannot be empty");
  }

  return {
    answerText: body.answerText,
  };
}
