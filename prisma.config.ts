import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import path from "path";

export default defineConfig({
  schema: "./prisma/schema.prisma",

  migrations: {
    path: "./prisma/migrations",
  },

  datasource: {
    url: env("DATABASE_URL"),
  },

  client: {
    output: path.resolve(__dirname, "./generated/prisma"),
  },
});
