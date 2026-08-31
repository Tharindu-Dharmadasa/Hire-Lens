import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
// @ts-ignore The generated client is outside the backend source root.
import { PrismaClient } from "../../../generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });
