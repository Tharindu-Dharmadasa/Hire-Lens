/**
 * CV Routes
 */

import { Router } from "express";
import { createCV, listCVs, getCV, deleteCV } from "@/controllers/cv.js";

export const cvRouter = Router();

cvRouter.post("/cvs", createCV);
cvRouter.get("/cvs", listCVs);
cvRouter.get("/cvs/:id", getCV);
cvRouter.delete("/cvs/:id", deleteCV);
