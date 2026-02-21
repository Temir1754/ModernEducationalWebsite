import "dotenv/config";
import { db } from "./server/db";
import { siteContent, sections } from "@shared/schema";
import { sql } from "drizzle-orm";

async function migrate() {
    console.log("Creating site_content table...");

    try {
        await db.execute(sql`
      CREATE TABLE IF NOT EXISTS site_content (
        id VARCHAR(36) PRIMARY KEY,
        \`key\` VARCHAR(255) NOT NULL UNIQUE,
        lang VARCHAR(10) NOT NULL DEFAULT 'kz',
        value TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'text',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
        console.log("✓ site_content table created");
    } catch (error: any) {
        if (error.code === 'ER_TABLE_EXISTS_ERROR') {
            console.log("✓ site_content table already exists");
        } else {
            throw error;
        }
    }

    console.log("Creating sections table...");

    try {
        await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sections (
        id VARCHAR(36) PRIMARY KEY,
        page VARCHAR(100) NOT NULL,
        slug VARCHAR(100) NOT NULL,
        \`order\` VARCHAR(10) NOT NULL,
        is_visible BOOLEAN DEFAULT TRUE,
        config TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log("✓ sections table created");
    } catch (error: any) {
        if (error.code === 'ER_TABLE_EXISTS_ERROR') {
            console.log("✓ sections table already exists");
        } else {
            throw error;
        }
    }

    console.log("Migration complete!");
    process.exit(0);
}

migrate().catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
});
