import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../shared/schema";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite, { schema });

async function check() {
  const media = await db.select().from(schema.media);
  console.log("--- Media URLs ---");
  media.forEach(m => console.log(`${m.section}: ${m.url}`));

  const docs = await db.select().from(schema.documents).limit(10);
  console.log("\n--- Document URLs (first 10) ---");
  docs.forEach(d => console.log(`${d.title}: ${d.url}`));
}

check();
