import { storage } from '../server/storage';

async function run() {
  console.log("Fetching media items...");
  const media = await storage.getMedia();
  
  // Filter for gallery items
  const galleryItems = media.filter(m => m.section === 'gallery' || !m.section);
  
  console.log(`Found ${galleryItems.length} items to delete.`);
  
  for (const item of galleryItems) {
    console.log(`Deleting item: ${item.id} (${item.url})`);
    await storage.deleteMedia(item.id);
  }
  
  console.log("Deletion complete.");
  process.exit(0);
}

run().catch(err => {
  console.error("Error during deletion:", err);
  process.exit(1);
});
