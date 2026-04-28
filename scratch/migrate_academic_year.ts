import Database from 'better-sqlite3';

const db = new Database('sqlite.db');

try {
  db.prepare("ALTER TABLE events ADD COLUMN academic_year TEXT NOT NULL DEFAULT '2025-2026'").run();
  console.log("Column academic_year added successfully.");
} catch (err: any) {
  if (err.message.includes("duplicate column name")) {
    console.log("Column academic_year already exists.");
  } else {
    console.error("Error adding column:", err.message);
  }
} finally {
  db.close();
}
