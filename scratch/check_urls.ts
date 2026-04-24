
import Database from "better-sqlite3";
const sqlite = new Database("sqlite.db");
const media = sqlite.prepare("SELECT url FROM media LIMIT 5").all();
const docs = sqlite.prepare("SELECT url FROM documents LIMIT 5").all();
console.log({ media, docs });
process.exit(0);
