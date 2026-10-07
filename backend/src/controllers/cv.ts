/**
 * CV Controller
 */

import { Request, Response, NextFunction } from "express";
import { CVService } from "@/services/cv/index.js";
import { extractTextFromCVFile } from "@/services/cv/fileParser.js";
import { validateCreateCV } from "@/validators/index.js";
import { ApiError } from "@/types/index.js";

const cvService = new CVService();

// Create CV

export async function createCV(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = validateCreateCV(req.body);

    const result = await cvService.createCV(data);

    res.status(201).json({
      status: "ok",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// Upload CV
export async function uploadCV(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.body.userId as string | undefined;

    if (!userId || typeof userId !== "string") {
      throw new ApiError(400, "userId is required and must be a string");
    }

    if (!req.file) {
      throw new ApiError(400, "CV file is required");
    }

    const rawText = await extractTextFromCVFile(req.file);

    const cv = await cvService.createCV({
      userId,
      fileName: req.file.originalname,
      rawText,
    });

    res.status(201).json({
      status: "ok",
      message: "CV uploaded and text extracted successfully",
      data: cv,
    });
  } catch (error) {
    next(error);
  }
}

// Listing CVs

export async function listCVs(
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

    const cvs = await cvService.listCVs(userId);

    res.status(200).json({
      status: "ok",
      data: cvs,
    });
  } catch (error) {
    next(error);
  }
}

// Get user's CV by ID

export async function getCV(
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

    const cv = await cvService.getCV(id, userId);

    res.status(200).json({
      status: "ok",
      data: cv,
    });
  } catch (error) {
    next(error);
  }
}

// Delete CV

export async function deleteCV(
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

    const result = await cvService.deleteCV(id, userId);

    res.status(200).json({
      status: "ok",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// Analyze CV through AI service

export async function analyzeCV(
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

    const result = await cvService.analyzeCV(id, userId);

    res.status(200).json({
      status: "ok",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
