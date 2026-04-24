
import Database from "better-sqlite3";
const sqlite = new Database("sqlite.db");
const mediaCount = sqlite.prepare("SELECT COUNT(*) as count FROM media").get();
const docsCount = sqlite.prepare("SELECT COUNT(*) as count FROM documents").get();
const foldersCount = sqlite.prepare("SELECT COUNT(*) as count FROM document_folders").get();
console.log({ mediaCount, docsCount, foldersCount });
process.exit(0);
