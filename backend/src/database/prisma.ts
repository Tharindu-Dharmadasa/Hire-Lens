import dotenv from "dotenv";
import path from "path";
import { PrismaPg } from "@prisma/adapter-pg";
// @ts-ignore The generated client is outside the backend source root.
import { PrismaClient } from "../../../generated/prisma/client.js";

dotenv.config({
  path: path.resolve(process.cwd(), "../.env"),
});

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

export const prisma = new PrismaClient({ adapter });
