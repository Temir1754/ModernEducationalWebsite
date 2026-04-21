import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./shared/schema";
import fs from "fs";
import path from "path";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite, { schema });

async function sync() {
  console.log("🛠 Starting production data sync...");

  const dataPath = path.join(process.cwd(), "scratch", "sync-data.json");
  if (!fs.existsSync(dataPath)) {
    console.error("❌ Sync data file not found at:", dataPath);
    return;
  }

  const { media, documents } = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  console.log(`📸 Syncing ${media.length} media records...`);
  for (const item of media) {
    const cleanItem = {
      ...item,
      createdAt: item.createdAt ? new Date(item.createdAt) : new Date()
    };

    await db.insert(schema.media).values(cleanItem).onConflictDoUpdate({
      target: schema.media.id,
      set: {
        type: item.type,
        url: item.url,
        caption: item.caption,
        section: item.section,
        eventId: item.eventId
      }
    }).run();
  }

  console.log(`📄 Syncing ${documents.length} document records...`);
  for (const doc of documents) {
    // Handle Date conversion if it's a string from JSON
    const cleanDoc = {
      ...doc,
      createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date()
    };
    
    await db.insert(schema.documents).values(cleanDoc).onConflictDoUpdate({
      target: schema.documents.id,
      set: {
        section: doc.section,
        title: doc.title,
        description: doc.description,
        url: doc.url,
        color: doc.color,
        icon: doc.icon,
        scanUrl: doc.scanUrl
      }
    }).run();
  }

  console.log("✅ Sync complete!");
}

sync().catch(console.error);
