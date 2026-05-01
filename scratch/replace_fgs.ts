import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, '../client/src');

const replacement = 'Білімді ұрпақ жекеменшік мектебі';

function walk(dir: string, callback: (filePath: string) => void) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      walk(filePath, callback);
    } else if (stats.isFile() && (file.endsWith('.tsx') || file.endsWith('.ts'))) {
      callback(filePath);
    }
  }
}

walk(srcDir, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace "FGS" with the replacement, but avoid social media handles in URLs if possible
  // We'll target "FGS" as a word or in specific contexts
  
  // Specific patterns to replace
  const patterns = [
    { regex: /FGS\s+мектебі/g, repl: replacement },
    { regex: /FGS\s+School/g, repl: replacement },
    { regex: /\|\s*FGS/g, repl: `| ${replacement}` },
    { regex: /FGS\s+-/g, repl: `${replacement} -` },
    { regex: /FGS\s+Staff/g, repl: `${replacement} Staff` },
    { regex: /FGS\s+Көмекші/g, repl: `${replacement} Көмекші` },
    { regex: /FGS\s+IV/g, repl: `${replacement} IV` },
    { regex: /"FGS"/g, repl: `"${replacement}"` },
    { regex: />FGS</g, repl: `>${replacement}<` },
    { regex: /FGS\s+фотогалерея/g, repl: `${replacement} фотогалерея` },
  ];

  let changed = false;
  let newContent = content;

  for (const p of patterns) {
    if (p.regex.test(newContent)) {
      newContent = newContent.replace(p.regex, p.repl);
      changed = true;
    }
  }
  
  // Also catch stray "FGS" words in Kazakh text
  // e.g. "FGS мектебінің"
  const kazakhRegex = /FGS\s+(мектебі[а-яәғқңөұүһі]*)/g;
  if (kazakhRegex.test(newContent)) {
    newContent = newContent.replace(kazakhRegex, (match, suffix) => `${replacement} ${suffix}`);
    changed = true;
  }

  if (changed) {
    console.log(`Updating ${filePath}`);
    fs.writeFileSync(filePath, newContent, 'utf8');
  }
});
