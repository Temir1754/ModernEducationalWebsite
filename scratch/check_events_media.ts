
import Database from "better-sqlite3";
const sqlite = new Database("sqlite.db");
const media = sqlite.prepare("SELECT url, caption FROM media WHERE section = 'events' LIMIT 10").all();
console.log({ media });
process.exit(0);
