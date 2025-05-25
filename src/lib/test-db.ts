import { prisma } from "./prisma";

export async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`📊 Current user count: ${userCount}`);

    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}
