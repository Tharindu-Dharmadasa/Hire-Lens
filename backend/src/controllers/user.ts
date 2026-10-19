import { Request, Response, NextFunction } from "express";
import { clerkClient, getAuth } from "@clerk/express";
import { prisma } from "../database/prisma.js";

export async function syncUser(
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

    const clerkUser = await clerkClient.users.getUser(clerkId);

    const primaryEmail = clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId,
    );

    const email = primaryEmail?.emailAddress;

    if (!email) {
      res.status(400).json({
        status: "error",
        message: "A verified email address is required",
      });
      return;
    }

    const user = await prisma.user.upsert({
      where: { clerkId },
      update: { email },
      create: {
        clerkId,
        email,
      },
    });

    res.status(200).json({
      status: "ok",
      data: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
}
