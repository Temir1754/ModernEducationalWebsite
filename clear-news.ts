
import "dotenv/config";
import { db } from "./server/db";
import { news } from "@shared/schema";
import { sql } from "drizzle-orm";

async function clearNews() {
    console.log("🗑️ Clearing all news from database...");
    try {
        await db.delete(news);
        console.log("✅ All news deleted successfully.");
    } catch (error) {
        console.error("❌ Error clearing news:", error);
    }
    process.exit(0);
}

clearNews();
