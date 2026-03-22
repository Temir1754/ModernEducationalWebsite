import "dotenv/config";
import { db } from "./server/db";
import { users } from "./shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

async function run() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await db.update(users).set({ password: hashedPassword }).where(eq(users.username, "admin"));
  console.log("Password reset to admin123");
  process.exit(0);
}
run();
