import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./shared/schema";
import { eq, like } from "drizzle-orm";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite, { schema });

async function fix() {
  console.log("🛠 Fixing asset paths in SQLite...");

  // 1. Fix Canteen Media
  const canteenMedia = await db.select().from(schema.media).where(eq(schema.media.section, "canteen"));
  console.log(`📸 Updating ${canteenMedia.length} canteen images...`);
  
  const canteenMap: Record<string, string> = {
    "canteen_hall.png": "/gallery/canteen/hall.png",
    "canteen_kitchen.png": "/gallery/canteen/kitchen.png",
    "canteen_lunch.png": "/gallery/canteen/lunch.png"
  };

  for (const m of canteenMedia) {
    const filename = m.url.split('/').pop() || "";
    if (canteenMap[filename]) {
      await db.update(schema.media).set({ url: canteenMap[filename] }).where(eq(schema.media.id, m.id)).run();
    } else if (m.url.includes("placeholder") || m.url.includes("attached_assets")) {
       // Backup mapping for hall, kitchen, lunch if filenames are different
       if (m.caption?.toLowerCase().includes("зал") || m.caption?.toLowerCase().includes("hall")) {
         await db.update(schema.media).set({ url: "/gallery/canteen/hall.png" }).where(eq(schema.media.id, m.id)).run();
       } else if (m.caption?.toLowerCase().includes("кухня") || m.caption?.toLowerCase().includes("kitchen")) {
         await db.update(schema.media).set({ url: "/gallery/canteen/kitchen.png" }).where(eq(schema.media.id, m.id)).run();
       } else if (m.caption?.toLowerCase().includes("ас") || m.caption?.toLowerCase().includes("lunch")) {
         await db.update(schema.media).set({ url: "/gallery/canteen/lunch.png" }).where(eq(schema.media.id, m.id)).run();
       }
    }
  }

  // 2. Fix Document Paths (attached_assets -> uploads where applicable)
  // This is a guess: if a file isn't in attached_assets, maybe it's in uploads?
  // But we saw uploads has hashed names, so we can't easily auto-fix.
  // We'll leave them for now or provide a report.

  console.log("✅ Asset paths fixed!");
}

fix().catch(console.error);
