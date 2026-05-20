// import { PrismaClient } from '@prisma/client'
// import dns from 'dns';

// const globalForPrisma = globalThis
// dns.setServers(["1.1.1.1", "8.8.8.8"]);
// const dns = require("dns")

// export const prisma = globalForPrisma.prisma || new PrismaClient()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


//  import { PrismaClient } from '@prisma/client'
// import dns from 'dns';

// dns.setServers(["1.1.1.1", "8.8.8.8"]);

// const globalForPrisma = globalThis;

// export const prisma =
//   globalForPrisma.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== 'production')
//   globalForPrisma.prisma = prisma;


import { MongoClient } from 'mongodb'

const uri = process.env.DATABASE_URL

if (!uri) {
  throw new Error("DATABASE_URL is missing in .env")
}

let client
let clientPromise

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export default clientPromise