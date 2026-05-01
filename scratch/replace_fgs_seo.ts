import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.resolve(__dirname, '../shared/seo-config.ts');

const replacement = 'Білімді ұрпақ жекеменшік мектебі';

let content = fs.readFileSync(filePath, 'utf8');

// Specific patterns to replace in seo-config.ts
const patterns = [
  { regex: /nameRu:\s*"Частная школа Білімді ұрпақ - FGS Шымкент"/g, repl: `nameRu: "Частная школа ${replacement}"` },
  { regex: /\|\s*FGS/g, repl: `| ${replacement}` },
  { regex: /FGS\s+Шымкент/g, repl: replacement },
  { regex: /"FGS"/g, repl: `"${replacement}"` },
  { regex: /\(FGS\)/g, repl: `(${replacement})` },
  { regex: /FGS\s+мектебі/g, repl: replacement },
  { regex: /FGS\s+школа/g, repl: replacement },
  { regex: /"FGS\s+School"/g, repl: `"${replacement}"` },
  { regex: /"Future Generation School"/g, repl: `"${replacement}"` },
];

let newContent = content;
for (const p of patterns) {
  newContent = newContent.replace(p.regex, p.repl);
}

// Clean up keywords if they have FGS
newContent = newContent.replace(/"FGS\s+[^"]*"/g, (match) => match.replace('FGS', replacement));

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Updated shared/seo-config.ts');
