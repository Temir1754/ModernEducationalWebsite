import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./shared/schema";
import { eq } from "drizzle-orm";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite, { schema });

async function check() {
  console.log("🔍 Checking media records for 'canteen' section...");
  
  const results = await db.select()
    .from(schema.media)
    .where(eq(schema.media.section, "canteen"));

  if (results.length === 0) {
    console.log("❌ No media found for section 'canteen'.");
    
    console.log("\n🔍 Checking all media (first 20 records) to find anything relevant:");
    const allMedia = await db.select().from(schema.media).limit(20);
    allMedia.forEach(m => console.log(`[${m.section}] URL: ${m.url} | Caption: ${m.caption}`));
  } else {
    results.forEach(m => {
      console.log(`✅ ID: ${m.id} | URL: ${m.url} | Section: ${m.section} | Caption: ${m.caption}`);
    });
  }

  console.log("\n✨ Done!");
}

check().catch(console.error);
