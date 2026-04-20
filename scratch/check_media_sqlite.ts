import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./shared/schema";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite, { schema });

async function checkMedia() {
  const mediaItems = await db.select().from(schema.media);
  console.log(JSON.stringify(mediaItems, null, 2));
}

checkMedia().catch(console.error);
