import { config } from "./env";
import { PrismaClient } from "./generated/prisma";

declare global {
  var prisma: PrismaClient | undefined;
}

const db = globalThis.prisma || new PrismaClient();

if (config.NODE_ENV !== "production") globalThis.prisma = db;

export default db;
