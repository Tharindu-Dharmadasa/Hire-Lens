/**
 * Database Routes
 */

import { Router } from "express";
import { getDatabaseHealth } from "@/controllers/database.js";

export const databaseRouter = Router();

databaseRouter.get("/database", getDatabaseHealth);
