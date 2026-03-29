import "dotenv/config";
import { db } from "./server/db";
import { users } from "./shared/schema";

async function run() {
  const allUsers = await db.select().from(users);
  console.log("Users in DB:");
  console.log(allUsers.map(u => ({ id: u.id, username: u.username, role: u.role })));
  process.exit(0);
}
run();
