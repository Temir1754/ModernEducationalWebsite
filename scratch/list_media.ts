import { storage } from "../server/storage";

async function listMedia() {
  try {
    const media = await storage.getMedia();
    console.log("Current Media in Database:");
    media.forEach(m => {
      console.log(`- ID: ${m.id} | Section: ${m.section} | URL: ${m.url}`);
    });
    if (media.length === 0) console.log("No media found.");
  } catch (err) {
    console.error("Error listing media:", err);
  }
}

listMedia();
