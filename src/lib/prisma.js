
const { PrismaClient } = require("@prisma/client");


const prismaClientSingleton = () => {
  
  return new PrismaClient();
};

// Check if a global Prisma instance exists, if not create one
const prisma = global.prismaGlobal || prismaClientSingleton();

// In non-production environments, assign the Prisma instance to the global object to reuse it across invocations
if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}


module.exports = prisma;
