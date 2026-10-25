import { PrismaClient } from '@prisma/client';

// Reuse PrismaClient across warm serverless invocations
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.__prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = prisma;
}
