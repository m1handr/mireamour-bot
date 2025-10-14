import { drizzle } from "drizzle-orm/node-postgres";
import type * as schema from "./schema";

export * from "./schema";
export const db = drizzle<typeof schema>(process.env.DATABASE_URL!);
