/**
 * CV Controller
 */

import { Request, Response, NextFunction } from "express";
import { CVService } from "@/services/cv/index.js";
import { validateCreateCV } from "@/validators/index.js";

const cvService = new CVService();

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
