import { Router } from "express";
import {
  createInterviewSession,
  listInterviewSessions,
  getInterviewSession,
  submitInterviewAnswer,
  deleteInterviewSession,
} from "@/controllers/interview.js";

export const interviewRouter = Router();

interviewRouter.post("/interviews", createInterviewSession);
interviewRouter.get("/interviews", listInterviewSessions);
interviewRouter.get("/interviews/:id", getInterviewSession);
interviewRouter.post(
  "/interviews/:id/questions/:questionId/answer",
  submitInterviewAnswer,
);
interviewRouter.delete("/interviews/:id", deleteInterviewSession);