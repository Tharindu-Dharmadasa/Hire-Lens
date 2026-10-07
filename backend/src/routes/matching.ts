/**
 * Matching Routes
 */

import { Router } from "express";
import {
  matchJob,
  listMatches,
  getMatch,
  deleteMatch,
} from "@/controllers/matching.js";

export const matchingRouter = Router();

// Run AI matching for a job
matchingRouter.post("/jobs/:id/match", matchJob);

// Get all matches for a user
matchingRouter.get("/matches", listMatches);

// Get one match
matchingRouter.get("/matches/:id", getMatch);

// Delete one match
matchingRouter.delete("/matches/:id", deleteMatch);
