import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../shared/schema';
import fs from 'fs';
import path from 'path';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite, { schema });

async function check() {
  const allMedia = await db.select().from(schema.media);
  console.log('Total media records:', allMedia.length);
  
  const results = allMedia.map(m => {
    let filePath = '';
    if (m.url.startsWith('/attached_assets/')) {
        filePath = path.join(process.cwd(), m.url);
    } else if (m.url.startsWith('/uploads/')) {
        filePath = path.join(process.cwd(), m.url);
    } else {
        // Fallback to public
        filePath = path.join(process.cwd(), 'client', 'public', m.url);
    }
    
    const exists = fs.existsSync(filePath);
    return { id: m.id, url: m.url, section: m.section, caption: m.caption, exists, filePath };
  });

  const missing = results.filter(r => !r.exists);
  console.log('Missing files:', missing.length);
  
  if (missing.length > 0) {
    console.log('--- Sample of missing files ---');
    missing.slice(0, 20).forEach(m => {
      console.log(`URL: ${m.url} | Section: ${m.section} | Caption: ${m.caption}`);
      console.log(`  Expected at: ${m.filePath}`);
    });
  }
  
  const exists = results.filter(r => r.exists);
  if (exists.length > 0) {
    console.log('\n--- Sample of existing files ---');
    exists.slice(0, 5).forEach(m => {
      console.log(`URL: ${m.url} | Section: ${m.section} | Caption: ${m.caption}`);
    });
  }
}

check().catch(console.error);
