import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import 'dotenv/config';
import { PrismaClient } from './generated/client';


const connectionString = process.env["DATABASE_URL"];
console.log(connectionString)
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prismaClient = globalForPrisma.prisma || prisma

globalForPrisma.prisma = prismaClient