import { db } from "../server/db";
import { documents } from "../shared/schema";

async function deleteAllDocuments() {
  console.log("Deleting all documents while keeping folders...");
  const result = await db.delete(documents);
  console.log("All documents deleted successfully.");
}

deleteAllDocuments().catch(console.error);
