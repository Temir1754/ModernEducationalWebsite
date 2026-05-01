import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.resolve(__dirname, '../client/index.html');

const replacement = 'Білімді ұрпақ жекеменшік мектебі';

let content = fs.readFileSync(filePath, 'utf8');

// Replace FGS in titles, meta tags, and schema
let newContent = content.replace(/FGS/g, replacement);
newContent = newContent.replace(/Future Generation School/g, replacement);

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Updated client/index.html');
