
import Database from "better-sqlite3";
const sqlite = new Database("sqlite.db");
const docs = sqlite.prepare("SELECT title, section, url FROM documents WHERE section LIKE 'upbringing-program-%' OR section LIKE 'crime-prevention-%' OR section = 'upbringing-student-code' LIMIT 10").all();
console.log({ docs });
process.exit(0);
