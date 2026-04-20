import "dotenv/config";
import mysql from "mysql2/promise";
import Database from "better-sqlite3";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import * as schema from "./shared/schema";
import { eq } from "drizzle-orm";

async function migrate() {
  console.log("🚀 Starting server-side migration...");

  const mysqlUrl = process.env.DATABASE_URL;
  if (!mysqlUrl) {
    console.error("❌ DATABASE_URL is not defined in .env");
    process.exit(1);
  }

  const connection = await mysql.createConnection(mysqlUrl);
  console.log("✅ Connected to MySQL");

  const sqlite = new Database("sqlite.db");
  const db = drizzleSqlite(sqlite, { schema });
  console.log("✅ Connected to SQLite");

  // Helper to clear table before migration to avoid duplicates
  const clearTable = async (table: any, name: string) => {
    console.log(`🧹 Clearing ${name}...`);
    sqlite.prepare(`DELETE FROM ${name}`).run();
  };

  try {
    // 1. Migrate Users
    await clearTable(schema.users, "users");
    const [userRows]: any = await connection.execute("SELECT * FROM users");
    console.log(`📥 Migrating ${userRows.length} users...`);
    for (const row of userRows) {
      await db.insert(schema.users).values({
        id: row.id,
        username: row.username,
        password: row.password,
        role: row.role || 'user'
      }).run();
    }

    // 2. Migrate Events
    await clearTable(schema.events, "events");
    const [eventRows]: any = await connection.execute("SELECT * FROM events");
    console.log(`📥 Migrating ${eventRows.length} events...`);
    for (const row of eventRows) {
      await db.insert(schema.events).values({
        id: row.id,
        month: row.month,
        title: row.title,
        dateText: row.date_text,
        description: row.description,
        mediaUrl: row.media_url,
        mediaType: row.media_type,
        createdAt: new Date(row.created_at)
      }).run();
    }

    // 3. Migrate News
    await clearTable(schema.news, "news");
    const [newsRows]: any = await connection.execute("SELECT * FROM news");
    console.log(`📥 Migrating ${newsRows.length} news items...`);
    for (const row of newsRows) {
      await db.insert(schema.news).values({
        id: row.id,
        title: row.title,
        body: row.body,
        coverUrl: row.cover_url,
        dateText: row.date_text,
        createdAt: new Date(row.created_at)
      }).run();
    }

    // 4. Migrate Site Content
    await clearTable(schema.siteContent, "site_content");
    const [contentRows]: any = await connection.execute("SELECT * FROM site_content");
    console.log(`📥 Migrating ${contentRows.length} content items...`);
    for (const row of contentRows) {
      await db.insert(schema.siteContent).values({
        id: row.id,
        key: row.key,
        lang: row.lang || 'kz',
        value: row.value,
        type: row.type || 'text',
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      }).run();
    }

    // 5. Migrate Document Folders
    await clearTable(schema.documentFolders, "document_folders");
    const [folderRows]: any = await connection.execute("SELECT * FROM document_folders");
    console.log(`📥 Migrating ${folderRows.length} folders...`);
    for (const row of folderRows) {
      await db.insert(schema.documentFolders).values({
        id: row.id,
        name: row.name,
        parentId: row.parent_id,
        isCategory: row.is_category === 1,
        order: String(row.order || "0"),
        createdAt: new Date(row.created_at)
      }).run();
    }

    // 6. Migrate Documents
    await clearTable(schema.documents, "documents");
    const [docRows]: any = await connection.execute("SELECT * FROM documents");
    console.log(`📥 Migrating ${docRows.length} documents...`);
    for (const row of docRows) {
      await db.insert(schema.documents).values({
        id: row.id,
        section: row.section,
        title: row.title,
        description: row.description,
        url: row.url,
        scanUrl: row.scan_url,
        color: row.color,
        icon: row.icon,
        createdAt: new Date(row.created_at)
      }).run();
    }

    // 7. Migrate Teachers
    await clearTable(schema.teachers, "teachers");
    const [teacherRows]: any = await connection.execute("SELECT * FROM teachers");
    console.log(`📥 Migrating ${teacherRows.length} teachers...`);
    for (const row of teacherRows) {
      await db.insert(schema.teachers).values({
        id: row.id,
        name: row.name,
        position: row.position,
        phone: row.phone,
        email: row.email,
        photoUrl: row.photo_url,
        department: row.department,
        createdAt: new Date(row.created_at)
      }).run();
    }

    // 8. Migrate Sections
    await clearTable(schema.sections, "sections");
    const [sectionRows]: any = await connection.execute("SELECT * FROM sections");
    console.log(`📥 Migrating ${sectionRows.length} sections...`);
    for (const row of sectionRows) {
      await db.insert(schema.sections).values({
        id: row.id,
        page: row.page,
        slug: row.slug,
        order: String(row.order || "0"),
        isVisible: row.is_visible === 1,
        config: row.config,
        createdAt: new Date(row.created_at)
      }).run();
    }

    // 9. Migrate Media
    await clearTable(schema.media, "media");
    const [mediaRows]: any = await connection.execute("SELECT * FROM media");
    console.log(`📥 Migrating ${mediaRows.length} media items...`);
    for (const row of mediaRows) {
      await db.insert(schema.media).values({
        id: row.id,
        type: row.type,
        url: row.url,
        thumbnailUrl: row.thumbnail_url,
        caption: row.caption,
        eventId: row.event_id,
        section: row.section,
        createdAt: new Date(row.created_at)
      }).run();
    }

    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await connection.end();
    sqlite.close();
  }
}

migrate();
