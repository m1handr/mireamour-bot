import { type Config, defineConfig } from "drizzle-kit";
import { config } from "./lib/env";

export default defineConfig({
  out: "./drizzle",
  schema: "./lib/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: config.DATABASE_URL,
  },
} satisfies Config);
