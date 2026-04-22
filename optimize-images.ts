import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DIRECTORIES = [
  path.join(__dirname, 'client/src/assets'),
  path.join(__dirname, 'public/gallery'),
  path.join(__dirname, 'public'),
  path.join(__dirname, 'uploads'),
  path.join(__dirname, 'attached_assets')
];

const MAX_WIDTH = 1920;
const QUALITY = 80;

async function optimizeImage(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

  const stats = fs.statSync(filePath);
  if (stats.size < 100 * 1024 && !filePath.includes('logo.png')) {
    // Skip small images unless it's the logo
    return;
  }

  console.log(`Processing: ${path.relative(__dirname, filePath)} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    let pipeline = image;
    if (metadata.width && metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH);
    }

    const tmpPath = `${filePath}.tmp`;

    if (ext === '.png' && !filePath.includes('logo')) {
      // For general PNGs, convert to jpeg if they don't need transparency
      // But let's stay safe and just optimize PNG
      await pipeline.png({ quality: QUALITY, palette: true }).toFile(tmpPath);
    } else if (filePath.includes('logo.png')) {
      // Optimize logo specifically
      await pipeline.png({ quality: 60, palette: true }).toFile(tmpPath);
    } else {
      await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toFile(tmpPath);
    }

    // ALSO generate WebP version
    const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    await pipeline.webp({ quality: QUALITY }).toFile(webpPath);
    console.log(`  ✨ Created WebP: ${path.relative(__dirname, webpPath)}`);

    const newStats = fs.statSync(tmpPath);
    if (newStats.size < stats.size) {
      fs.renameSync(tmpPath, filePath);
      console.log(`  ✅ Optimized: ${(stats.size / 1024 / 1024).toFixed(2)} MB -> ${(newStats.size / 1024 / 1024).toFixed(2)} MB`);
    } else {
      fs.unlinkSync(tmpPath);
      console.log(`  ℹ️ Skipping: No significant reduction.`);
    }
  } catch (err) {
    console.error(`  ❌ Error processing ${filePath}:`, err);
  }
}

async function processDirectory(dir: string) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      await processDirectory(fullPath);
    } else {
      await optimizeImage(fullPath);
    }
  }
}

async function run() {
  console.log("🚀 Starting image optimization...");
  for (const dir of DIRECTORIES) {
    await processDirectory(dir);
  }
  console.log("✨ All done!");
}

run().catch(console.error);
