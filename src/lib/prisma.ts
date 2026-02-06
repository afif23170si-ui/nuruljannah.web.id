import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

// Configure Neon for serverless environments (Vercel)
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // Check if using Neon pooled connection
  const databaseUrl = process.env.DATABASE_URL || "";
  const isNeon = databaseUrl.includes("neon.tech");
  const isPooled = databaseUrl.includes("pooler") || databaseUrl.includes("-pooler");

  // For Neon pooled connections, use the Neon adapter
  if (isNeon && isPooled) {
    // Append connection parameters for serverless
    let poolUrl = databaseUrl;
    if (!poolUrl.includes("connection_limit")) {
      poolUrl += poolUrl.includes("?") ? "&connection_limit=1" : "?connection_limit=1";
    }

    const pool = new Pool({ connectionString: poolUrl });
    const adapter = new PrismaNeon(pool);

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  // For non-Neon or direct connections
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
