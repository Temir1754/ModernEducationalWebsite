
import Database from "better-sqlite3";
const sqlite = new Database("sqlite.db");
const news = sqlite.prepare("SELECT title, cover_url FROM news LIMIT 5").all();
console.log({ news });
process.exit(0);
