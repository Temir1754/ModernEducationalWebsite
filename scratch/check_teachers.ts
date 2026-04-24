
import Database from "better-sqlite3";
const sqlite = new Database("sqlite.db");
const teachers = sqlite.prepare("SELECT name, photo_url FROM teachers LIMIT 5").all();
console.log({ teachers });
process.exit(0);
