import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./shared/schema";
import { eq } from "drizzle-orm";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite, { schema });

async function fix() {
  console.log("🛠 Fixing canteen media paths in database...");

  const mappings = [
    { old: "/canteen-hall.png", new: "/gallery/canteen/hall.png" },
    { old: "/canteen-kitchen.png", new: "/gallery/canteen/kitchen.png" },
    { old: "/canteen-lunch.png", new: "/gallery/canteen/lunch.png" }
  ];

  for (const m of mappings) {
    const result = await db.update(schema.media)
      .set({ url: m.new })
      .where(eq(schema.media.url, m.old))
      .run();
    
    if (result.changes > 0) {
      console.log(`✅ Updated: ${m.old} -> ${m.new}`);
    } else {
      console.log(`ℹ️ Path ${m.old} not found or already updated.`);
    }
  }

  console.log("✨ Done!");
}

fix().catch(console.error);
