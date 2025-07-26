import { PrismaClient } from "../generated/prisma/index.js";

const GlobalPrisma = globalThis;

export const db = GlobalPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  GlobalPrisma.prisma = db;
}
// export default prisma;
