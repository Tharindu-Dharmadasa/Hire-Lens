import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";

export function requireUser(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const auth = getAuth(req);

  if (!auth.userId) {
    res.status(401).json({
      status: "error",
      message: "Authentication required",
    });
    return;
  }

  next();
}
