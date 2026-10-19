import { Router } from "express";
import { requireUser } from "../middleware/requireUser.js";
import { syncUser } from "../controllers/user.js";

export const userRouter = Router();

userRouter.post("/users/sync", requireUser, syncUser);
