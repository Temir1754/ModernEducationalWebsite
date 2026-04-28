import { storage } from "../server/storage";

async function forceDelete() {
  const idToDelete = "f070fa24-ab22-4911-bb88-3307e1ebec65";
  try {
    console.log(`Force deleting media item: ${idToDelete}`);
    await storage.deleteMedia(idToDelete);
    console.log("Success! Item deleted from database.");
  } catch (err) {
    console.error("Error during force delete:", err);
  }
}

forceDelete();
