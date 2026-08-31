/**
 * Request Validators
 */

import { ApiError } from "@/types/index.js";

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
