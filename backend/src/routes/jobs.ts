/**
 * Jobs Routes
 */

import { Router } from "express";
import { createJob, listJobs, getJob, deleteJob } from "@/controllers/jobs.js";

export const jobsRouter = Router();

jobsRouter.post("/jobs", createJob);
jobsRouter.get("/jobs", listJobs);
jobsRouter.get("/jobs/:id", getJob);
jobsRouter.delete("/jobs/:id", deleteJob);
