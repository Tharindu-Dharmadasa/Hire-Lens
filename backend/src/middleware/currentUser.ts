import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { prisma } from "../database/prisma.js";

export async function requireCurrentUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      res.status(403).json({
        status: "error",
        message: "User profile not synchronized",
      });
      return;
    }

    res.locals.userId = user.id;
    next();
  } catch (error) {
    next(error);
  }
}
