// import { PrismaClient } from '@prisma/client'
// import dns from 'dns';

// const globalForPrisma = globalThis
// dns.setServers(["1.1.1.1", "8.8.8.8"]);
// const dns = require("dns")

// export const prisma = globalForPrisma.prisma || new PrismaClient()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


 import { PrismaClient } from '@prisma/client'
import dns from 'dns';

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = prisma;