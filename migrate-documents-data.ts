import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./shared/schema";
import fs from "fs";
import path from "path";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite, { schema });

async function migrate() {
  console.log("🛠 Starting documents migration from file...");

  const filePath = path.join(process.cwd(), "scratch", "documents_to_migrate.txt");
  if (!fs.existsSync(filePath)) {
    console.error("❌ Migration file not found at:", filePath);
    return;
  }

  const rawData = fs.readFileSync(filePath, "utf-8");
  const lines = rawData.trim().split("\n");
  let count = 0;

  for (const line of lines) {
    // Regex logic to handle "val" and \N correctly
    // This regex looks for: 
    // 1. "..." (quoted strings)
    // 2. \N (nulls)
    // Separated by tabs
    const parts: string[] = [];
    const regex = /"((?:\\.|[^"\\])*)"|\\N/g;
    let match;
    while ((match = regex.exec(line)) !== null) {
      if (match[1] !== undefined) {
        parts.push(match[1]);
      } else {
        parts.push("NULL_VALUE"); // Use a placeholder for null
      }
    }

    if (parts.length < 9) {
      console.warn("⚠️ Skipping invalid line (parts length < 9):", line);
      continue;
    }

    const clean = (val: string) => (val === "NULL_VALUE" ? null : val);

    const doc = {
      id: clean(parts[0])!,
      section: clean(parts[1])!,
      title: clean(parts[2])!,
      description: clean(parts[3]),
      url: clean(parts[4])!,
      color: clean(parts[5]),
      icon: clean(parts[6]),
      createdAt: parts[7] === "NULL_VALUE" ? new Date() : new Date(clean(parts[7])!),
      scanUrl: clean(parts[8]),
    };

    try {
      await db.insert(schema.documents).values(doc).onConflictDoUpdate({
        target: schema.documents.id,
        set: {
          section: doc.section,
          title: doc.title,
          description: doc.description,
          url: doc.url,
          color: doc.color,
          icon: doc.icon,
          scanUrl: doc.scanUrl,
        }
      }).run();
      count++;
    } catch (err) {
      console.error(`❌ Error inserting ${doc.title}:`, err);
    }
  }

  console.log(`✅ Migration finished! Updated ${count} documents.`);
}

migrate().catch(console.error);
