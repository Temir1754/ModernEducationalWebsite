import "dotenv/config";
import { db, pool } from "./server/db";

async function main() {
  try {
    await pool.query(`DROP TABLE IF EXISTS document_folders`);
    await pool.query(`
      CREATE TABLE document_folders (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        parent_id VARCHAR(100) DEFAULT NULL,
        is_category BOOLEAN DEFAULT FALSE,
        \`order\` VARCHAR(10) DEFAULT '0',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Table document_folders recreated successfully");
  } catch (err) {
    console.error("Error creating table:", err);
  } finally {
    process.exit(0);
  }
}

main();
