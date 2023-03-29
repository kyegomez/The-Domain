// import { PrismaClient } from "@prisma/client";

// declare global {
//   var prisma: PrismaClient | undefined;
// }

// const prisma = typeof window === "undefined" ? (global.prisma || new PrismaClient()) : undefined;

// if (process.env.NODE_ENV === "production" && typeof window === "undefined") global.prisma = prisma;

// export default prisma;




/////////////////===================================================v2

// import { PrismaClient } from '@prisma/client';

// declare global {
//     namespace NODEJS{
//         interface Global {
//             prisma: PrismaClient;
//         }
//     }
// }

// export const prisma = 
//     global.prisma || 
//     new PrismaClient({
//         log: 
//         process.env.NODE_ENV === 'production'
//         ? ["error", "warn"]
//         : ["query", "info", "warn", "error"],
//     });

// if (process.env.NODE_ENV != "production") global.prisma = prisma;



/////////////////===================================================v3

// import { Prisma, PrismaClient } from "@prisma/client";

// declare global {
//   namespace NodeJS {
//     interface Global {
//       prisma: PrismaClient;
//     }
//   }
// }

// let prisma: PrismaClient;

// if (typeof window === "undefined") {
//   if (process.env.NODE_ENV === "production") {
//     prisma = new PrismaClient();
//   } else {
//     if (!global.prisma) {
//       global.prisma = new PrismaClient();
//     }

//     prisma = global.prisma;
//   }
// }

// export default prisma;




import { PrismaClient } from '@prisma/client';

declare const global: Global & { prisma?: PrismaClient };

export let prisma: PrismaClient;

if (typeof window === 'undefined') {
  if (process.env['NODE_ENV'] === 'production') {
    prisma = new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
  
  }}