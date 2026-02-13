import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasourceUrl: process.env.DATABASE_URL,
  });
}

// Use cached client in ALL environments (including production builds)
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Cache the client globally to prevent multiple instances
globalForPrisma.prisma = prisma;

export default prisma;
