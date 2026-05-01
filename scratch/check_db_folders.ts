import { db } from "../server/db";
import { documentFolders, documents } from "../shared/schema";
import { eq } from "drizzle-orm";

async function checkFolders() {
  const folders = await db.select().from(documentFolders);
  console.log("Folders in DB:", JSON.stringify(folders, null, 2));

  const docs = await db.select().from(documents);
  console.log("Documents in DB:", JSON.stringify(docs.map(d => ({ id: d.id, section: d.section })), null, 2));
}

checkFolders().catch(console.error);
