// Creates an additional admin user. Never modifies existing users.
// Usage: npx tsx create-admin.ts <username> <password>
import "dotenv/config";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "./server/db";
import { users } from "./shared/schema";

async function run() {
  const [username, password] = process.argv.slice(2);

  if (!username || !password) {
    console.error("Usage: npx tsx create-admin.ts <username> <password>");
    process.exit(1);
  }
  if (!/^[A-Za-z0-9_.-]{3,50}$/.test(username)) {
    console.error("Username must be 3-50 characters: latin letters, digits, _ . -");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters");
    process.exit(1);
  }

  const [existing] = await db.select().from(users).where(eq(users.username, username));
  if (existing) {
    console.error(`User "${username}" already exists (role: ${existing.role}). Nothing changed.`);
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.insert(users).values({
    id: crypto.randomUUID(),
    username,
    password: hashedPassword,
    role: "admin",
  });

  console.log(`Admin "${username}" created.`);
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
