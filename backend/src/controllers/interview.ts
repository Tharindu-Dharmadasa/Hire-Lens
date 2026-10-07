import { Request, Response, NextFunction } from "express";
import { InterviewService } from "@/services/interview/index.js";
import {
  validateCreateInterviewSession,
  validateSubmitInterviewAnswer,
} from "@/validators/index.js";
import { ApiError } from "@/types/index.js";

const interviewService = new InterviewService();

export async function createInterviewSession(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = validateCreateInterviewSession(req.body);

    const session = await interviewService.createSession(data);

    res.status(201).json({
      status: "ok",
      message: "Interview session created successfully",
      data: session,
    });
  } catch (error) {
    next(error);
  }
}

export async function listInterviewSessions(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      throw new ApiError(400, "userId query parameter is required");
    }

    const sessions = await interviewService.listSessions(userId);

    res.status(200).json({
      status: "ok",
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
}

export async function getInterviewSession(
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

    const session = await interviewService.getSession(id, userId);

    res.status(200).json({
      status: "ok",
      data: session,
    });
  } catch (error) {
    next(error);
  }
}

export async function submitInterviewAnswer(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id: sessionId, questionId } = req.params;
    const userId = req.query.userId as string;

    if (!userId) {
      throw new ApiError(400, "userId query parameter is required");
    }

    const { answerText } = validateSubmitInterviewAnswer(req.body);

    const result = await interviewService.submitAnswer({
      sessionId,
      questionId,
      userId,
      answerText,
    });

    res.status(200).json({
      status: "ok",
      message: "Interview answer submitted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteInterviewSession(
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

    const result = await interviewService.deleteSession(id, userId);

    res.status(200).json({
      status: "ok",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}