import { storage } from "../server/storage";

async function check() {
  const content = await storage.getSiteContent();
  console.log(JSON.stringify(content, null, 2));
  process.exit(0);
}

check();
